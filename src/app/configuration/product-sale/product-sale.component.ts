import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { SalesService } from '../Services/sales.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { MasterService } from 'src/app/master/services/master.service';
import { retryWhen, delay, take, switchMap, catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrls: ['./product-sale.component.css']
})
export class ProductSaleComponent implements OnInit {
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
  productDropDown!: Dropdown[];
  datePickerConfig!: Partial<BsDatepickerConfig>;
  isModalShown: boolean = false;
  rowData = [];
  newModel = {
    company_code:'',
    plant_code:'',
    amount:'',
    bmc_code:'',
    collection_date:'',
    entry_from:'',
    farmer_code:'',
    mcc_code:'',
    mpp_code:'',
    product_id:'',
    product_qty:'',
    product_rate:'',
    shift_code:'',
    transaction_date:''
  }
  constructor(private _salesService: SalesService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, public _masterService: MasterService,private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
      farmer_code: new FormControl('', Validators.required),
      transaction_date: new FormControl(new Date(), Validators.required),
      collection_date: new FormControl('', Validators.required),
      shift_code: new FormControl('', Validators.required),
      product_id:new FormControl('',Validators.required),
      product_qty:new FormControl('',Validators.required),
      product_rate: new FormControl('0', Validators.required),
      amount: new FormControl('0', Validators.required),
      entry_from: new FormControl('WEB')
    });
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      mpp_code: new FormControl('', Validators.required),
      farmer_code: new FormControl('', Validators.required)
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
    this.ProductMasterDropDown();
    this.GetAllProduct();
  }
  // ff(){
  //   this.model = Object.assign({}, this.createForm.value);
  //   console.log('________form model_____',this.model);
  //   this.newModel.amount = this.model.amount;
  //   this.newModel.collection_date = this.model.collection_date;
  //   this.newModel.entry_from = this.model.entry_from;
  //   this.newModel.farmer_code = this.model.farmer_code;
  //   this.newModel.product_id = this.model.product_id;
  //   this.newModel.product_qty = this.model.product_qty;
  //   this.newModel.product_rate = this.model.product_rate;
  //   this.newModel.shift_code = this.model.shift_code;
  //   this.newModel.transaction_date = this.model.transaction_date;
  //   console.log('________new model_____',this.newModel);
  // }
  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      // console.log('________form model_____',this.model);
      this.newModel.amount = this.model.amount;
      this.newModel.collection_date = this.model.collection_date;
      this.newModel.entry_from = this.model.entry_from;
      this.newModel.farmer_code = this.model.farmer_code;
      this.newModel.product_id = this.model.product_id;
      this.newModel.product_qty = this.model.product_qty;
      this.newModel.product_rate = this.model.product_rate;
      this.newModel.shift_code = this.model.shift_code;
      this.newModel.transaction_date = this.model.transaction_date;
      // console.log('________new model_____',this.newModel);
      this._salesService.CreateProductSaleForMember(this.model).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this.alertService.Success(this.createResponse.responseMessage);
          this._toastrService.success(this.createResponse.responseMessage);
          // this.createForm.reset()
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('member_product_sales_validation'), this.createResponse.responseData)
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
        delay(500), // Delay for 500ms before retrying
        take(5), // Maximum of 5 retries
        switchMap(() => {
          // Refresh the data by making a new API call after the delay
          return this._masterService.CompanyDropDown();
        })
      )),
      catchError(error => {
        console.error('API call error:', error);
        return of(null); // Return an observable with null value to continue the flow
      })
    ).subscribe(response => {
      if (response !== null) {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus === 200) {
          this.companyDropDown = this.searchResponse.responseData as Dropdown[];
          this.newModel.company_code = this.searchResponse.responseData[0].value;
          // console.log('company dropdown-----------', this.newModel);
          this. PlantDropDown();
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
          this._toastrService.error(this.searchResponse.responseData);
        }
      } else {
        // this.alertService.Error('Failed to fetch data. Please try again later.');
        this._toastrService.error("Failed to fetch data, please try again later.")
      }
    });
  }
  PlantDropDown() {
    setTimeout(()=>{
       this.model = Object.assign({}, this.createForm.value);
    this._masterService.PlantDropDown(this.model).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.plantDropDown = this.searchResponse.responseData as Dropdown[];
        this.newModel.plant_code = this.searchResponse.responseData[0].value;
        // console.log('plant dropdown-----------', this.newModel);
        this. MCCDropDown();
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  },2000)
}
MCCDropDown() {
  this.model = Object.assign({}, this.createForm.value);
  this._masterService.MCCDropDown(this.model).subscribe(response => {
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
  this._masterService.BMCDropDown(this.model).subscribe(response => {
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
  this._masterService.MPPDropDown(this.model).subscribe(response => {
    this.searchResponse = response as Response;
    if (this.searchResponse.responseStatus == 200) {
      this.mppDropDown = this.searchResponse.responseData as Dropdown[];
    } else {
      // this.alertService.Error(this.searchResponse.responseData);
      this._toastrService.error(this.searchResponse.responseData);
    }
  });
}
FarmerDropDown(mcc_code: any) {
  this.model = Object.assign({}, this.createForm.value);
  this.newModel.mpp_code = this.model.mpp_code;
  this._masterService.FarmerDropDown(this.model).subscribe(response => {
    this.searchResponse = response as Response;
    if (this.searchResponse.responseStatus == 200) {
      this.farmerDropDown = this.searchResponse.responseData as Dropdown[];
    } else {
      // this.alertService.Error(this.searchResponse.responseData);
      this._toastrService.error(this.searchResponse.responseData);
    }
  });
  }
  ProductMasterDropDown() {
    this._masterService.MasterProductDropDown().pipe(
      retryWhen(errors => errors.pipe(
        delay(500), // Delay for 500ms before retrying
        take(5), // Maximum of 5 retries
        switchMap(() => {
          // Refresh the data by making a new API call after the delay
          return this._masterService.MasterProductDropDown();
        })
      )),
      catchError(error => {
        console.error('API call error:', error);
        return of(null); // Return an observable with null value to continue the flow
      })
    ).subscribe(response => {
      if (response !== null) {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus === 200) {
          this.productDropDown = this.searchResponse.responseData as Dropdown[];
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
             this._toastrService.error(this.searchResponse.responseData);
        }
      } else {
        // this.alertService.Error('Failed to fetch data. Please try again later.');
        this._toastrService.error("failed to fetch the data, please try again later.")
      }
    });
  }
  GetRate(data : any) {
    let product_id=this.createForm.controls['product_id'].value
    var result = this.rowData.find( ({ Id }) => Id === product_id );
    this.model=result;
    if(this.model){
    this.createForm.controls['product_rate'].setValue(this.model.current_market_price)
    }else{
      this.createForm.controls['product_rate'].setValue(0);
    }
    this.CalculateAmount();
  }
  CalculateAmount() {
    let qty = this.createForm.controls['product_qty'].value;
    let rate = this.createForm.controls['product_rate'].value;
    if (!!qty && !!rate) {
      let amount = (qty * rate).toFixed(2);
      this.createForm.controls['amount'].setValue(amount);
    }else{
      this.createForm.controls['amount'].setValue(0);
    }
  }
  GetAllProduct(){
    this._masterService.ProductList(null).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.rowData = this.searchResponse.responseData;
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
}
