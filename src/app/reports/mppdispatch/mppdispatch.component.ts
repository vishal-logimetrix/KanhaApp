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
@Component({
  selector: 'app-mppdispatch',
  templateUrl: './mppdispatch.component.html',
  styleUrls: ['./mppdispatch.component.css']
})
export class MPPDispatchComponent implements OnInit {

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
      { headerName: "BMC Code", field: 'bmc_code', resizable: true, width: 130 },
      { headerName: "BMC Name", field: 'bmc_name', resizable: true, width: 130 },
      { headerName: "MPP Code", field: 'mpp_code', resizable: true, width: 130 },
      { headerName: "MPP Name", field: 'mpp_name', resizable: true, width: 130 },
      { headerName: "Route Name", field: 'route_name', resizable: true, width: 130 },
      {
        headerName: "Collection Date", field: 'collection_date', resizable: true, width: 130,
        cellRenderer: (data: any) => {
          // return data.value ? (new Date(data.value)).toLocaleDateString() : '';
          return moment(data.value).format('DD/MM/YYYY')
        }
      },
      { headerName: "Shift Name", field: 'shift_name', resizable: true, width: 130 },
      { headerName: "Milk Type", field: 'milk_type', resizable: true, width: 115 },
      { headerName: "QTY", field: 'qty', resizable: true, width: 100 },
      { headerName: "FAT", field: 'fat', resizable: true, width: 100 },
      { headerName: "SNF", field: 'snf', resizable: true, width: 100 },
      { headerName: "Rate", field: 'rate', resizable: true, width: 100 },
      { headerName: "AMT", field: 'amount', resizable: true, width: 100 },
      { headerName: "No. of Can", field: 'no_of_can', resizable: true, width: 100 },
      {
        headerName: "Dispatch DateTime", field: 'dispatch_datetime', resizable: true, width: 130,
        cellRenderer: (data: any) => {
          // return data.value ? (new Date(data.value)).toLocaleDateString() : '';
          return moment(data.value).format('DD/MM/YYYY HH:MM:ss')
        }
      },
      { headerName: "Entry From", field: 'entry_from', resizable: true, width: 130 }
    ];
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
  MPPDispatchSummeryDateWise() {
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this._reportService.MPPDispatchSummeryDateWise(this.searchModel).subscribe(response => {
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
