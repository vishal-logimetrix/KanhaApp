import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from '../../services/master.service';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
@Component({
  selector: 'app-bmc-list',
  templateUrl: './bmc-list.component.html',
  styleUrls: ['./bmc-list.component.css']
})
export class BmcListComponent implements OnInit{
  closeResult: string = '';
  isModalShown: boolean = false;
  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  public searchForm!: FormGroup;
  searchModel: any;
  searchResponse!: Response;
  createResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  plantModel: any = {};
  mccModel:any = {};
  model: any = {};
  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';

  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    mcc_name:'',
    bmc_code:'',
    bmc_name:'',
    address: '',
    is_active:true,

  }
  originalData: any[] = [];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: 'Plant Code', field: 'plant_code', resizable: true, width: 150 },
      { headerName: 'Plant Name', field: 'plant_name', resizable: true, width: 150 },
      { headerName: 'MCC Code', field: 'mcc_code', resizable: true, width: 150 },
      { headerName: 'MCC Name', field: 'mcc_name', resizable: true, width: 150 },
      { headerName: 'BMC Code', field: 'bmc_code', resizable: true, width: 150 },
      { headerName: 'BMC Name', field: 'bmc_name', resizable: true, width: 150 },
      { headerName: 'Adress', field: 'address', resizable: true, width: 150 },
      { headerName: 'Is Active', field: 'is_active', resizable: true, width: 150 },
      { 
        headerName: 'Action', 
        field: 'Action',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: (params: any) => this.onEditClick(params.rowData),
          label: 'Edit',
          tooltip:'Edit',
          icon:' fa fa-pencil'
        }
       }
    ];
    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
    @ViewChild('autoShownModal', { static: false })
    autoShownModal?: ModalDirective;
  constructor(private _masterService: MasterService,private _toastrService: ToastrService, private _serviceValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe){

    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      bmc_name: new FormControl('', Validators.required),
      is_active: new FormControl(true),
      address: new FormControl(),
      search: new FormControl()
    });
  }
  ngOnInit(): void {
    this.CompanyDropDown();
    this.showModal();
  }
  onSearchInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.searchTable();
  }

  // searchTable() {
  //   if (this.searchTerm) {
  //     this.rowData = this.originalData.filter((row: any) =>
  //       row.plant_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.plant_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mcc_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mcc_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.bmc_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.bmc_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.address.toLowerCase().indexOf(this.searchTerm) !== -1
  //     );
  //   }else {
  //     // If the search term is empty, show all rows
  //     this.rowData = [...this.originalData];
  //   }
  // }

  searchTable() {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.rowData = this.originalData.filter((row: any) => {
        const valuesToSearch = [
          row.plant_code,
          row.plant_name,
          row.mcc_code,
          row.mcc_name,
          row.bmc_code,
          row.bmc_name,
          row.address,
        ];
        for (const value of valuesToSearch) {
          if (value.toLowerCase().indexOf(trimmedSearchTerm) !== -1) {
            return true;
          }
        }
        return false;
      });
    } else {
      // If the search term is empty, show all rows
      this.rowData = [...this.originalData];
    }
  }

  onEditClick(rowData:any): void {
    // Call the click handler passed from the column definition
    this.selectedRowData = rowData;
    this.searchForm.patchValue({
      plant_code: this.selectedRowData.plant_code,
      plant_name: this.selectedRowData.plant_name,
      mcc_code: this.selectedRowData.mcc_code,
      mcc_name: this.selectedRowData.mcc_name,
      bmc_code: this.selectedRowData.bmc_code,
      bmc_name: this.selectedRowData.bmc_name,
      address: this.selectedRowData.address,
      is_active: this.selectedRowData.is_active
    });
    this.isUpdateModalShown= !this.isUpdateModalShown;
  }

  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'PLANT CODE': entry.plant_code,
      'PLANT Name': entry.plant_name,
      'MCC CODE': entry.mcc_code,
      'MCC NAME': entry.mcc_name,
      'BMC CODE': entry.bmc_code,
      'BMC NAME': entry.bmc_name,
      'IS ACTIVE': entry.is_active,
      'ADDRESS': entry.address,
    }));

    // Create a new Excel workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      // Generate Excel file binary
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
       // Save the file using FileSaver.js
        const filename = 'data_export.xlsx';
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, filename);
      }
  SearchBMC() {
    // if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.mcc_code = this.searchModel.mcc_code;
      this._masterService.BMCList(this.newModel).subscribe((response) => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.originalData = this.searchResponse.responseData;
           this.rowData = [...this.originalData];
          this.isModalShown = !this.isModalShown;
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    // }
  }
  //#region  DropDown Methods
  CompanyDropDown() {
    this._masterService.CompanyDropDown().subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.companyDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.company_code = this.searchResponse.responseData[0].value;
        this. PlantDropDown();
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  PlantDropDown() {
    this.plantModel = Object.assign({}, this.searchForm.value);
    this._masterService.PlantDropDown(this.newModel).subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.plant_code = this.searchResponse.responseData[0].value;
        this. MCCDropDown();
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  MCCDropDown() {
    this.plantModel = Object.assign({}, this.searchForm.value);
    this._masterService.MCCDropDown(this.newModel).subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  Create() {
    if (this.searchForm.valid) {
      this.mccModel = Object.assign({}, this.searchForm.value);
      this.newModel.mcc_code = this.mccModel.mcc_code;
      this.newModel.bmc_code = this.mccModel.bmc_code;
      this.newModel.bmc_name = this.mccModel.bmc_name;
      this.newModel.is_active = this.mccModel.is_active;
      this.newModel.address = this.mccModel.address;      
      this.isAddModalShown = !this.isAddModalShown;
      this._masterService.BMCCreate(this.newModel).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          this._toastrService.success(this.createResponse.responseMessage);
          this.searchForm.reset();
        } else {
          this._serviceValidation.parseValidation(this._msgProperty.transform('bmc_validation'),this.createResponse.responseData)
        }
      });
    } else {
      this._toastrService.error("Input Form Data is Not Valid.")
    }
   }
   addBMC(){
    const isActive = this.searchForm.get('is_active')?.value;
    this.searchForm.reset();
    this.isAddModalShown = !this.isAddModalShown;
    this.searchForm.get('is_active')?.setValue(isActive);
   }

   Update(){
    //write the update logic here
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this.newModel.address = this.model.address;
      this.newModel.mcc_code = this.model.mcc_code;
      this.newModel.mcc_name = this.model.mcc_name;
      this.newModel.is_active = this.model.is_active;
    }
    this.isUpdateModalShown = !this.isUpdateModalShown;
  }

  ////#endregion
  //#region Model View Methods
  showModal(): void {
    this.isModalShown = true;
  }
  hideModal(): void {
    this.autoShownModal?.hide();
    this.isAddModalShown = false;
    this.isUpdateModalShown = false;
  }
  onHidden(): void {
    this.isModalShown = false;
  }
}
