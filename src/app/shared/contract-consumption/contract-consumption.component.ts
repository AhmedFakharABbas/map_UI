import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetVehicleContract } from 'app/models/get-vehicle-contract';
import { ContractService } from 'app/services/contract.service';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-contract-consumption',
  templateUrl: './contract-consumption.component.html',
  styleUrls: ['./contract-consumption.component.scss']
})
export class ContractConsumptionComponent implements OnInit {

  getVehicleContractObj: GetVehicleContract;
  @Input('vehicleID') vehicleID : number;
  @Input('contractPlanID') contractPlanID : number;
  @Output() closeContractDetails = new EventEmitter<string>();

  constructor(private _contractService: ContractService, public _sharedService: SharedService) { }

  ngOnInit() {
    this.getVehicleContractObj = new GetVehicleContract();
     this.getVehicleContract(this.vehicleID, this.contractPlanID);
  }

  getVehicleContract(vehicleID: number, contractPlanID: number) {
    this._contractService.getVehicleContract(vehicleID, contractPlanID).subscribe((res: any) => {
      this.getVehicleContractObj = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  closeContract() {
    this.closeContractDetails.emit('true');

  }


  openNewTab(jobCardID: number) {
    var url =  "/update-job/" + jobCardID + "/basic-info"
    window.open(url, '_blank');
  }
}
