import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../../services/master.service';
import { Response } from 'src/app/Auth/common/model/response';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit{
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
  mccDropDown!: Dropdown[];
  mccDropDownn!: Dropdown[];
  bmcDropDown!: Dropdown[];
  bmcDropDownn!: Dropdown[];
  routeModel: any = {};
  model: any = {};
  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    route_code:'',
    route_name:'',
    address:'',
    is_active: true,
  }
  originalData: any[] = [];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName:'BMC Code', field: 'bmc_code', resizable: true, width: 150 },
      { headerName:'BMC Name', field: 'bmc_name', resizable: true, width: 150 },
      { headerName:'Route Code', field: 'route_code', resizable: true, width: 150 },
      { headerName:'Route Name', field: 'route_name', resizable: true, width: 150 },
      { headerName:'Address', field: 'address', resizable: true, width: 150 },
      { headerName:'Is Active', field: 'is_active', resizable: true, width: 150 },
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

    
  constructor(private _masterService: MasterService, private _toasterService: ToastrService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe,){

    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      bmc_name: new FormControl('', Validators.required),
      route_code: new FormControl('', Validators.required),
      route_name: new FormControl('', Validators.required),
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
  //       row.bmc_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.bmc_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.route_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.route_name.toLowerCase().indexOf(this.searchTerm) !== -1  
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
          row.bmc_code,
          row.bmc_name,
          row.route_code,
          row.route_name,
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
      bmc_code: this.selectedRowData.bmc_code,
      bmc_name: this.selectedRowData.bmc_name,
      route_code: this.selectedRowData.route_code,
      route_name: this.selectedRowData.route_name,
      address: this.selectedRowData.address,
      is_active: this.selectedRowData.is_active
    });
    this.searchForm.get('bmc_code')?.disable();
    this.searchForm.get('bmc_name')?.disable();

    this.isUpdateModalShown= !this.isUpdateModalShown;
  }
  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'BMC CODE': entry.bmc_code,
      'BMC NAME': entry.bmc_name,
      'ROUTE CODE': entry.route_code,
      'ROUTE NAME': entry.route_name,
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

  SearchRoute(){
    // if (this.searchForm.valid) {
      this.searchForm.get('bmc_code')?.enable();
      this.searchForm.get('bmc_name')?.enable();

      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.mcc_code=this.searchModel.mcc_code;
      this.newModel.bmc_code=this.searchModel.bmc_code;
      this._masterService.RouteList(this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
           this.originalData = this.searchResponse.responseData;
           this.rowData = [...this.originalData];
          this.isModalShown=!this.isModalShown;
        } else {
          this._toasterService.error(this.searchResponse.responseData);
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
        this.newModel.company_code = this.searchResponse.responseData[0].value;
        this. PlantDropDown();
      } else {
        this._toasterService.error(this.searchResponse.responseData);
      }
    });
  }

  PlantDropDown() {
    this.routeModel = Object.assign({}, this.searchForm.value);
    this._masterService.PlantDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.plant_code = this.searchResponse.responseData[0].value;
        this. MCCDropDown();
        this.MCCDropDownn();
      } else {
        this._toasterService.error(this.searchResponse.responseData);
      }
    });
  }
  
  MCCDropDown() {
    this.routeModel = Object.assign({}, this.searchForm.value);
    this._masterService.MCCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toasterService.error(this.searchResponse.responseData);
      }
    });
  }
  MCCDropDownn() {
    this.routeModel = Object.assign({}, this.searchForm.value);
    this._masterService.MCCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDownn = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toasterService.error(this.searchResponse.responseData);
      }
    });
  }
  
  BMCDropDown(plant_code : any) {
    this.routeModel = Object.assign({}, this.searchForm.value);
    this._masterService.BMCDropDown(this.routeModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.bmcDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toasterService.error(this.searchResponse.responseData);
      }
    });
  }
  BMCDropDownn(plant_code : any) {
    this.routeModel = Object.assign({}, this.searchForm.value);
    this._masterService.BMCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.bmcDropDownn = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toasterService.error(this.searchResponse.responseData);
      }
    });
  }

  Create() {
    this.searchForm.get('bmc_code')?.enable();
    this.searchForm.get('bmc_name')?.enable();
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      console.log('befor service api==>', this.model);
      this.newModel.bmc_code=this.model.bmc_code;
      this.newModel.route_code=this.model.route_code;
      this.newModel.route_name=this.model.route_name;
      this.newModel.is_active=this.model.is_active;
      this.newModel.address=this.model.address;
      this.newModel.mcc_code = this.model.mcc_code;   
      this._masterService.RouteCreate(this.newModel).subscribe(response => {
        this.createResponse = response as Response;
        console.log(' service response==>', this.createResponse);
        if (this.createResponse.responseStatus == 200) {
          console.log('after response==>', this.newModel);
          this._toasterService.success(this.createResponse.responseMessage);
          this.searchForm.reset();
          this.isAddModalShown = false;
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('route_validation'),this.createResponse.responseData)
        }
      });
    } 
    else {
      this._toasterService.error("Input data is not valid.")
    }
   }

  addRoute(){
    this.searchForm.get('bmc_code')?.enable();
    this.searchForm.get('bmc_name')?.enable();
    const isActive = this.searchForm.get('is_active')?.value;
    this.searchForm.reset();
    this.isAddModalShown = !this.isAddModalShown;
    this.searchForm.get('is_active')?.setValue(isActive);
  }

  Update(){
    this.searchForm.get('bmc_code')?.enable();
    this.searchForm.get('bmc_name')?.enable();
    //write the update logic here
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this.newModel.address = this.model.address;
      this.newModel.mcc_code = this.model.mcc_code;
      this.newModel.mcc_name = this.model.mcc_name;
      this.newModel.is_active = this.model.is_active;
      this.newModel.route_code = this.model.route_code;
      this.newModel.route_name = this.model.route_name;
    }
    ////////////////////////////////////////////////////////////////////////subscribe update api here----
    this.isUpdateModalShown = !this.isUpdateModalShown;
  }


  ////#endregion


  //#region Model View Methods
  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal?.hide();
    this.isUpdateModalShown = false;
  }

  onHidden(): void {
    this.isModalShown = false;
    this.isUpdateModalShown = false;
  }

}
