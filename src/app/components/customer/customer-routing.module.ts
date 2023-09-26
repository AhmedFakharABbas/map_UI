import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { ViewCustomerListComponent } from './view-customer-list/view-customer-list.component'; 
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';


const routes: Routes = [
  {
    path: "create-customer",
    component: CreateCustomerComponent,
    data: {
      breadcrumb: "Create Customer"
    }
  }, 
  {
    path: "update-customer",
    component: CreateCustomerComponent,
    data: {
      breadcrumb: "Update Customer"
    }
  },
  {
    path: "list",
    component: ViewCustomerListComponent,
    data: {
      breadcrumb: "Customer List"
    }
  },
  {
    path: "customer-feedback",
    component: CustomerFeedbackComponent,
    data: {
      breadcrumb: "Customer Feedback"
    }
  },
  {
    path: "customer-profile",
    component: CustomerProfileComponent,
    data: {
      breadcrumb: "Customer Profile"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
