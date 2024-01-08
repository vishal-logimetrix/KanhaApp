import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
// import { moment } from 'ngx-bootstrap/chronos/testing/chain';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Response } from 'src/app/Auth/common//model/response';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../../services/master.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-rate-applicability-list',
  templateUrl: './rate-applicability-list.component.html',
  styleUrls: ['./rate-applicability-list.component.css']
})
export class RateApplicabilityListComponent implements OnInit {
  closeResult: string = "";
  isModalShown: boolean = false;
  public searchForm!: FormGroup;
  searchModel: any;
  searchResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  bmcDropDown!: Dropdown[];
  mppDropDown!: Dropdown[];
  mppModel: any = {};
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    mpp_code:'',
    bmc_code:'',
  };
  searchTerm: string = '';
  originalData: any[] = [];
   //for grid
   rowData:any = [];
   columnDefs: ColDef[] = [
     { headerName: "BMC Code", field: 'bmc_code', resizable: true, width: 130 },
     { headerName: "BMC Name", field: 'bmc_name', resizable: true, width: 130 },
     { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
     { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
     { headerName: "Rate Code", field: 'rate_code', resizable: true, width: 120 },
     {
       headerName: "Effective Date", field: 'effective_date', resizable: true, width: 150,
       cellRenderer: (data: any) => {
         return moment(data.value).format('DD/MM/YYYY')
       }
     },
     { headerName: "Effective Shift", field: 'effective_shift', resizable: true, width: 150 },
     { headerName: "Rate Details", field: 'rate_details', resizable: true, width: 200 }
    ];
   // DefaultColDef sets props common to all Columns
   public defaultColDef: ColDef = {
     sortable: true,
     filter: true
   };
   @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  constructor(private _masterService: MasterService,private _toastrService: ToastrService){
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('0'),
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

  searchTable() {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.rowData = this.originalData.filter((row: any) => {
        const valuesToSearch = [
          row.bmc_code,
          row.bmc_name,
          row.mpp_code,
          row.mpp_name,
          row.rate_code,
          row.effective_date,
          row.effective_shift,
          row.rate_details,
        ];
        for (const value of valuesToSearch) {
          if (typeof value === 'string' && value.toLowerCase().indexOf(trimmedSearchTerm) !== -1) {
            return true;
          }
          // If it's a number, convert it to a string and then check
          if (typeof value === 'number' && value.toString().toLowerCase().indexOf(trimmedSearchTerm) !== -1) {
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

  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'BMC CODE': entry.bmc_code,
      'BMC NAME': entry.bmc_name,
      'MPP CODE': entry.mpp_code,
      'MPP NAME': entry.mpp_name,
      'RATE CODE': entry.rate_code,
      'EFFECTIVE DATE': entry.effective_date,
      'EFFECTIVE SHIFT': entry.effective_shift,
      'RATE DETAILS': entry.rate_details,
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
  // ff(){
  //   this.searchModel = Object.assign({}, this.searchForm.value);
  //   console.log('-------mpp model----------',this.searchModel);
  //   console.log('-------new model ------------',this.newModel);

  // }
  GetApplicabilityList() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.mpp_code = this.searchModel.mpp_code;
      this._masterService.GetRateApplicabilityList(this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.originalData = this.searchResponse.responseData;
          this.rowData = [...this.originalData];
          this.isModalShown = !this.isModalShown;
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }
  }
  //#region  DropDown Methods
  CompanyDropDown() {
    this._masterService.CompanyDropDown().subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.companyDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.company_code = this.searchResponse.responseData[0].value;
        this.PlantDropDown();
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
        this.MCCDropDown();
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  MCCDropDown() {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.MCCDropDown(this.mppModel).subscribe(response => {
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
    this.newModel.mpp_code = this.mppModel.mpp_code;
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
