import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { TeamLeadRoutingModule } from './team-lead-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [ DashboardComponent],
  imports: [
    TeamLeadRoutingModule,
    SharedModule
  ]
})
export class TeamLeadModule { }
