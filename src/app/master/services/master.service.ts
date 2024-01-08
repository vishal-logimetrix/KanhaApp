import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, retryWhen, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/Auth/common/model/response';
@Injectable({
  providedIn: 'root'
})
export class MasterService {
  baseUrl = environment.apiUrl;
  constructor(private _http: HttpClient) { }
  StateList() {
    return this._http.get<Response>(this.baseUrl + 'geo/get/state')
    .pipe(
      retryWhen(errors => errors.pipe(
        delay(1000),
        take(3),
        catchError((error)=>{
          console.log('Error occurred:', error);
          return throwError(error)
        })
      ))
    )
  }
  DistrictList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'geo/get/district', model)
    .pipe(
      retryWhen(errors => errors.pipe(
        delay(1000),
        take(3),
        catchError((error)=>{
          console.log('Error occurred:', error);
          return throwError(error);
        })
      ))
    )
  }
  TehsilList(model: any) {
    console.log('_____model_stringify________',JSON.stringify(model));
    return this._http.post<Response>(this.baseUrl + 'geo/get/tehsil', model)
    .pipe(
      retryWhen(errors => errors.pipe(
        delay(1000),
        take(3),
        catchError((error)=>{
          console.log('Error occurred:', error);
          return throwError(error);
        })
      ))
    )
  }
  VillageList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'geo/get/village', model)
    .pipe(
      retryWhen(errors => errors.pipe(
        delay(1000),
        take(3),
        catchError((error)=>{
          console.log('Error occurred:', error);
          return throwError(error);
        })
        ))
    )
  }
  // Dropdowns
  StateDropDown() {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/geo/state',{});
  }
  DistrictDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/geo/district',model);
  }
  TehsilDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/geo/tehsil',model);
  }
  VillageDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/geo/village',model);
  }
  HamletDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/geo/hamlet',model);
  }
  CompanyDropDown() {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/company',{});
  }
  PlantDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/plant',model);
  }
  MCCDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/mcc',model);
  }
  BMCDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/bmc',model);
  }
  RouteDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/route',model);
  }
  MPPDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/mpp',model);
  }
  FarmerDropDown(model: any) {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/farmer',model);
  }
  MilkTypeDropDown() {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/milk/type',{});
  }
  MilkQualityTypeDropDown() {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/milk/quality/type',{});
  }
  MasterProductDropDown() {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/product',{});
  }
  ImportNameDropDown() {
    return this._http.post<Response>(this.baseUrl + 'common/dropdown/import/process',{});
  }
  //company Services region
  CompanyCreate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'company/create', model);
  }
  CompanyList() {
    return this._http.post<Response>(this.baseUrl + 'company/list', {});
  }
  // Plant Services region
  PlantCreate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'plant/create', model);
  }
  PlantList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'plant/list', model);
  }
   //#region MCC Services
   MCCCreate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'mcc/create', model);
  }
  MCCList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'mcc/list', model);
  }
   //#region BMC Services
   BMCCreate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'bmc/create', model);
  }
  BMCList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'bmc/list', model);
  }
    //#region Route Services
   RouteCreate(model: any) {
      return this._http.post<Response>(this.baseUrl + 'route/create', model);
    }
  RouteList(model: any) {
      return this._http.post<Response>(this.baseUrl + 'route/list', model);
    }
  //#region MPP Services
  MPPCreate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'mpp/create', model);
  }
  MPPList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'mpp/list', model);
  }
  //#region VSP Services
    VSPCreate(model: any) {
      return this._http.post<Response>(this.baseUrl + 'sahayak/create', model);
    }
    VSPList(model: any) {
      return this._http.post<Response>(this.baseUrl + 'sahayak/list', model);
    }
  //#region Farmer Services
  FarmerCreate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'farmer/create', model);
  }
  FarmerList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'farmer/list', model);
  }
    //#region Rate Master Services
    RateApplicabilityCreate(model: any) {
      return this._http.post<Response>(this.baseUrl + 'rateone/rate/applicability/create',model);
    }
    RateList(model: any) {
      return this._http.post<Response>(this.baseUrl + 'rateone/rate/list', {});
    }
    RateMasterCreate(model: FormData) {
      return this._http.post<Response>(this.baseUrl + 'rateone/ratechart/import',model);
    }
    GetRateApplicabilityList(model: any) {
      return this._http.post<Response>(this.baseUrl + 'rateone/rate/applicability/list',model);
    }
  //#region Product Master Services
  ProductCreate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'product/create', model);
  }
  ProductList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'product/list', {});
  }
  ProductUpdate(model: any) {
    return this._http.post<Response>(this.baseUrl + 'product/update', model);
  }
    //#region  Import Utility
    ImportMasterFile(model: any) {
      return this.fetchAllPostWithoutContentType(this.baseUrl + 'import/process/file',model);
    }
    public fetchAllPostWithoutContentType(apiUrl: any,params?: HttpParams | any | any[]): Observable<Response> {
      const httpOpts = Object.assign({});
      if (params) {
        httpOpts.params = this.createSearchParams(params);
      }
      let authenticationCheck: any;
      authenticationCheck = this._http.post(apiUrl, params, {
        responseType: 'blob' as 'blob',
      });
      return authenticationCheck;
    }
    private createSearchParams(query: HttpParams | string | any): HttpParams {
      let newParams = new HttpParams();
      if (typeof query === 'string') {
        let searchParams = new HttpParams();
        const splitQuery = query.split('&');
        splitQuery.forEach((param) => {
          const keyValPair = param.split('=');
          searchParams = searchParams.set(keyValPair[0], keyValPair[1]);
        });
        newParams = searchParams;
      } else if (query instanceof HttpParams) {
        newParams = query;
      } else {
        // Parse object into HttpParams
        Object.keys(query).forEach((key) => {
          newParams = newParams.set(key, query[key]);
        });
      }
      return newParams;
    }
}
