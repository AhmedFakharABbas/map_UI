import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';

import { VendorRoutingModule } from './vendor-routing.module'; 
import { CreateVendorComponent } from './create-vendor/create-vendor.component';
import { ViewVendorListComponent } from './view-vendor-list/view-vendor-list.component';
import { ViewVendorComponent } from './view-vendor/view-vendor.component';

@NgModule({
  declarations: [ CreateVendorComponent, ViewVendorListComponent, ViewVendorComponent],
  imports: [
    VendorRoutingModule,
    SharedModule, 
  ]
})
export class VendorModule { }
