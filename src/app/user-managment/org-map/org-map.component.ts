import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/Auth/Services/auth.service.service';
import { Response } from 'src/app/Auth/common/model/response';
import { MasterService } from 'src/app/master/services/master.service';
@Component({
  selector: 'app-org-map',
  templateUrl: './org-map.component.html',
  styleUrls: ['./org-map.component.css']
})
export class OrgMapComponent implements OnInit{
  _userData: any = {};
  _searchResponse!: Response;
  _userOrgDetails = [];
  //[{ "company_code": "01", "plant_code": "01001", "mcc_code": "01001", "bmc_code": "01001", "mpp_code": null }, { "company_code": "01", "plant_code": "01001", "mcc_code": "01002", "bmc_code": "01002", "mpp_code": null }, { "company_code": "01", "plant_code": "01001", "mcc_code": "01003", "bmc_code": "01003", "mpp_code": null }, { "company_code": "01", "plant_code": "01001", "mcc_code": "01004", "bmc_code": "01004", "mpp_code": null }, { "company_code": "01", "plant_code": "01001", "mcc_code": "01005", "bmc_code": "01005", "mpp_code": null }, { "company_code": "01", "plant_code": "01001", "mcc_code": "01006", "bmc_code": "01006", "mpp_code": null }];
  _userCompany: any = [];
  companySource: any = [];
  companyTarget: any = [];

  _userPlant: any = [];
  plantSource: any = [];
  plantTarget: any = [];

  _userMcc: any = [];
  mccSource: any = [];
  mccTarget: any = [];

  _userBmc: any = [];
  bmcSource: any = [];
  bmcTarget: any = [];

  _userMpp: any = [];
  mppSource: any = [];
  mppTarget: any = [];
  userCode: any = '';

  key: string = '';
  search_org_map_json :any={};

