import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { ForemanRoutingModule } from './foreman-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [ DashboardComponent],
  imports: [
    ForemanRoutingModule,
    SharedModule
  ]
})
export class ForemanModule { }
