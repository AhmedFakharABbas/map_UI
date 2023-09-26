import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { ManagerRoutingModule } from './manager-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    ManagerRoutingModule,
    SharedModule
  ]
})
export class ManagerModule { }
