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
  selector: 'app-mcc-list',
  templateUrl: './mcc-list.component.html',
  styleUrls: ['./mcc-list.component.css']
})
export class MccListComponent implements OnInit{


  closeResult: string = "";
  isModalShown: boolean = false;
  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  public searchForm!: FormGroup;
  searchModel: any;
  searchResponse!: Response;
  createResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  plantModel: any = {};
  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';

  model: any = {};
  newmodel: any = {
    company_code:'',
    company_name:'',
    plant_code:'',
    plant_name:'',
    mcc_code:'',
    mcc_name:'',
    is_active: true,
    address:''
  };

  originalData: any[] = [];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: 'plant code', field: 'plant_code', resizable: true, width: 150 },
      { headerName: 'plant Name', field: 'plant_name', resizable: true, width: 150 },
      { headerName: 'MCC code', field: 'mcc_code', resizable: true, width: 150 },
      { headerName: 'MCC Name', field: 'mcc_name', resizable: true, width: 150 },
      { headerName: 'Address', field: 'address', resizable: true, width: 150 },
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
      filter: true
    };
  
    @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  constructor(private _masterService: MasterService, private _toastrService: ToastrService, private _serverValidation:ServerValidationService, private _msgProperty: MessageTranslationPipe){

    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      mcc_name: new FormControl('', Validators.required),
      is_active: new FormControl(true),
      address: new FormControl(''),
      search: new FormControl(''),
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
      

  SearchMCC(){
    // if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this._masterService.MCCList(this.newmodel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.originalData = this.searchResponse.responseData;
           this.rowData = [...this.originalData];
          this.isModalShown=!this.isModalShown;
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    // }
  }
  //#region  DropDown Methods

  CompanyDropDown() {
    this._masterService.CompanyDropDown().subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.companyDropDown = this.searchResponse.responseData as Dropdown[];
        this.newmodel.company_code = this.companyDropDown[0].value;
        this.newmodel.company_name = this.companyDropDown[0].text;
        this.model.company_code = this.searchResponse.responseData[0].value;
        this.PlantDropDown();
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  PlantDropDown() {
    this.plantModel = Object.assign({}, this.searchForm.value);
    this._masterService.PlantDropDown(this.model).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this.newmodel.plant_name = this.plantDropDown[0].text;
        this.model.plant_code = this.searchResponse.responseData[0].value;        
        this.newmodel.plant_code = this.searchResponse.responseData[0].value;        
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  Create() {
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this.newmodel.mcc_code = this.model.mcc_code;
      this.newmodel.mcc_name = this.model.mcc_name;
      this.newmodel.address = this.model.address; 
      this.newmodel.is_active = this.model.is_active;
      this._masterService.MCCCreate(this.newmodel).subscribe((res) => {
        this.createResponse = res as Response;
        if (this.createResponse.responseStatus == 200) {
          this._toastrService.success(this.createResponse.responseMessage)
          this.searchForm.reset();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('mcc_validation'),
            this.createResponse.responseData
          );
        }
      });
    } else {
      this._toastrService.error('Input form data is not valid')
    }
  }
  addMCC(){
      const isActive = this.searchForm.get('is_active')?.value;
      this.searchForm.reset();
      this.searchForm.get('is_active')?.setValue(isActive);
      this.isAddModalShown = true;
  }
  Update(){
    //write the update logic here
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this.newmodel.address = this.model.address;
      this.newmodel.mcc_code = this.model.mcc_code;
      this.newmodel.mcc_name = this.model.mcc_name;
      this.newmodel.is_active = this.model.is_active;
    }
    this.isUpdateModalShown = !this.isUpdateModalShown;
  }

  ////#endregion


  //#region Model View Methods
  showModal(): void {
    this.isModalShown = true;
    // this.isAddModalShown = true;
  }
  hideModal(): void {
    this.autoShownModal?.hide();
    this.isAddModalShown = false;
  }
  onHidden(): void {
    this.isModalShown = false;
    this.isAddModalShown = false;
  }

}
