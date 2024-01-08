import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
import { ReportService } from '../Services/report.service';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-farmer-shift-report',
  templateUrl: './farmer-shift-report.component.html',
  styleUrls: ['./farmer-shift-report.component.css']
})
export class FarmerShiftReportComponent implements OnInit{
  closeResult: string = "";
  isModalShown: boolean = false;
  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  public searchForm: FormGroup;
  public createForm!: FormGroup;
  searchModel: any;
  searchResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  bmcDropDown!: Dropdown[];
  mppDropDown!: Dropdown[];
  farmerDropDown!: Dropdown[];
  datePickerConfig!: Partial<BsDatepickerConfig>;
  mppModel: any = {};
  newModel = {
    bmc_code: '',
    company_code:'',
    from_date:'',
    from_shift_code:'',
    mcc_code:'',
    member_code:'',
    mpp_code:'',
    plant_code:'',
    to_date:'',
    to_shift_code:''
  }
  originalData: any[] = [];
  searchTerm: string = '';
  model: any = {};

    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
      { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
      { headerName: "Farmer Code", field: 'member_code', resizable: true, width: 130 },
      { headerName: "Farmer Name", field: 'farmer_name', resizable: true, width: 130 },
      {
        headerName: "Collection Date", field: 'collection_date', resizable: true, width: 130,
        cellRenderer: (data: any) => {
          return moment(data.value).format('DD/MM/YYYY')
        }
      },
      { headerName: "Shift Name", field: 'shift_name', resizable: true, width: 130 },
      { headerName: "Sample No", field: 'sample_no', resizable: true, width: 130 },
      { headerName: "Milk Type", field: 'milk_type', resizable: true, width: 115 },
      { headerName: "QTY", field: 'qty', resizable: true, width: 100 },
      { headerName: "FAT", field: 'fat', resizable: true, width: 100 },
      { headerName: "SNF", field: 'snf', resizable: true, width: 100 },
      { headerName: "Rate", field: 'rate', resizable: true, width: 100 },
      { headerName: "AMT", field: 'amount', resizable: true, width: 100 },
      { headerName: "Qty Flag", field: 'is_qty_auto', resizable: true, width: 100 },
      { headerName: "Quality Flag", field: 'is_quality_auto', resizable: true, width: 100 },
      {
        headerName: "Qty Sample Time", field: 'qty_sample_time', resizable: true, width: 130,
        cellRenderer: (data: any) => {
          return moment(data.value).format('DD/MM/YYYY HH:MM:ss')
        }
      },
      {
        headerName: "Quality Sample Time", field: 'quality_sample_time', resizable: true, width: 130,
        cellRenderer: (data: any) => {
          return moment(data.value).format('DD/MM/YYYY HH:MM:ss')
        }
      },
      { headerName: "Entry From", field: 'entry_from', resizable: true, width: 130 }
    ];
    exportDataToExcel(): void {
      const formattedData = this.rowData.map((entry: any) => ({
        'MPP CODE': entry.mpp_code,
        'MPP NAME': entry.mpp_name,
        'FARMER CODE': entry.member_code,
        'FARMER NAME': entry.farmer_name,
        'COLLECTION DATE':this.formatDate(entry.collection_date),
        'SHIFT NAME': entry.shift_name,
        'SAMPLE NO.':entry.sample_no,
        'MILK TYPE': entry.milk_type,
        'QTY': entry.qty,
        'FAT': entry.fat,
        'SNF': entry.snf,
        'CLR': entry.clr,
        'RATE': entry.rate,
        'AMOUNT': entry.amount,
        'QTY FLAG':entry.is_qty_auto,
        'QUALITY FLAG':entry.is_quality_auto,
        'QTY SAMPLE TIME':this.formatDate(entry.qty_sample_time),
        'QUALITY SAMPLE TIME':this.formatDate(entry.quality_sample_time),
        'ENTRY FROM': entry.entry_from
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
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }
    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
      sortable: true,
      filter: true
    };
    @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  constructor(private _masterService: MasterService, private _reportService: ReportService, private _toastrService: ToastrService){
    this.searchForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('0'),
      member_code: new FormControl('0'),
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
          row.mpp_code,
          row.mpp_name, 
          row.member_code,
          row.farmer_name,
          row.shift_name,
          row.shift_code.toString(),
          row.sample_no.toString(),
          row.milk_type,
          row.qty.toString(),
          row.fat.toString(),
          row.snf.toString(),
          row.clr.toString(),
          row.rate.toString(),
          row.amount.toString(),
          row.is_qty_auto,
          row.entry_from,
          // row.,
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


  FarmerShiftReport() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.from_date = this.searchModel.from_date;
      this.newModel.from_shift_code = this.searchModel.from_shift_code;
      this.newModel.member_code = this.searchModel.member_code;
      this.newModel.to_date = this.searchModel.to_date;
      this.newModel.to_shift_code = this.searchModel.to_shift_code;
      this._reportService.FarmerShiftReport(this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.originalData = this.searchResponse.responseData;
          this.rowData = [...this.originalData];
          console.log('--------------------', this.rowData)
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
        this. MCCDropDown()
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
  FarmerDropDown(mcc_code: any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this.newModel.mpp_code = this.mppModel.mpp_code;
    this._masterService.FarmerDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.farmerDropDown = this.searchResponse.responseData as Dropdown[];
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
