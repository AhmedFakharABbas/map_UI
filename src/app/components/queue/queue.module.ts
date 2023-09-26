import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueueRoutingModule } from './queue-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { QueueComponent } from './queue/queue.component';
import { QueuePreviewComponent } from './queue-preview/queue-preview.component';


@NgModule({
  declarations: [QueueComponent, QueuePreviewComponent],
  imports: [
    CommonModule,
    QueueRoutingModule, 
    SharedModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class QueueModule { }
