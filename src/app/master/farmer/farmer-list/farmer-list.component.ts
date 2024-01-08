import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from '../../services/master.service';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
@Component({
  selector: 'app-farmer-list',
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.css']
})
export class FarmerListComponent implements OnInit{

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
    bmc_code:'',
    mpp_code:'',
    farmer_application_no:'',
    farmer_code:'',
    farmer_name:'',
    first_name:'',
    last_name:'',
    middle_name:'',
    farmer_short_code:'',
    gender:'',
    mobile_no:'',
    is_active: true,
  }

  originalData: any[] = [];
  //for grid
  rowData:any = [];
  columnDefs: ColDef[] = [
    { headerName:'BMC Code', field: 'bmc_code', resizable: true, width:130 },
    { headerName:'BMC Name', field: 'bmc_name', resizable: true, width:150 },
    { headerName:'MPP Code', field: 'mpp_code', resizable: true, width:130 },
    { headerName:'MPP Name', field: 'mpp_name', resizable: true, width:150 },
    { headerName:'Farmer Application Number', field: 'farmer_application_no', resizable: true, width:130 },
    { headerName:'Farmer Code', field: 'farmer_code', resizable: true, width:150 },
    { headerName:'Farmer Short Code', field: 'farmer_short_code', resizable: true, width:130 },
    { headerName:'Farmer Name', field: 'farmer_name', resizable: true, width:150 },
    { headerName:'Mobile No', field: 'mobile_no', resizable: true, width:150 },
    { headerName:'Gender', field: 'gender', resizable: true, width:130 },
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

  constructor(private _masterService: MasterService, private _toastrService: ToastrService,private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe){
    
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
      mpp_name: new FormControl(''),
      farmer_application_no: new FormControl('', Validators.required),
      farmer_code: new FormControl('', [Validators.required]),
      farmer_name: new FormControl('', Validators.required),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      middle_name: new FormControl(''),
      farmer_short_code: new FormControl('',Validators.required),
      gender:new FormControl('',Validators.required),
      mobile_no:new FormControl('',Validators.required),
      is_active: new FormControl(true),
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
  //   const  trimmedSearchTerm = this.searchTerm.trim();
  //   if (trimmedSearchTerm) {
  //     this.rowData = this.originalData.filter((row: any) =>
  //       row.bmc_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.bmc_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mpp_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mpp_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.farmer_application_no.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.farmer_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.farmer_short_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.farmer_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.mobile_no.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.gender.toLowerCase().indexOf(this.searchTerm) !== -1  
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
          row.farmer_application_no,
          row.farmer_code,
          row.farmer_short_code,
          row.farmer_name,
          row.mobile_no,
          row.gender
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
      farmer_application_no: this.selectedRowData.farmer_application_no,
      farmer_code: this.selectedRowData.farmer_code,
      mobile_no: this.selectedRowData.mobile_no,
      farmer_short_code: this.selectedRowData.farmer_short_code,
      farmer_name: this.selectedRowData.farmer_name,
      gender: this.selectedRowData.gender,
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
      'FARMER APPLICATION NUMBER': entry.farmer_application_no,
      'Farmer CODE': entry.farmer_code,
      'Farmer NAME': entry.farmer_name,
      'MOBILE NO': entry.mobile_no,
      'GENDER': entry.gender,
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

  SearchFarmer(){
    // if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.mpp_code = this.searchModel.mpp_code;
      this._masterService.FarmerList(this.newModel).subscribe(response => {
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
        this. MCCDropDown() ;
        this. MCCDropDownn() ;
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

  MPPDropDown(plant_code : any) {
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
  MPPDropDownn(plant_code : any) {
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

  addFarmer(){
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
      this.newModel.farmer_application_no = this.model.farmer_application_no;
      this.newModel.farmer_code = this.model.farmer_code;
      this.newModel.farmer_name = this.model.farmer_name;
      this.newModel.farmer_short_code = this.model.farmer_short_code;
      this.newModel.first_name = this.model.first_name;
      this.newModel.gender = this.model.gender;
      this.newModel.is_active = this.model.is_active;
      this.newModel.last_name = this.model.last_name;
      this.newModel.middle_name = this.model.middle_name;
      this.newModel.mobile_no = this.model.mobile_no;
      this.newModel.mpp_code = this.model.mpp_code;
      this._masterService.FarmerCreate(this.newModel).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          this.isAddModalShown = false;
          this._toastrService.success(this.createResponse.responseData);
          this.searchForm.reset();
          this.searchForm.controls['is_active'].setValue(true);
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('farmer_validation'), this.createResponse.responseData)
        }
      });
    } else {
      this._toastrService.error("Input Form data is not valid.");
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
  }

}
