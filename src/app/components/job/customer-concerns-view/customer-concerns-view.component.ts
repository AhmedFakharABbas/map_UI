import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-customer-concerns-view',
  templateUrl: './customer-concerns-view.component.html',
  styleUrls: ['./customer-concerns-view.component.scss']
})
export class CustomerConcernsViewComponent implements OnInit {

  tabID: number = 69;
  
  constructor( public _sharedService: SharedService) { }

  ngOnInit() {
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/customer-concerns-view") > -1);
    }
  }

}
