import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/Auth/Services/auth.service.service';
import { MessageTranslationPipe } from 'src/app/Auth/common/Pipes/message-translation.pipe';
import { ServerValidationService } from 'src/app/Auth/common/Services/server-validation.service';
import { Response } from 'src/app/Auth/common/model/response';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{
  public createForm: FormGroup;
  model: any = {};
  createResponse!: Response;
  searchResponse!: Response;
  user_name: any;
  constructor(private _msgProperty: MessageTranslationPipe, private _serverValidation: ServerValidationService, private _authService: AuthServiceService){
    this.createForm = new FormGroup({
      user_name: new FormControl('', Validators.required),
      old_password: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    //get decodate token form auth service.
    let user_data = this._authService.decodateToken;
    //set username for globle variable.
    this.user_name = user_data["user_name"];
    //set username into create form property.
    this.createForm.get('user_name')?.setValue(this.user_name);
  }

  // save method
  ChangePassowrd() {
    if (this.createForm.valid) {
      this.model = Object.assign({}, this.createForm.value);
      this._authService.ChangePassword(this.model).subscribe((response:any)=> {
        this.createResponse = response as Response;
        if (this.createResponse.responseStatus == 200) {
          // this.alertService.Success("Password Change Successfully...!");
          this.createForm.reset();
          this.createForm.get('user_name')?.setValue(this.user_name);
        } else {
          this._serverValidation.parseValidation(this._msgProperty.transform('change_password_validation'), this.createResponse.responseData);
        }
      });
    } else {
      // this.alertService.Alert(this._msgProperty.transform('change_password_validation'), "Input form data is not valid.");
    }
  }
  private passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get("confirm_passowrd")?.value ? null : { 'mismatch': true };
  }
}
