import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/Auth/common/model/response';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //#region CDA Reports                               change the url after API create for CDA report.

  // CDASubReport(model: any) {
  //   return this.http.post<Response>(this.baseUrl + "report/farmercollection/shiftreport", model);
  // }

  //#region Farmer Collection Reports

  FarmerShiftReport(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'report/farmercollection/shiftreport',
      model
    );
  }

  FarmerCollectionSummeryReport(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'report/farmercollection/summery',
      model
    );
  }

  // -------------------------------------------------------- ADD CDA Report Link
  CDAReport(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'report/farmercollection/cda',
      model
    );
  }

  FarmerPassbook(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'report/farmercollection/passbook',
      model
    );
  }

  //#endregion

  //#region MPP Dispatch Reports

  MPPDispatchSummeryDateWise(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'report/mppdispatch/summery/datewise',
      model
    );
  }


  //#region Master Data Report

  FarmerMasterReport(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'report/master/farmer/report',
      model
    );
  }

  // ----------------------------------------------------------------------- change the URL 
ActualComposeReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
collectionComposeReport(model:any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
signatureReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
MemberAutoManualReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
MPPLedgerReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  CollectionSummaryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  dockCheckListReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  labCheckListReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  sampleWiseCheckListReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  zeroLrCheckListReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  dailyMilkSummaryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  sampleWiseRateCheckListReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  canMISReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  collectionLedgerReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  FarmerHistoryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  dispatchHistoryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  transferHistoryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  dockHistoryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
  // ----------------------------------------------------------------------- change the URL 
  labHistoryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}
dpuStatusHistoryReport(model: any){
  return this.http.post<Response>(
    this.baseUrl + 'report/master/farmer/report',
    model
  );
}

}
