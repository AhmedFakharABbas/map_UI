import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { VendorModel } from 'app/models/vendor';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { VendorFilter } from 'app/models/vendor-filter';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }
  
  getMetaData() {
    let url = 'api/PartsVendor/GetVendorMetaData'; 
    return this._customHttp.get(url)
  }

  saveVendor(vendorObj:VendorModel): Observable<any>{
    var url = 'api/PartsVendor/SavePartsVendor';
    return this._customHttp.post(url,vendorObj);
  }

  getSingleVendor(id: number){
    var url='api/PartsVendor/GetSinglePartsVendor';
    return this._customHttp.get(url,{vendorId: id})
  }

  getAllVendors(filter: VendorFilter){
    var url = 'api/PartsVendor/GetAllPartsVendor';
    return this._customHttp.post(url, filter)
  }

  updateVendor(vendorObj: VendorModel): Observable<any>{
    var url = 'api/PartsVendor/UpdatePartsVendor';
    return this._customHttp.put(url, vendorObj)
  }

  deleteVendor(id: number){
    var url = 'api/PartsVendor/DeletePartsVendor';
    return this._customHttp.delete(url,{vendorID: id, modifiedBy: this._sharedService.logged_user_id})
  }

}
