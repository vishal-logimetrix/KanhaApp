import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from '../../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ConfigurationService } from 'src/app/configuration/Services/configuration.service';
import { Router } from '@angular/router';
import { retryWhen, delayWhen, timer, take, delay, switchMap, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-rate-applicability',
  templateUrl: './rate-applicability.component.html',
  styleUrls: ['./rate-applicability.component.css']
})
export class RateApplicabilityComponent implements OnInit {
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  model: any = {};
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  bmcDropDown!: Dropdown[];
  routeDropDown!: Dropdown[];
  deviceLocationDropDown!: Dropdown[];
  mppDropDown!: Dropdown[];
  public _rate_code:any;
  isModalShown: boolean = false;
  datePickerConfig!: Partial<BsDatepickerConfig>;
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    route_codes:[],
    mpp_codes:[],
    rate_location:'',
    effective_date:'',
    effective_shift:'',
    rate_code:'',
  };
  rowData = [];
  columnDefs: ColDef[] = [
    { field: 'plant_code', resizable: true },
    { field: 'plant_name', resizable: true },
    { field: 'mcc_code', resizable: true },
    { field: 'mcc_name', resizable: true },
    { field: 'address', resizable: true },
    { field: 'is_active', resizable: true },
    { field: 'Action' }
  ];
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };
  constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _configurationService: ConfigurationService, private _route: Router, private _toastrService: ToastrService){
    const navigation = this._route.getCurrentNavigation();
      const state = navigation?.extras.state as {
        pass_data: any
      };
      this._rate_code = state?.pass_data.rate_code;
      this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      route_codes:new FormArray([]),
      mpp_codes: new FormArray([]),
      rate_location: new FormControl('', Validators.required),
      effective_date: new FormControl('', Validators.required),
      effective_shift: new FormControl('', Validators.required),
      rate_code:new FormControl('',Validators.required)
    });
    this.createForm.get('rate_code')?.setValue(this._rate_code);
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required)
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
    this.DeviceLocationDropDown("device_location");
  }
  // ff(){
  //   this.model = Object.assign({}, this.createForm.value);
  //   console.log('_______searchModel__________',this.model);
  //   this.newModel.mpp_codes = this.model.mpp_codes;
  //   console.log('_______new Model__________',this.newModel);
  // }
  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      this.newModel.mpp_codes = this.model.mpp_codes;
      this._masterService.RateApplicabilityCreate(this.newModel).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this.alertService.Success(this.createResponse.responseMessage);
          this._toastrService.success(this.createResponse.responseData);
          this.createForm.reset();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('rate_applicability_validation'), this.createResponse.responseData)
        }
      });
    } else {
      // this.alertService.Error("Input form data is not valid.");
      this._toastrService.error("Input form data is not valid.");
    }
  }
  CompanyDropDown() {
    this._masterService.CompanyDropDown().pipe(
      retryWhen(errors => errors.pipe(
        delayWhen(() => timer(500)), // Delay for 500 milliseconds before retrying
        take(5) // Retry for a maximum of 5 times (you can adjust this as needed)
      ))
    ).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.companyDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.company_code = this.searchResponse.responseData[0].value;
        // console.log('_________model->company_code_________',this.model);
        this.PlantDropDown();
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    }, error => {
      // this.alertService.Error('Failed to retrieve data.');
      this._toastrService.error("Failed to retrieve data.");
    });
  }
  PlantDropDown() {
    this.model = Object.assign({}, this.createForm.value);
    this._masterService.PlantDropDown( this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.plant_code = this.searchResponse.responseData[0].value;
        this.MCCDropDown();
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  MCCDropDown() {
    this.model = Object.assign({}, this.createForm.value);
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
  BMCDropDown(company_code: any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.mcc_code = this.model.mcc_code;
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
  RouteDropDown(company_code: any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.bmc_code = this.model.bmc_code;
    this._masterService.RouteDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.routeDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  MPPDropDown(company_code: any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.effective_date = this.model.effective_date;
    this.newModel.effective_shift = this.model.effective_shift;
    this.newModel.rate_code = this.model.rate_code;
    this.newModel.rate_location = this.model.rate_location;
    this.newModel.route_codes = this.model.route_codes;
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
  DeviceLocationDropDown(common_key_name: string) {
    this.model = Object.assign({}, { common_key: common_key_name });
    this._configurationService.CommonMasterValueDropDown(this.model)   // leave here this.model as it is.
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            delay(500),
            take(5),
            switchMap(() => {
              return this._configurationService.CommonMasterValueDropDown(this.newModel);
            })
          )
        ),
        catchError((error) => {
          console.error('API call error:', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response !== null) {
          this.searchResponse = response as Response;
          if (this.searchResponse.responseStatus === 200) {
            this.deviceLocationDropDown = this.searchResponse.responseData as Dropdown[];
          } else {
            // this.alertService.Error(this.searchResponse.responseData);
            this._toastrService.error(this.searchResponse.responseData);
          }
        } else {
          // this.alertService.Error('Failed to fetch data. Please try again later.');
          this._toastrService.error('Failed to Fetch data. Please try again later.');
        }
      });
  }
  ////#endregion
  onRouteCheckboxChange(event: any) {
    const selectedCountries = (this.createForm.controls['route_codes'] as FormArray);
    if (event.target.checked) {
      selectedCountries.push(new FormControl(event.target.value));
    } else {
      const index = selectedCountries.controls
      .findIndex(x => x.value === event.target.value);
      selectedCountries.removeAt(index);
    }
    this.MPPDropDown("1");
  }
  onMPPCheckboxChange(event: any) {
    const selectedCountries = (this.createForm.controls['mpp_codes'] as FormArray);
    if (event.target.checked) {
      selectedCountries.push(new FormControl(event.target.value));
    } else {
      const index = selectedCountries.controls
      .findIndex(x => x.value === event.target.value);
      selectedCountries.removeAt(index);
    }
  }
}
