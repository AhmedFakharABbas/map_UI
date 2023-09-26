import { SharedModule } from "./../../shared/shared.module";
import { NgModule } from "@angular/core";
import { AdminRoutingModule } from "./admin-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [AdminRoutingModule, SharedModule]
})
export class AdminModule {}
