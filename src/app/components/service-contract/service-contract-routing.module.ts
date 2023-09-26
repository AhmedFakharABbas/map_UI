import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ContractConsumptionComponent } from '../../shared/contract-consumption/contract-consumption.component';
import { CreateContractComponent } from './create-contract/create-contract.component';


const routes: Routes = [
  {
    path: "create-contract",
    component: CreateContractComponent,
    data: {
      breadcrumb: "Create Contract"
    }
  },
  {
    path: "contract-feature",
    component: CreateContractComponent,
    data: {
      breadcrumb: "Contract Feature"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceContractRoutingModule { }
