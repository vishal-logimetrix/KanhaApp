import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/Auth/Services/auth.service.service';
import { Response } from 'src/app/Auth/common/model/response';
@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit{
  datePickerConfig: Partial<BsDatepickerConfig>;
  public signUpForm: FormGroup;
  signUpResponse!: Response;
  model: any = {};
  constructor(
    private _authService: AuthServiceService,
    private router: Router,
    private _toastrService: ToastrService
  ) {
    this.signUpForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl(),
      middle_name: new FormControl(),
      user_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ]),
      birth_date: new FormControl(),
      email_id: new FormControl('', Validators.required),
      mobile_no: new FormControl('', [Validators.required]),
    });

    this.datePickerConfig = {
      containerClass: 'theme-blue',
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      isAnimated: true,
      showTodayButton: true,
    };
  }
  ngOnInit(): void {}

  SignUp() {
    if (this.signUpForm.valid) {
      this.model = Object.assign({}, this.signUpForm.value);
      this._authService.signup(this.model).subscribe((response:any) => {
        this.signUpResponse = response as Response;
        if (this.signUpResponse.responseStatus == 200) {
          this._toastrService.success(this.signUpResponse.responseMessage);
          //pass value to org mapping screen.
          let passing_value = {
            user_name: this.signUpForm.controls['user_name'].value,
            user_code: this.signUpResponse.responseData,
          };
          const navigationExtras: NavigationExtras = {
            state: {
              pass_data: passing_value,
            },
          };
          this.router.navigate(['/org/map/'], navigationExtras);
          this.signUpForm.reset();
        } else {
          this._toastrService.error(this.signUpResponse.responseData);
          console.log(JSON.stringify(this.signUpResponse));
        }
      });
    } else {
      this._toastrService.error('Input form data is not valid.');
    }
  }
}
