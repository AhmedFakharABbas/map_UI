import { NgModule } from "@angular/core";
import { CreateServiceCenterComponent } from "./create-service-center/create-service-center.component";
import { ViewServiceCenterListComponent } from "./view-service-center-list/view-service-center-list.component";
import { ManageHoursComponent } from "./manage-hours/manage-hours.component";
import { SharedModule } from "app/shared/shared.module";
import { ServiceCenterRoutingModule } from './service-center-routing.module';
import { ViewServiceCenterComponent } from './view-service-center/view-service-center.component';
import { ViewWorkingHoursComponent } from './view-working-hours/view-working-hours.component';
import { ViewSettingsComponent } from './view-settings/view-settings.component';

@NgModule({
  declarations: [
    CreateServiceCenterComponent,
    ViewServiceCenterListComponent,
    ManageHoursComponent,
    ViewServiceCenterComponent,
    ViewWorkingHoursComponent,
    ViewSettingsComponent
  ],
  imports: [ SharedModule, ServiceCenterRoutingModule]
})
export class ServiceCenterModule {}
