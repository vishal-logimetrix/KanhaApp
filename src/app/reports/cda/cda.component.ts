import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
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
  selector: 'app-cda',
  templateUrl: './cda.component.html',
  styleUrls: ['./cda.component.css']
})
export class CDAComponent implements OnInit{
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
  farmerDropDown!: Dropdown[];
  datePickerConfig!: Partial<BsDatepickerConfig>;
  mppModel: any = {}
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
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
      //for grid
      rowData = [];
      columnDefs: ColDef[] = [
        { headerName: "Date", field: 'mpp_code', resizable: true, width: 130 },      //add the rate feild
        { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
        { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
        { headerName: "MCC Code", field: 'mpp_name', resizable: true, width: 130 },   //add the mcc code feild
        { headerName: "MCC Name", field: 'mpp_name', resizable: true, width: 130 },   //add the mcc name feild
        { headerName: "Route Code", field: 'mpp_name', resizable: true, width: 130 },   //add the route code feild
        { headerName: "Route Name", field: 'mpp_name', resizable: true, width: 130 },   //add the route name feild
        { headerName: "shift", field: 'member_code', resizable: true, width: 130 },     //add the shift feild
        { headerName: "C QTY", field: 'Qty', resizable: true, width: 130 },                //add for all listed in below
        { headerName: "C FAT Kg", field: 'avg_fat', resizable: true, width: 130 },
        { headerName: "C SNF Kg", field: 'avg_snf', resizable: true, width: 130 },
        { headerName: "C FAT", field: 'kg_fat', resizable: true, width: 130 },
        { headerName: "C SNF", field: 'kg_snf', resizable: true, width: 130 },
        { headerName: "C Amount", field: 'rate', resizable: true, width: 130 },
        { headerName: "D Qty", field: 'amount', resizable: true, width: 130 },
        { headerName: "A Fat Kg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A SNF Kg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A Fat", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A SNF", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A Amount", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "D-C Qty", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "D-C FatKg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "D-C SNFKg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "D-C Fat", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "D-C SNF", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "D-C Amount", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-D Qty", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-D FatKg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-D SNFKg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-D Fat", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-D Fat", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-D SNF", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-D Amount", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-C Qty", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-C FatKg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-C SNFKg", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-C Fat", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-C SNF", field: 'no_of_shift', resizable: true, width: 130 },
        { headerName: "A-C Amount", field: 'no_of_shift', resizable: true, width: 130 },
      ];

      exportDataToExcel(): void {
        const formattedData = this.rowData.map((entry: any) => ({
          'MPP CODE': entry.mpp_code,
          'MPP NAME': entry.mpp_name,
          'FARMER CODE': entry.member_code,
          'FARMER NAME': entry.farmer_name,
          'MILK TYPE': entry.milk_type,
          'QTY': entry.Qty,
          'FAT KG': entry.kg_fat,
          'SNF KG': entry.kg_snf,
          'SNF %': entry.avg_snf,
          'FAT %': entry.avg_fat,
          'RATE': entry.rate,
          'AMOUNT': entry.amount,
          'NO OF SHIFT':entry.no_of_shift,
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
    this.showModal();
  }
  // ff(){
  //   this.searchModel = Object.assign({}, this.searchForm.value);
  //   console.log('______searcmodule_________', this.searchModel);
  //   this.newModel.from_date = this.searchModel.from_date;
  //   this.newModel.from_shift_code = this.searchModel.from_shift_code;
  //   this.newModel.member_code = this.searchModel.member_code;
  //   this.newModel.to_date = this.searchModel.to_date;
  //   this.newModel.to_shift_code = this.searchModel.to_shift_code;
  //   console.log('______newmodule_________', this.newModel);
  //   this.isModalShown = !this.isModalShown;
  // }
  CDAReport() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.newModel.from_date = this.searchModel.from_date;
      this.newModel.from_shift_code = this.searchModel.from_shift_code;
      this.newModel.member_code = this.searchModel.member_code;
      this.newModel.to_date = this.searchModel.to_date;
      this.newModel.to_shift_code = this.searchModel.to_shift_code;
      this._reportService.CDAReport(this.searchModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.rowData = this.searchResponse.responseData;
          console.log('______________CDA________________',this.rowData);
          this.isModalShown = !this.isModalShown;
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
      this._masterService.PlantDropDown(this.newModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.plantDropDown = this.searchResponse.responseData as Dropdown[];
          this.newModel.plant_code = this.searchResponse.responseData[0].value;
          // console.log('________new model plant dropdown_____',this.newModel);
          this. MCCDropDown() ;
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
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
          // this.alertService.Error(this.searchResponse.responseData);
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
          // this.alertService.Error(this.searchResponse.responseData);
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
          // this.alertService.Error(this.searchResponse.responseData);
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
        // this.alertService.Error(this.searchResponse.responseData);
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
