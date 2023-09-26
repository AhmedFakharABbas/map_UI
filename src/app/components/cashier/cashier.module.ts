import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { CashierRoutingModule } from './cashier-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [ DashboardComponent],
  imports: [
    CashierRoutingModule,
    SharedModule
  ]
})
export class CashierModule { }
