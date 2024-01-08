import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { Response } from 'src/app/Auth/common/model/response';
import { ConfigurationService } from '../Services/configuration.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
@Component({
  selector: 'app-milk-quality-type',
  templateUrl: './milk-quality-type.component.html',
  styleUrls: ['./milk-quality-type.component.css']
})
export class MilkQualityTypeComponent implements OnInit {
  public createForm: FormGroup;
  public searchForm!: FormGroup;
  model: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  isModalShown: boolean = false;
  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  searchModel: any;
  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';
  originalData: any[] = [];

  newModel: any = {
    milk_quality_type_code: '',
    milk_quality_type_name:'',
    is_active:false,
  }
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName:'Milk Quality Type Code', field: 'milk_quality_type_code', resizable: true },
      { headerName:'Milk Quality Type Name', field: 'milk_quality_type_name', resizable: true },
      { headerName:'Is Active', field: 'is_active', resizable: true },
      { 
        headerName: 'Action', 
        field: 'Action',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: (params: any) => this.onEditClick(params.rowData),
          label: 'Edit',
          tooltip:'Edit',
          icon:' fa fa-pencil'
        }
       }
    ];
    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
      sortable: true,
      filter: true
    };
    
    @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;

  constructor(private _configurationService: ConfigurationService, private _msgProperty: MessageTranslationPipe, private _serverValidation: ServerValidationService, private _toastrService: ToastrService){
    
    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }

    this.createForm = new FormGroup({
      milk_quality_type_name: new FormControl('', Validators.required),
      is_active: new FormControl(false),
      search: new FormControl(''),
    });

     // Initialize searchForm here
     this.searchForm = new FormGroup({
      milk_quality_type_code: new FormControl('', Validators.required),
      milk_quality_type_name: new FormControl('', Validators.required),
      is_active: new FormControl(false),
    });

  }
  ngOnInit(): void {
    this.MilkQualityTypeList();
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.searchTable();
  }

  searchTable() {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.rowData = this.originalData.filter((row: any) => {
        const valuesToSearch = [
          row.milk_quality_type_code.toString(),
          row.milk_quality_type_name,
          // row.is_active,
        ];
        for (const value of valuesToSearch) {
          if (value.toLowerCase().indexOf(trimmedSearchTerm) !== -1) {
            return true;
          }
        }
        return false;
      });
    } else {
      // If the search term is empty, show all rows
      this.rowData = [...this.originalData];
    }
  }

  onEditClick(rowData:any): void {
    // Call the click handler passed from the column definition
    this.selectedRowData = rowData;
    this.searchForm.patchValue({
      milk_quality_type_code: this.selectedRowData.milk_quality_type_code,
      milk_quality_type_name: this.selectedRowData.milk_quality_type_name,
      is_active: this.selectedRowData.is_active,
    });
    // this.searchForm.get('milk_type_code')?.disable();
    this.isUpdateModalShown= !this.isUpdateModalShown;
  }

  // save method
  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      this._configurationService.MilkQualityTypeCreate(this.model).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this.alertService.Success(this.createResponse.responseMessage);
          this._toastrService.success(this.createResponse.responseMessage);
          this.createForm.reset();
          this.MilkQualityTypeList();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('milk_quality_validation'), this.createResponse.responseData);
        }
      });
    } else {
      // this.alertService.Alert(this._msgProperty.transform('milk_quality_validation'),"Input form data is not valid.");
      this._toastrService.warning(this._msgProperty.transform('milk_quality_validation'),"Input form data is not valid.")
    }
  }
  MilkQualityTypeList() {
    this._configurationService.MilkQualityTypeList().subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        const header: any[] = Object.keys(this.searchResponse.responseData[0]);
        header.forEach(element => {
          // this.columns.push({ key: element, title: element });
        });
        // this.rowData = this.searchResponse.responseData;
        this.originalData = this.searchResponse.responseData;
        this.rowData = [...this.originalData];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }

  addMilkQualityType(){
    this.isAddModalShown = !this.isAddModalShown;
  }

  Update(){
    // this.searchForm.get('bmc_code')?.enable();
    // this.searchForm.get('bmc_name')?.enable();
    //write the update logic here
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this.newModel.milk_quality_type_code = this.model.milk_quality_type_code;
      this.newModel.milk_quality_type_name = this.model.milk_quality_type_name;
      this.newModel.is_active = this.model.is_active;
    }
    ////////////////////////////////////////////////////////////////////////subscribe update api here----
    this.isUpdateModalShown = !this.isUpdateModalShown;
  }

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal?.hide();
    this.isUpdateModalShown = false;
  }

  onHidden(): void {
    this.isModalShown = false;
    this.isUpdateModalShown = false;
  }
}
