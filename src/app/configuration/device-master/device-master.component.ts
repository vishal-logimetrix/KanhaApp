import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
import { ConfigurationService } from '../Services/configuration.service';
import { Router } from '@angular/router';
import { retryWhen, delay, take, switchMap, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-device-master',
  templateUrl: './device-master.component.html',
  styleUrls: ['./device-master.component.css']
})
export class DeviceMasterComponent implements OnInit {
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  model: any = {};
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  updateResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  bmcDropDown!: Dropdown[];
  mppDropDown!: Dropdown[];
  deviceLocationDropDown!: Dropdown[];
  button_name: any;
  isModalShown: boolean = false;
  rowData = [];
  stateData: any;
  pass_data: any;
  _data: any;

  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    device_code:'',
    device_location:'',
    device_no:'',
    imei_no:'',
    is_gprs:'',
    mobile_no:'',
    mpp_code:'',
    sim_no:'',
    sync_status: 0,
    is_active:true,
  }
  constructor(public _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _configurationService: ConfigurationService, private _router: Router, private _toastrService: ToastrService){
    this.button_name = 'Create';
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      pass_data: any;
    };
    this._data = state?.pass_data;
    this.createForm = new FormGroup({
      device_code: new FormControl('0'),
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
      device_location: new FormControl('', Validators.required),
      device_no: new FormControl('', Validators.required),
      imei_no: new FormControl('', Validators.required),
      sim_no: new FormControl('', Validators.required),
      mobile_no: new FormControl('', Validators.required),
      is_gprs: new FormControl(true),
      is_active: new FormControl(true),
      sync_status: new FormControl(0),
    });
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.CompanyDropDown();
    this.DeviceLocationDropDown('device_location');
    if (this._data != null) {
      this.createForm.patchValue(this._data);
      this.searchForm.patchValue(this._data);
      this.PlantDropDown();
      // this.PlantDropDown(this._data.company_code);
      this.MCCDropDown();
      // this.MCCDropDown(this._data.plant_code);
      this.BMCDropDown(this._data.mcc_code);
      this.MPPDropDown(this._data.mpp_code);
      this.createForm
        .get('device_location')
        ?.setValue(this._data.device_location);
      this.button_name = 'Update';
    }
  }
  // ff(){
  //   this.model = Object.assign({}, this.createForm.value);
  //   console.log('__________form data__________', this.model);
  //   this.newModel.device_code = this.model.device_code;
  //   this.newModel.device_location = this.model.device_location;
  //   this.newModel.device_no = this.model.device_no;
  //   this.newModel.imei_no = this.model.imei_no;
  //   this.newModel.is_active = this.model.is_active;
  //   this.newModel.is_gprs = this.model.is_gprs;
  //   this.newModel.mobile_no = this.model.mobile_no;
  //   this.newModel.mpp_code = this.model.mpp_code;
  //   this.newModel.sim_no = this.model.sim_no;
  //   this.newModel.sync_status = this.model.sync_status;
  //   console.log('__________newModl data__________', this.newModel);
  // }
  Create() {
    if (this.createForm.valid && this.button_name == 'Create') {
      this.model = Object.assign({}, this.createForm.value);
      console.log('__________form data__________', this.model);
      this.newModel.device_code = this.model.device_code;
      this.newModel.device_location = this.model.device_location;
      this.newModel.device_no = this.model.device_no;
      this.newModel.imei_no = this.model.imei_no;
      this.newModel.is_active = this.model.is_active;
      this.newModel.is_gprs = this.model.is_gprs;
      this.newModel.mobile_no = this.model.mobile_no;
      this.newModel.mpp_code = this.model.mpp_code;
      this.newModel.sim_no = this.model.sim_no;
      this.newModel.sync_status = this.model.sync_status;
      console.log('__________newModl data__________', this.newModel);
      this._configurationService.DeviceMasterCreate(this.model).subscribe((response) => {
          this.createResponse = response as Response;
          if (this.createResponse.responseStatus == 200) {
            // this.alertService.Success(this.createResponse.responseMessage);
            this._toastrService.success(this.createResponse.responseMessage);
            this.createForm.reset();
          } else {
            this._serverValidation.parseValidation(
              this._msgProperty.transform('device_master_validation'),
              this.createResponse.responseData
            );
          }
        });
    } else if (
      this.createForm.controls['device_code'].value != 0 &&
      this.button_name == 'Update') {
      this.model = Object.assign({}, this.createForm.value);
      this._configurationService.DeviceMasterUpdate(this.model)
        .subscribe((response) => {
          this.updateResponse = response as Response;
          if (this.updateResponse.responseStatus == 200) {
            // this.alertService.Success(this.updateResponse.responseMessage);
            this._toastrService.success(this.updateResponse.responseMessage);
            this.createForm.reset();
          } else {
            this._serverValidation.parseValidation(
              this._msgProperty.transform('device_master_validation'),
              this.updateResponse.responseData
            );
          }
        });
    } else {
      // this.alertService.Error('Input form data is not valid.');
      this._toastrService.error("Input Form Data is not valid.");
    }
    // this.setDefaultValues();
  }
  CompanyDropDown() {
    this._masterService.CompanyDropDown().subscribe((response) => {
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
    this.model = Object.assign({}, this.createForm.value);
    this._masterService.PlantDropDown(this.newModel).subscribe((response) => {
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
    this.model = Object.assign({}, this.createForm.value);
    this._masterService.MCCDropDown(this.newModel).subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mccDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  BMCDropDown(mcc_code: any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.mcc_code = this.model.mcc_code;
    this._masterService.BMCDropDown(this.newModel).subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.bmcDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  MPPDropDown(mcc_code: any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.bmc_code = this.model.bmc_code;
    this._masterService.MPPDropDown(this.newModel).subscribe((response) => {
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
    this._configurationService.CommonMasterValueDropDown(this.model)
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            delay(500), // Delay for 500ms before retrying
            take(5), // Maximum of 5 retries
            switchMap(() => {
              // Refresh the data by making a new API call after the delay
              return this._configurationService.CommonMasterValueDropDown(this.model);
            })
          )
        ),
        catchError((error) => {
          console.error('API call error:', error);
          return of(null); // Return an observable with null value to continue the flow
        })
      )
      .subscribe((response) => {
        if (response !== null) {
          this.searchResponse = response as Response;
          if (this.searchResponse.responseStatus === 200) {
            this.deviceLocationDropDown = this.searchResponse
              .responseData as Dropdown[];
          } else {
            // this.alertService.Error(this.searchResponse.responseData);
            this._toastrService.error(this.searchResponse.responseData);
          }
        } else {
          // this.alertService.Error('Failed to fetch data. Please try again later.');
          this._toastrService.error("Failed to Fetch data, please try again later.")
        }
      });
  }
}
