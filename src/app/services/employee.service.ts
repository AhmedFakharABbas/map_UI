import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'app/models/employee';
import { CustomHttpService } from './custom-http.service';
import { EmployeeFilter } from 'app/models/employee-filter';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }

  saveEmployee(employeeObj: Employee): Observable<any> {
    var url = 'api/Account/Register';
    return this._customHttp.post(url, employeeObj);
  }

  getMetaData(id: number) {
    let url = 'api/Employee/EmployeeMetaData';
    return this._customHttp.get(url, { userID: id });
  }

  getAllEmployeesData(filter: EmployeeFilter) {
    let url = 'api/Employee/GetAllEmployees';
    return this._customHttp.post(url, filter);
  }

  getSingleEmployee(UserID: number) {
    let url = 'api/Employee/GetSingleEmployee';
    return this._customHttp.get(url, { userID: UserID });
  }

  getEmployeeProfile(UserID: number) {
    let url = 'api/Employee/GetEmployeeProfile';
    return this._customHttp.get(url, { userID: UserID });
  }

  updateEmployee(employeeObj: Employee): Observable<any> {
    let url = 'api/Employee/UpdateEmployee';
    return this._customHttp.put(url, employeeObj)
  }

  deleteEmployee(UserID: number) {
    let url = 'api/Employee/DeleteEmployee';
    return this._customHttp.delete(url, { userID: UserID, modifiedBy: this._sharedService.logged_user_id })
  }

  changeEmployeeStatus(UserID: number) { 
    let url = 'api/Employee/ChangeEmployeeStatus';
    return this._customHttp.get(url, { userID: UserID, LoginUserID: this._sharedService.logged_user_id });
  }

  resetEmployeePassword(Email: string, Password: string, ConfirmPassword: string) {
    let url = 'api/Account/ResetEmployeePassword';
    return this._customHttp.post(url, { Email: Email, Password: Password, ConfirmPassword: ConfirmPassword });
  }
}
