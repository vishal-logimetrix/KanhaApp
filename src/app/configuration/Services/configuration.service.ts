import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/Auth/common/model/response';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  //#region Milk Type Services

  MilkTypeCreate(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'configuration/milk/type/create',
      model
    ); 
  }

  MilkTypList() {
    return this.http.post<Response>(
      this.baseUrl + 'configuration/milk/type/list',
      {}
    );
  }
  //#region Milk Quality Type Services

  MilkQualityTypeCreate(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'configuration/milkquality/type/create',
      model
    );
  }

  MilkQualityTypeList() {
    return this.http.post<Response>(
      this.baseUrl + 'configuration/milkquality/type/list',{});  //   /api/v1.0/configuration/milkquality/type/list
      }
  //#region DEvice master Services

  DeviceMasterCreate(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'devicemaster/create',
      model
    );
  }

  DeviceMasterList(model: any) {
    return this.http.post<Response>(this.baseUrl + 'devicemaster/list', model);
  }

  DeviceMasterUpdate(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'devicemaster/update',
      model
    );
  }

  DeviceDeRegister(model: any) {
    return this.http.get<Response>(
      this.baseUrl +
        'DeviceMaster/deregister/device?device_code=' +
        model.device_code
    );
  }

  //#endregion

  // configuration/common/master/create

  //#region DEvice master Services

  CommonMasterCreate(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'configuration/common/master/create',
      model
    );
  }

  CommonMasterList(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'configuration/common/master/list',
      model
    );
  }

  CommonMasterValueDropDown(model: any) {
    return this.http.post<Response>(
      this.baseUrl + 'common/dropdown/common/master/value',
      model
    );
  }

  CommonMasterKeyDropDown() {
    return this.http.post<Response>(
      this.baseUrl + 'common/dropdown/common/master/key',
      {}
    );
  }

  //#endregion
}
