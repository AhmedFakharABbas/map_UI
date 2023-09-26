import { Component, OnInit } from "@angular/core";
import { IBarChartOptions, IChartistAnimationOptions, IChartistData, IChartistSeriesData } from "chartist";
import { ChartEvent, ChartType } from "ng-chartist";
import * as $ from "jquery";
import { SharedService } from 'app/services/shared.service';
import { EmployeeService } from 'app/services/employee.service';
import { Employee } from 'app/models/employee';
import { ActivatedRoute } from '@angular/router';
import { JobCardInfo } from 'app/models/job-card-info';
import { EmployeeProfile } from 'app/models/employee-profile';

@Component({
  selector: "app-view-user",
  templateUrl: "./view-user.component.html",
  styleUrls: ["./view-user.component.scss"]
})
export class ViewUserComponent implements OnInit {
  toggleRed: boolean = true;
  toggleGreen: boolean = true;
  toggleBlack: boolean = true;
  toggleBlue: boolean = true;
  employeeProfile: EmployeeProfile;
  userID: number;
  isCardCollapsed = true;
  isTableCollapsed = false; 
  cPage: number = 1;
  // labels: Array<string>;
  // series: Array<IChartistSeriesData> | Array<Array<IChartistSeriesData>> | Array<Array<IChartistData>> | Array<number> | Array<Array<number>>;
  obj: Array<number>;
  obj2: Array<any>;
  constructor(private route: ActivatedRoute, private _employeeService: EmployeeService, public _sharedService: SharedService) { }

  ngOnInit() { 
    this.route.queryParams.subscribe(params => {
      this.userID = +params['UserID']; // (+) converts string 'id' to a number
    });
    this.employeeProfile = new EmployeeProfile(); 
    this.getEmployeeProfile();
  }

  type: ChartType = "Line";
  // data: IChartistData = {
  //   labels: [],
  //   series: []
  // };

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

  // getSingleEmployee() {
  //   this._employeeService.getSingleEmployee(this.userID).subscribe((res: any) => {
  //     this.employeeObj = res.Employee;
  //     this.employeeObj.TaskTechnicians = res.TaskTechnicians;
  //     this.employeeObj.GraphData = res.GraphData;
  //     this.employeeObj.CompletedTasks = res.CompletedTasks;
  //     this.employeeObj.TechnicianStats = res.TechnicianStats;
  //     this.employeeObj = res.Employee;
  //     this.employeeObj.Roles = res.UserRoles.filter(item => item.IsChecked == 1);

  //     this.obj = new Array<number>();
  //     this.obj2 = new Array<any>();
  //     // this.labels = new Array<any>();
  //     this.employeeObj.GraphData.forEach(element => {
  //       this.obj.push(+element.TaskCount);
  //       // this.labels.push(element.Day);
  //     });
  //     this.obj2.push(this.obj);
  //     // this.data.series = this.obj2;
  //     // this.data.labels = this.labels; 
  //   }, error => {
  //     console.log("error", error.Message);
  //   });
  // }

  getEmployeeProfile(){
    this._employeeService.getEmployeeProfile(this.userID).subscribe((res: any) => {
      this.employeeProfile = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

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
}
