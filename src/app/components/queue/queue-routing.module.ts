import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'app/guards/can-deactivate-guard.service';
import { QueueComponent } from './queue/queue.component';


const routes: Routes = [
  {
    path: "create-queue",
    component: QueueComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      breadcrumb: "queue"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueRoutingModule { }
