import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { Response } from 'src/app/Auth/common//model/response';
import { MasterService } from '../services/master.service';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rate-master',
  templateUrl: './rate-master.component.html',
  styleUrls: ['./rate-master.component.css']
})
export class RateMasterComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  public buttonDisabled:boolean=false;
  public createForm!: FormGroup;
  public searchForm!: FormGroup;
  model: any = {};
  searchModel: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  isModalShown: boolean = false;
    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
      sortable: true,
      filter: true
    };
    files: any;
  constructor(private _masterService: MasterService, private _serverValidation: ServerValidationService, private _msgProperty: MessageTranslationPipe,private _toastrService: ToastrService){
    this.createForm = new FormGroup({
      rate_code: new FormControl('0'),
      rate_name: new FormControl('', Validators.required),
      remark: new FormControl('', Validators.required),
      rate_chart_file: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {

  }
  Create() {
    this.buttonDisabled=true;
    if (this.createForm.valid) {
      let _formData = new FormData();
      _formData.append("rate_code", this.createForm.controls['rate_code'].value);
      _formData.append("rate_name", this.createForm.controls['rate_name'].value);
      _formData.append("remark", this.createForm.controls['remark'].value);
      _formData.append("rate_chart_file", this.fileInput.nativeElement.files[0]);
      this._masterService.RateMasterCreate(_formData).subscribe(response => {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this.alertService.Success("Rate chart upload successfully...!");
          this._toastrService.success("rate chart upload successfully...!");
          this.createForm.reset();
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('rate_master_validation'), this.createResponse.responseData)
        }
      });
    } else {
      // this.alertService.Error("Input form data is not valid.");
      this._toastrService.error("Input form data is not valid.");
    }
  }
  onFileChange(event: any) {
    console.log(JSON.stringify(event));
    if (event.target.files.length == 1) {
      console.log("File : " + event.target.files[0]);
      const file = event.target.files[0];
      this.createForm.patchValue({
        rate_chart_file: file
      });
      this.files = file;
    } else {
      // this.alertService.Error("you can not select multiple files.");
      this._toastrService.error("Ypo cannot select multiple file.!");
    }
  }
}
