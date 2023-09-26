import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateVehicleComponent } from './create-vehicle/create-vehicle.component';
import { ViewVehicleListComponent } from './view-vehicle-list/view-vehicle-list.component';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';


const routes: Routes = [
  {
    path: "create-vehicle",
    component: CreateVehicleComponent,
    data: {
      breadcrumb: "create vehicle"
    }
  },
  {
    path: "list",
    component: ViewVehicleListComponent,
    data: {
      breadcrumb: "vehicle list"
    }
  },
  {
    path: "view",
    component: ViewVehicleComponent,
    data: {
      breadcrumb: "vehicle profile"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
