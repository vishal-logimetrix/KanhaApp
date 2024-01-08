import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/Auth/Services/auth.service.service';
import { GridButtonRendererComponentComponent } from 'src/app/Auth/common/Renderer/grid-button-renderer-component/grid-button-renderer-component.component';
import { Response } from 'src/app/Auth/common/model/response';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  closeResult: string = "";
  isModalShown: boolean = false;
  public userSearchForm!: FormGroup;
  searchModel: any;
  searchResponse!: Response;
  public frameworkComponents: any;
  rowDataClicked1 = {};
   // for gird 
   rowData = [];
   columnDefs: ColDef[] = [
     {headerName: "User Code", field: 'Id',resizable: true,width:120 },
     {headerName: "First Name", field: 'FirstName',resizable: true },
     {headerName: "Last Code", field: 'Lastname',resizable: true },
     {headerName: "User Name", field: 'Username',resizable: true },
     {headerName: "Email ID", field: 'eMailId',resizable: true },
     {headerName: "Mobile No", field: 'Mobile No',resizable: true },
     {headerName: "Birth Date", field: 'BirthDate',resizable: true},
     {
       field: 'Action',
       cellRenderer: 'buttonRenderer',
       cellRendererParams: {
         onClick: this.ApplyApplicability.bind(this),
         label: 'Org Mapping',
         tooltip:'Org Mapping',
         icon:'fa fa-link'
       }
     }];
     // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    flex:1,
      minWidth:100
  };
  rowHeight:number=50;
  constructor(private _authService: AuthServiceService, private _router: Router,private _toastrService: ToastrService){
    this.userSearchForm = new FormGroup({
      user_name: new FormControl(''),
      mobile_no: new FormControl(''),
    });
    this.frameworkComponents = {
      buttonRenderer: GridButtonRendererComponentComponent,
    }
    this.showModal();
  }
  ngOnInit(): void {}
  exportDataToExcel(): void {
    const formattedData = this.rowData.map((entry: any) => ({
      'USER CODE': entry.Id,
      'FIRST NAME': entry.FirstName,
      'LAST NAME': entry.Lastname,
      'USER NAME': entry.Username,
      'E-MAIL ID': entry.eMailId,
      'MOBILE NO': entry['Mobile No'],
      'BIRTH DATE': entry.BirthDate,    
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
  showModal(): void {
    this.isModalShown = true;
  }
  hideModal(): void {
    this.autoShownModal?.hide();
  }
  onHidden(): void {
    this.isModalShown = false;
  }
  searchUser() {
    if (this.userSearchForm.valid) {
      this.searchModel = Object.assign({}, this.userSearchForm.value);
      this._authService.getUserList(this.searchModel).subscribe((response:any) => {
        this.searchResponse = response as Response;
        if (this.searchResponse.responseStatus == 200) {
          this._toastrService.success(this.searchResponse.responseMessage);
          this.hideModal();
          const header: any[] = Object.keys(this.searchResponse.responseData[0]);
          header.forEach(element => {
            // this.columns.push({ key: element, title: element });
          });
          this.rowData=this.searchResponse.responseData;
        } else {
          this._toastrService.error(this.searchResponse.responseData);
        }
      });
    }
  }
  ApplyApplicability(data: any) {
    this.rowDataClicked1 = data.rowData;
    console.log(JSON.stringify(this.rowDataClicked1));
    let pass_value_json={
      user_code:data.rowData.Id,
      user_name:data.rowData.Username
    }
    const navigationExtras: NavigationExtras = {
      state: {
        pass_data:pass_value_json
      }
    };
    this._router.navigate(['/org/map/'],navigationExtras);
  }
}
