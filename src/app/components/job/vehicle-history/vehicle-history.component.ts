import { Component, OnInit } from '@angular/core';
import { _getShadowRoot } from '@angular/material/progress-spinner/typings/progress-spinner';
import { JobService } from 'app/services/job.service';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-vehicle-history',
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.scss']
})
export class VehicleHistoryComponent implements OnInit {

  constructor(public _sharedService: SharedService, private _jobService: JobService) { }

  ngOnInit() { 
    this.vehicleHistory();
  }

  vehicleHistory() { 
    this._jobService.getVehicleHistory(this._sharedService.jobObj.JCBasicInfo.JobCardID, this._sharedService.jobObj.jcVehicleObj.VIN).subscribe((res: any) => {
      //this.jobCardArray = res;
      this._sharedService.jobObj.HistoryTasks = res.JobTasks;
      this._sharedService.jobObj.HistoryParts = res.JobParts;
      this._sharedService.jobObj.HistoryGallery = res.Gallery;

    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

}
