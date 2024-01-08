import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Response } from 'src/app/Auth/common//model/response';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MilkCollectionService } from '../Services/milk-collection.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { MasterService } from 'src/app/master/services/master.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-farmer-collection',
  templateUrl: './farmer-collection.component.html',
  styleUrls: ['./farmer-collection.component.css']
})
export class FarmerCollectionComponent implements OnInit{
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
  farmerDropDown!: Dropdown[];
  milkTypeDropDown!: Dropdown[];
  milkQualityTypeDropDown!: Dropdown[];
  datePickerConfig!: Partial<BsDatepickerConfig>;
  isModalShown: boolean = false;
  rowData = [];
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    mpp_code:'',
    entry_from:'',
    collection_date:'',
    shift_code:'',
    milk_type_code:'',
    milk_quality_type_code:'',
    clr:'',
    fat:'',
    qty:'',
    snf:'',
    rate:'',
    rate_code:'',
    member_code:'',
  }
  constructor(private _milkCollectionService: MilkCollectionService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, public _masterService: MasterService, private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
      member_code: new FormControl('', Validators.required),
      collection_date: new FormControl('', Validators.required),
      shift_code: new FormControl('', Validators.required),
      milk_type_code: new FormControl('', Validators.required),
      milk_quality_type_code: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      fat: new FormControl('', Validators.required),
      snf: new FormControl('', Validators.required),
      clr: new FormControl('0'),
      rate: new FormControl('0', Validators.required),
      amount: new FormControl('0', Validators.required),
      rate_code: new FormControl('0', Validators.required),
      entry_from: new FormControl('WEB'),
    });
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
      farmer_code: new FormControl('', Validators.required),
    });
    this.datePickerConfig = {
      containerClass: 'theme-blue',
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      isAnimated: true,
      showTodayButton: true,
    };
  }
  ngOnInit(): void {
    this.CompanyDropDown();
    this.MilkTypeDropDown(0);
    this.MilkQualityTypeDropDown(0);
  }

  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      this.newModel.amount = this.model.amount;
      this.newModel.clr = this.model.clr;
      this.newModel.collection_date = this.model.collection_date;
      this.newModel.entry_from = this.model.entry_from;
      this.newModel.fat = this.model.fat;
      this.newModel.member_code = this.model.member_code;
      this.newModel.milk_quality_type_code = this.model.milk_quality_type_code;
      this.newModel.milk_type_code = this.model.milk_type_code;
      this.newModel.qty = this.model.qty;
      this.newModel.rate = this.model.rate;
      this.newModel.snf = this.model.snf;
      this.newModel.rate_code = this.model.rate_code;
      this.newModel.shift_code = this.model.shift_code;
      this._milkCollectionService.AddFarmerCollection(this.model).subscribe((response) => {
          this.createResponse = response as Response;
          if (this.createResponse.responseStatus == 200) {
            this._toastrService.success(this.createResponse.responseMessage);
            // this.createForm.reset()
          } else {
            this._serverValidation.parseValidation(
              this._msgProperty.transform('farmer_collection_validation'),
              this.createResponse.responseData
            );
          }
        });
    } else {
      this._toastrService.error("Input Form Data is Not Valid.")
    }
  }
  //#region  DropDown Methods
  CompanyDropDown() {
    setTimeout(() => {
      this._masterService.CompanyDropDown().subscribe((response) => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.companyDropDown = this.searchResponse.responseData as Dropdown[];
          this.newModel.company_code = this.searchResponse.responseData[0].value;
          this. PlantDropDown();
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }, 2000);
  }
  PlantDropDown() {
    this.model = Object.assign({}, this.createForm.value);
    this._masterService.PlantDropDown(this.newModel).subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this. MCCDropDown() ;
      } else {
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
      this._toastrService.error(this.searchResponse.responseData);
    }
  });
  }
  FarmerDropDown(mcc_code: any) {
    this.model = Object.assign({}, this.createForm.value);
    this.newModel.mpp_code = this.model.mpp_code;
    this._masterService.FarmerDropDown(this.newModel).subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.farmerDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  MilkTypeDropDown(mcc_code: any) {
    // this.model = Object.assign({}, this.createForm.value);
    this._masterService.MilkTypeDropDown().subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.milkTypeDropDown = this.searchResponse.responseData as Dropdown[];
      } else {
           this._toastrService.error(this.searchResponse.responseData);
          }
        });
      }
      MilkQualityTypeDropDown(mcc_code: any) {
        // this.model = Object.assign({}, this.createForm.value);
    setTimeout(() => {
      this._masterService.MilkQualityTypeDropDown().subscribe((response) => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.milkQualityTypeDropDown = this.searchResponse.responseData as Dropdown[];
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }, 3000);
  }
  ////#endregion
  GetRate() {
    this.model = Object.assign({}, this.createForm.value);
    let milk_type_code = this.model.milk_type_code;
    let milk_quality_type_code = this.model.milk_quality_type_code;
    let fat = this.model.fat;
    let snf = this.model.snf;
    let clr = this.model.clr;
    if (
      !!milk_type_code &&
      !!milk_quality_type_code &&
      !!fat &&
      !!snf &&
      !!clr
    ) {
      this._milkCollectionService.Getrate(this.model).subscribe((response) => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          this._toastrService.success(this.createResponse.responseMessage);
          // console.log(JSON.stringify(this.createResponse.responseData));
          let rate = this.createResponse.responseData.rate;
          let rate_code = this.createResponse.responseData.rate_code;
          let qty = this.createForm.controls['qty'].value;
          this.createForm.controls['rate'].setValue(rate);
          this.createForm.controls['rate_code'].setValue(rate_code);
          this.createForm.controls['amount'].setValue((qty * rate).toFixed(2));
          // this.createForm.reset()
        } else {
          this._serverValidation.parseValidation(
            this._msgProperty.transform('farmer_collection_validation'),
            this.createResponse.responseData
          );
        }
      });
    }
  }
  CalculateAmount() {
    let qty = this.createForm.controls['qty'].value;
    let rate = this.createForm.controls['rate'].value;
    if (!!qty && !!rate) {
      let amount = (qty * rate).toFixed(2);
      this.createForm.controls['amount'].setValue(amount);
    } else {
      this.createForm.controls['amount'].setValue(0);
    }
  }
}
