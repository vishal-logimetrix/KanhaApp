import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-product-master-list',
  templateUrl: './product-master-list.component.html',
  styleUrls: ['./product-master-list.component.css']
})
export class ProductMasterListComponent implements OnInit{

  isAddModalShown:boolean = false;
  isUpdateModalShown:boolean = false;
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  isModalShown: boolean = false;
  searchResponse!: Response;
  originalData: any[] = [];
  searchTerm: string = '';
  model: any = {};
  //for grid
  rowData:any = [];
  columnDefs: ColDef[] = [
    { field: 'Id', resizable: true, hide: true },
    { headerName: "Product Type", field: 'product_type', resizable: true,width: 130 },
    { headerName: "Product Code", field: 'product_code', resizable: true,width: 130 },
    { headerName: "SKU", field: 'product_sku', resizable: true,width: 130 },
    { headerName: "Product Name", field: 'product_name', resizable: true },
    { headerName: "Short Name", field: 'product_short_name', resizable: true,width: 130 },
    { headerName: "Unit", field: 'product_unit', resizable: true,width: 130 },
    { headerName: "Base Price", field: 'base_price', resizable: true ,width: 130},
    { headerName: "Current Market Price", field: 'current_market_price', resizable: true,width: 130 },
    { headerName: "IsActive", field: 'is_active', resizable: true,width: 130 },
    { headerName: "Allow Sale", field: 'allow_sale', resizable: true,width: 130 },
    { headerName: "Allow Indent", field: 'allow_indent', resizable: true,width: 130 },
    {
      field: 'Action',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.EditDeviceMaster.bind(this),
        label: 'Edit',
        tooltip:'Edit',
        icon:' fa fa-pencil'
      }
    }];
    public frameworkComponents: any;
    rowDataClicked1 = {};
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };
  constructor(private _masterService: MasterService, private _router: Router,private _toastrService: ToastrService){
    
    this.createForm = new FormGroup({
      // milk_type_name: new FormControl('', Validators.required),
      // milk_type_short_name: new FormControl('', Validators.required),
      // is_active: new FormControl(false),
      search: new FormControl(''),
    });

    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
  }
  ngOnInit(): void {
    this.SearchProduct();
  }
  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'PRODUCT TYPE': entry.product_type,
      'PRODUCT CODE': entry.product_code,
      'SKU': entry.product_sku,
      'PRODUCT NAME': entry.product_name,
      'SHORT NAME': entry.product_short_name,
      'UNIT': entry.product_unit,
      'BASE PRICE': entry.base_price,
      'CURRENT MARKET PRICE': entry.current_market_price,
      'IS ACTIVE': entry.is_active,
      'ALLOW SALE': entry.allow_sale,
      'ALLOW INDENT': entry.allow_indent,
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

      onSearchInput(event: any) {
        this.searchTerm = event.target.value.toLowerCase();
        this.searchTable();
      }
      searchTable() {
        const trimmedSearchTerm = this.searchTerm.trim();
        if (trimmedSearchTerm) {
          this.rowData = this.originalData.filter((row: any) => {
            const valuesToSearch = [
              row.product_type,
              row.product_code,
              row.product_sku,
              row.product_name,
              row.product_short_name,
              row.product_unit,
              row.base_price.toString(),
              row.current_market_price.toString(),
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

  SearchProduct() {
    this._masterService.ProductList(null).subscribe(response => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.originalData = this.searchResponse.responseData;
           this.rowData = [...this.originalData];
      } else {
        this._toastrService.error(this.searchResponse.responseData);
      }
    });
  }
  EditDeviceMaster(data: any) {
    this.rowDataClicked1 = data.rowData;
    const navigationExtras: NavigationExtras = {
      state: {
        pass_data:this.rowDataClicked1
      }
    };
    this._router.navigate(['product/master'],navigationExtras);
  }

}
