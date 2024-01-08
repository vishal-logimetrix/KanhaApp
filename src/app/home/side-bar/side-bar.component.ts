import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
showMaster: boolean = false;
showTransaction: boolean = false;
showBillRate: boolean = false;
showReports: boolean = false;
showUtility: boolean = false;
showSettings: boolean = false;
showState: boolean = false;
showCompany: boolean = false;
showMilkRate: boolean = false;
showCollection: boolean = false;
showDispatch: boolean = false;
showUser: boolean = false;
showFarmerCollection: boolean = false;
  constructor(){}
  ngOnInit(): void {
  }
  
  toggleMaster() {
    this.showMaster = !this.showMaster;
  }

  toggleTransaction() {
    this.showTransaction = !this.showTransaction;
  }
  toggleBillRate(){
    this.showBillRate = !this.showBillRate;
  }
  toggleReport(){
    this.showReports = !this.showReports;
  }
  toggleUtility(){
    this.showUtility=!this.showUtility;
  }
  toggleSettings(){
    this.showSettings=!this.showSettings;
  }
  toggleGeo(){
  this.showState = !this.showState;
  }
 toggleCompany(){
  this.showCompany = !this.showCompany;
 }
 toggleMilkRate(){
  this.showMilkRate=!this.showMilkRate;
 }
 toggleCollection(){
  this.showCollection=!this.showCollection;
 }
 toggleDispatch(){
  this.showDispatch=!this.showDispatch;
 }
 toggleUser(){
  this.showUser=!this.showUser;
 }
 toggleFarmer(){
  this.showFarmerCollection=!this.showFarmerCollection;
 }
  setActiveTab(tabName: string) {
    // this.activeTab = tabName;
  }


}
