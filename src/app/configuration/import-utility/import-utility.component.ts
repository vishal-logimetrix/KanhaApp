import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { Dropdown } from 'src/app/Auth/common/model/dropdown';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';

@Component({
  selector: 'app-import-utility',
  templateUrl: './import-utility.component.html',
  styleUrls: ['./import-utility.component.css']
})
export class ImportUtilityComponent implements OnInit{

  @ViewChild('fileInput') fileInput: any;
  public buttonDisabled: boolean = false;
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  model: any = {};
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  isModalShown: boolean = false;
  importProcessDropDown!: Dropdown[];
    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
      sortable: true,
      filter: true,
    };
    files: any;
  constructor(public _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe){
    this.createForm = new FormGroup({
      import_name: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.GetImportProcess();
  }
  Create() {
    this.buttonDisabled = true;
    if (this.createForm.valid) {
      let _formData = new FormData();
      _formData.append(
        'import_name',
        this.createForm.controls['import_name'].value
      );
      _formData.append('file', this.fileInput.nativeElement.files[0]);
        this._masterService.ImportMasterFile(_formData)
        .subscribe(async (data: any) => {
          var buffer = await data.arrayBuffer();
          var excelData = new Uint8Array(buffer);
          var arr = new Array();
          for (var i = 0; i != excelData.length; ++i) {
            arr[i] = String.fromCharCode(excelData[i]);
          }
          var bstr: any = arr.join('');
          if (String(bstr).includes('"responseMessage"')) {
            bstr = JSON.parse(bstr);
          }
          if (
            !(bstr == null || bstr == undefined || bstr === '') &&
            String(bstr.responseMessage).toLocaleLowerCase() == 'error'
          ) {
            this.createResponse = bstr as Response;
            this._serverValidation.parseValidation(
              this._msgProperty.transform('import_utility_validation'),
              this.createResponse.responseData
            );
          } else {
            // FileSaver.saveAs(data, 'name.xlsx');
            // this.alertService.Error('Error File Save Successfully.');
          }
          this.buttonDisabled = false;
        });
    } else {
      // this.alertService.Error('Input form data is not valid.');
    }
  }
  onFileChange(event: any) {
    console.log(JSON.stringify(event));
    if (event.target.files.length == 1) {
      // console.log("File : " + event.target.files[0]);
      const file = event.target.files[0];
      this.createForm.patchValue({
        file: file,
      });
      this.files = file;
    } else {
      // this.alertService.Error('you can not select multiple files.');
    }
  }
  GetImportProcess() {
    this._masterService.ImportNameDropDown().subscribe((response) => {
      this.searchResponse = response as Response;
      if (this.searchResponse.responseStatus == 200) {
        this.importProcessDropDown = this.searchResponse
          .responseData as Dropdown[];
          console.log('jkndwendkjn',this.importProcessDropDown);
      } else {
        // this.alertService.Error(this.searchResponse.responseData);
      }
    });
  }
}
