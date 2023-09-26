import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from "app/services/shared.service";
import { JobService } from "app/services/job.service";
import { ActivatedRoute } from "@angular/router";
import { ImageMarker } from "app/models/image-marker";
import { ImgMapComponent } from "ng2-img-map";
import { TaskTechnician } from "app/models/task-technician";
import { InspectionResult } from "app/models/inspection-result";

@Component({
  selector: "app-job-detail",
  templateUrl: "./job-detail.component.html",
  styleUrls: ["./job-detail.component.scss"],
})
export class JobDetailComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  closeResult: string;
  JobCardID: number;
  imgMarker: ImageMarker;
  marker: Array<any>;
  taskTechnician: TaskTechnician;
  currentJobTask: number;
  markers: any[][] = [];

  sedan: string = "../../../assets/img/exterior/exterior-sedan.jpg";
  pickup: string = "../../../assets/img/exterior/exterior-pickup.jpg";
  hatchback: string = "../../../assets/img/exterior/exterior-hatchback.png";
  SUV: string = "../../../assets/img/exterior/exterior-SUV.jpeg";
  coupe: string = "../../../assets/img/exterior/exterior-coupe.jpg";
  twoDoorPickup: string =
    "../../../assets/img/exterior/exterior-two-door-pickup.png";
  bus: string = "../../../assets/img/exterior/exterior-bus.png";
  convertible: string = "../../../assets/img/exterior/exterior-convertible.jpg";
  smallVehicle: string =
    "../../../assets/img/exterior/exterior-smallVehicle.jpg";

  @ViewChild("imgMap", { static: false }) imgMap: ImgMapComponent;
  isViewMode: boolean;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public _sharedService: SharedService,
    private _jobService: JobService
  ) {}

  ngOnInit() {
    this.taskTechnician = new TaskTechnician();
    this.route.queryParams.subscribe((params) => {
      this.JobCardID = +params["JobCardID"];
    });
    this.getSingleJob();
    window.addEventListener("scroll", this.onScrollEvent, true); //third parameter
    this.isViewMode=false
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }

  getSingleJob() {
    debugger;
    this._jobService.getSingleJob(this.JobCardID).subscribe(
      (res: any) => {
        this._sharedService.jobObj = res;
        //to work on point number 72
        this._sharedService.jobObj.JobTasks.forEach((element) => {
          if (element.JobTaskTypeID == 51 && element.IsInclude == true) {
           
           let userRole = this._sharedService.jobObj.UserRoles.filter(userrole=>userrole.UserID==element.EmployeeID);
       if(userRole!=undefined){
        element.EmployeeFullName=userRole[0].EmployeeFullName;
       }
        }
        });
        if (
          this._sharedService.jobObj.ImageMarkers != undefined &&
          this._sharedService.jobObj.ImageMarkers.length > 0
        ) {
          this._sharedService.jobObj.ImageMarkers.forEach((element) => {
            this.marker = new Array<any>();
            this.marker.push(element.Latitude);
            this.marker.push(element.Longitude);
            this.marker.push(element.ImageMarkerID);
            this.marker.push(element.JobCardID);
            this.markers.push(this.marker);
            this.isViewMode = true;

            // let testarray = this._sharedService.jobObj.JobTasks.filters(item=>item.JobTaskTypeID==51&&item.IsInclude==true);

            // conso;

            // $.getScript('../../../assets/js/scroll-sidebar.js');
          });
          setTimeout(() => {
            this.imgMap.draw();
          }, 500);
        }
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  assignTaskTechnician(jobTask: InspectionResult) {
    if (jobTask.EmployeeID != undefined) {
      jobTask.CurrentUserID = jobTask.UserID;
      // jobTask.EmployeeID = jobTask.CurrentEmployeeID;
      this._jobService.assignTaskTechnician(jobTask).subscribe(
        (res) => {
          var jobTask = res;

          var task = this._sharedService.jobObj.JobTasks.find(
            (item) => item.JobTaskID == jobTask.JobTaskID
          );
          if (task != undefined) {
            task = jobTask;
          }
          this._sharedService.success(
            "Success",
            "Technician Assigned successfully"
          );
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    }
  }

  isCompleted(jobTask: InspectionResult) {
    this._jobService.completedJobTask(jobTask).subscribe(
      (res) => {
        this._sharedService.success("Success", "Task Completed");
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  //#region  Modal
  open(content, type) {
    if (type === "") {
      // console.log("aici");
      this.modalService.open(content, {}).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    } else {
      this.modalService.open(content).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  //#endregion

  // modal for signature and mileage
  openModal(modal: any) {
    this.activatedModalRef = this.modalService.open(modal);
  }
  closeModal() {
    this.activatedModalRef.close();
  }

  onScrollEvent() {
    let sideBar = [
      { sectionId: "info", tabId: "info-tab" },
      { sectionId: "payments", tabId: "payments-tab" },
      { sectionId: "inspection", tabId: "inspection-tab" },
      { sectionId: "tasks", tabId: "tasks-tab" },
      { sectionId: "concerns", tabId: "concerns-tab" },
      { sectionId: "parts", tabId: "parts-tab" },
      { sectionId: "extTask", tabId: "extTask-tab" },
    ];

    sideBar.forEach((link) => {
      var element = document.getElementById(link.sectionId);
      var position = element.getBoundingClientRect();

      // // checking whether fully visible
      // if (position.top >= 0 && position.bottom <= window.innerHeight) {
      //   console.log('Element is fully visible in screen');
      // }

      // checking for partial visibility
      if (position.top + 100 < window.innerHeight && position.bottom >= 0) {
        // console.log(link.sectionId + ' Element is partially visible in screen');
        if (document.getElementById(link.tabId) != undefined) {
          document.getElementById(link.tabId).classList.add("active");
        }
        sideBar
          .filter((item) => item.sectionId != link.sectionId)
          .forEach((element) => {
            if (document.getElementById(element.tabId) != undefined) {
              document.getElementById(element.tabId).classList.remove("active");
            }
          });
        return;
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener("scroll", this.onScrollEvent, true);
  }
}
