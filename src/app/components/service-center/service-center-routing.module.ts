import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateServiceCenterComponent } from './create-service-center/create-service-center.component';
import { ViewServiceCenterListComponent } from './view-service-center-list/view-service-center-list.component';
import { ManageHoursComponent } from './manage-hours/manage-hours.component';
import { ViewServiceCenterComponent } from './view-service-center/view-service-center.component';
import { ViewWorkingHoursComponent } from './view-working-hours/view-working-hours.component';
import { ViewSettingsComponent } from './view-settings/view-settings.component';


const routes: Routes = [
  {
    path: "create-service-center",
    component: CreateServiceCenterComponent,
    data: {
      breadcrumb: "create service center"
    }
  },
  {
    path: "update-service-center",
    component: CreateServiceCenterComponent,
    data: {
      breadcrumb: "update service center"
    }
  },
  {
    path: "list",
    component: ViewServiceCenterListComponent,
    data: {
      breadcrumb: "service center list"
    }
  },
  {
    path: "manage-hours",
    component: ManageHoursComponent,
    data: {
      breadcrumb: "manage hours"
    }
  },
  {
    path: "view",
    component: ViewServiceCenterComponent,
    data: {
      breadcrumb: "view service center"
    }
  },
  {
    path: "view-working-hours",
    component: ViewWorkingHoursComponent,
    data: {
      breadcrumb: "view working hours"
    }
  },
  {
    path: "view-settings",
    component: ViewSettingsComponent,
    data: {
      breadcrumb: "view settings"
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceCenterRoutingModule { }
