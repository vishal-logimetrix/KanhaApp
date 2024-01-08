import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi } from 'ag-grid-community';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from '../services/master.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  public createForm: FormGroup;
  model: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  rowDataClicked1 = {};
  isModalShown: boolean = false;
  public frameworkComponents: any;
  searchTerm: string = '';

  button_name:any;
  pass_data: any;
  _data: any;
  gridApi!: GridApi;
  selectedRowData: any = {};

  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
    originalData: any[] = [];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: 'Company Code', field: 'company_code', resizable: true },
      { headerName: 'Company Name', field: 'company_name', resizable: true },
      { headerName: 'Company Short Name', field: 'company_short_name', resizable: true },
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
  constructor(private _masterService: MasterService, private _msgProperty: MessageTranslationPipe, private _serverValidation: ServerValidationService,private _toastrService: ToastrService, private _router:Router){
    
    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    this.createForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      company_name: new FormControl('', Validators.required),
      company_short_name: new FormControl(),
      search: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.CompanyList();
  }
  onEditClick(rowData:any): void {
       this.selectedRowData = rowData;
    this.createForm.patchValue({
      company_code: this.selectedRowData.company_code,
      company_name: this.selectedRowData.company_name,
      company_short_name: this.selectedRowData.company_short_name,
    });
    this.isModalShown= !this.isModalShown;
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
  //       row.company_short_name.toLowerCase().indexOf(this.searchTerm) !== -1 
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
          row.company_short_name,
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

  
  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'COMPANY CODE': entry.company_code,
      'COMPANY NAME': entry.company_name,
      'COMPANY SHORT NAME': entry.company_short_name,
    }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const filename = 'data_export.xlsx';
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, filename);
      }

  // save method
  // Create() {
  //   if (this.createForm.valid) {
  //     this.model = Object.assign({}, this.createForm.value);     //------------------------------------uncomment these
  //     console.log('__________________Update method form data_____', this.model);
  //       this.isModalShown = !this.isModalShown;
  //       this.CompanyList();
  //     this._masterService.CompanyCreate(this.model).subscribe(response => {
  //       this.createResponse = response as Response;
  //       if (this.createResponse.responseStatus == 200) {
  //         this._toastrService.success("created successfully!");
  //         this.createForm.reset();
  //         this.CompanyList();
  //       } else {
  //         this._serverValidation.parseValidation(this._msgProperty.transform('company_validation'), this.createResponse.responseData);
  //       }
  //     });
  //   } else {
  //     this._toastrService.warning(this._msgProperty.transform('company_validation'),"Input form Data is not valid");
  //   }
  // }
  Update() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value); 
        this.isModalShown = !this.isModalShown;
        this.CompanyList();
        this._toastrService.error(`You don't have permission to update the company data..`)
    //   this._masterService.CompanyCreate(this.model).subscribe(response => {
    //     this.createResponse = response as Response;
    //     if (this.createResponse.responseStatus == 200) {
    //       this._toastrService.success("created successfully!");
    //       this.createForm.reset();
    //       this.CompanyList();
    //     } else {
    //       this._serverValidation.parseValidation(this._msgProperty.transform('company_validation'), this.createResponse.responseData);
    //     }
    //   });
    // } else {
    //   this._toastrService.warning(this._msgProperty.transform('company_validation'),"Input form Data is not valid");
    }
  }
  CompanyList() {
    this._masterService.CompanyList().subscribe(response => {
      this.searchResponse = response as Response;      
      if (this.searchResponse.responseStatus == 200) {
        this.originalData = this.searchResponse.responseData;
        this.rowData = [...this.originalData];
        // this.isModalShown = !this.isModalShown;
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  UpdateCompany(){

  }
    //#region Model View Methods
    showModal(): void {
      this.isModalShown = true;
    }
    hideModal(): void {
      this.autoShownModal?.hide();
    }
    onHidden(): void {
      this.isModalShown = false;
    }
}
