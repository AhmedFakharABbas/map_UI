import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CustomHttpService {
  public baseUrl = environment.API_URL;

  public pendingRequests: number = 0;
  public httpOptions;


  constructor(private _http: HttpClient,
    private _route: Router,
    public _sharedService: SharedService,
    private _router: Router) { }

  
    get(url: string, data?: any): Observable<any[]> {
    
    this.pendingRequests++;
    this._sharedService.loading = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token"),
      }),
      params: data
    };
    return this._http.get(this.baseUrl + url, this.httpOptions)
      .map((response: any) => {
        
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        }
    
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
        }
        this._sharedService.loading = false;
        if (e.status === 401) {
          this.signout();
        }
        return throwError(e.error);
      });
  }

  getWithoutLoader(url: string, data?: any): Observable<any[]> { 
    this.pendingRequests++; 
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token"),
      }),
      params: data
    };
    return this._http.get(this.baseUrl + url, this.httpOptions)
      .map((response: any) => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) { 
          this._sharedService.loading = false;
        }
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        } 
        if (e.status === 401) {
          this.signout();
        }
        return throwError(e.error);
      });
  }

  delete(url: string, data?: any): Observable<any[]> {
    this.pendingRequests++;
    this._sharedService.loading = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token"),
      }),
      params: data
    };
    return this._http.delete(this.baseUrl + url, this.httpOptions)
      .map((response: any) => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        }
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        this._sharedService.loading = false;
        if (this.pendingRequests == 0) {
        }
        if (e.status === 401) {

          this.signout();
        }
        return throwError(e.error);
      });
  }

  getWithoutHeader(url: string, data?: any): Observable<any[]> {
    this.pendingRequests++;
    this._sharedService.loading = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token"),
      })
    };
    return this._http.get(this.baseUrl + url, this.httpOptions)
      .map((response: any) => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        }
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        this._sharedService.loading = false;
        if (this.pendingRequests == 0) {
        }

        if (e.status === 401) {

          this.signout();
        }
        return throwError(e.error);
      });
  }

  // getAutoScoreReport(url: string, data: any): Observable<any[]> {
  //   this.pendingRequests++;
  //   this._sharedService.loading = true;
  //   this.httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //     params: data
  //   };
  //   return this._http.get(environment.AUTO_SCORE_URL + url, this.httpOptions)
  //     .map((response: any) => {
  //       this.pendingRequests--;
  //       if (this.pendingRequests == 0) {
  //         this._sharedService.loading = false;
  //       }
  //       return response;
  //     })
  //     .catch(e => {
  //       this.pendingRequests--;
  //       this._sharedService.loading = false;
  //       if (this.pendingRequests == 0) {
  //       }
  //       if (e.status === 401) {

  //         this.signout();
  //       }
  //       return throwError(e.error);
  //     });
  // }

  postWithoutHeader(url: string, data: any): Observable<any[]> {
    this.pendingRequests++;
    this._sharedService.loading = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post(this.baseUrl + url, data, this.httpOptions)
      .map((response: any) => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        }
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        this._sharedService.loading = false;
        if (this.pendingRequests == 0) {
        }
        if (e.status === 401) {

          this.signout();
        }
        // return Observable.throw(e);
        return throwError(e.error);
      });
  }

  post(url: string, data: any): Observable<any[]> {
    
    this.pendingRequests++;
    this._sharedService.loading = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token"),
      })
    };
    return this._http.post(this.baseUrl + url, data, this.httpOptions)
      .map((response: any) => {
        
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        }
    
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        this._sharedService.loading = false;
        if (this.pendingRequests == 0) {
        }
        if (e.status === 401) {

          this.signout();
        }
        return throwError(e.error);
      });
  }
  postWithoutLoader(url: string, data: any): Observable<any[]> {
    this.pendingRequests++;
    this._sharedService.showUploadPercentage = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token"),
      })
    };
    return this._http.post(this.baseUrl + url, data, this.httpOptions)
      .map((response: any) => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.showUploadPercentage = false;
        }
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        this._sharedService.showUploadPercentage = false;
        if (this.pendingRequests == 0) {
        }
        if (e.status === 401) {

          this.signout();
        }
        return throwError(e.error);
      });
  }

  put(url: string, data: any): Observable<any[]> {
    this.pendingRequests++;
    this._sharedService.loading = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("token"),
      })
    };
    return this._http.put(this.baseUrl + url, data, this.httpOptions)
      .map((response: any) => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        }
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        this._sharedService.loading = false;
        if (this.pendingRequests == 0) {
        }
        if (e.status === 401) {

          this.signout();
        }
        return throwError(e.error);
      });
  }
 
  resetPassword(url: string, data: any): Observable<any[]> {
    this.pendingRequests++;
    this._sharedService.loading = true;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("ResetToken"),
      })
    };
    return this._http.post(this.baseUrl + url, data, this.httpOptions)
      .map((response: any) => {
        this.pendingRequests--;
        if (this.pendingRequests == 0) {
          this._sharedService.loading = false;
        }
        return response;
      })
      .catch(e => {
        this.pendingRequests--;
        this._sharedService.loading = false;
        if (this.pendingRequests == 0) {
        }
        if (e.status === 401) {

          this.signout();
        }
        return throwError(e.error);
      });
  }

  signout() {
    // localStorage.removeItem("UserInfo");
    // this._route.navigate(['/']);
    // window.location.reload();

    localStorage.clear();
    // this._sharedService.is_logged_in = false;
    this._sharedService.logged_user_role_id = undefined;
    this._sharedService.logged_user_id = undefined;
    // this._sharedService.user_profile_image = undefined;
    // this._sharedService.user_profile_name = undefined;
    // this._sharedService.logged_user_account_id = undefined;
    // this._sharedService.token = undefined; 
    this._sharedService.token = undefined;
    this._sharedService.user = undefined;
    this._sharedService.logged_user_id = undefined;
    this._sharedService.logged_user_role = undefined;
    this._sharedService.logged_user_role_id = undefined;
    this._sharedService.currentWorkshopID = undefined;
    this._sharedService.currentWorkshopName = undefined;
    this._sharedService.EmployeeID = undefined;

    this._router.navigate(['/auth/login'])
  }
}

