import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { ViewJobListComponent } from "./view-job-list/view-job-list.component";
import { JobDetailComponent } from "./job-detail/job-detail.component";
import { SharedModule } from "app/shared/shared.module"; 
import { ViewJobsRoutingModule } from './view-jobs-routing.module';
import { JobHistoryComponent } from './job-history/job-history.component';  
import { TechJobListComponent } from './tech-job-list/tech-job-list.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';
@NgModule({
  declarations: [ViewJobListComponent, JobDetailComponent, JobHistoryComponent, TechJobListComponent, ViewTasksComponent],
  imports: [SharedModule, ViewJobsRoutingModule ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ViewJobsModule {}
