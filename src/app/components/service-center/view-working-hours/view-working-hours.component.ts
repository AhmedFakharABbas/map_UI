import { Component, OnInit } from '@angular/core';
import { SaveWorkingHours } from 'app/models/save-working-hours';
import { ServiceCenterService } from 'app/services/service-center.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-view-working-hours',
  templateUrl: './view-working-hours.component.html',
  styleUrls: ['./view-working-hours.component.scss']
})
export class ViewWorkingHoursComponent implements OnInit {
  WorkshopID: number;
  saveWorkingHours: SaveWorkingHours

  constructor(private _serviceCenterService: ServiceCenterService, private route: ActivatedRoute, public _sharedService: SharedService) { }

  ngOnInit() {

    this.saveWorkingHours = new SaveWorkingHours();
    this.route.queryParams.subscribe(params => {
      this.WorkshopID = +params['WorkshopID']; // (+) converts string 'id' to a number   
    });
    this.getMetaData();
  }


  getMetaData() {
    this._serviceCenterService.getManageHours(this.WorkshopID).subscribe((res: any) => {
      this.saveWorkingHours.WorkingHours = res; 
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }
}
