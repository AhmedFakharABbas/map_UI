import { NgModule } from "@angular/core";
import { CreateVehicleComponent } from "./create-vehicle/create-vehicle.component";
import { ViewVehicleListComponent } from "./view-vehicle-list/view-vehicle-list.component";
import { SharedModule } from "app/shared/shared.module";
import { VehicleRoutingModule } from './vehicle-routing.module';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';

@NgModule({
  declarations: [CreateVehicleComponent, ViewVehicleListComponent, ViewVehicleComponent],
  imports: [ SharedModule, VehicleRoutingModule]
})
export class VehicleModule {}
