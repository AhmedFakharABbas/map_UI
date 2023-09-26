import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core"; 
import { JobRoutingModule } from "./job-routing.module";
import { SharedModule } from "app/shared/shared.module";
import { BasicInfoComponent } from "./basic-info/basic-info.component";
import { CustomerConcernsComponent } from "./customer-concerns/customer-concerns.component"; 
import { InspectionComponent } from "./inspection/inspection.component";
import { InspectionResultsComponent } from "./inspection-results/inspection-results.component";
import { PartsComponent } from "./parts/parts.component";
import { QaComponent } from "./qa/qa.component";
import { CreateJobComponent } from "./create-job/create-job.component";
import { JcCreateCustomerComponent } from './jc-create-customer/jc-create-customer.component';
import { JcViewCustomerComponent } from './jc-view-customer/jc-view-customer.component';
import { JcCreateVehicleComponent } from './jc-create-vehicle/jc-create-vehicle.component';
import { JcViewVehicleComponent } from './jc-view-vehicle/jc-view-vehicle.component';
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
import { QueueComponent } from '../queue/queue/queue.component';   

@NgModule({
  declarations: [
    BasicInfoComponent,
    CustomerConcernsComponent, 
    InspectionComponent,
    InspectionResultsComponent,
    PartsComponent,
    QaComponent,
    CreateJobComponent,
    JcCreateCustomerComponent,
    JcViewCustomerComponent,
    JcCreateVehicleComponent,
    JcViewVehicleComponent,
    ApprovalComponent,
    PartsPricingComponent,
    ApprovalViewComponent,
    BasicInfoViewComponent,
    CustomerConcernsViewComponent,
    InspectionViewComponent,
    InspectionResultsViewComponent,
    QaViewComponent,
    TakeApprovalComponent,
    VehicleHistoryComponent
  ],
  imports: [SharedModule, JobRoutingModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class JobModule {}
