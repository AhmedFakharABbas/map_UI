import { SearchFilterPipe } from './../pipes/search-filter.pipe';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { BreadCrumbComponent } from "./bread-crumb/bread-crumb.component";
import { RouterModule } from "@angular/router";
import { ChartistModule } from "ng-chartist"; 
import { NgSelectModule } from "@ng-select/ng-select";
import { Ng5SliderModule } from "ng5-slider";
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from 'app/pipes/filter.pipe';
import { ImgMapComponent } from 'ng2-img-map';
import { RoleBaseEmployeeFilterPipe } from 'app/pipes/role-base-employee-filter.pipe';
import { NotFilterPipe } from 'app/pipes/not-filter.pipe';
import { TimeFormat } from 'app/pipes/time-format.pipe';
import { PhoneMaskDirective } from '../models/phone-no'
import { DuplicateDropdownPipe } from 'app/pipes/duplicate-dropdown.pipe';
import { YearFilterPipe } from 'app/pipes/year-filter.pipe';
import { EditAcceptedJobPipe } from 'app/pipes/edit-accepted-job.pipe';  
import { EmployeeFilterPipe } from 'app/pipes/employee-filter.pipe';
import { PhoneFormatPipe } from 'app/pipes/phone-format.pipe';
import { JobCardFilterPipe } from 'app/pipes/job-card-filter.pipe';
import { FileUploadModule } from 'ng2-file-upload';
import { FilterTechJobCards } from 'app/pipes/filter-tech-jobcards.pipe';
import { ElseHyphenDirective } from 'app/directives/else-hyphen.directive';
import { FilterCustomerList } from 'app/pipes/filter-customer-list.pipe';
import { IRFilterPipe } from 'app/pipes/ir-filter.pipe';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { UserRoleEmployeeFilter } from 'app/pipes/userRole-employee-filter.pipe';
import { HoursToMinPipe } from 'app/pipes/hours-to-min.pipe'; 
import { ContractConsumptionComponent } from './contract-consumption/contract-consumption.component';
import {ProgressBarModule} from "angular-progress-bar"
import { PureFilterPipe } from 'app/pipes/filter-pure.pipe';
import { BetweenPipe } from 'app/pipes/between.pipe';
import { PartFilter } from 'app/models/part-filter';
import { Part } from 'app/models/part';
import { PartFilterPipe } from 'app/pipes/part-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
 
@NgModule({
  declarations: [
    SearchFilterPipe,
    BreadCrumbComponent,
    FilterPipe, 
    ImgMapComponent,
    RoleBaseEmployeeFilterPipe,
    TimeFormat,
    HoursToMinPipe,
    NotFilterPipe,
    PhoneFormatPipe,
    PhoneMaskDirective, 
    YearFilterPipe,
    DuplicateDropdownPipe,
    EditAcceptedJobPipe,
    EmployeeFilterPipe,
    JobCardFilterPipe,
    IRFilterPipe,
    FilterTechJobCards,
    FilterCustomerList,
    UserRoleEmployeeFilter,
    ElseHyphenDirective, 
    ContractConsumptionComponent,
    PureFilterPipe,
    BetweenPipe,
    PartFilterPipe

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    JwBootstrapSwitchNg2Module,
    RouterModule,
    ChartistModule, 
    Ng5SliderModule, 
    NgSelectModule,
    HttpClientModule,
    FileUploadModule,
    ProgressBarModule,
    CountdownTimerModule.forRoot(),
    NgxPaginationModule
  ],
  exports: [
    CommonModule,
    FormsModule, 
    NgbModule,
    ChartistModule,
    JwBootstrapSwitchNg2Module,
    RouterModule,
    BreadCrumbComponent, 
    Ng5SliderModule,
    NgSelectModule,
    FilterPipe,
    RoleBaseEmployeeFilterPipe,
    JobCardFilterPipe,
    IRFilterPipe,
    FilterTechJobCards,
    UserRoleEmployeeFilter,
    FilterCustomerList,
    ImgMapComponent,
    TimeFormat,
    HoursToMinPipe,
    NotFilterPipe,
    PhoneFormatPipe,
    PhoneMaskDirective,
    DuplicateDropdownPipe,
    YearFilterPipe,
    EditAcceptedJobPipe,
    SearchFilterPipe,
    EmployeeFilterPipe,
    FileUploadModule,
    ElseHyphenDirective,
    CountdownTimerModule,
    ContractConsumptionComponent,
    ProgressBarModule,
    PureFilterPipe,
    BetweenPipe,
    PartFilterPipe,
    NgxPaginationModule
  ]
})
export class SharedModule {}
