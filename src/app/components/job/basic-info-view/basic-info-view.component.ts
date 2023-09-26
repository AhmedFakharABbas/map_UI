import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-basic-info-view',
  templateUrl: './basic-info-view.component.html',
  styleUrls: ['./basic-info-view.component.scss']
})
export class BasicInfoViewComponent implements OnInit {

  constructor(public _sharedService: SharedService) { }

  ngOnInit() {
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/basic-info-view") > -1);
    }
  }

}
