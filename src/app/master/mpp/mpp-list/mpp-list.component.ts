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
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
@Component({
  selector: 'app-mpp-list',
  templateUrl: './mpp-list.component.html',
  styleUrls: ['./mpp-list.component.css']
})
export class MppListComponent implements OnInit{

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
  routeDropDown!: Dropdown[];
  routeDropDownn!: Dropdown[];
  model: any = {};
  
  mppModel: any = {};
  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';
  // newModel: any = {
  //   company_code: '',
  //   plant_code:'',
  //   mcc_code:'',
  //   bmc_code:'',
  //   route_code:'',
  // }
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    route_code:'',
    mpp_short_name:'',
    mpp_old_code:'',
    mpp_code:'',
    mpp_name:'',
    allow_collection_at_bmc:false,
    is_active: true,
    address:'',
  }
    originalData: any[] = [];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: 'BMC Code', field: 'bmc_code', resizable: true, width: 130 },
      { headerName: 'BMC Name', field: 'bmc_name', resizable: true, width: 130 },
      { headerName: 'MPP Code', field: 'mpp_code', resizable: true, width: 130 },
      { headerName: 'MPP Name', field: 'mpp_name', resizable: true, width: 150 },
      { headerName: 'Route Code', field: 'route_code', resizable: true, width: 100 },
      { headerName: 'Route Name', field: 'route_name', resizable: true, width: 150 },
      { headerName: 'MPP Short Name', field: 'mpp_short_name', resizable: true, width: 150 },
      { headerName: 'MPP Old Name', field: 'mpp_old_code', resizable: true, width: 150 },
      { headerName: 'Address', field: 'address', resizable: true, width: 150 },
      { headerName: 'Allow Collection at BMC', field: 'allow_collection_at_bmc', resizable: true, width: 150 },
      { headerName: 'IS Active', field: 'is_active', resizable: true, width: 150 },
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

  constructor(private _masterService: MasterService, private _toastrService: ToastrService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe,){
    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      bmc_name: new FormControl(''),
      route_code: new FormControl('', Validators.required),
      route_name: new FormControl(''),
      mpp_name: new FormControl('', Validators.required),
      mpp_short_name: new FormControl('', Validators.required),
      mpp_old_code: new FormControl('',Validators.required),
      mpp_code: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      allow_collection_at_bmc: new FormControl(false),
      is_active: new FormControl(true),
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
  //       row.mpp_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mpp_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mpp_old_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
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
          row.mpp_code,
          row.mpp_name,
          row.mpp_old_code,
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
      mpp_short_name: this.selectedRowData.mpp_short_name,
      mpp_old_code: this.selectedRowData.mpp_old_code,
      address: this.selectedRowData.address,
      is_active: this.selectedRowData.is_active,
      allow_collection_at_bmc: this.selectedRowData.allow_collection_at_bmc,
    });
    this.searchForm.get('bmc_code')?.disable();
    this.searchForm.get('bmc_name')?.disable();
    this.searchForm.get('mpp_code')?.disable();
    this.searchForm.get('mpp_name')?.disable();

    this.isUpdateModalShown= !this.isUpdateModalShown;
  }

  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'BMC CODE': entry.bmc_code,
      'BMC NAME': entry.bmc_name,
      'MPP CODE': entry.mpp_code,
      'MPP NAME': entry.mpp_name,
      'ROUTE CODE': entry.route_code,
      'ROUTE NAME': entry.route_name,
      'MPP SHORT NAME': entry.mpp_short_name,
      'MPP OLD NAME': entry.mpp_old_code,
      'ALLOW COLLECTION': entry.allow_collection_at_bmc,
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
  SearchMPP(){
    // if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.route_code = this.searchModel.route_code;
      this._masterService.MPPList(this.searchModel).subscribe(response => {
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
        this.newModel.company_code = this.searchResponse.responseData[0].value;
        this. PlantDropDown();
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  PlantDropDown() {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.PlantDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.plant_code = this.searchResponse.responseData[0].value;
        this. MCCDropDown();
        this. MCCDropDownn();
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  MCCDropDown() {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.MCCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  MCCDropDownn() {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.MCCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDownn = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  BMCDropDown(plant_code : any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this.newModel.mcc_code = this.mppModel.mcc_code;
    this._masterService.BMCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.bmcDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  BMCDropDownn(plant_code : any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this.newModel.mcc_code = this.mppModel.mcc_code;
    this._masterService.BMCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.bmcDropDownn = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  RouteDropDown(plant_code : any) {
    this.mppModel = Object.assign({}, this.searchForm.value); 
    this.newModel.bmc_code = this.mppModel.bmc_code;
    this._masterService.RouteDropDown(this.mppModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.routeDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  RouteDropDownn(plant_code : any) {
    this.mppModel = Object.assign({}, this.searchForm.value); 
    this.newModel.bmc_code = this.mppModel.bmc_code;
    this._masterService.RouteDropDown(this.mppModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.routeDropDownn = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  Create() {
    if (this.searchForm.valid) {
    this.model = Object.assign({}, this.searchForm.value);
    this.newModel.mpp_code = this.model.mpp_code;
    this.newModel.mpp_name = this.model.mpp_name;
    this.newModel.mpp_old_code = this.model.mpp_old_code;
    this.newModel.mpp_short_name = this.model.mpp_short_name;
    this.newModel.route_code = this.model.route_code;
    this.newModel.address= this.model.address;
      this._masterService.MPPCreate(this.newModel).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          this.isAddModalShown = false;
          this._toastrService.success(this.createResponse.responseMessage);
          this.searchForm.reset();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('mpp_validation'),this.createResponse.responseData)
        }
      });
    } else {
      this._toastrService.error("Input Form data is not valid.")
    }
   }
  AddMPP(){
    this.searchForm.get('bmc_code')?.enable();
    this.searchForm.get('bmc_name')?.enable();
    this.searchForm.get('mpp_code')?.enable();
    this.searchForm.get('mpp_name')?.enable();
    const isActive = this.searchForm.get('is_active')?.value;
    this.searchForm.reset();
    this.isAddModalShown = !this.isAddModalShown;
    this.searchForm.get('is_active')?.setValue(isActive);
  }
  Update(){
    this.searchForm.get('bmc_code')?.enable();
    this.searchForm.get('bmc_name')?.enable();
    this.searchForm.get('mpp_code')?.enable();
    this.searchForm.get('mpp_name')?.enable();
    // this.searchForm.get('mcc_code')?.removeValidators;
    // this.searchForm.removeValidators;
    //write the update logic here
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this.newModel.address = this.model.address;
      this.newModel.mcc_code = this.model.mcc_code;
      this.newModel.mcc_name = this.model.mcc_name;
      this.newModel.is_active = this.model.is_active;
      this.newModel.route_code = this.model.route_code;
      this.newModel.route_name = this.model.route_name;
      console.log('________________vishal_________');
      this.searchForm.addValidators;
    }
    ////////////////////////////////////////////////////////////////////////subscribe update api here----
    this.isUpdateModalShown = !this.isUpdateModalShown;
  }

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
  }

}
