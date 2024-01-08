import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { Response } from 'src/app/Auth/common/model/response';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-bmc',
  templateUrl: './bmc.component.html',
  styleUrls: ['./bmc.component.css']
})
export class BMCComponent implements OnInit{
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  mccDropDown!: Dropdown[];
  isModalShown: boolean = false;
  model: any = {};
  newModel: any = {
    company_code: '',
    plant_code:'',
    mcc_code:'',
    bmc_code:'',
    bmc_name:'',
    is_active:true,
    address:''
  }
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
  constructor(private _masterService: MasterService, private _serviceValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe,private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      bmc_code: new FormControl('', Validators.required),
      bmc_name: new FormControl('', Validators.required),
      is_active: new FormControl(true),
      address: new FormControl()
    });
    // this.searchForm = new FormGroup({
    //   company_code: new FormControl('', Validators.required),
    //   plant_code: new FormControl('', Validators.required),
    //   mcc_code: new FormControl('', Validators.required)
    // });
  }
  ngOnInit(): void {
    this.CompanyDropDown();
  }
  // ff(){
  //   this.model = Object.assign({}, this.createForm.value);
  //   console.log('------forms values---------', this.model);
  //   this.newModel.mcc_code = this.model.mcc_code;
  //   this.newModel.bmc_code = this.model.bmc_code;
  //   this.newModel.bmc_name = this.model.bmc_name;
  //   this.newModel.is_active = this.model.is_active;
  //   this.newModel.address = this.model.address;  
  //   console.log('__________new models values___________', this.newModel);
    
  // }
  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      this.newModel.mcc_code = this.model.mcc_code;
      this.newModel.bmc_code = this.model.bmc_code;
      this.newModel.bmc_name = this.model.bmc_name;
      this.newModel.is_active = this.model.is_active;
      this.newModel.address = this.model.address;      
      console.log('________model_________', this.model);
      console.log('________new model_________', this.newModel);
      // this._masterService.BMCCreate(this.newModel).subscribe(response => {
      //   this.createResponse = response as Response;
      //   if (this.createResponse.responseStatus == 200) {
      //     this._toastrService.success(this.createResponse.responseMessage);
      //     this.createForm.reset();
      //   } else {
      //     this._serviceValidation.parseValidation(this._msgProperty.transform('bmc_validation'),this.createResponse.responseData)
      //   }
      // });
    } else {
      this._toastrService.error("Input Form Data is Not Valid.")
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
}
