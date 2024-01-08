import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.css']
})
export class FarmerComponent implements OnInit{
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
  isModalShown: boolean = false;
  rowData = [];
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    mpp_code:'',
    farmer_application_no:'',
    farmer_code:'',
    farmer_name:'',
    first_name:'',
    last_name:'',
    middle_name:'',
    farmer_short_code:'',
    gender:'',
    mobile_no:'',
    is_active: true,
  }
  constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
      farmer_application_no: new FormControl('', Validators.required),
      farmer_code: new FormControl('', [Validators.required]),
      farmer_name: new FormControl('', Validators.required),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      middle_name: new FormControl(''),
      farmer_short_code: new FormControl('',Validators.required),
      gender:new FormControl('',Validators.required),
      mobile_no:new FormControl('',Validators.required),
      is_active: new FormControl(true),
    });
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required)
    });
    
  }
  ngOnInit(): void {
    this.CompanyDropDown();
  }

  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      console.log('----model------',this.model);
      this.newModel.farmer_application_no = this.model.farmer_application_no;
      this.newModel.farmer_code = this.model.farmer_code;
      this.newModel.farmer_name = this.model.farmer_name;
      this.newModel.farmer_short_code = this.model.farmer_short_code;
      this.newModel.first_name = this.model.first_name;
      this.newModel.gender = this.model.gender;
      this.newModel.is_active = this.model.is_active;
      this.newModel.last_name = this.model.last_name;
      this.newModel.middle_name = this.model.middle_name;
      this.newModel.mobile_no = this.model.mobile_no;
      this.newModel.mpp_code = this.model.mpp_code;
      console.log('----new model------',this.newModel);
      this._masterService.FarmerCreate(this.newModel).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          this._toastrService.success(this.createResponse.responseData);
          this.createForm.reset();
          this.createForm.controls['is_active'].setValue(true);
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('farmer_validation'), this.createResponse.responseData)
        }
      });
    } else {
      this._toastrService.error("Input Form data is not valid.");
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
  BMCDropDown(mcc_code: any) {
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
  MPPDropDown(mcc_code: any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.bmc_code = this.model.bmc_code;
    this._masterService.MPPDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.mppDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);'
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
}
