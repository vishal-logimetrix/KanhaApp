import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Response } from 'src/app/Auth/common/model/response';
import { AuthServiceService } from '../../Services/auth.service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {


  jwtHelper = new JwtHelperService();
  newTokenResponse!: Response;
  
  constructor(private _authService: AuthServiceService, private _http: HttpClient, private _route: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      // add auth header with jwt if account is logged in and request is to the api url
      let token = this._authService.getAuthToken();
      let refreshToken = this._authService.getRefreshToken();

      let newAccessToken="";
      let newRefreshToken="";


      const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (token && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        return next.handle(request);
  }
}
