import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from 'app/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private _router: Router, public _sharedService: SharedService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this._sharedService.isUserLogin()) {
      return true;
    } else { 
      if(this._sharedService.logged_user_role_id == 5 || this._sharedService.logged_user_role_id == 6 || this._sharedService.logged_user_role_id == 7 || this._sharedService.logged_user_role_id == 8 || this._sharedService.logged_user_role_id == 9){
        this._router.navigate(['/job/job-list']);
      }
      else if (this._sharedService.logged_user_role_id == 10){
        this._router.navigate(['/invoice/list']);
      }
      else{
          this._router.navigate(['/job/list']);
      }
      return false;
    }
  }

}
