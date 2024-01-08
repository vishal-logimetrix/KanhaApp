import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { Response } from 'src/app/Auth/common/model/response';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-mpp',
  templateUrl: './mpp.component.html',
  styleUrls: ['./mpp.component.css']
})
export class MPPComponent implements OnInit{

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
  isModalShown: boolean = false;
  rowData = [];
  
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    route_code:'',
    mpp_short_name:'',
    mpp_old_code:'',
    mpp_code:'',
    mpp_name:'',
    allow_collection_at_bmc:false,
    is_active: true,
    address:'',
  }

  constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe,private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      route_code: new FormControl('', Validators.required),
      mpp_name: new FormControl('', Validators.required),
      mpp_short_name: new FormControl(''),
      mpp_old_code: new FormControl('',Validators.required),
      mpp_code: new FormControl('', Validators.required),
      allow_collection_at_bmc: new FormControl(false),
      is_active: new FormControl(true),
      address: new FormControl()
    });
    // this.searchForm = new FormGroup({
    //   company_code: new FormControl('', Validators.required),
    //   plant_code: new FormControl('', Validators.required),
    //   mcc_code: new FormControl('', Validators.required),
    //   bmc_code: new FormControl('', Validators.required)
    // });
  }
  ngOnInit(): void {
    this.CompanyDropDown();
  }

  // ff(){
  //   this.model = Object.assign({}, this.createForm.value);
  //   console.log('________model_________', this.model);
  //   this.newModel.mpp_code = this.model.mpp_code;
  //   this.newModel.mpp_name = this.model.mpp_name;
  //   this.newModel.mpp_old_code = this.model.mpp_old_code;
  //   this.newModel.mpp_short_name = this.model.mpp_short_name;
  //   this.newModel.route_code = this.model.route_code;
  //   this.newModel.address= this.model.address;
  //   console.log('________new model_________', this.newModel);
  // }
  
  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
    console.log('________model_________', this.model);
    this.newModel.mpp_code = this.model.mpp_code;
    this.newModel.mpp_name = this.model.mpp_name;
    this.newModel.mpp_old_code = this.model.mpp_old_code;
    this.newModel.mpp_short_name = this.model.mpp_short_name;
    this.newModel.route_code = this.model.route_code;
    this.newModel.address= this.model.address;
    console.log('________new model_________', this.newModel);
      // this._masterService.MPPCreate(this.newModel).subscribe(response => {
      //   this.createResponse = response as Response;
      //   if (this.createResponse.responseStatus == 200) {
      //     this._toastrService.success(this.createResponse.responseMessage)
      //     this.createForm.reset();
      //   } else {
      //     this._serverValidation.parseValidation(this._msgProperty.transform('mpp_validation'),this.createResponse.responseData)
      //   }
      // });
    } else {
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

  BMCDropDown() {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.mcc_code = this.model.mcc_code;
    this._masterService.BMCDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.bmcDropDown = this.searchResponse.responseData as Dropdown[];
        // this.RouteDropDown();
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  RouteDropDown() {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.bmc_code = this.model.bmc_code;
    this._masterService.RouteDropDown(this.newModel).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.routeDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData)
      }
    });
  }
}
