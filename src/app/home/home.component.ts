import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthServiceService } from '../Auth/Services/auth.service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

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
isSidebarCollapsed: boolean = false;
jwtHelperService = new JwtHelperService();
  showMilkCollection: boolean= false;
  showManual:boolean = false;
  showAutoCollection: boolean  = false;
  showModification: boolean = false;
  showImport:boolean = false;
  showExport: boolean = false;
  showDPUReport: boolean = false;
  showMemberCollection: boolean = false;
  showBMC: boolean = false;
  showRouteWise: boolean = false;
  showHistoryReport: boolean = false;
  constructor(private renderer: Renderer2, private elementRef: ElementRef, public _authService: AuthServiceService, private _router: Router, private _toastrService: ToastrService){}
  ngOnInit(): void {
    const auth_token = localStorage.getItem('auth_token');
    if (auth_token) {
      this._authService.decodateToken =
        this.jwtHelperService.decodeToken(auth_token);
        // console.log('_________________decode_____________',this.jwtHelperService.decodeToken(auth_token));
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('server_date_time');
      this._router.navigate(['/login']);
    }
    const localData = localStorage.getItem('auth_token');
  }
  logout(){
    localStorage.removeItem('auth_token');
    this._router.navigate(['/login']);
    this._toastrService.success("LogOut..!")
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  toggleMaster() {
    this.showMaster = !this.showMaster;
  }
  toggleTransaction(){
    this.showTransaction = !this.showTransaction;
  }
  toggleAutoCollection(){
    this.showAutoCollection=!this.showAutoCollection;
  }
  toggleModification(){
    this.showModification=!this.showModification;
  }
  toggleImport(){
    this.showImport=!this.showImport;
  }
  toggleExport(){
    this.showExport=!this.showExport;
  }
  toggleManual(){
    this.showManual = !this.showManual;
  }
  toggleMilkCollection() {
    this.showMilkCollection = !this.showMilkCollection;
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
  toggleCDA(){
    this.showDPUReport=!this.showDPUReport;
  }
  toggleMemberCollection(){
    this.showMemberCollection=!this.showMemberCollection;
  }
  toggleBMC(){
    this.showBMC=!this.showBMC;
  }
  toggleRouteWise(){
    this.showRouteWise=!this.showRouteWise;
  }
  toggleHistory(){
    this.showHistoryReport=!this.showHistoryReport;
  }
}
