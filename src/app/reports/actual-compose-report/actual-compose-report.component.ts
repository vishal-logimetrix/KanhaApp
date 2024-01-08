import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
import { ReportService } from '../Services/report.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-actual-compose-report',
  templateUrl: './actual-compose-report.component.html',
  styleUrls: ['./actual-compose-report.component.css']
})
export class ActualComposeReportComponent implements OnInit{
  public searchForm!: FormGroup;
  searchModel: any;
  searchResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  bmcDropDown!: Dropdown[];
  mppDropDown!: Dropdown[];
  farmerDropDown!: Dropdown[];
  datePickerConfig!: Partial<BsDatepickerConfig>;
  mppModel: any = {}
  isShowTabel: boolean = false;
  rowData = [];
  newModel = {
    bmc_code:'',
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
  columnDefs: ColDef[] = [                                                //change the feild name later based on API response.
    { headerName: "BMC Name", field: 'bmc_name', resizable: true, width: 130 },
    { headerName: "Route Name", field: 'route_name', resizable: true, width: 130 },
    { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
    { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
    { headerName: "Date", field: 'date', resizable: true, width: 115 },
    { headerName: "Shift", field: 'shift', resizable: true, width: 130 },
    { headerName: "A Qtr(Ltr)", field: 'A_Qtr(Ltr)', resizable: true, width: 130 },
    { headerName: "A Fat", field: 'A_fat', resizable: true, width: 130 },
    { headerName: "A SNF", field: 'A_snf', resizable: true, width: 130 },
    { headerName: "A FatKg", field: 'A_fatkg', resizable: true, width: 130 },
    { headerName: "A SNFKg", field: 'A_snfkg', resizable: true, width: 130 },
    { headerName: "Amount", field: 'amount', resizable: true, width: 130 },
    { headerName: "C Qtr(Ltr)", field: 'C_Qtr(Ltr)', resizable: true, width: 130 },
    { headerName: "C Fat", field: 'C_fat', resizable: true, width: 130 },
    { headerName: "C SNF", field: 'C_snf', resizable: true, width: 130 },
    { headerName: "C FatKg", field: 'C_fatKg', resizable: true, width: 130 },
    { headerName: "C SNFKg", field: 'C_snfkg', resizable: true, width: 130 },
    { headerName: "C Amount", field: 'C_amount', resizable: true, width: 130 },
    { headerName: "AC Qtr(Ltr)", field: 'Ac_Qtr(Ltr)', resizable: true, width: 130 },
    { headerName: "AC SNF", field: 'Ac_snf', resizable: true, width: 130 },
    { headerName: "AC fatKg", field: 'Ac_fatkg', resizable: true, width: 130 },
    { headerName: "AC SNFKg", field: 'Ac_snf', resizable: true, width: 130 },
    { headerName: "AC Amount", field: 'Ac_amount', resizable: true, width: 130 },
    { headerName: "Bonus Difference", field: 'bonus_difference', resizable: true, width: 130 },
  ];
            // DefaultColDef sets props common to all Columns
            public defaultColDef: ColDef = {
            sortable: true,
            filter: true
          };
  
  constructor(private _masterService: MasterService, private _reportService: ReportService,private _toastrService: ToastrService){
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
      to_shift_code: new FormControl('', Validators.required)
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
  }
  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'BMC NAME': entry.bmc_name,
      'ROUTE NAME': entry.route_name,                                        //CHANGE THE FEILD NAMES BASED ON API RESPONSE LATER.
      'MPP NAME': entry.mpp_code,
      'MPP CODE': entry.mpp_code,
      'DATE': entry.date,
      'SHIFT': entry.shift,
      'A QTR(Ltr)': entry.A_Qtr,
      'A FAT': entry.A_fat,
      'A SNF': entry.A_snf,
      'A FATKg': entry.A_fatkg,
      'A SNFKg': entry.A_snfkg,
      'AMOUNT': entry.amount,
      'C QTR(Ltr)': entry.C_Qtr,
      'C FAT': entry.C_fat,
      'C SNF': entry.C_snf,
      'C FATKg': entry.C_fatKg,
      'C SNFKg': entry.C_snfkg,
      'C AMOUNT': entry.C_amount,
      'AC QTR(Ltr)': entry.Ac_Qtr,
      'AC SNF': entry.Ac_snf,
      'AC FATKG': entry.Ac_fatkg,
      'AC SNFKG': entry.Ac_snf,
      'AC AMOUNT': entry.Ac_amount,
      'BONUSE DIFFERENCE': entry.bonus_difference,
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
      //   console.log('__________searchModel________', this.searchModel)
      //   this.newModel.from_date = this.searchModel.from_date;
      //   this.newModel.from_shift_code = this.searchModel.from_shift_code;
      //   this.newModel.mcc_code = this.searchModel.mcc_code;
      //   this.newModel.member_code = this.searchModel.member_code;
      //   this.newModel.to_date = this.searchModel.to_date;
      //   this.newModel.to_shift_code = this.searchModel.to_shift_code;
      //   console.log('__________newModel________', this.newModel)
      // }
  ActualComposeReport() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.from_date = this.searchModel.from_date;
      this.newModel.from_shift_code = this.searchModel.from_shift_code;
      this.newModel.mcc_code = this.searchModel.mcc_code;
      this.newModel.member_code = this.searchModel.member_code;
      this.newModel.to_date = this.searchModel.to_date;
      this.newModel.to_shift_code = this.searchModel.to_shift_code;
      this._reportService.ActualComposeReport(this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.rowData = this.searchResponse.responseData;
          this.isShowTabel =!this.isShowTabel;
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
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
          // console.log('______new Model_____', this.newModel);  
          this. PlantDropDown();
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }
    PlantDropDown() {
      this.mppModel = Object.assign({}, this.searchForm.value);
      this._masterService.PlantDropDown( this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.plantDropDown = this.searchResponse.responseData as Dropdown[];
          this.newModel.plant_code = this.searchResponse.responseData[0].value;
          // console.log('________new model plant dropdown_____',this.newModel);
          this. MCCDropDown();
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }
    MCCDropDown() {
      this.mppModel = Object.assign({}, this.searchForm.value);
      this._masterService.MCCDropDown( this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.mccDropDown = this.searchResponse.responseData as Dropdown[];
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }
    BMCDropDown(plant_code: any) {
      this.mppModel = Object.assign({}, this.searchForm.value);
      this.newModel.mcc_code = this.mppModel.mcc_code;
      this._masterService.BMCDropDown( this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.bmcDropDown = this.searchResponse.responseData as Dropdown[];
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
        }
      });
    }
    MPPDropDown(plant_code: any) {
      this.mppModel = Object.assign({}, this.searchForm.value);
      this.newModel.bmc_code = this.mppModel.bmc_code;
      this._masterService.MPPDropDown( this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.mppDropDown = this.searchResponse.responseData as Dropdown[];
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }
    FarmerDropDown(mcc_code: any) {
      this.mppModel = Object.assign({}, this.searchForm.value);
      this.newModel.mpp_code = this.mppModel.mpp_code;
      this._masterService.FarmerDropDown( this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.farmerDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
}
