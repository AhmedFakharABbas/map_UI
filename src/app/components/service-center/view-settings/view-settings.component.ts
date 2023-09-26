import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopSetting } from 'app/models/workshop-setting';
import { ServiceCenterService } from 'app/services/service-center.service';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.component.html',
  styleUrls: ['./view-settings.component.scss']
})
export class ViewSettingsComponent implements OnInit {

  workshopSetting: WorkshopSetting;
  WorkshopID: number = 0;

  constructor(private _serviceCenterService: ServiceCenterService, private route: ActivatedRoute, public _sharedService: SharedService) { }

  ngOnInit() {

    this.workshopSetting = new WorkshopSetting();
    if (this.workshopSetting == undefined) {
      this.workshopSetting = this._sharedService._commonMeta.WorkshopSetting;
    }
    this.route.queryParams.subscribe(params => {
      this.WorkshopID = +params['WorkshopID']; // (+) converts string 'id' to a number   
    });
    this.getSetting();

  }

  getSetting() {
    this._serviceCenterService.getSetting(this.WorkshopID).subscribe((res: any) => {
      this.workshopSetting = res;
      this.workshopSetting.EditPartDiscount = false;
      this.workshopSetting.EditRepairDiscount = false;
      this._sharedService._commonMeta.WorkshopSetting = this.workshopSetting;
      
      if (this.workshopSetting.MaximumRepairDiscount == undefined) {
        this.workshopSetting.MaximumRepairDiscount = 0;
      }
      if (this.workshopSetting.MaximumPartDiscount == undefined) {
        this.workshopSetting.MaximumPartDiscount = 0;
      }
    }, error => {
      // this._sharedService.error('Error', error.Message);
    })
  }


  saveSetting() {
    this._serviceCenterService.saveSetting(this.workshopSetting).subscribe((res: any) => {
      this._sharedService.success('Success', 'Service saved successfully');
    }, error => {
      // this._sharedService.error('Error', error.Message);
    })
  }

}
