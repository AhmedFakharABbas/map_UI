import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { ViewAllNotificationsComponent } from './view-all-notifications/view-all-notifications.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [ViewAllNotificationsComponent],
  imports: [
    SharedModule,
    CommonModule,
    NotificationRoutingModule
  ]
})
export class NotificationModule { }
