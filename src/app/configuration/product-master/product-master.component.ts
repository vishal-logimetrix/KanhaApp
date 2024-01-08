import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
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
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.css']
})
export class ProductMasterComponent implements OnInit{
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  model: any = {};
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  productUnitDropDown!: Dropdown[];
  productTypeDropDown!: Dropdown[];
  button_name:any;
  isModalShown: boolean = false;

  pass_data: any;
  _data: any;

  rowData = [];
  columnDefs: ColDef[] = [
    { field: 'Id', resizable: true, hide: true },
    { headerName: "Product Type", field: 'product_type', resizable: true },
    { headerName: "Product Code", field: 'product_code', resizable: true },
    { headerName: "SKU", field: 'product_sku', resizable: true },
    { headerName: "Product Name", field: 'product_name', resizable: true },
    { headerName: "Short Name", field: 'product_short_name', resizable: true },
    { headerName: "Unit", field: 'product_unit', resizable: true },
    { headerName: "Base Price", field: 'base_price', resizable: true },
    { headerName: "Current Market Price", field: 'current_market_price', resizable: true },
    { headerName: "IsActive", field: 'is_active', resizable: true },
    { headerName: "Allow Sale", field: 'allow_sale', resizable: true },
    { headerName: "Allow Indent", field: 'allow_indent', resizable: true },
    { headerName: "Product Code", field: 'Action' }];

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };

  constructor(public _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _configurationService: ConfigurationService, private _router: Router, private _toastrService: ToastrService){
    this.button_name="Submit";
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      pass_data: any
    };
    this._data = state?.pass_data;
    this.createForm = new FormGroup({
      Id: new FormControl(0),
      product_type: new FormControl('', Validators.required),
      product_code: new FormControl('', Validators.required),
      product_name: new FormControl('', Validators.required),
      product_short_name: new FormControl('', Validators.required),
      product_sku: new FormControl(''),
      product_unit: new FormControl(''),
      base_price: new FormControl('', Validators.required),
      current_market_price: new FormControl('', Validators.required),
      is_active: new FormControl(true),
      allow_indent: new FormControl(true),
      allow_sale: new FormControl(true)
    });
  }
  ngOnInit(): void {
    this.ProductUnitDropDown("product_unit");
    this.ProductTypeDropDown("product_type");
    if (this._data != null) {
      // console.log(JSON.stringify(this._data));
      this.createForm.patchValue(this._data);
      // this.searchForm.patchValue(this._data);
      this.createForm.get('product_type')?.setValue(this._data.product_type);
      this.createForm.get('product_unit')?.setValue(this._data.product_unit);
      this.button_name="Update";
    }
  }
  Create() {
    if (this.createForm.valid && this.button_name=="Submit") {
      this.model = Object.assign({}, this.createForm.value);
      this._masterService.ProductCreate(this.model).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this._alertService.Success(this.createResponse.responseMessage);
          this._toastrService.success(this.createResponse.responseMessage);
          this.createForm.reset();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('product_validation'), this.createResponse.responseData)
        }
      });
    } 
    else if(this.createForm.controls['Id'].value != 0 && this.button_name=="Update"){
      this.model = Object.assign({}, this.createForm.value);
      this._masterService.ProductUpdate(this.model).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this.alertService.Success(this.createResponse.responseMessage);
          this._toastrService.success(this.createResponse.responseMessage);
          this.createForm.reset();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('product_validation'), this.createResponse.responseData)
        }
      });
    }
    else {
      // this.alertService.Error("Input form data is not valid.");
      this._toastrService.error("Input form data is not valid.")
    }
  }
  ProductUnitDropDown(common_key_name: string) {
    this.model = Object.assign({}, {"common_key": common_key_name });
    this._configurationService.CommonMasterValueDropDown(this.model).pipe(
      retryWhen(errors => errors.pipe(
        delay(500), // Delay for 500ms before retrying
        take(5), // Maximum of 5 retries
        switchMap(() => {
          // Refresh the data by making a new API call after the delay
          return this._configurationService.CommonMasterValueDropDown(this.model);
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
          this.productUnitDropDown = this.searchResponse.responseData as Dropdown[];
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
          this._toastrService.error(this.searchResponse.responseData);
        }
      } else {
        // this.alertService.Error('Failed to fetch data. Please try again later.');
        this._toastrService.error("Failed to fetch data, please try again later.");
      }
    });
  }
  ProductTypeDropDown(common_key_name: string) {
    this.model = Object.assign({}, { "common_key": common_key_name });
    this._configurationService.CommonMasterValueDropDown(this.model).pipe(
      retryWhen(errors => errors.pipe(
        delay(500), // Delay for 500ms before retrying
        take(5), // Maximum of 5 retries
        switchMap(() => {
          // Refresh the data by making a new API call after the delay
          return this._configurationService.CommonMasterValueDropDown(this.model);
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
          this.productTypeDropDown = this.searchResponse.responseData as Dropdown[];
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
}
