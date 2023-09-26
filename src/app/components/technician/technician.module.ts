import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { TechnicianRoutingModule } from './technician-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    TechnicianRoutingModule,
    SharedModule
  ]
})
export class TechnicianModule { }
