import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from '../../Services/auth.service.service';
import { Injectable } from '@angular/core';

@Injectable() 
export class guardsGuard implements CanActivate {

  constructor(private route: Router, private _authService: AuthServiceService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this._authService.loggedIn()) {
      return true;
    }

    this.route.navigate(['/login']);
    return false;
  }

}
