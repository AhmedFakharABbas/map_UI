import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAllNotificationsComponent } from './view-all-notifications/view-all-notifications.component';


const routes: Routes = [
  {
    path: "list",
    component: ViewAllNotificationsComponent,
    data: {
      breadcrumb: "notification list"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
