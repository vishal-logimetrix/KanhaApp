import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from 'src/app/master/services/master.service';
import { MilkCollectionService } from '../../Services/milk-collection.service';
import { Response } from 'src/app/Auth/common//model/response';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
@Component({
  selector: 'app-bmc-collection-list',
  templateUrl: './bmc-collection-list.component.html',
  styleUrls: ['./bmc-collection-list.component.css']
})
export class BmcCollectionListComponent implements OnInit{
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
  datePickerConfig!: Partial<BsDatepickerConfig>;
  mppModel: any = {};
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    mpp_code:'',
    from_date:'',
    from_shift_code:'',
    to_date:'',
    to_shift_code:'',
  }
  searchTerm: string = '';
  originalData: any[] = [];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: "BMC Code", field: 'bmc_code', resizable: true, width: 130 },
      { headerName: "BMC Name", field: 'bmc_name', resizable: true, width: 130 },
      { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
      { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
      {
        headerName: "Collection Date", field: 'collection_date', resizable: true, width: 130,
        cellRenderer: (data: any) => {
          // return data.value ? (new Date(data.value)).toLocaleDateString() : '';
          return moment(data.value).format('DD/MM/YYYY')
        }
      },
      { field: 'shift_code', resizable: true, hide: true, width: 130 },
      { headerName: "Shift Name", field: 'shift_name', resizable: true, width: 130 },
      { headerName: "Sample No", field: 'sample_no', resizable: true, width: 130 },
      { field: 'milk_type_code', resizable: true, hide: true, width: 130 },
      { headerName: "Milk Type", field: 'milk_type_name', resizable: true, width: 130 },
      { headerName: "QTY", field: 'qty', resizable: true, width: 130 },
      { headerName: "FAT", field: 'fat', resizable: true, width: 130 },
      { headerName: "SNF", field: 'snf', resizable: true, width: 130 },
      { headerName: "Rate", field: 'rate', resizable: true, width: 130 },
      { headerName: "AMT", field: 'amount', resizable: true, width: 130 },
      { field: 'Action', width: 150 }
    ];
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };

  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  constructor(public _masterService:MasterService, private _milkCollectionService: MilkCollectionService, private _toastrService: ToastrService){
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('0', Validators.required),
      from_date: new FormControl('', Validators.required),
      to_date: new FormControl('', Validators.required),
      from_shift_code: new FormControl('', Validators.required),
      to_shift_code: new FormControl('', Validators.required),
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

  searchTable() {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.rowData = this.originalData.filter((row: any) => {
        const valuesToSearch = [
          row.bmc_code,
          row.bmc_name,
          row.mpp_code,
          row.mpp_name,
          row.farmer_code,
          row.farmer_short_code,
          row.farmer_name,
          row.collection_date,
          row.shift_name,
          row.sample_no,
          row.milk_type_code,
          row.milk_type_name,
          row.qty,
          row.fat,
          row.snf,
          row.rate,
          row.amount,
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
      'COLLECTION DATE': entry.collection_date,
      'SHIFT NAME': entry.shift_name,
      'SAMPLE NO': entry.sample_no,
      'MILK TYPE': entry.milk_type_code,
      'QTY': entry.qty,
      'FAT': entry.fat,
      'SNF': entry.snf,
      'RATE': entry.rate,
      'AMT': entry.AMT,
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

  GetBMCCollectionList() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.from_date = this.searchModel.from_date;
      this.newModel.from_shift_code = this.searchModel.from_shift_code;
      this.newModel.mpp_code = this.searchModel.mpp_code;
      this.newModel.to_date = this.searchModel.to_date;
      this.newModel.to_shift_code = this.searchModel.to_shift_code;
      this._milkCollectionService.GetBMCCollectionList(this.newModel).subscribe(response => {
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
  ////#endregion
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
