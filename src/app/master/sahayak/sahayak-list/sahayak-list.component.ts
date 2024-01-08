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
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
@Component({
  selector: 'app-sahayak-list',
  templateUrl: './sahayak-list.component.html',
  styleUrls: ['./sahayak-list.component.css']
})
export class SahayakListComponent implements OnInit{

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
  mppDropDown!: Dropdown[];
  mppDropDownn!: Dropdown[];
  datePickerConfig: Partial<BsDatepickerConfig>;
  mppModel: any = {};
  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';

  model: any = {};
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    mcc_name:'',
    bmc_code:'',
    bmc_name:'',
    mpp_code:'',
    mpp_name:'',
  }

  originalData: any[] = [];
 //for grid
 rowData:any = [];
 columnDefs: ColDef[] = [
  { headerName:'BMC Code', field: 'bmc_code', resizable: true, width: 130},
  { headerName:'BMC Name', field: 'bmc_name', resizable: true, width: 150 },
  { headerName:'MPP Code', field: 'mpp_code', resizable: true, width: 130 },
  { headerName:'MPP Name', field: 'mpp_name', resizable: true, width: 150 },
  { headerName:'Sahayak Code', field: 'sahayak_code', resizable: true, width: 130 },
  { headerName:'Sahayak Name', field: 'sahayak_name', resizable: true, width: 150 },
  { headerName:'Mobile No', field: 'mobile_no', resizable: true, width: 150 },
  { headerName:'Is Member', field: 'is_member', resizable: true, width: 130 },
  { headerName:'Agreement start Date', field: 'agreement_start_date', resizable: true, width: 150 },
  { headerName:'Agreement End Date', field: 'agreement_end_date', resizable: true, width: 150 },
  { headerName:'Security Deposite Amount', field: 'security_deposit_amount', resizable: true, width: 150 },
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


  constructor(private _masterService: MasterService, private _toastrService: ToastrService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe){

    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      bmc_name: new FormControl(''),
      mpp_code: new FormControl('', Validators.required),
      mpp_name: new FormControl('',),
      sahayak_code: new FormControl('', Validators.required),
      sahayak_name: new FormControl('', Validators.required),
      mobile_no: new FormControl('', Validators.required),
      is_member: new FormControl('', Validators.required),
      agreement_start_date: new FormControl('', Validators.required),
      agreement_end_date: new FormControl('', Validators.required),
      security_deposit_amount: new FormControl(''),
      search: new FormControl(''),
    });
    this.datePickerConfig = {
      containerClass: 'theme-blue',
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      isAnimated: true,
      showTodayButton: true
    }
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
  //       row.sahayak_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.sahayak_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mobile_no.toLowerCase().indexOf(this.searchTerm) !== -1  
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
          row.sahayak_code,
          row.sahayak_name,
          row.mobile_no,
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
      mpp_code: this.selectedRowData.mpp_code,
      mpp_name: this.selectedRowData.mpp_name,
      sahayak_code: this.selectedRowData.sahayak_code,
      sahayak_name: this.selectedRowData.sahayak_name,
      mobile_no: this.selectedRowData.mobile_no,
      agreement_start_date: this.selectedRowData.agreement_start_date,
      agreement_end_date: this.selectedRowData.agreement_end_date,
      security_deposit_amount: this.selectedRowData.security_deposit_amount,
      is_member: this.selectedRowData.is_member
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
      'SAHAYAK CODE': entry.sahayak_code,
      'SAHAYAK NAME': entry.sahayak_name,
      'MOBILE NO': entry.mobile_no,
      'IS MEMBER': entry.is_member,
      'AGREEMENT START DATE': entry.agreement_start_date,
      'AGREEMENT END DATE': entry.agreement_end_date,
      'SECURITY DEPOSITE AMOUNT': entry.security_deposit_amount,
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
  SearchSahayak() {
    // if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.mpp_code = this.searchModel.mpp_code;
      this._masterService.VSPList(this.newModel).subscribe(response => {
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
    this.newModel.bmc_code = this.mppModel.bmc_code;
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
    this.newModel.bmc_code = this.mppModel.bmc_code;
    this._masterService.MCCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDownn = this.searchResponse.responseData as Dropdown[];
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
  BMCDropDownn(plant_code: any) {
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
  MPPDropDownn(plant_code: any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this.newModel.bmc_code = this.mppModel.bmc_code;
    this._masterService.MPPDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mppDropDownn = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  addSahayak(){
    this.searchForm.get('bmc_code')?.enable();
    this.searchForm.get('bmc_name')?.enable();
    this.searchForm.get('mpp_code')?.enable();
    this.searchForm.get('mpp_name')?.enable();
    const isActive = this.searchForm.get('is_active')?.value;
    this.searchForm.reset();
    this.isAddModalShown = !this.isAddModalShown;
    this.searchForm.get('is_active')?.setValue(isActive);
  }
  Create() {
    if (this.searchForm.valid) {
    this.model = Object.assign({}, this.searchForm.value);
    this.newModel.agreement_end_date = this.model.agreement_end_date;
    this.newModel.agreement_start_date = this.model.agreement_start_date;
    this.newModel.mobile_no = this.model.mobile_no;
    this.newModel.mpp_code = this.model.mpp_code;
    this.newModel.sahayak_code = this.model.sahayak_code;
    this.newModel.sahayak_name = this.model.sahayak_name;
    this.newModel.is_member = this.model.is_member;
    this.newModel.security_deposit_amount = this.model.security_deposit_amount;
      this._masterService.VSPCreate(this.model).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          this.isAddModalShown = false;
          this._toastrService.success(this.createResponse.responseMessage)
          this.searchForm.reset();
          this.searchForm.controls['is_member'].setValue(false);
        }
        else if(this.createResponse.responseStatus == 500){
          // this._toastrService.error(this.createResponse.responseMessage);
          this._toastrService.warning(this.createResponse.responseData.sahayak_code,'Sahayak code not allow'); //check what is unique
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('sahayak_validation'),this.createResponse.responseData)
        }
      });
    } else {
      this._toastrService.error("Input Form data is not valid.")
    }
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
      console.log('________________vishal_________');
      this.searchForm.addValidators;
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
    this.isAddModalShown = false;
  }
  onHidden(): void {
    this.isModalShown = false;
    this.isAddModalShown = false;
    this.isUpdateModalShown == false;
  }
}
