import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
import { ReportService } from '../Services/report.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-member-auto-manual-collection',
  templateUrl: './member-auto-manual-collection.component.html',
  styleUrls: ['./member-auto-manual-collection.component.css']
})
export class MemberAutoManualCollectionComponent implements OnInit{

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
  rowData = [];
                                               //change the feild name later based on API response.
  columnDefs: ColDef[] = [                                                //change the feild name later based on API response.
  { headerName: "BMC Code", field: 'bmc_code', resizable: true, width: 130 },
  { headerName: "BMC Name", field: 'bmc_name', resizable: true, width: 130 },
  { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
  { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
  { headerName: "Member Code", field: 'member_code', resizable: true, width: 115 },
  { headerName: "Mamber Name", field: 'member_name', resizable: true, width: 130 },
  { headerName: "C Type", field: 'c_type', resizable: true, width: 130 },
  { headerName: "S date", field: 's_date', resizable: true, width: 130 },
  { headerName: "Shift", field: 'shift', resizable: true, width: 130 },
  { headerName: "Qtr(Ltr)", field: 'qtrltr', resizable: true, width: 130 },
  { headerName: "Fat", field: 'fat', resizable: true, width: 130 },
  { headerName: "SNF", field: 'snf', resizable: true, width: 130 },
  { headerName: "Amount", field: 'amount', resizable: true, width: 130 },
  { headerName: "Rate", field: 'rate', resizable: true, width: 130 },
  { headerName: "Auto/Manual", field: 'auto_manual', resizable: true, width: 130 },
  { headerName: "SyncDirection", field: 'syncdirection', resizable: true, width: 130 },
  ];
            // DefaultColDef sets props common to all Columns
            public defaultColDef: ColDef = {
            sortable: true,
            filter: true
          };
  constructor(private _masterService: MasterService, private _reportService: ReportService){
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
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

  MemberAutoManual() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this._reportService.MemberAutoManualReport(this.searchModel).subscribe(response => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.rowData = this.searchResponse.responseData;
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
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

}
