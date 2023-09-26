import { NgModule } from "@angular/core";
import { CreateCustomerComponent } from "./create-customer/create-customer.component";
import { ViewCustomerListComponent } from "./view-customer-list/view-customer-list.component";
import { SharedModule } from "app/shared/shared.module";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CustomerFeedbackComponent } from "./customer-feedback/customer-feedback.component";
import { CustomerProfileComponent } from "./customer-profile/customer-profile.component";

@NgModule({
  declarations: [
    CreateCustomerComponent,
    ViewCustomerListComponent,
    CustomerFeedbackComponent,
    CustomerProfileComponent,
  ],
  imports: [SharedModule, CustomerRoutingModule],
})
export class CustomerModule {}
