import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewJobListComponent } from './view-job-list/view-job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobHistoryComponent } from './job-history/job-history.component'; 
import { TechJobListComponent } from './tech-job-list/tech-job-list.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';


const routes: Routes = [
  {
    path: "list",
    component: ViewJobListComponent,
    data: {
      breadcrumb: "job list"
    }
  },
  {
    path: "detail",
    component: JobDetailComponent,
    data: {
      breadcrumb: "job detail"
    }
  },
  {
    path: "history",
    component: JobHistoryComponent,
    data: {
      breadcrumb: "job history"
    }
  },
  {
    path: "job-list",
    component: TechJobListComponent,
    data: {
      breadcrumb: "job list"
    }
  },
  {
    path: "view-tasks",
    component: ViewTasksComponent,
    data: {
      breadcrumb: "All Tasks"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewJobsRoutingModule { }
