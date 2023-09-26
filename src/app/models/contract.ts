import { ContractPlan } from './contract-plan';
import { PlanFeature } from './plan-feature';
import { ServiceContract } from './service-contract';
import { PlanPrice } from './plan-price';

export class Contract {
    ServiceContract : ServiceContract;
    ContractPlan : ContractPlan;
    PlanPrices : Array<PlanPrice>;
    PlanFeatures : Array<PlanFeature>;

    constructor() {
        this.ServiceContract = new ServiceContract();
        this.ContractPlan = new ContractPlan();
        this.PlanPrices = new Array<PlanPrice>();
        this.PlanFeatures = new Array<PlanFeature>();
            
    }

}