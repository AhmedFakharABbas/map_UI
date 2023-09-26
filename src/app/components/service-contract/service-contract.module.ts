import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceContractRoutingModule } from './service-contract-routing.module';
import { CreateContractComponent } from './create-contract/create-contract.component';
import { SharedModule } from 'app/shared/shared.module';
import { ContractFeatureComponent } from './contract-feature/contract-feature.component'; 


@NgModule({
  declarations: [CreateContractComponent, ContractFeatureComponent],
  imports: [
    CommonModule,
    SharedModule,
    ServiceContractRoutingModule
  ]
})
export class ServiceContractModule { }
