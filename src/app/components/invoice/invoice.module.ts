import { NgModule } from "@angular/core"; 
import { InvoiceRoutingModule } from "./invoice-routing.module";
import { InvoiceDetailComponent } from "./invoice-detail/invoice-detail.component";
import { ViewInvoiceListComponent } from "./view-invoice-list/view-invoice-list.component";
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [CreateInvoiceComponent, InvoiceDetailComponent, ViewInvoiceListComponent],
  imports: [ InvoiceRoutingModule, SharedModule]
})
export class InvoiceModule { }
