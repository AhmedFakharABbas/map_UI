import { Component, OnInit } from '@angular/core';
import { ServiceCenter } from 'app/models/service-center';
import { SharedService } from 'app/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import * as $ from "jquery";
import { ServiceCenterService } from 'app/services/service-center.service';
import { ChartType, ChartEvent } from 'ng-chartist';
import { IChartistData, IBarChartOptions, IChartistAnimationOptions } from 'chartist';

@Component({
  selector: 'app-view-service-center',
  templateUrl: './view-service-center.component.html',
  styleUrls: ['./view-service-center.component.scss']
})
export class ViewServiceCenterComponent implements OnInit {
  toggleRed: boolean = true;
  toggleGreen: boolean = true;
  toggleBlack: boolean = true;
  toggleBlue: boolean = true;
  WorkshopID: number; 
  isCardCollapsed = true;
  isTableCollapsed = false;
  serviceCenterObj:ServiceCenter
 
  constructor(private route: ActivatedRoute, private _serviceCenter: ServiceCenterService, public _sharedService: SharedService) { }

  ngOnInit() {

    this.serviceCenterObj= new ServiceCenter();
    this.route.queryParams.subscribe(params => {
      this.WorkshopID = +params['WorkshopID']; // (+) converts string 'id' to a number
    }); 
    this.getSingleServiceCenter();
  }
  getSingleServiceCenter(){
    this._serviceCenter.getSingleServiceCenter(this.WorkshopID).subscribe((res:any) => { 
      this.serviceCenterObj = res;
    },error=>{
     this._sharedService.error('Error', error.Message);
    });
  }
  
  type: ChartType = "Line";
  data: IChartistData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    series: [
      [5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
      [3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4] 
    ]
  };

  options: IBarChartOptions = {
    axisX: {
      showGrid: true
    },
    height: "500px"
  };

  events: ChartEvent = {
    draw: data => {
      if (data.type === "bar") {
        data.element.animate({
          y2: <IChartistAnimationOptions>{
            dur: "0.5s",
            from: data.y1,
            to: data.y2,
            easing: "easeOutQuad"
          }
        });
      }
    }
  };



  toggleRedFun() {
    if (this.toggleRed == true) {
      this.toggleRed = false;
      $(".ct-series-a").css("display", "none");
      $(".a").css("text-decoration", "line-through");
    } else {
      this.toggleRed = true;
      $(".a").css("text-decoration", "none");
      $(".ct-series-a").css("display", "inline-block");
    }
  }
  toggleGreenFun() {
    if (this.toggleGreen == true) {
      this.toggleGreen = false;
      $(".ct-series-b").css("display", "none");
      $(".b").css("text-decoration", "line-through");
    } else {
      this.toggleGreen = true;
      $(".b").css("text-decoration", "none");
      $(".ct-series-b").css("display", "inline-block");
    }
  }

  toggleBlackFun() {
    if (this.toggleBlack == true) {
      this.toggleBlack = false;
      $(".ct-series-c").css("display", "none");
      $(".c").css("text-decoration", "line-through");
    } else {
      this.toggleBlack = true;
      $(".c").css("text-decoration", "none");
      $(".ct-series-c").css("display", "inline-block");
    }
  }

  toggleBlueFun() {
    if (this.toggleBlue == true) {
      this.toggleBlue = false;
      $(".ct-series-d").css("display", "none");
      $(".d").css("text-decoration", "line-through");
    } else {
      this.toggleBlue = true;
      $(".d").css("text-decoration", "none");
      $(".ct-series-d").css("display", "inline-block");
    }
  }
}
