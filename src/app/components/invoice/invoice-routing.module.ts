import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";
import { ViewInvoiceListComponent } from "./view-invoice-list/view-invoice-list.component";
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';

const routes: Routes = [
  {
    path: "create-invoice",
    component: CreateInvoiceComponent,
    data: {
      breadcrumb: "Create Invoice"
    }
  },
  {
    path: "detail",
    component: InvoiceDetailComponent,
    data: {
      breadcrumb: "Invoice Detail"
    }
  },
  {
    path: "list",
    component: ViewInvoiceListComponent,
    data: {
      breadcrumb: "Invoice List"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
