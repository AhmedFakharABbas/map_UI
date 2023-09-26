import { NgModule } from '@angular/core';
import { PricingRoutingModule } from './pricing-routing.module';
import { TaskPricingComponent } from './task-pricing/task-pricing.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [TaskPricingComponent],
  imports: [
    SharedModule, PricingRoutingModule]
})
export class PricingModule { }
