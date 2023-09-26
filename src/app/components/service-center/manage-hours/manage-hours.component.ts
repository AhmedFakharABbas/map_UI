import { Component, OnInit } from '@angular/core';
import { ServiceCenterService } from 'app/services/service-center.service';
import { SharedService } from 'app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveWorkingHours } from 'app/models/save-working-hours';

@Component({
  selector: 'app-manage-hours',
  templateUrl: './manage-hours.component.html',
  styleUrls: ['./manage-hours.component.scss']
})
export class ManageHoursComponent implements OnInit {
  startTime: string;
  // manageHoursArray: Array<WorkingHours>;
  WorkshopID: number;
  saveWorkingHours: SaveWorkingHours

  constructor(private route: ActivatedRoute, private _serviceCenterService: ServiceCenterService, private _router: Router, private _sharedService: SharedService) { }

  ngOnInit() {
    // this.manageHoursArray = new Array<WorkingHours>();
    this.saveWorkingHours = new SaveWorkingHours();
    this.route.queryParams.subscribe(params => {
      this.WorkshopID = +params['WorkshopID']; // (+) converts string 'id' to a number   
    });
    this.getMetaData();
  }

  duplicateHours(event, i) {
    if (event.target.checked) {
      this.saveWorkingHours.WorkingHours[i].StartTime = this.saveWorkingHours.WorkingHours[i - 1].StartTime;
      this.saveWorkingHours.WorkingHours[i].EndTime = this.saveWorkingHours.WorkingHours[i - 1].EndTime;
    }
    else if (i > 0) {
      this.saveWorkingHours.WorkingHours[i].StartTime = null;
      this.saveWorkingHours.WorkingHours[i].EndTime = null;
    }
    else {
      return 0;
    }
  }

  getMetaData() {
    this._serviceCenterService.getManageHours(this.WorkshopID).subscribe((res: any) => {
      this.saveWorkingHours.WorkingHours = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  onSaveManageHours() {
    this.saveWorkingHours.WorkingHours.forEach(element => {
      element.WorkshopID = this.WorkshopID;
    });
    this._serviceCenterService.saveWorkingHours(this.saveWorkingHours).subscribe((res: any) => {
      this._sharedService.success('Success', 'Manage hours saved successfully');
      if (this._sharedService.logged_user_role_id == 1) {
        this._router.navigate(['/', 'service-center', 'list']);
      }
      else {
        this._router.navigate(['/', 'admin', 'dashboard']);
      }
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }
}
