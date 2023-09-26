import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
import { CommonService } from 'app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contract } from 'app/models/contract';
import { ServiceContract } from 'app/models/service-contract';
import { ContractPlan } from 'app/models/contract-plan';
import { PlanPrice } from 'app/models/plan-price';


@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss']
})
export class CreateContractComponent implements OnInit {

  serviceContract: ServiceContract;
  contractPlan: ContractPlan;
  planPrices: PlanPrice;

  public addContractPlanRef: (name) => void;
  public addServiceContractRef: (name) => void;

  constructor(private route: ActivatedRoute, public _sharedService: SharedService, private _router: Router, private _commonService: CommonService) {
    this.addContractPlanRef = this.addContractPlan.bind(this);
    this.addServiceContractRef = this.addServiceContract.bind(this);

  }

  ngOnInit() {

    this._sharedService.contractObj = new Contract();
    this.serviceContract = new ServiceContract();
    this.contractPlan = new ContractPlan();
    this.planPrices = new PlanPrice();

  }

  saveServiceContract() {
    
    this._sharedService.contractObj.ServiceContract = this.serviceContract;
    this._sharedService.contractObj.ContractPlan = this.contractPlan;
    this._sharedService.contractObj.PlanPrices.push(this.planPrices);

    this.planPrices = new PlanPrice();
  }

  updateServiceContract() {
    
  }

  addContractPlan(name) {
    
    this.contractPlan = new ContractPlan();
    this.contractPlan.ContractPlanID = Math.floor((Math.random() * -1000) - 1);
    this.contractPlan.PlanName = name;

    // var dd = document.getElementById('contractPlan');
    // dd.set = this.contractPlan.PlanName;

    this._sharedService._commonMeta.ContractPlans.push(this.contractPlan);
    //this.onAddPartToArray(this.automotivePartObj);
    return { PlanName: this.contractPlan.PlanName, ContractPlanID: this.contractPlan.ContractPlanID };


  }

  addServiceContract(name) {
    
    this.serviceContract = new ServiceContract();
    this.serviceContract.ServiceContractID = Math.floor((Math.random() * -1000) - 1);
    this.serviceContract.ContractName = name;
    this.serviceContract.WorkshopID = this._sharedService.currentWorkshopID;

    this._sharedService._commonMeta.ServiceContracts.push(this.serviceContract);
    return { ContractName: this.serviceContract.ContractName, ServiceContractID: this.serviceContract.ServiceContractID }
  }
}
