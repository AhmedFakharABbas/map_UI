import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpService } from './custom-http.service';
import { ServiceCenter } from 'app/models/service-center';
import { SharedService } from './shared.service';
import { ServiceCenterFilter } from 'app/models/service-center-filter';
import { SaveWorkingHours } from 'app/models/save-working-hours';
import { WorkshopSetting } from 'app/models/workshop-setting';

@Injectable({
  providedIn: 'root'
})
export class ServiceCenterService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }

  saveServiceCenter(serviceCenterObj: ServiceCenter): Observable<any> {
    var url = "api/Account/RegisterWorkshop";
    return this._customHttp.post(url, serviceCenterObj);
  }

  getMetaData() {
    let url = 'api/Workshop/GetWorkshopMetaData';
    return this._customHttp.get(url);
  }

  getAllServiceCenters(filter: ServiceCenterFilter) {
    let url = 'api/Workshop/GetAllWorkshops';
    return this._customHttp.post(url, filter);
  }

  getSingleServiceCenter(WorkshopID: number) {
    let url = 'api/Workshop/GetSingleWorkshop';
    return this._customHttp.get(url, { workshopID: WorkshopID });
  }

  updateServiceCenter(serviceCenterObj: ServiceCenter): Observable<any> {
    let url = 'api/Workshop/UpdateWorkshop';
    return this._customHttp.put(url, serviceCenterObj)
  }

  deleteServiceCenter(WorkshopID: number) {
    let url = 'api/Workshop/DeleteWorkshop';
    return this._customHttp.delete(url, { WorkshopID: WorkshopID, modifiedBy: this._sharedService.logged_user_id })
  }

  getManageHours(WorkshopID: number) {
    let url = 'api/Workshop/GetWorkingHoursMetaData';
    return this._customHttp.get(url, { workshopID: WorkshopID });
  }

  saveWorkingHours(hours: SaveWorkingHours) {
    let url = 'api/Workshop/SaveWorkingHours';
    return this._customHttp.post(url, { WorkingHours: hours.WorkingHours, createdBy: this._sharedService.logged_user_id })
  }

  getSetting(WorkshopID: number) {
    let url = 'api/Workshop/GetSetting';
    return this._customHttp.get(url, { workshopID: WorkshopID });
  }
  saveSetting(workshopSetting : WorkshopSetting) {
    let url = 'api/Workshop/SaveSetting';
    return this._customHttp.put(url, { workshopID: this._sharedService.currentWorkshopID, MaximumRepairDiscount : workshopSetting.MaximumRepairDiscount, MaximumPartDiscount : workshopSetting.MaximumPartDiscount, UserID : this._sharedService.logged_user_id });
  }

}
