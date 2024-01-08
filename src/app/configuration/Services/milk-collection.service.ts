import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/Auth/common//model/response';

@Injectable({
  providedIn: 'root'
})
export class MilkCollectionService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  AddFarmerCollection(model: any) {
    return this.http.post<Response>(this.baseUrl + "farmer/collection/create", model);
  }

  GetFarmerCollectionList(model: any) {
    return this.http.post<Response>(this.baseUrl + "farmer/collection/list", model);
  }

  Getrate(model:any){
    return this.http.post<Response>(this.baseUrl + "farmer/get/collection/rate", model);
  }

  AddMppMilkDispatch(model: any) {
    return this.http.post<Response>(this.baseUrl + "mppdispatch/create", model);
  }

  GetMppMilkDispatchList(model: any) {
    return this.http.post<Response>(this.baseUrl + "mppdispatch/list", model);
  }

  AddBMCCollection(model:any){
    return this.http.post<Response>(this.baseUrl + "bmccollection/create", model);
  }

  GetBMCCollectionList(model: any) {
    return this.http.post<Response>(this.baseUrl + "bmccollection/list", model);
  }

  GetBMCCollectionRate(model:any){
    return this.http.post<Response>(this.baseUrl + "bmccollection/get/bmc/collection/rate", model);
  }
}
