import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { Employee } from 'app/models/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

  constructor(private _customHttp: CustomHttpService) { }


  login(employeeObj: Employee): Observable<any> {
    var url = 'token';
    const body = 'UserName=' + employeeObj.Email + '&Password=' + employeeObj.Password + '&grant_type=password';
    return this._customHttp.postWithoutHeader(url, body);
  }

  forgotPassword(model: Employee): Observable<any> {
    var url = "api/Account/ForgotPassword";
    return this._customHttp.post(url,model)
  }

  resetPassword(model: Employee): Observable<any> {
    var url = "api/Account/ResetPassword";
    return this._customHttp.post(url, model)
  }

}
