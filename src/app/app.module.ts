import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app.routing";
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { LoaderComponent } from "./shared/loader/loader.component";
import { SharedModule } from "./shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { FullLayoutComponent } from "./layouts/full-layout/full-layout.component";
import { SimpleLayoutComponent } from "./layouts/simple-layout/simple-layout.component"; 
import { AuthGuard } from './guards/auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate-guard.service'; 
import { PublicGuard } from './guards/public.guard';
import { DatePipe } from "@angular/common";
import { FilterPipe } from "./pipes/filter.pipe";
import { PureFilterPipe } from "./pipes/filter-pure.pipe";
import { BetweenPipe } from "./pipes/between.pipe";
import { PartFilter } from "./models/part-filter";
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoaderComponent,
    FullLayoutComponent,
    SimpleLayoutComponent  
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SimpleNotificationsModule.forRoot(),

  ],
  providers: [AuthGuard, CanDeactivateGuard, PublicGuard, DatePipe, FilterPipe, PureFilterPipe, PartFilter],
  bootstrap: [AppComponent]
})
export class AppModule {}
