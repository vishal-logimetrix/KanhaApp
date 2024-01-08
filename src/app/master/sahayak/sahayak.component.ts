import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { Response } from 'src/app/Auth/common/model/response';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sahayak',
  templateUrl: './sahayak.component.html',
  styleUrls: ['./sahayak.component.css']
})
export class SahayakComponent implements OnInit {

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
  mppDropDown!: Dropdown[];
  datePickerConfig: Partial<BsDatepickerConfig>;
  isModalShown: boolean = false;
  rowData = [];
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    mpp_code:'',
    sahayak_code:'',
    sahayak_name:'',
    mobile_no:'',
    is_member: false,
    agreement_start_date:'',
    agreement_end_date:'',
    security_deposit_amount:'',
    is_active: true,
  }
    constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _toastrService: ToastrService){
      this.createForm = new FormGroup({
        // company_code: new FormControl('', Validators.required),
        // plant_code: new FormControl('', Validators.required),
        mcc_code: new FormControl('', Validators.required),
        bmc_code: new FormControl('', Validators.required),
        mpp_code: new FormControl('', Validators.required),
        sahayak_code: new FormControl('', Validators.required),
        sahayak_name: new FormControl('', Validators.required),
        mobile_no: new FormControl('', Validators.required),
        is_member: new FormControl(false),
        agreement_start_date: new FormControl(),
        agreement_end_date: new FormControl(),
        security_deposit_amount: new FormControl(0),
        is_active: new FormControl(true)
      });
  
      this.searchForm = new FormGroup({
        company_code: new FormControl('', Validators.required),
        plant_code: new FormControl('', Validators.required),
        mcc_code: new FormControl('', Validators.required),
        bmc_code: new FormControl('', Validators.required)
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


  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      // console.log('----model------',this.model);
    this.newModel.agreement_end_date = this.model.agreement_end_date;
    this.newModel.agreement_start_date = this.model.agreement_start_date;
    this.newModel.mobile_no = this.model.mobile_no;
    this.newModel.mpp_code = this.model.mpp_code;
    this.newModel.sahayak_code = this.model.sahayak_code;
    this.newModel.sahayak_name = this.model.sahayak_name;
    this.newModel.is_active = this.model.is_active;
    this.newModel.is_member = this.model.is_member;
    this.newModel.security_deposit_amount = this.model.security_deposit_amount;
    // console.log('----new model------',this.newModel);
      this._masterService.VSPCreate(this.model).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this.alertService.Success(this.createResponse.responseMessage);
          this._toastrService.success(this.createResponse.responseMessage)
          this.createForm.reset();
          this.createForm.controls['is_active'].setValue(true);
          this.createForm.controls['is_member'].setValue(false);
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('sahayak_validation'),this.createResponse.responseData)
        }
      });
    } else {
      // this.alertService.Error("Input form data is not valid.");
      this._toastrService.error("Input Form data is not valid.")
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
        this._toastrService.error(this.searchResponse.responseData)
      }
    });
  }
  PlantDropDown() {
    this.model = Object.assign({}, this.createForm.value);
    this._masterService.PlantDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.plant_code = this.searchResponse.responseData[0].value;
        // console.log('________new model plant dropdown_____',this.newModel);
        this. MCCDropDown() ;
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData)
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
  BMCDropDown(mcc_code : any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.mcc_code = this.model.mcc_code;
    this._masterService.BMCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.bmcDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData)
      }
    });
  }
  MPPDropDown(mcc_code : any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.bmc_code = this.model.bmc_code;
    this._masterService.MPPDropDown( this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mppDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData)
      }
    });
  }
}
