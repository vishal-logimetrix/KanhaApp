import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
import { ConfigurationService } from '../../Services/configuration.service';
import { NavigationExtras, Router } from '@angular/router';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
@Component({
  selector: 'app-divice-master-list',
  templateUrl: './divice-master-list.component.html',
  styleUrls: ['./divice-master-list.component.css']
})
export class DiviceMasterListComponent implements OnInit {
  closeResult: string = "";
  isModalShown: boolean = false;
  public searchForm!: FormGroup;
  public creatForm!: FormGroup;
  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  searchModel: any;
  searchResponse!: Response;
  updateResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  bmcDropDown!: Dropdown[];
  mppDropDown!: Dropdown[];
  mppModel: any = {};
  newModel: any = {
    company_code:'',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    mpp_code:''
  }

  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';
  originalData: any[] = [];
   //for grid
   rowData:any = [];
   columnDefs: ColDef[] = [
     {
       field: '',
       cellRenderer: 'buttonRenderer',
       cellRendererParams:{
         onClick: this.EditDeviceMaster.bind(this),
         label: 'Edit',
         tooltip:'Edit',
         icon:' fa fa-pencil'
       },width:20
     },{
       field: '',
       cellRenderer: 'buttonRenderer',
       cellRendererParams:{
         onClick: this.DeRegisterDeviceMaster.bind(this),
         label: 'Block Device',
         tooltip:'Block Device',
         icon:' fa fa-ban'
       },width:20
     },
     { field: 'device_code', resizable: true,hide: true },
     // { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
     { headerName:"Device Location", field: 'device_location', resizable: true,width:110 },
     { field: 'company_code', resizable: true,hide: true  },
     { field: 'plant_code', resizable: true,hide: true  },
     { field: 'mcc_code', resizable: true,hide: true  },
     {headerName:"MCC Name", field: 'mcc_name', resizable: true, width: 130 },
     {headerName:"BMC Code", field: 'bmc_code', resizable: true, width: 130 },
     {headerName:"BMC Name", field: 'bmc_name', resizable: true, width: 130 },
     {headerName:"MPP Code", field: 'mpp_code', resizable: true, width: 130 },
     {headerName:"MPP Name", field: 'mpp_name', resizable: true, width: 130 },
     {headerName:"Device Number", field: 'device_no', resizable: true, width: 130 },
     {headerName:"IMEI No", field: 'imei_no', resizable: true, width: 130 },
     {headerName:"SIM No", field: 'sim_no', resizable: true, width: 130 },
     {headerName:"Mobile No", field: 'mobile_no', resizable: true, width: 130 },
     {headerName:"IS GPRS", field: 'is_gprs', resizable: true, width: 130 },
     {
       headerName: "Last Sync DateTime", field: 'last_sync_datetime', resizable: true, width: 130,
       cellRenderer: (data: any) => {
         // return data.value ? (new Date(data.value)).toLocaleDateString() : '';
         return moment(data.value).format('DD/MM/YYYY HH:MM:SS')
       }
     },
     {headerName:"Sync Date", field: 'Sync Data', resizable: true, width: 130 },
     ];
 // DefaultColDef sets props common to all Columns
 public defaultColDef: ColDef = {
  sortable: true,
  filter: true
};
@ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;

  rowDataClicked1 = {};
  constructor(public _masterService: MasterService, private _configurationService: ConfigurationService, private _router: Router,
    private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe,private _toastrService: ToastrService){
      this.searchForm = new FormGroup({
        // company_code: new FormControl('', Validators.required),
        // plant_code: new FormControl('', Validators.required),
        mcc_code: new FormControl('', Validators.required),
        bmc_code: new FormControl('', Validators.required),
        mpp_code: new FormControl('0', Validators.required)
      });
      this.frameworkComponents = {
        buttonRenderer: GridButtonRendererComponentComponent,
      }
  }
  ngOnInit(): void {
    this.CompanyDropDown();
    this.showModal();
  }
  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'DEVICE LOCATION': entry.device_location,
      'MCC Name': entry.mcc_name,
      'BMC CODE': entry.bmc_code,
      'BMC NAME': entry.bmc_name,
      'MPP CODE': entry.mpp_code,
      'MPP NAME': entry.mpp_name,
      'DEVICE NUMBER': entry.device_no,
      'IMEI': entry.imei_no,
      'SIM NO': entry.sim_no,
      'MOBILE NUMBER ': entry.mobile_no,
      'IS GPRS': entry.is_gprs,
      'LAST SYNC DATETIME': entry.last_sync_datetime,
      'SYNC DATE': entry.sync,
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
  SearchDeviceMasterList() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.mpp_code = this.searchModel.mpp_code;
      this._configurationService.DeviceMasterList(this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.rowData = this.searchResponse.responseData;
          this.isModalShown = !this.isModalShown;
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }
  }
  EditDeviceMaster(data: any) {
    this.rowDataClicked1 = data.rowData;
    // console.log(JSON.stringify(this.rowDataClicked1));
    const navigationExtras: NavigationExtras = {
      state: {
        pass_data:this.rowDataClicked1
      }
    };
    this._router.navigate(['device/master'],navigationExtras);
  }
  DeRegisterDeviceMaster(data: any) {
    this.rowDataClicked1 = data.rowData;
    console.log(JSON.stringify(this.rowDataClicked1));
    this._configurationService.DeviceDeRegister(this.rowDataClicked1).subscribe(response => {
      this.updateResponse = response as Response;
      if (this.updateResponse.responseStatus == 200) {
        this._toastrService.success(this.updateResponse.responseMessage);
        this.SearchDeviceMasterList();
      } else {
        this._serverValidation.parseValidation(this._msgProperty.transform('device_master_validation'), this.updateResponse.responseData)
      }
    });
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
  BMCDropDown(plant_code: any) {
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
      MPPDropDown(plant_code: any) {
        this.mppModel = Object.assign({}, this.searchForm.value);
        this.newModel.bmc_code = this.mppModel.bmc_code;
        this._masterService.MPPDropDown(this.newModel).subscribe(response => {
          this.searchResponse = response as Response;
          if (this.searchResponse.responseStatus == 200) {
            this.mppDropDown = this.searchResponse.responseData as Dropdown[];
          } else {
            this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  //#region Model View Methods
  showModal(): void {
    this.isModalShown = true;
  }
  hideModal(): void {
    this.autoShownModal?.hide();
  }
  onHidden(): void {
    this.isModalShown = false;
  }
}
