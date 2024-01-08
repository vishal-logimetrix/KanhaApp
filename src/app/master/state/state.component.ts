import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { MasterService } from '../services/master.service';
import { Response } from 'src/app/Auth/common//model/response';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
})
export class StateComponent implements OnInit {

  closeResult: string = "";
  isModalShown: boolean = false;
  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  searchModel: any;
  searchResponse!: Response;
  createResponse!: Response;
  companyDropDown!: Dropdown[];
  plantDropDown!: Dropdown[];
  plantModel: any = {};
  selectedRowData: any = {}
  public searchForm!: FormGroup;
  public frameworkComponents: any;
  searchTerm: string = '';

  model: any = {};
  newModel: any = {
   state_code: '',
   state_name:'',
  }
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;


  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'STATE CODE': entry.state_code,
      'STATE NAME': entry.state_name,
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

  constructor(private _masterService: MasterService, private _toastrService: ToastrService){

    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }

    this.searchForm = new FormGroup({
      state_code: new FormControl(''),
      state_name: new FormControl(''),
      search: new FormControl(''),
    });
  }
  // yourDataSource = [
  //   { someColumnName: 1, countryName: 'Country A', action: 'edit', },
  //   { someColumnName: 2, countryName: 'Country B', action: 'edit', },
  // ];
  
  originalData: any[] = [];
  //for grid
  rowData:any = [];
  columnDefs: ColDef[] = [
    {headerName:"State Code", field: 'state_code', resizable: true },
    {headerName:"State Name", field: 'state_name', resizable: true },
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
    
    ngOnInit(): void {
      this.StateList();
    }
    onSearchInput(event: any) {
      this.searchTerm = event.target.value.toLowerCase();
      this.searchTable();
    }

    // searchTable() {
    //   if (this.searchTerm) {
    //     this.rowData = this.originalData.filter((row: any) =>
    //       row.state_code.toLowerCase().indexOf(this.searchTerm) !== -1 ||
    //       row.state_name.toLowerCase().indexOf(this.searchTerm) !== -1
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
        state_code: this.selectedRowData.state_code,
        state_name: this.selectedRowData.state_name,
      });
      this.isUpdateModalShown= !this.isUpdateModalShown;
    }

    StateList(){
     this._masterService.StateList().subscribe((res:any)=>{
      this.searchResponse = res as Response;
      if (this.searchResponse.responseStatus==200) {
        // const header: any[] = Object.keys(this.searchResponse.responseData[0]);
        // header.forEach(element => {
        // });
        this.originalData = this.searchResponse.responseData;
        this.rowData = [...this.originalData];
      }else{
        this._toastrService.error(this.searchResponse.responseData);
      }
     })
    }
    Update(){
      if (this.searchForm.valid) {
        this.model = Object.assign({}, this.searchForm.value);
        this.newModel.address = this.model.address;
        this.newModel.mcc_code = this.model.mcc_code;
        this.newModel.mcc_name = this.model.mcc_name;
      
      }
      ////////////////////////////////////////////////////////////////////////subscribe update api here----
      this.isUpdateModalShown = !this.isUpdateModalShown;
    }
    showModal(): void {
      this.isModalShown = true;
    }
    hideModal(): void {
      this.isUpdateModalShown = false;
    }
    onHidden(): void {
      this.isUpdateModalShown == false;
    }
    addModel(row: any) {
      this.selectedRowData = row;
      this.isUpdateModalShown = true;
      // Set form controls with row data
      this.searchForm.patchValue({
          state_code: row.state_code,
          state_name: row.state_name,
      });
  }
}
