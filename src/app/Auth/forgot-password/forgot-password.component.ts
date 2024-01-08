import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Response } from 'src/app/Auth/common/model/response';
import { AuthServiceService } from '../Services/auth.service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  loginResponse!: Response;
  jwtHelperService = new JwtHelperService();
  public forgetPasswordForm!: FormGroup;
  login_button_disable:boolean=false;
  constructor(private _authService: AuthServiceService, private _router: Router){
    this.forgetPasswordForm = new FormGroup({
      mobile_no: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });
    
  }
  ngOnInit(): void {
  }


  forgetPassword(){
    if (this.forgetPasswordForm.valid) {
      this.login_button_disable=true;
      this.model=Object.assign({},this.forgetPasswordForm.value);
      this._authService.ForgetPassword(this.model).subscribe((response:any) => {
        this.loginResponse = response as Response;
        if (this.loginResponse.responseStatus == 200) {
          // this.altertService.Success("Password Change Successfully...!");
          this.login_button_disable=false;
          this._router.navigate(['/login']);
        } else {
          // this.altertService.Error(this.loginResponse.responseData);
          this.login_button_disable=false;
        }
      });
    }else{
      if (this.forgetPasswordForm.get('mobile_no') == null) {
        // this.altertService.Error("Mobile is require.");
      }else if(this.forgetPasswordForm.get('new_password') == null) {
        // this.altertService.Error("New Password is require.");
      }else if(this.forgetPasswordForm.get('confirm_password') == null) {
        // this.altertService.Error("Confirm Password is require.");
      }
      this.login_button_disable=false;
    }
  }

}
