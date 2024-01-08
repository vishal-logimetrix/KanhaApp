import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService implements OnInit{

  baseUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService();
  decodateToken: any;
  constructor(private _http: HttpClient, private _route: Router) { }

  ngOnInit(): void {

  }
  login(model: any) {
    return this._http.post<Response>(this.baseUrl + 'auth/login', model);
  }
  loggedIn(): any{
    const auth_token = localStorage.getItem('auth_token')
    return !this.jwtHelper.isTokenExpired(auth_token as string | null);
  }
  signup(model: any) {
    return this._http.post<Response>(this.baseUrl + 'users/create', model);
  }

  getAuthToken() {
    const auth_token = localStorage.getItem('auth_token');
    return auth_token;
  }

  getUserList(model: any) {
    return this._http.post<Response>(this.baseUrl + 'users/list', model);
  }

  getRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken;
  }

  GetAccessTokenFromRefreshToken(refreshToken: any) {
    return this._http.post<Response>(this.baseUrl + 'auth/access/token', {
      refresh_token: refreshToken,
    });
  }

  ChangePassword(model: any) {
    return this._http.post<Response>(
      this.baseUrl + 'auth/change/password',
      model
    );
  }

  ForgetPassword(model: any) {
    return this._http.post<Response>(
      this.baseUrl + 'auth/forget/password',
      model
    );
  }

  //#region organization mapping services Start

  GetCurrentOrgMapping(model: any) {
    return this._http.post<Response>(this.baseUrl + 'users/org/map/list', model);
  }

  GetOrgMapCompany() {
    return this._http.get<Response>(this.baseUrl + 'users/org/map/company');
  }

  GetOrgMapPlant(model: any) {
    let jsonModel = {
      data: model,
    };

    return this._http.post<Response>(
      this.baseUrl + 'users/org/map/plant',
      jsonModel
    );
  }

  GetOrgMapMcc(model: any) {
    let jsonModel = {
      data: model,
    };
    return this._http.post<Response>(
      this.baseUrl + 'users/org/map/mcc',
      jsonModel
    );
  }

  GetOrgMapBmc(model: any) {
    let jsonModel = {
      data: model,
    };
    return this._http.post<Response>(
      this.baseUrl + 'users/org/map/bmc',
      jsonModel
    );
  }

  GetOrgMapMpp(model: any) {
    let jsonModel = {
      data: model,
    };
    return this._http.post<Response>(
      this.baseUrl + 'users/org/map/mpp',
      jsonModel
    );
  }

  SaveOrgMap(model: any) {
    let jsonModel = {
      data: model,
    };
    return this._http.post<Response>(
      this.baseUrl + 'users/org/map/save',
      jsonModel
    );
  }
}
