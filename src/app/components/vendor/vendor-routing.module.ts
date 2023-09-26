import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { ViewVendorListComponent } from './view-vendor-list/view-vendor-list.component';
import { ViewVendorComponent } from './view-vendor/view-vendor.component';

const routes: Routes = [

  {
    path: "create-vendor",
    component: CreateVendorComponent,
    data: {
      breadcrumb: "create vendor"
    }
  },
  {
    path: "list",
    component: ViewVendorListComponent,
    data: {
      breadcrumb: "view vendor list"
    }
  },
  {
    path: "view-vendor",
    component: ViewVendorComponent,
    data: {
      breadcrumb: "view vendor"
    }
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
