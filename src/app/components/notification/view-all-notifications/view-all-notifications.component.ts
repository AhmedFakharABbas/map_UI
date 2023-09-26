import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from 'app/services/job.service';
import { SharedService } from 'app/services/shared.service';
import { FullLayoutComponent } from 'app/layouts/full-layout/full-layout.component';

@Component({
  selector: 'app-view-all-notifications',
  templateUrl: './view-all-notifications.component.html',
  styleUrls: ['./view-all-notifications.component.scss']
})
export class ViewAllNotificationsComponent implements OnInit {

  cPage: number = 1;
  pageSize: number = 15;

  constructor(private router: Router, public activatedRoute: ActivatedRoute, public _sharedService: SharedService, private _jobService: JobService, public modalService: NgbModal) { }


  ngOnInit() {
  }

  readAllNotifications() {
    if( this._sharedService._commonMeta.Notification.UnReadNotifications >0){
   
    var userID = +this._sharedService.logged_user_id;
    this._jobService.readAllNotifications(userID).subscribe(res => {
      var noti = this._sharedService._commonMeta.Notifications.filter(item => item.IsRead == false);
      noti.forEach(element => {
        element.IsRead = true;
      });
      this._sharedService._commonMeta.Notification.UnReadNotifications = 0;
      this._sharedService.success('Success', 'Success');
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }
  }

  getAllNotifications(pageNumber: number){
    
    this._sharedService.notePage = this.cPage;
    this._jobService.viewAllNotifications(this._sharedService.logged_user_id, this._sharedService.notePage).subscribe((res:any) => {
     this._sharedService._commonMeta.Notifications = res;
     
    },
    error =>{

    });
 
}

}