  constructor(private _router:Router,  private _activeRoute: ActivatedRoute,private _masterService: MasterService,private _toastrService: ToastrService,private _authService: AuthServiceService){
      const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      pass_data: any;
    };
    this._userData = state?.pass_data;
    if(this._userData){
      this.search_org_map_json = { user_code: this._userData.user_code };
    }
    this._authService.GetCurrentOrgMapping(this.search_org_map_json).subscribe(
      (data: any) => {
        this._searchResponse = data as Response;
        let respData = this._searchResponse.responseData;
        if (
          respData != null &&
          respData != undefined &&
          respData.data_list != null &&
          respData.data_list != undefined &&
          respData.data_list.length > 0
        ) {
          this._userOrgDetails = respData;
          this._userCompany = this._userOrgDetails.map(function (value: any) {
            return value.company_code;
          });
          this._userPlant = this._userOrgDetails.map(function (value: any) {
            return value.plant_code;
          });
          this._userMcc = this._userOrgDetails.map(function (value: any) {
            return value.mcc_code;
          });
          this._userBmc = this._userOrgDetails.map(function (value: any) {
            return value.bmc_code;
          });
          this._userMpp = this._userOrgDetails.map(function (value: any) {
            return value.mpp_code;
          });
        }
        // for selected user data
        setTimeout(() => {
          this.setCompanyData();
        }, 300);
      },
      (err) => {
        setTimeout(() => {
          this.setCompanyData();
        }, 300);
        // this.generalService.setException(err, 'user_org_mapping_validation');
      }
    );
  }
  setCompanyData() {
    this._authService.GetOrgMapCompany().subscribe(
      (data: any) => {
        this._searchResponse = data as Response;
        this.companySource = this._searchResponse.responseData;
        // for selected user data
        let userComp = this._userCompany;
        this.companyTarget = this.companySource.filter(function (n: any) {
          return userComp.indexOf(n.company_code) !== -1;
        });
        // for selected user data
        setTimeout(() => {
          this.companyChange(true);
          this._userCompany = [];
        }, 300);
      },
      (err) => {
        // this.generalService.setException(err, 'user_org_mapping_validation');
        // this.alertService.Error(this._searchResponse.responseData);
        this._toastrService.error(this._searchResponse.responseData);
      }
    );
  }
  displayValue(item: any) {
    return item.value;
  }
  displayCompany(item: any) {
    return item.company_name;
  }
  displayPlant(item: any) {
    return item.plant_name;
  }
  displayMcc(item: any) {
    return item.mcc_name;
  }
  displayBmc(item: any) {
    return item.bmc_name;
  }
  displayMpp(item: any) {
    return item.mpp_name;
  }
  ngOnInit() {
    this.key = 'key';
  }
  companyChange(setTarget = false) {
    if (this.companyTarget.length == 0) {
      this.plantSource = [];
      this.plantTarget = [];
      this.mccSource = [];
      this.mccTarget = [];
      this.bmcSource = [];
      this.bmcTarget = [];
      this.mppSource = [];
      this.mppTarget = [];
    } else {
      this._authService.GetOrgMapPlant(this.companyTarget).subscribe(
        (data: any) => {
          this._searchResponse = data as Response;

          this.plantSource = this._searchResponse.responseData;
          // return;

          // for selected user data
          if (setTarget) {
            let userPlant = this._userPlant;
            this.plantTarget = this.plantSource.filter(function (n: any) {
              return userPlant.indexOf(n.plant_code) !== -1;
            });
          }
          // for selected user data
          let selectedCompany = this.companyTarget.map(function (value: any) {
            return value.company_code;
          });
          // this.plantTarget = this.plantTarget.filter(function (n: any) {
          //   return selectedCompany.indexOf(n.company_code) !== -1;
          // });
          // this.plantSource = this.plantSource.filter(function (n: any) {
          //   return selectedCompany.indexOf(n.company_code) !== -1;
          // });
          setTimeout(() => {
            this.plantChange(setTarget);
          }, 300);
          // this.setTargetValues();
        },
        (err) => {
          // this.generalService.setException(err, 'user_org_mapping_validation');
          // this.alertService.Error(this._searchResponse.responseData);
          this._toastrService.error(this._searchResponse.responseData);
        }
      );
    }
  }
  plantChange(setTarget = false) {
    if (this.plantTarget.length == 0) {
      this.mccSource = [];
      this.mccTarget = [];
      this.bmcSource = [];
      this.bmcTarget = [];
      this.mppSource = [];
      this.mppTarget = [];
    } else {
      this._authService.GetOrgMapMcc(this.plantTarget).subscribe(
        (data: any) => {
          this._searchResponse = data as Response;
          this.mccSource = this._searchResponse.responseData;
          // for selected user data
          if (setTarget) {
            let userMcc = this._userMcc;
            this.mccTarget = this.mccSource.filter(function (n: any) {
              return userMcc.indexOf(n.mcc_code) !== -1;
            });
          }
          // for selected user data
          let selectedPlant = this.plantTarget.map(function (value: any) {
            return value.plant_code;
          });
          // this.mccTarget = this.mccTarget.filter(function (n: any) {
          //   return selectedPlant.indexOf(n.plant_code) !== -1;
          // });
          // this.mccSource = this.mccSource.filter(function (n: any) {
          //   return selectedPlant.indexOf(n.plant_code) !== -1;
          // });
          setTimeout(() => {
            this.mccChange(setTarget);
          }, 300);
          // this.mccChange();
          // this.setTargetValues();
        },
        (err) => {
          // this.generalService.setException(err, 'user_org_mapping_validation');
          // this.alertService.Error(this._searchResponse.responseData);
          this._toastrService.error(this._searchResponse.responseData);
        }
      );
    }
  }
  mccChange(setTarget = false) {
    if (this.mccTarget.length == 0) {
      this.bmcSource = [];
      this.bmcTarget = [];
      this.mppSource = [];
      this.mppTarget = [];
    } else {
      this._authService.GetOrgMapBmc(this.mccTarget).subscribe(
        (data: any) => {
          this._searchResponse = data as Response;
          this.bmcSource = this._searchResponse.responseData;
          // for selected user data
          if (setTarget) {
            let userBmc = this._userBmc;
            this.bmcTarget = this.bmcSource.filter(function (n: any) {
              return userBmc.indexOf(n.bmc_code) !== -1;
            });
          }
          // for selected user data
          let selectedMcc = this.mccTarget.map(function (value: any) {
            return value.mcc_code;
          });
          // this.bmcTarget = this.bmcTarget.filter(function (n: any) {
          //   return selectedMcc.indexOf(n.mcc_code) !== -1;
          // });
          // this.bmcSource = this.bmcSource.filter(function (n: any) {
          //   return selectedMcc.indexOf(n.mcc_code) !== -1;
          // });
          setTimeout(() => {
            this.bmcChange(setTarget);
          }, 300);
          // this.bmcChange();
          // this.setTargetValues();
        },
        (err) => {
          // this.generalService.setException(err, 'user_org_mapping_validation');
          // this.alertService.Error(this._searchResponse.responseData);
          this._toastrService.error(this._searchResponse.responseData);
        }
      );
    }
  }
  bmcChange(setTarget = false) {
    if (this.bmcTarget.length == 0) {
      this.mppSource = [];
      this.mppTarget = [];
    } else {
      this._authService.GetOrgMapMpp(this.bmcTarget).subscribe(
        (data: any) => {
          this._searchResponse = data as Response;
          this.mppSource = this._searchResponse.responseData;
          // for selected user data
          if (setTarget) {
            let userMpp = this._userMpp;
            this.mppTarget = this.mppSource.filter(function (n: any) {
              return userMpp.indexOf(n.mpp_code) !== -1;
            });
          }
          // for selected user data
          let selectedBmc = this.bmcTarget.map(function (value: any) {
            return value.bmc_code;
          });
          // this.mppTarget = this.mppTarget.filter(function (n : any) {
          //   return selectedBmc.indexOf(n.bmc_code) !== -1;
          // });
          // this.mppSource = this.mppSource.filter(function (n : any) {
          //   return selectedBmc.indexOf(n.bmc_code) !== -1;
          // });
          // this.setTargetValues();
        },
        (err) => {
          // this.generalService.setException(err, 'user_org_mapping_validation');
          // this.alertService.Error(this._searchResponse.responseData);
          this._toastrService.error(this._searchResponse.responseData);
        }
      );
    }
  }
  setTargetValues() {
    let selectedCompany = this.companyTarget.map(function (value: any) {
      return value.company_code;
    });
    this.plantTarget = this.plantTarget.filter(function (n: any) {
      return selectedCompany.indexOf(n.company_code) !== -1;
    });
    this.plantSource = this.plantSource.filter(function (n: any) {
      return selectedCompany.indexOf(n.company_code) !== -1;
    });

    let selectedPlant = this.plantTarget.map(function (value: any) {
      return value.plant_code;
    });
    this.mccTarget = this.mccTarget.filter(function (n: any) {
      return selectedPlant.indexOf(n.plant_code) !== -1;
    });
    this.mccSource = this.mccSource.filter(function (n: any) {
      return selectedPlant.indexOf(n.plant_code) !== -1;
    });

    let selectedMcc = this.mccTarget.map(function (value: any) {
      return value.mcc_code;
    });

    this.bmcTarget = this.bmcTarget.filter(function (n: any) {
      return selectedMcc.indexOf(n.mcc_code) !== -1;
    });
    this.bmcSource = this.bmcSource.filter(function (n: any) {
      return selectedMcc.indexOf(n.mcc_code) !== -1;
    });

    let selectedBmc = this.bmcTarget.map(function (value: any) {
      return value.bmc_code;
    });
    this.mppTarget = this.mppTarget.filter(function (n: any) {
      return selectedBmc.indexOf(n.bmc_code) !== -1;
    });
    this.mppSource = this.mppSource.filter(function (n: any) {
      return selectedBmc.indexOf(n.bmc_code) !== -1;
    });
  }
  orgMap() {
    let postOrgMap = [];
    let postOrgType = '';
    if (this.mppTarget.length > 0) {
      postOrgMap = Object.assign([], this.mppTarget);
      postOrgType = 'MPP';
    } else if (this.bmcTarget.length > 0) {
      postOrgMap = Object.assign([], this.bmcTarget);
      postOrgType = 'BMC';
    } else if (this.mccTarget.length > 0) {
      postOrgMap = Object.assign([], this.mccTarget);
      postOrgType = 'MCC';
    } else if (this.plantTarget.length > 0) {
      postOrgMap = Object.assign([], this.plantTarget);
      postOrgType = 'Plant';
    } else if (this.companyTarget.length > 0) {
      postOrgMap = Object.assign([], this.companyTarget);
      postOrgType = 'Company';
    }
    if (postOrgMap.length == 0) {
      // this.alertService.error(
      //   this.messageProperty.transform('select_atleast_one_organization'),
      //   false,
      //   'user_organization_mapping'
      // );
      // this.alertService.Error('Select atleast one organization');
    } else {
      let saveOrgMap: any = [];
      postOrgMap.forEach((element: any) => {
        // element['org_type'] = postOrgType;
        if(this._userData){
          element['user_code'] = this._userData.user_code;
        }else{
          element['user_code'] ="0";
        }
        saveOrgMap.push(element);
      });
      var uniqueOrg = saveOrgMap
        .map((ar: any) => JSON.stringify(ar))
        .filter((itm: any, idx: any, arr: any) => arr.indexOf(itm) === idx)
        .map((str: any) => JSON.parse(str));
      // console.log('Save data :' + JSON.stringify(uniqueOrg));
      // return;
      this._authService.SaveOrgMap(uniqueOrg).subscribe((data: any) => {
        //   this.generalService.setServerSideValidation(data);
        //   if (data.message.toLowerCase() == 'success') {
        //     this.router.navigate(['/user']);
        //   }
        // },
        // (err) => {
        //   this.generalService.setException(err, 'user_org_mapping_validation');
        // }
        this._searchResponse = data as Response;
        if (this._searchResponse.responseStatus == 200) {
          // this.alertService.Success(this._searchResponse.responseMessage);
          this._toastrService.error(this._searchResponse.responseMessage);
          this._router.navigate(['/user/list']);
        } else {
          // this.alertService.Error(this._searchResponse.responseData);
          this._toastrService.error(this._searchResponse.responseData);
        }
      });
    }
  }
}
