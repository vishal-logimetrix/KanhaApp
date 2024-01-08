import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Response } from 'src/app/Auth/common//model/response';
import { MasterService } from '../../services/master.service';
import { NavigationExtras, Router } from '@angular/router';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-rate-master-list',
  templateUrl: './rate-master-list.component.html',
  styleUrls: ['./rate-master-list.component.css']
})
export class RateMasterListComponent implements OnInit{
  closeResult: string = "";
  isModalShown: boolean = false;
  public searchForm: FormGroup;
  searchModel: any;
  searchResponse!: Response;
  public frameworkComponents: any;
  searchTerm: string = '';

  rowDataClicked1 = {};
  originalData: any[] = [];
  //for grid
  rowData:any = [];
  columnDefs: ColDef[] = [
    { field: 'rate_code', resizable: true },
    { field: 'rate_name', resizable: true },
    { field: 'upload_date', resizable: true },
    { field: 'remark', resizable: true },
    {
      field: 'Action',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.ApplyApplicability.bind(this),
        label: 'Edit',
        tooltip:'Applicability',
        icon:'fa fa-plus'
      }
    }];
 // DefaultColDef sets props common to all Columns
 public defaultColDef: ColDef = {
  sortable: true,
  filter: true
};
@ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  constructor(private _masterService: MasterService, private _route: Router, private _toastrService: ToastrService){
    this.searchForm = new FormGroup({
      company_code: new FormControl('', Validators.required),
      plant_code: new FormControl('', Validators.required),
      search: new FormControl(''),
    });
    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
  }
  ngOnInit(): void {
    this.RateList();
  }
  onSearchInput(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.searchTable();
  }

  // searchTable() {
  //   const trimmedSearchTerm = this.searchTerm.trim();
  //   if (trimmedSearchTerm) {
  //     this.rowData = this.originalData.filter((row: any) => {
  //       const valuesToSearch = [
  //         row.rate_code,
  //         row.rate_name,
  //         row.remark,
  //         row.upload_date
  //       ];
  //       for (const value of valuesToSearch) {
  //         if (value.toLowerCase().indexOf(trimmedSearchTerm) !== -1) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     });
  //   } else {
  //     // If the search term is empty, show all rows
  //     this.rowData = [...this.originalData];
  //   }
  // }


  // here handle the bug for row.rate_code, because rate_code gives an error while converting it into lowercase.

  searchTable() {
    const trimmedSearchTerm = this.searchTerm.trim();
    if (trimmedSearchTerm) {
      this.rowData = this.originalData.filter((row: any) => {
        const valuesToSearch = [
          row.rate_name,
          row.remark,
          row.upload_date
        ];
  
        for (const value of valuesToSearch) {
          if (typeof value === 'string' && value.toLowerCase().indexOf(trimmedSearchTerm) !== -1) {
            return true;
          }
          
          // If it's a number, convert it to a string and then check
          if (typeof value === 'number' && value.toString().toLowerCase().indexOf(trimmedSearchTerm) !== -1) {
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
      'RATE CODE': entry.rate_code,
      'RATE NAME': entry.rate_name,
      'UPLOAD DATE': entry.upload_date,
      'REMARK': entry.remark,
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

  RateList() {
    // this.searchModel = Object.assign({}, this.searchForm.value);
    this._masterService.RateList(null).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.originalData = this.searchResponse.responseData;
           this.rowData = [...this.originalData];
        this.isModalShown = !this.isModalShown;
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  ApplyApplicability(data: any) {
    this.rowDataClicked1 = data.rowData;
    console.log(JSON.stringify(this.rowDataClicked1));
    const navigationExtras: NavigationExtras = {
      state: {
        pass_data:this.rowDataClicked1
      }
    };
    this._route.navigate(['milk/rate-applicability'],navigationExtras);
  }

}
