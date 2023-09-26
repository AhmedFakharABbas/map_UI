import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { Vehicle } from 'app/models/vehicle';
import { Observable } from 'rxjs';
import { VehicleFilter } from 'app/models/vehicle-filter';
import { SharedService } from './shared.service';
import { CreateVehicle } from 'app/models/create-vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }

  getMetaData(){
    var url ='api/MetaData/GetMetaData';
    return this._customHttp.get(url);
  }

  getVehicleMetaData(){
    var url = 'api/Vehicle/GetVehicleMetaData';
    return this._customHttp.get(url, {workshopID: this._sharedService.currentWorkshopID});
  }

  saveVehicle( model: CreateVehicle): Observable<any> {
    debugger
    var url = 'api/Vehicle/SaveVehicle';
    return this._customHttp.post(url, model)
  }

  getSingleVehicle(id: number){
    var url = 'api/Vehicle/GetSingleVehicle';
    return this._customHttp.get(url,{vehicleID: id})
  }
  
  getAllVehicles(filter: VehicleFilter){
    var url = 'api/Vehicle/GetAllVehicles'; 
    return this._customHttp.post(url, filter);
  }  

  updateVehicle(createVehicle: CreateVehicle): Observable<any>{
    var url = 'api/Vehicle/UpdateVehicle';
    return this._customHttp.put(url, createVehicle)
  }

  deleteVehicle(id: number){
    var url = 'api/Vehicle/DeleteVehicle'; 
    return this._customHttp.delete(url,{vehicleID: id, modifiedBy: this._sharedService.logged_user_id})
  }

  getVehicleProfile(id: number){
    var url = 'api/Vehicle/VehicleProfile';
    return this._customHttp.get(url, {vehicleID: id})
  }

  checkVehicle(plateNumber : any, customerID : number, workshopID : number, vin : any, vehicleID : number): Observable<any>{
    var url = 'api/JobCard/CheckVehicle';
    return this._customHttp.post(url, {PlateNumber : plateNumber, CustomerID : customerID, WOrkshopID : workshopID, VIN : vin, VehicleID : vehicleID})
  }


} 
