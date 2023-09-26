import { Component, OnInit } from '@angular/core';
import { JobCardFilter } from 'app/models/job-card-filter';
import { JobCardInfo } from 'app/models/job-card-info';
import { SharedService } from 'app/services/shared.service';
import { JobService } from 'app/services/job.service';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.scss']
})
export class JobHistoryComponent implements OnInit {

  cPage: number = 1;
  JobCardID: number;
  jobCardArray: JobCardInfo;
  filter: JobCardFilter;
  radioTab: boolean;
  showMore: boolean = false;
  role: number;
  totalPages: number;
 
  // dropdownID: number;
  constructor(public _sharedService: SharedService, private _jobService: JobService) { }

  ngOnInit() {
    this.filter = new JobCardFilter();
    this.jobCardArray = new JobCardInfo();
    this.jobCardHistory();
  }

  jobCardHistory() {
     console.log("c page :"+this.cPage);
    let checkIn;
    let checkOut;
    if(this.filter.CheckInDate != undefined){
      checkIn=this.filter.CheckInDate;
      let temp = this._sharedService.dateFormat(this.filter.CheckInDate);
      this.filter.CheckInDate = temp;
    }
    if(this.filter.CheckOutDate != undefined){
      checkOut=this.filter.CheckOutDate;
      let temp = this._sharedService.dateFormat(this.filter.CheckOutDate);
      this.filter.CheckOutDate = temp;
    }
    this.filter.UserID = this._sharedService.logged_user_id;
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this.filter.RowsPerPage = this._sharedService.pageSize;
    this.filter.StartRow = this.cPage; 
    //to Filter all falsy values ( "", 0, false, null, undefined )
    let filteredObj=Object.entries(this.filter).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})
   this.filter=JSON.parse(JSON.stringify(filteredObj))
this._jobService.jobHistory(this.filter).subscribe((res: any) => {
      debugger
      this.jobCardArray = res;
      this.totalPages = res.SingleData.TotalPages;
      if(checkIn!=undefined){
        this.filter.CheckInDate=checkIn;
      }
      if(checkOut!=undefined){
        this.filter.CheckOutDate=checkOut;
      }
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  clearFilters() {
    this.filter = new JobCardFilter(); 
    this.jobCardArray = new JobCardInfo();
    this.jobCardHistory();
    this.cPage = 1;
    this.totalPages=undefined;
  }

  //collapse jc 
  collapseJC($event: any, jcID : number){ 
    if(document.getElementById('card'+jcID).classList.contains('show')){
      $(event.target).removeClass('fa-chevron-up');
      $(event.target).addClass('fa-chevron-down');
    }
    else{
      $(event.target).removeClass('fa-chevron-down');
      $(event.target).addClass('fa-chevron-up');
    }
  }
  omit_special_char(event)
  {   
     var k;  
     k = event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  onVINPaste(event: any){
   
    let clipData=  event.clipboardData;
    let pastedText = clipData.getData('text');
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(pastedText)){
   event.preventDefault();
   return false;
    }
    
  }

}
