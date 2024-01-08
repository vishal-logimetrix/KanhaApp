import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/Auth/common/model/response';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  CreateProductSaleForMember(model: any) {
    return this.http.post<Response>(this.baseUrl + "productsales/create", model);
  }

  ListProductSaleForMember(model: any) {
    return this.http.post<Response>(this.baseUrl + "productsales/list", model);
  }
}
