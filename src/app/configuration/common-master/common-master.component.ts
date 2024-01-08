import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { ConfigurationService } from '../Services/configuration.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { Response } from 'src/app/Auth/common/model/response';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
@Component({
  selector: 'app-common-master',
  templateUrl: './common-master.component.html',
  styleUrls: ['./common-master.component.css']
})
export class CommonMasterComponent implements OnInit {
  public createForm: FormGroup;
  public searchForm!: FormGroup;
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
  
  model: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  commonMasterKeyDropDown!: Dropdown[];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: 'ID', field: 'Id', resizable: true },
      { headerName: 'Common Key', field: 'common_key', resizable: true },
      { headerName: 'Common Value', field: 'common_value', resizable: true },
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
      filter: true,
    };

    @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
    
  constructor(private _configuarationService: ConfigurationService, private _msgProperty: MessageTranslationPipe,private _serverValidation: ServerValidationService,private _toastrService: ToastrService){

    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    
    this.createForm = new FormGroup({
      common_key: new FormControl('', Validators.required),
      common_value: new FormControl('', Validators.required),
      search: new FormControl(''),
    });

     // Initialize searchForm here
     this.searchForm = new FormGroup({
      Id: new FormControl('', Validators.required),
      common_key: new FormControl('', Validators.required),
      common_master: new FormControl('',Validators.required),
    });
  }
  ngOnInit(): void {
    this.CommonMasterKeyDropDown();
    this.CommonMasterList();
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
          row.Id.toString(),
          row.common_key,
          row.comman_value,
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
      Id: this.selectedRowData.Id,
      common_key: this.selectedRowData.common_key,
      comman_value: this.selectedRowData.comman_valuee,
    });
    // this.searchForm.get('milk_type_code')?.disable();
    this.isUpdateModalShown= !this.isUpdateModalShown;
  }
  
  // save method
  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      this._configuarationService.CommonMasterCreate(this.model).subscribe((response) => {
          this.createResponse = response as Response;
          if (this.createResponse.responseStatus == 200) {
            this._toastrService.success(this.createResponse.responseMessage);
            this.createForm.reset();
            this.CommonMasterList();
          } else {
            this._serverValidation.parseValidation(
              this._msgProperty.transform('common_master_validation'),
              this.createResponse.responseData
            );
          }
        });
    } else {
      // this.alertService.Alert(this._msgProperty.transform('common_master_validation'),'Input form data is not valid.');
      this._toastrService.warning(this._msgProperty.transform('common_master_validation'),'Input form data is not valid.')
    }
  }
  CommonMasterList() {
    this.model = Object.assign({}, this.createForm.value);
    this._configuarationService.CommonMasterList(this.model).subscribe((response) => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          if (
            this.searchResponse.responseData &&
            this.searchResponse.responseData.length > 0) {
            const header: any[] = Object.keys(
              this.searchResponse.responseData[0]
            );
            header.forEach((element) => {
            });
            this.originalData = this.searchResponse.responseData;
        this.rowData = [...this.originalData];
          } else {
            // Handle the case where responseData is empty
          }
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
  }
  CommonMasterKeyDropDown() {
    this._configuarationService.CommonMasterKeyDropDown().subscribe((response) => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this.commonMasterKeyDropDown = this.searchResponse
            .responseData as Dropdown[];
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
  }
  Update(){
    // this.searchForm.get('bmc_code')?.enable();
    // this.searchForm.get('bmc_name')?.enable();
    //write the update logic here
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this.newModel.Id = this.model.Id;
      this.newModel.common_key = this.model.common_key;
      this.newModel.comman_value = this.model.comman_value;
    }
    ////////////////////////////////////////////////////////////////////////subscribe update api here----
    this.isUpdateModalShown = !this.isUpdateModalShown;
  }

  addCommonMaster(){
    this.isAddModalShown = !this.isAddModalShown;
  }

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal?.hide();
    this.isUpdateModalShown = false;
    this.isAddModalShown = false;
  }

  onHidden(): void {
    this.isModalShown = false;
    this.isUpdateModalShown = false;
    this.isAddModalShown = false;
  }
}
