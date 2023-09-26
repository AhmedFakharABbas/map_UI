import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPricingComponent } from './task-pricing/task-pricing.component';

const routes: Routes = [
  {
    path: "task-pricing",
    component: TaskPricingComponent,
    data: {
      breadcrumb: "task pricing"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
