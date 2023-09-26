import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComparePartsComponent } from './compare-parts/compare-parts.component';
import { SearchPartsComponent } from './search-parts/search-parts.component';
import { CreatePartComponent } from './create-part/create-part.component';
import { ViewPartListComponent } from './view-part-list/view-part-list.component';
import { SingleViewPartComponent } from './single-view-part/single-view-part.component';
import { PurhcaseOrdersComponent } from '../part/purhcase-orders/purhcase-orders.component'



const routes: Routes = [
  {
    path: "compare-parts",
    component: ComparePartsComponent,
    data: {
      breadcrumb: "Search Parts"
    }
  },
  {
    path: "search-parts",
    component: SearchPartsComponent,
    data: {
      breadcrumb: "search parts"
    }
  },
  {
    path: "create-part",
    component: CreatePartComponent,
    data: {
      breadcrumb: "create part"
    }
  },
  {
    path: "list",
    component: ViewPartListComponent,
    data: {
      breadcrumb: "parts list"
    }
  },
  {
    path: "view",
    component: SingleViewPartComponent,
    data: {
      breadcrumb: "view part"
    }
  },
  {
    path: "purchase-orders",
    component: PurhcaseOrdersComponent,
    data: {
      breadcrumb: "view part"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartRoutingModule { }
