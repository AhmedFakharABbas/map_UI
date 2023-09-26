import { Component, OnInit } from '@angular/core';
import { ChartEvent, ChartType } from 'ng-chartist';
import { IChartistAnimationOptions, IBarChartOptions, IChartistData } from 'chartist';
import * as $ from "jquery";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  toggleRed: boolean;
  toggleGreen: boolean;
  toggleBlack: boolean;
  toggleBlue: boolean;

  constructor() { }

  ngOnInit() {
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


