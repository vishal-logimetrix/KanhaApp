import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
import { ReportService } from '../Services/report.service';

@Component({
  selector: 'app-farmer-master',
  templateUrl: './farmer-master.component.html',
  styleUrls: ['./farmer-master.component.css']
})
export class FarmerMasterComponent implements OnInit{

  closeResult: string = "";
  isModalShown: boolean = false;
  public searchForm: FormGroup;
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

    //for grid
    rowData = [];
    columnDefs: ColDef[] = [
      { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
      { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
      { headerName: "Application No", field: 'farmer_application_no', resizable: true, width: 120 },
      { headerName: "Farmer Code", field: 'farmer_code', resizable: true, width: 160 },
      { headerName: "Farmer Short Code", field: 'farmer_short_code', resizable: true, width: 130 },
      { headerName: "Farmer Name", field: 'farmer_name', resizable: true, width: 160 },
      { headerName: "Gender", field: 'gender', resizable: true, width: 130 },
      { headerName: "Mobile No", field: 'mobile_no', resizable: true, width: 130 }
    ];

    exportDataToExce(): void {
      const formattedData = this.rowData.map((entry: any) => ({
        'MPP CODE': entry.mpp_code,
        'MPP NAME': entry.mpp_name,
        'Application No': entry.farmer_application_no,
        'Farmer Code': entry.farmer_code,
       'Farmer Short Code': entry.farmer_short_code,
        'Farmer Name': entry.farmer_name,
        'Gender': entry.gender,
        'Mobile No': entry.mobile_no,
       
      }));
  
      // Create a new Excel workbook
      // const workbook = XLSX.utils.book_new();
      // const worksheet = XLSX.utils.json_to_sheet(formattedData);
      // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
      // Generate Excel file binary
      // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      // Save the file using FileSaver.js
      const filename = 'data_export.xlsx';
      // const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // saveAs(blob, filename);
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
  
  constructor(private _masterService: MasterService, private _reportService: ReportService){
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('0')
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
  FarmerMasterReport() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this._reportService.FarmerMasterReport(this.searchModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.rowData = this.searchResponse.responseData;
          this.isModalShown = !this.isModalShown;
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
        }
      });
    }
  }
  CompanyDropDown() {
    this._masterService.CompanyDropDown().subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.companyDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
      }
    });
  }
  PlantDropDown(company_code: any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.PlantDropDown(this.mppModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
      }
    });
  }
  MCCDropDown(plant_code: any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.MCCDropDown(this.mppModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
      }
    });
  }

  BMCDropDown(plant_code: any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.BMCDropDown(this.mppModel).subscribe(response => {
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
    this._masterService.MPPDropDown(this.mppModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mppDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
      }
    });
  }
  FarmerDropDown(mcc_code: any) {
    this.mppModel = Object.assign({}, this.searchForm.value);
    this._masterService.FarmerDropDown(this.mppModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.farmerDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
      }
    });
  }

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
