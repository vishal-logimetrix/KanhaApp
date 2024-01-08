import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { Response } from 'src/app/Auth/common/model/response';
import { of, retryWhen, delayWhen, timer, concatMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-mcc',
  templateUrl: './mcc.component.html',
  styleUrls: ['./mcc.component.css']
})
export class MCCComponent implements OnInit {
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  model: any = {};
  newmodel: any = {
    company_code:'',
    plant_code:'',
    mcc_code:'',
    mcc_name:'',
    is_active: true,
    address:''
  };
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  isModalShown: boolean = false;
  rowData = [];
  columnDefs: ColDef[] = [
    { field: 'plant_code', resizable: true },
    { field: 'plant_name', resizable: true },
    { field: 'mcc_code', resizable: true },
    { field: 'mcc_name', resizable: true },
    { field: 'address', resizable: true },
    { field: 'is_active', resizable: true },
    { field: 'Action' },
  ];
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      // company_code: new FormControl('', Validators.required),
      // plant_code: new FormControl('', Validators.required),
      mcc_code: new FormControl('', Validators.required),
      mcc_name: new FormControl('', Validators.required),
      is_active: new FormControl(true),
      address: new FormControl(),
    });
    // this.searchForm = new FormGroup({
    //   company_code: new FormControl('', Validators.required),
    //   plant_code: new FormControl('', Validators.required),
    // });
  }
  ngOnInit(): void {
    this.CompanyDropDown();
  }
  // ff(){
  //   this.model = Object.assign({}, this.createForm.value);
  //   console.log('-----------old model--------',this.model);
  //   this.newmodel.mcc_code = this.model.mcc_code;
  //   this.newmodel.mcc_name = this.model.mcc_name;
  //   this.newmodel.address = this.model.address;
  //   console.log('____________newModel_______-',this.newmodel);
  // }
  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      this.newmodel.mcc_code = this.model.mcc_code;
      this.newmodel.mcc_name = this.model.mcc_name;
      this.newmodel.address = this.model.address;
      this._masterService.MCCCreate(this.newmodel).subscribe((res) => {
        this.createResponse = res as Response;
        if (this.createResponse.responseStatus == 200) {
          this._toastrService.success(this.createResponse.responseMessage)
          this.createForm.reset();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('mcc_validation'),
            this.createResponse.responseData
          );
        }
      });
    } else {
      this._toastrService.error('Input form data is not valid')
    }
  }
  CompanyDropDown() {
    of(null)
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            delayWhen(() => timer(500)) // Delay for 500 milliseconds before retrying
          )
        )
      )
      .subscribe(() => {
        this._masterService.CompanyDropDown().subscribe((res) => {
          this.searchResponse = res as Response;
          if (this.searchResponse.responseStatus == 200) {
            this.companyDropDown = this.searchResponse.responseData as Dropdown[];
            this.newmodel.company_code = this.companyDropDown[0].value;
            this.PlantDropDown();
          } else {
            // this.alertService.Error(this.searchResponse.responseData);
            this._toastrService.error(this.searchResponse.responseData)
          }
        });
      });
  }
  PlantDropDown() {
    this.model = Object.assign({}, this.createForm.value);
    this.newmodel.is_active = this.model.is_active;
    of(null)
      .pipe(
        concatMap(() =>
          this._masterService.PlantDropDown(this.newmodel).pipe(
            retryWhen((errors) =>
              errors.pipe(
                delayWhen(() => timer(500)) // Delay for 500 milliseconds before retrying
              )
            )
          )
        )
      )
      .subscribe((response) => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.plantDropDown = this.searchResponse.responseData as Dropdown[];
          this.newmodel.plant_code = this.plantDropDown[0].value;
          console.log('________new Model_____', this.newmodel);
          
        } else {
          // this.alertService.Error(this.searchResponse.responseData);
          this._toastrService.error(this.searchResponse.responseData)
        }
      });
  }
}
