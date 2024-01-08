import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { NewRegisterComponent } from '../new-register/new-register.component';
import { Router } from '@angular/router';
import { AuthServiceService } from '../Services/auth.service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Response } from 'src/app/Auth/common/model/response';
import { ToastrService } from 'ngx-toastr';

// import { AlertService } from '../common/Services/alert.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  model: any = {};
  public loginForm!: FormGroup;
  bsModalRef!: BsModalRef;
  loginResponse!: Response;
  jwtHelperService = new JwtHelperService();
  login_button_disable: boolean = false;
  constructor(private modalService: BsModalService, private route: Router, public _authService: AuthServiceService,
    private _toastrService: ToastrService){
    this.loginForm = new FormGroup({
      user_name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    localStorage.removeItem('auth_token');
  }
  login() {
   if (this.loginForm.valid) {
    this.login_button_disable = true;
    this.model = Object.assign({}, this.loginForm.value);
    this._authService.login(this.model).subscribe((res:any)=>{
      this.loginResponse = res as Response;
      if (this.loginResponse.responseStatus==200) {
        // console.log('----token----', this.loginResponse.responseData.Token);
        localStorage.setItem('auth_token',this.loginResponse.responseData.Token);
         localStorage.setItem('server_date_time',this.loginResponse.responseData.ServerDateTime);
        this._authService.decodateToken = this.jwtHelperService.decodeToken(this.loginResponse.responseData.Token);
        this.login_button_disable = false;
        this._toastrService.success('Login Successful!');
        this.route.navigate(['/home/dashboard']);
      }
      else {
        window.alert('Error Occured')
      }
    });
   }
   else{
    if (this.loginForm.get('user_name') == null) {
           window.alert('UserName is required')
    } else if (this.loginForm.get('password') == null) {
         window.alert('passwor is required')
    }
    this.login_button_disable = false;
   }
  }
  loggedIn(){
  return this._authService.loggedIn();
  }
  logout(){
    localStorage.removeItem('auth_token');
    this.route.navigate(['/login'])
  }
  // public showModal(): void {
  //   this.bsModalRef = this.modalService.show(ForgotPasswordComponent, {
  //     animated: true,
  //     backdrop: 'static',
  //     class: 'modal-md'
  //   });
  // }
  showRegisterModal(): void{
    // this.bsModalRef = this.modalService.show(NewRegisterComponent, {
    //   animated: true,
    //   backdrop: 'static',
    //   class: 'modal-md'
    // });
  }
}
