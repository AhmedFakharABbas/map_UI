import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { AdvisorRoutingModule } from './advisor-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [ DashboardComponent],
  imports: [
    AdvisorRoutingModule,
    SharedModule
  ]
})
export class AdvisorModule { }
