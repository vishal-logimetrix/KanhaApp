import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Response } from 'src/app/Auth/common//model/response';
import { DashboardServiceService } from '../../services/dashboard-service.service';
@Component({
  selector: 'app-mppdashboard',
  templateUrl: './mppdashboard.component.html',
  styleUrls: ['./mppdashboard.component.css']
})
export class MPPDashboardComponent implements OnInit{

  closeResult: string = '';
  isModalShown: boolean = false;
  public searchForm!: FormGroup;
  datePickerConfig!: Partial<BsDatepickerConfig>;
  @ViewChild('autoShownModal', { static: false })
  autoShownModal?: ModalDirective;
  searchResponse!: Response;
  totalFarmersDashboard!: any;
  todayLocalSale!: any;
  totalPouringFarmerAndQty!: any;
  totalPouringMPPAndMPP!: any;
  model: any = {};
  isLoading: boolean = true;
  selected!: Date | null;
  constructor(private _dashboardService: DashboardServiceService,private modalService: BsModalService){
    this.searchForm = new FormGroup({
      from_date: new FormControl(new Date(), Validators.required),
      from_shift: new FormControl('1', Validators.required),
      to_date: new FormControl(new Date(), Validators.required),
      to_shift: new FormControl('2', Validators.required),
    });
    this.datePickerConfig = {
      containerClass: 'theme-blue',
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      isAnimated: true,
      showTodayButton: true,
    };
  }
  ngOnInit(): void {
    this.TotalFarmers();
    this.TotalLocalSaleAmount();
    this.TotalPouringFarmerAndQty();
    this.TotalPouringMPPAndMPP();
  }
  TotalFarmers(){
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this._dashboardService.GetTotalFarmers(this.model).subscribe((res:any)=>{
        if (res!==null) {
          this.searchResponse = res as Response;
          if (this.searchResponse.responseStatus === 200) {
            this.totalFarmersDashboard = this.searchResponse.responseData[0];
            console.log('_____total_farmer______', this.todayLocalSale);
          }else{
            // this._alertService.Error(this.searchResponse.responseData);
          }
        }
      })
    }
  }
  TotalLocalSaleAmount(){
    if (this.searchForm.valid) {
      this.model = Object.assign({}, this.searchForm.value);
      this._dashboardService.GetTodayTotalProductSale(this.model).subscribe((res:any)=>{
        if (res!==null) {
          this.searchResponse = res as Response;
          if (this.searchResponse.responseStatus===200) {
            this.todayLocalSale = this.searchResponse.responseData[0];
            console.log('_____total_sale______', this.todayLocalSale); 
          }else{
            // error msg
          }
        }
      })
    }
  }
  TotalPouringFarmerAndQty(){
   if (this.searchForm.valid) {
    this.model = Object.assign({}, this.searchForm.value);
    this._dashboardService.GetTodayTotalPouringFarmer(this.model).subscribe((res:any)=>{
      if (res!==null) {
        this.searchResponse = res as Response;
        if (this.searchResponse.responseStatus===200) {
          this.totalPouringFarmerAndQty = this.searchResponse.responseData[0];
          console.log('_______total_pouring_Farmer___________', this.totalPouringFarmerAndQty);
        }else{
          // print error msg
        }
      }
    })
   }
  }
  TotalPouringMPPAndMPP(){
   if (this.searchForm.valid) {
    this.model = Object.assign({}, this.searchForm.value);
    this._dashboardService.GetTotalActiveMPP(this.model).subscribe((res:any)=>{
      if (res!==null) {
        this.searchResponse = res as Response;
        if (this.searchResponse.responseStatus===200) {
          this.totalPouringMPPAndMPP = this.searchResponse.responseData[0];
          console.log('_______total_MPP___________', this.totalPouringMPPAndMPP);
        }
      }
    })
   }
  }
  showModal():void{
    this.isModalShown = true;
  }
  hideModal(): void{
    this.autoShownModal?.hide();
  }
  onHidden(){
    this.isModalShown = false;
  }
  DashboardUpdate(){

  }
}
