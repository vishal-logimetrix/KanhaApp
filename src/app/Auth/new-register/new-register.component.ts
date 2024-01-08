import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-new-register',
  templateUrl: './new-register.component.html',
  styleUrls: ['./new-register.component.css']
})
export class NewRegisterComponent implements OnInit {
  mobile!: string;
  constructor(private bsModalRef: BsModalRef){}
  ngOnInit(): void {
  }

  mobileNumber(){
    console.log('mobile number is : ',);
    if (this.mobile!=undefined) {
      console.log(this.mobile);
      
    }
    this.bsModalRef.hide()
    
  }
  onClose() {
    this.bsModalRef.hide();
  }
  
}
