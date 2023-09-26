import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BasicInfoComponent } from "./basic-info/basic-info.component";
import { CustomerConcernsComponent } from "./customer-concerns/customer-concerns.component";
import { InspectionComponent } from "./inspection/inspection.component";
import { InspectionResultsComponent } from "./inspection-results/inspection-results.component";
import { QaComponent } from "./qa/qa.component";
import { CreateJobComponent } from "./create-job/create-job.component";
import { CanDeactivateGuard } from 'app/guards/can-deactivate-guard.service'; 
import { ApprovalComponent } from './approval/approval.component';
import { PartsPricingComponent } from './parts-pricing/parts-pricing.component';
import { ApprovalViewComponent } from './approval-view/approval-view.component';
import { BasicInfoViewComponent } from './basic-info-view/basic-info-view.component';
import { CustomerConcernsViewComponent } from './customer-concerns-view/customer-concerns-view.component';
import { InspectionViewComponent } from './inspection-view/inspection-view.component';
import { InspectionResultsViewComponent } from './inspection-results-view/inspection-results-view.component';
import { QaViewComponent } from './qa-view/qa-view.component';
import { TakeApprovalComponent } from './take-approval/take-approval.component';
import { VehicleHistoryComponent } from './vehicle-history/vehicle-history.component';
// import { QueueComponent } from "../queue/queue/queue.component";

const routes: Routes = [
  {
    path: "",
    component: CreateJobComponent,
    children: [
      {
        path: "basic-info",
        component: BasicInfoComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          breadcrumb: "basic info"
        } 
      },
      {
        path: "basic-info-view",
        component: BasicInfoViewComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          breadcrumb: "basic info"
        } 
      },
      {
        path: "customer-concerns",
        component: CustomerConcernsComponent,
        data: {
          breadcrumb: "customer concern"
        }
      },
      {
        path: "customer-concerns-view",
        component: CustomerConcernsViewComponent,
        data: {
          breadcrumb: "customer concern"
        }
      },
      {
        path: "inspection",
        component: InspectionComponent,
        data: {
          breadcrumb: "inspection"
        }
      },
      {
        path: "inspection-view",
        component: InspectionViewComponent,
        data: {
          breadcrumb: "inspection"
        }
      },
      {
        path: "inspection-results",
        component: InspectionResultsComponent,
        data: {
          breadcrumb: "inspection results"
        }
      },
      {
        path: "inspection-results-view",
        component: InspectionResultsViewComponent,
        data: {
          breadcrumb: "inspection results"
        }
      },
      {
        path: "approval",
        component: ApprovalComponent,
        data: {
          breadcrumb: "approval"
        }
      }, 
      {
        path: "approval-view",
        component: ApprovalViewComponent,
        data: {
          breadcrumb: "approval"
        }
      }, 
      {
        path: "part-price",
        component: PartsPricingComponent,
        data: {
          breadcrumb: "parts-pricing"
        }
      },
      {
        path: "qa",
        component: QaComponent,
        data: {
          breadcrumb: "qa"
        }
      }, 
      {
        path: "qa-view",
        component: QaViewComponent,
        data: {
          breadcrumb: "qa"
        }
      }, 
      {
        path: "vehicle-history",
        component: VehicleHistoryComponent,
        data: {
          breadcrumb: "vehicle-history"
        }
      },
      // {
      //   path: "update-queue",
      //   component: QueueComponent,
      //   data: {
      //     breadcrumb: "queue"
      //   }
      // }, 

      {
        path: "invoice",
        loadChildren: () =>
          import("../invoice/invoice.module").then(mod => mod.InvoiceModule)
      },
      
    ]
  },
  {
    path: "view-approval",
    component: ApprovalViewComponent,
    data: {
      breadcrumb: "approval"
    }
  },
  {
    path: "take-approval",
    component: TakeApprovalComponent,
    data: {
      breadcrumb: "approval"
    }
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
