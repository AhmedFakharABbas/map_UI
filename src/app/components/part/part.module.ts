import { NgModule } from "@angular/core";
import { SearchPartsComponent } from "./search-parts/search-parts.component";
import { ComparePartsComponent } from "./compare-parts/compare-parts.component";
import { SharedModule } from "app/shared/shared.module";
import { PartRoutingModule } from './part-routing.module';
import { CreatePartComponent } from './create-part/create-part.component';
import { ViewPartListComponent } from './view-part-list/view-part-list.component';
import { SingleViewPartComponent } from './single-view-part/single-view-part.component';
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { PurhcaseOrdersComponent } from './purhcase-orders/purhcase-orders.component';

@NgModule({
  declarations: [SearchPartsComponent, 
    ComparePartsComponent, 
    CreatePartComponent, 
    ViewPartListComponent, 
    SingleViewPartComponent, PurhcaseOrdersComponent,],
  imports: [ 
    SharedModule, 
    PartRoutingModule, 
    ]
})
export class PartModule {}
