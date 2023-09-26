import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { Customer } from 'app/models/customer';
import { Observable } from "rxjs";
import { CustomerFilter } from 'app/models/customer-filter';
import { SharedService } from './shared.service';
import { Feedback } from 'app/models/feedback';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }
  
  getMetaData() {
    let url = 'api/Workshop/GetWorkshopMetaData';
    return this._customHttp.get(url);
  }

  saveCustomer( customerObj: Customer): Observable<any> {
    var url = 'api/Customer/SaveCustomer';
    return this._customHttp.post(url, {customer: customerObj, VehicleID: this._sharedService.jobObj.jcVehicleObj.VehicleID});  
  }

  updateCustomer(customerObj: Customer): Observable<any>{
    var url ='api/Customer/UpdateCustomer';
    return this._customHttp.put(url, customerObj);
  }

  getAllCustomers(filter: CustomerFilter){
    var url = 'api/Customer/GetAllCustomers';
    return this._customHttp.post(url,filter);
  }

  getCustomer(id: number){
    var url = 'api/Customer/GetSingleCustomer';
    return this._customHttp.get(url,{customerID: id});
  }

  deleteCustomer(id: number){
    var url = 'api/Customer/DeleteCustomer';
    return this._customHttp.delete(url,{ customerID: id, modifiedBy: this._sharedService.logged_user_id});
  }

  getFeedback(customerID: number, jobCardID: number){
    var url = 'api/Customer/GetCustomerFeedback';
    return this._customHttp.get(url,{ customerID: customerID, jobCardID: jobCardID})
  }

  updateFeedback(customerFeedback: Array<Feedback>){
    var url = 'api/Customer/UpdateCustomerFeedback'; 
    return this._customHttp.put(url, {CustomerFeedback: customerFeedback, modifiedBy: this._sharedService.logged_user_id})
  }

  searchCustomer(searchQuery: string) {
    let url = 'api/Customer/searchCustomer';
    return this._customHttp.getWithoutLoader(url, { searchQuery: searchQuery})
  }


}
