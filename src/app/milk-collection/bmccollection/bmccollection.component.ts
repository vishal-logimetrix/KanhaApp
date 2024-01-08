import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Response } from 'src/app/Auth/common//model/response';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MilkCollectionService } from '../Services/milk-collection.service';
import { MasterService } from 'src/app/master/services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { retryWhen, delay, take, switchMap, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-bmccollection',
  templateUrl: './bmccollection.component.html',
  styleUrls: ['./bmccollection.component.css']
})
export class BMCCollectionComponent implements OnInit {
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
    amount:'',
    total_can:''
  }
  constructor(private _milkCollectionService: MilkCollectionService, public _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
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
      total_can: new FormControl('0'),
      entry_from: new FormControl('WEB'),
    });
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
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
      console.log('_________forms values_______________---',this.model);
      this.newModel.amount = this.model.amount;
      this.newModel.clr = this.model.clr;
      this.newModel.collection_date = this.model.collection_date;
      this.newModel.entry_from = this.model.entry_from;
      this.newModel.fat = this.model.fat;
      this.newModel.milk_quality_type_code = this.model.milk_quality_type_code;
      this.newModel.milk_type_code = this.model.milk_type_code;
      this.newModel.mpp_code = this.model.mpp_code;
      this.newModel.qty = this.model.qty;
      this.newModel.rate = this.model.rate;
      this.newModel.rate_code = this.model.rate_code;
      this.newModel.shift_code = this.model.shift_code;
      this.newModel.snf = this.model.snf;
      this.newModel.total_can = this.model.total_can;
      console.log('_________new values_______________---',this.newModel);
      this._milkCollectionService.AddBMCCollection(this.newModel).subscribe((response) => {
          this.createResponse = response as Response;
          if (this.createResponse.responseStatus == 200) {
            // this.alertService.Success(this.createResponse.responseMessage);
            this._toastrService.success(this.createResponse.responseData);
            // this.createForm.reset()
          } else {
            this._serverValidation.parseValidation(
              this._msgProperty.transform('bmc_collection_validation'),
              this.createResponse.responseData
            );
          }
        });
    } else {
      // this.alertService.Error('Input form data is not valid.');
      this._toastrService.error("Input Form Data is not Valid.");
    }
  }
  //#region  DropDown Methods
  CompanyDropDown() {
    this._masterService.CompanyDropDown()
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            delay(500), // Delay for 500ms before retrying
            take(5), // Maximum of 5 retries
            switchMap(() => {
              // Refresh the data by making a new API call after the delay
              return this._masterService.CompanyDropDown();
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
            this.companyDropDown = this.searchResponse.responseData as Dropdown[];
            this.newModel.company_code = this.searchResponse.responseData[0].value;
            // console.log('______new Model_____', this.newModel);  
            this. PlantDropDown();
          } else {
            // this.alertService.Error(this.searchResponse.responseData);
            this._toastrService.error(this.searchResponse.responseData);
          }
        } else {
          // this.alertService.Error('Failed to fetch data. Please try again later.');
          this._toastrService.error('Failed to Fetch data, please try agian later');
        }
      });
  }
  PlantDropDown() {
    this.model = Object.assign({}, this.createForm.value);
    this._masterService.PlantDropDown( this.newModel).subscribe((response) => {
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
    this._masterService.MCCDropDown( this.newModel).subscribe((response) => {
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
        console.log('_________MPP dropdown_________',this.mppDropDown);
        
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  
  MilkTypeDropDown(mcc_code: any) {
    this._masterService.MilkTypeDropDown()
    .pipe(
      retryWhen((errors) =>
      errors.pipe(
        delay(500), // Delay for 500ms before retrying
        take(5), // Maximum of 5 retries
        switchMap(() => {
          // Refresh the data by making a new API call after the delay
          return this._masterService.MilkTypeDropDown();
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
              this.milkTypeDropDown = this.searchResponse.responseData as Dropdown[];
            } else {
              // this.alertService.Error(this.searchResponse.responseData);
              this._toastrService.error(this.searchResponse.responseData);
          }
        } else {
          // this.alertService.Error('Failed to fetch data. Please try again later.');
          this._toastrService.error('Failed to fetch Data, please try agian later.');
        }
      });
  }

  MilkQualityTypeDropDown(mcc_code: any) {
    this._masterService
      .MilkQualityTypeDropDown()
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            delay(500), // Delay for 500ms before retrying
            take(5), // Maximum of 5 retries
            switchMap(() => {
              // Refresh the data by making a new API call after the delay
              return this._masterService.MilkQualityTypeDropDown();
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
            this.milkQualityTypeDropDown = this.searchResponse.responseData as Dropdown[];
          } else {
            // this.alertService.Error(this.searchResponse.responseData);
            this._toastrService.error(this.searchResponse.responseData);
          }
        } else {
          // this.alertService.Error('Failed to fetch data. Please try again later.');
          this._toastrService.error('Failed to fetch data, please try  again later.');
        }
      });
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
      this._milkCollectionService.GetBMCCollectionRate(this.model).subscribe((response) => {
          this.createResponse = response as Response;
          if (this.createResponse.responseStatus == 200) {
            // this.alertService.Success(this.createResponse.responseMessage);
            this._toastrService.success(this.createResponse.responseMessage);
            console.log(JSON.stringify(this.createResponse.responseData));
            let rate = this.createResponse.responseData.rate;
            let rate_code = this.createResponse.responseData.rate_code;
            let qty = this.createForm.controls['qty'].value;
            this.createForm.controls['rate'].setValue(rate);
            this.createForm.controls['rate_code'].setValue(rate_code);
            this.createForm.controls['amount'].setValue(
              (qty * rate).toFixed(2)
            );
            // this.createForm.reset()
          } else {
            this._serverValidation.parseValidation(
              this._msgProperty.transform('bmc_collection_validation'),
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
