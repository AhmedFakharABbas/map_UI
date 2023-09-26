import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { QaRoutingModule } from './qa-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    QaRoutingModule,
    SharedModule
  ]
})
export class QaModule { }
