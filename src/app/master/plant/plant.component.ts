import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css']
})
export class PlantComponent implements OnInit {
  public createForm: FormGroup;
  public searchForm: FormGroup;
  model: any = {};
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  companyDropDown!: Dropdown[];
  isModalShown: boolean = false;
  isAddModalShown:boolean = false;
  
  public frameworkComponents: any;
  searchTerm: string = '';

  button_name:any;
  pass_data: any;
  _data: any;
  gridApi!: GridApi;
  selectedRowData: any = {};
  companyId = {
    company_code:'',
    plant_code:'',
    plant_name:'',
    is_active:true,
    address:''
  }
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  originalData: any[] = [];
  //for grid
  rowData:any = [];
  columnDefs: ColDef[] = [
    { headerName: 'Company Code', field: 'company_code', resizable: true, width: 150 },
    { headerName: 'Company Name', field: 'company_name', resizable: true, width: 150 },
    { headerName: 'Plant Code', field: 'plant_code', resizable: true, width: 150 },
    { headerName: 'Plant Name', field: 'plant_name', resizable: true, width: 150 },
    { headerName: 'Address', field: 'address', resizable: true, width: 150 },
    { headerName: 'Is Active', field: 'is_active', resizable: true, width: 150 },
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
  constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe, private _toastrService: ToastrService){ 
    
    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }

    this.createForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      company_name: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      plant_name: new FormControl('', Validators.required),
      is_active: new FormControl(true),
      address: new FormControl(''),
      search: new FormControl(''),
    });
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      search: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.CompanyDropDown();
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.searchTable();
  }

  // searchTable() {
  //   if (this.searchTerm) {
  //     this.rowData = this.originalData.filter((row: any) =>
  //       row.company_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.company_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.plant_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.plant_name.toLowerCase().indexOf(this.searchTerm) !== -1 
  //     );
  //   }else {
  //     // If the search term is empty, show all rows
  //     this.rowData = [...this.originalData];
  //   }
  // }

  searchTable() {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.rowData = this.originalData.filter((row: any) => {
        const valuesToSearch = [
          row.company_code,
          row.company_name,
          row.plant_code,
          row.plant_name,
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
    this.createForm.patchValue({
      company_code: this.selectedRowData.company_code,
      company_name: this.selectedRowData.company_name,
      plant_code: this.selectedRowData.plant_code,
      plant_name: this.selectedRowData.plant_name,
      address: this.selectedRowData.address,
      is_active: this.selectedRowData.is_active
    });
    this.isModalShown= !this.isModalShown;
  }
  addPlant(){
    const isActive = this.createForm.get('is_active')?.value;
    this.createForm.reset();
    this.createForm.get('is_active')?.setValue(isActive);
    this.isAddModalShown = true;
  }

  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'COMPANY CODE': entry.company_code,
      'COMPANY NAME': entry.company_name,
      'PLANT CODE': entry.plant_code,
      'PLANT Name': entry.plant_name,
      'ADDRESS': entry.address,
      'IS ACTIVE': entry.is_active,
    }));

    // Create a new Excel workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      // Generate Excel file binary
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
       // Save the file using FileSaver.js
        const filename = 'data_export.xlsx';
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, filename);
      }


  // ff(){
  //   this.model = Object.assign({}, this.createForm.value);
  //   console.log('----------model----', this.model);
  //   this.companyId.address = this.model.address;
  //   this.companyId.is_active = this.model.is_active;
  //   this.companyId.plant_code = this.model.plant_code;
  //   this.companyId.plant_name = this.model.plant_name;
  //   console.log('----------new model-----------', this.companyId);
  // }


  // save method
  
  Update(){
    //write the update logic here
    this.isModalShown = !this.isModalShown;
  }

  Create() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      console.log('new plant add here', this.model);
      // this.companyId.address = this.model.address;
      // this.companyId.is_active = this.model.is_active;
      // this.companyId.plant_code = this.model.plant_code;
      // this.companyId.plant_name = this.model.plant_name;
      this.isAddModalShown = false;
      this._masterService.PlantCreate(this.model).subscribe(res => {
        this.createResponse = res as Response;
        if (this.createResponse.responseStatus == 200) {
          this._toastrService.success(this.createResponse.responseMessage);
          this.createForm.reset();   
          this.PlantList();
        } else {
          this._toastrService.error(this.createResponse.responseMessage)
          this._serverValidation.parseValidation(this._msgProperty.transform('plant_validation'),this.createResponse.responseData)
        }
        this.isAddModalShown = false;
      });
    } else {
      this._toastrService.error("Input form data is not valid.")
    }
  }
  PlantList() {
    // if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this._masterService.PlantList(this.companyId).subscribe(res => {
        this.searchResponse = res as Response;        
        if (this.searchResponse.responseStatus == 200) {
           this.originalData = this.searchResponse.responseData;
           this.rowData = [...this.originalData];
          // this.isModalShown=!this.isModalShown;
        } else {
          this._toastrService.error(this.searchResponse.responseData)
        }
      });
    // }
  }
  //#region  DropDown Methods
  CompanyDropDown() {
    this._masterService.CompanyDropDown().subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.companyDropDown = this.searchResponse.responseData as Dropdown[];
        this.companyId.company_code = this.companyDropDown[0].value;
        this.PlantList();
      } else {
        this._toastrService.error(this.searchResponse.responseData)
      }
    });
  }
  //#region Model View Methods
  showModal(): void {
    this.isModalShown = true;
    this.isAddModalShown = true;
  }
  hideModal(): void {
    this.autoShownModal?.hide();
    this.isModalShown = false;
    this.isAddModalShown = false;
  }
  onHidden(): void {
    this.isModalShown = false;
    this.isAddModalShown = false;
  }
}
