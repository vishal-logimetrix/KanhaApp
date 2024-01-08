import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { Response } from 'src/app/Auth/common/model/response';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';

@Component({
  selector: 'app-tehsil',
  templateUrl: './tehsil.component.html',
  styleUrls: ['./tehsil.component.css']
})
export class TehsilComponent implements OnInit{

  public searchForm: FormGroup;
  model: any = {};
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  stateDropDown!: Dropdown[];
  districtDropDown!: Dropdown[];
  isModalShown: boolean = false;
  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  selectedRowData: any = {}
  public frameworkComponents: any;
  searchTerm: string = '';

  stateId={
    state_code:'',
    district_code:''
  };

  originalData: any[] = [];
    //for grid
    rowData:any = [];
    columnDefs: ColDef[] = [
      { headerName: 'State Code', field: 'state_code', resizable: true, width:150},
      { headerName: 'State Name', field: 'state_name', resizable: true, width:150},
      { headerName: 'District Code', field: 'district_code', resizable: true, width:150 },
      { headerName: 'District Name', field: 'district_name', resizable: true, width:150 },
      { headerName: 'Tehsil Code', field: 'tehsil_code', resizable: true, width:150 },
      { headerName: 'Tehsil Name', field: 'tehsil_name', resizable: true, width:150 },
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
    @ViewChild('autoShownModal', { static: false })autoShownModal?: ModalDirective;
  constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService,private msgProperty: MessageTranslationPipe, private _toastrService: ToastrService){
    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    this.searchForm = new FormGroup({
      state_code: new FormControl(''),
      state_name: new FormControl(''),
      district_code: new FormControl('', Validators.required),
      district_name: new FormControl(''),
      tehsil_code: new FormControl(''),
      tehsil_name: new FormControl(''),
      search: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.TehsilList();
    this.StateDropdown();
    this.showModal();
  }
  onEditClick(rowData:any): void {
    // Call the click handler passed from the column definition
    this.selectedRowData = rowData;
    this.isUpdateModalShown = true;
    this.searchForm.patchValue({
      state_code: this.selectedRowData.state_code,
      state_name: this.selectedRowData.state_name,
      district_code: this.selectedRowData.district_code,
      district_name: this.selectedRowData.district_name,
      tehsil_code: this.selectedRowData.tehsil_code,
      tehsil_name: this.selectedRowData.tehsil_name,
    });
    this.searchForm.get('state_code')?.disable();
    this.searchForm.get('state_name')?.disable();
    this.searchForm.get('district_code')?.disable();
    this.searchForm.get('district_name')?.disable();
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.searchTable();
  }

  // searchTable() {
  //   if (this.searchTerm) {
  //     this.rowData = this.originalData.filter((row: any) =>
  //       row.state_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.state_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.district_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.district_name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.tehsil_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
  //       row.tehsil_name.toLowerCase().indexOf(this.searchTerm) !== -1 
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
          row.state_code,
          row.state_name,
          row.district_code,
          row.district_name,
          row.tehsil_code,
          row.tehsil_name
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
      'STATE CODE': entry.state_code,
      'STATE NAME': entry.state_name,
      'DISTRICT NAME': entry.district_name,
      'DISTRICT CODE': entry.district_code,
      'TEHSIL CODE': entry.tehsil_code,
      'TEHSIL NAME': entry.tehsil_name,
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
  TehsilList(){
   this.searchForm.get('state_code')?.enable();
   this.searchForm.get('state_name')?.enable();
   this.searchForm.get('district_code')?.enable();
   this.searchForm.get('district_name')?.enable();
    if (this.searchForm.valid) {
      this.searchModel = Object.assign({}, this.searchForm.value);
      this.stateId.district_code = this.searchModel.district_code;
      this._masterService.TehsilList(this.stateId).subscribe((res:any)=>{
        this.searchResponse = res as Response;
        if (this.searchResponse.responseStatus === 200) {
          this.originalData = this.searchResponse.responseData;
          this.rowData = [...this.originalData];
          this.isModalShown=!this.isModalShown;
        }else{
          this._toastrService.error(this.searchResponse.responseData); 
        }
      })
    }
  }
  StateDropdown(){
    this._masterService.StateDropDown().subscribe((res:any)=>{
        this.searchResponse = res as Response;
        if (this.searchResponse.responseStatus === 200) {
          this.stateDropDown = this.searchResponse.responseData as Dropdown[];
          this.stateId.state_code = this.searchResponse.responseData[0].value;         
          this.DistrictDropdown();
        }else{
          this._toastrService.error(this.searchResponse.responseData);
        }
    })
  }
  DistrictDropdown(){
    this.searchModel = Object.assign({}, this.searchForm.value);
    this._masterService.DistrictDropDown(this.stateId).subscribe((res:any)=>{
      this.searchResponse = res as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.districtDropDown = this.searchResponse.responseData as Dropdown[];
      }else{
        this._toastrService.error(this.searchResponse.responseData);
      }
    })
  }
  Update(){
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
          
    }
    ////////////////////////////////////////////////////////////////////////subscribe update api here----
    this.isUpdateModalShown = !this.isUpdateModalShown;
  }

    //#region Model View Methods
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
