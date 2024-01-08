import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/Auth/common//model/response';
import { Observable, catchError, delay, retryWhen, take, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService implements OnInit{
  baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}
  ngOnInit(): void {
  }

  GetTotalFarmers(model: any): Observable<Response> {
    return this._http.post<Response>(this.baseUrl + 'dashboard/get/total/active/farmers', model)
      .pipe(
        retryWhen(errors => errors.pipe(
          delay(1000), // Adjust the delay as needed (e.g., 1000ms = 1 second)
          take(3),     // Number of retries (adjust as needed)
          catchError((error) => {
            console.log('Error occurred:', error);
            return throwError(error);
          })
        ))
      );
  }
  GetTodayTotalProductSale(model: any) {
    return this._http.post<Response>(this.baseUrl + 'dashboard/get/total/product/sale',model)
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

  GetTodayTotalPouringFarmer(model: any) {
    return this._http.post<Response>(
      this.baseUrl + 'dashboard/get/total/pouring/farmers',model)
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

 
  GetTotalActiveMPP(model: any) {
    return this._http.post<Response>(this.baseUrl + 'dashboard/get/total/active/mpp',model)
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

  
}
