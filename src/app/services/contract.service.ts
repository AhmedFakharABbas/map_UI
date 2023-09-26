import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(public _customHttp : CustomHttpService) { }

  getVehicleContract(vehicleID : number, contractPlanID : number) {
    let url = 'api/ServiceContract/GetVehicleContract';
    return this._customHttp.get(url, { vehicleID : vehicleID, contractPlanID : contractPlanID });
  }
}
