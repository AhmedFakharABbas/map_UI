import { Component, OnInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from "app/services/shared.service";
import { JobService } from "app/services/job.service";
import { JobCardFilter } from "app/models/job-card-filter";
import { JobCardInfo } from "app/models/job-card-info";
import { InspectionResult } from "app/models/inspection-result";
import { JobProcess } from "app/models/job-process";
import { debug } from "console";
import { TaskProfile } from "app/models/task-profile";
import { TasksAction } from "app/models/tasks-action";
import { stringify } from "querystring";
import { BasicInfo } from "app/models/basic-info";
import { JobPart } from "app/models/JobPart";
import { take } from "rxjs/operators";
import { Appointment } from "app/models/appointment";
import { TechnicianJobsView } from "app/models/technician-jobs-view";
import { Subscription } from "rxjs";

@Component({
  selector: "app-view-job-list",
  templateUrl: "./view-job-list.component.html",
  styleUrls: ["./view-job-list.component.scss", "./tab-scroll.scss"],
})
export class ViewJobListComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  searchQuery: string;
  cPage: number = 1;
  JobCardID: number;
  filter: JobCardFilter;
  radioTab: boolean;
  // tabID: number = 19;
  jobTask: InspectionResult;
  assignTask: TasksAction;
  role: number;
  JobTaskID: number;
  TechTypeID: number;
  taskProfile: TaskProfile;
  currentProcess: JobProcess;
  changeAssignment: boolean = false;
  JobCard: BasicInfo;
  imageURL: string;
  heading: string;
  appointmentID: number;
  vehicleObj: JobCardInfo;

  AppointmentCount: number;
  jobCardArray: TechnicianJobsView;
  changeSubscription: Subscription;

  // dropdownID: number;
  constructor(
    public modalService: NgbModal,
    public _sharedService: SharedService,
    private _jobService: JobService
  ) {}

  ngOnInit() {
    debugger;
    this.changeSubscription = this._sharedService.getAllJobCards.subscribe(
      (data) => {
        this.getAllJobCards(this.filter.TabID);
      }
    );
    this.filter = new JobCardFilter();
    this.jobTask = new InspectionResult();
    this._sharedService.jobObj.Appointments = new Array<Appointment>();
    this.taskProfile = new TaskProfile();
    this.JobCard = new BasicInfo();
    // this.getJobCount();
    this.filter.TabID = this._sharedService.jobCardTab;
    this.filter.pageNumber = 1;
    // if(this._sharedService.jobCardTab != 5){
    //     this.filter.queuePageNumber = undefined;
    // }
    // else if(this._sharedService.jobCardTab == 5){
    //   this.filter.pageNumber = undefined;
    // }
    this.getAllJobCards(this.filter.TabID);
  }

  // loadScript(url: string) {
  //   const body = <HTMLDivElement>document.body;
  //   const script = document.createElement('script');
  //   script.innerHTML = '';
  //   script.src = url;
  //   script.async = false;
  //   script.defer = true;
  //   body.appendChild(script);
  // }
  // getJobCount() {
  //   this.filter.UserID = this._sharedService.logged_user_id;
  //   this.filter.WorkshopID = this._sharedService.currentWorkshopID;
  //   this.filter.UserRoleID = this._sharedService.logged_user_role_id;
  //   this._jobService.getJobCardCount(this.filter).subscribe((res: any) => {
  //     //this.jobCardArray = res;
  //     this.AppointmentCount = res.Appointment.AppointmentCount;
  //     this.NewCount = res.JCBasicInfo.NewCount;
  //     this.InspectionCount = res.JCBasicInfo.InspectionCount;
  //     this.WorkCount = res.JCBasicInfo.WorkCount;
  //     this.CompletedCount = res.JCBasicInfo.CompletedCount;

  //   }, error => {
  //     this._sharedService.error('Error', error.Message);
  //   })
  // }
  getAllJobCards(ObjectStatusID: number) {
    debugger;
    this.filter.UserID = this._sharedService.logged_user_id;
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this.filter.UserRoleID = this._sharedService.logged_user_role_id;
    this.filter.TabID = ObjectStatusID;
    // if (ObjectStatusID == 19) {
    //   this.filter.pageNumber = this._sharedService.jobCardPage;
    // }
    // else if (ObjectStatusID == 20) {
    //   this.filter.pageNumber = this._sharedService.jobCardPage;
    // }
    // else if (ObjectStatusID == 21) {
    //   this.filter.pageNumber = this._sharedService.jobCardPage;
    // }
    //  else if (ObjectStatusID == 22) {
    //   this.filter.pageNumber = this._sharedService.jobCardPage;
    // }
    debugger
    this._jobService.getAllJobsData(this.filter).subscribe(
      (res: any) => {
        debugger
        //this.jobCardArray = res;
        this._sharedService.jobObj = res;
        if (this._sharedService.jobObj.Appointments.length > 0) {
          this.AppointmentCount = res.Appointment.AppointmentCount;
          this._sharedService.appointments =
            this._sharedService.jobObj.Appointments;
        }
        // this.loadScript('./assets/js/jquery.steps.min.js');
        // this.loadScript('./assets/js/wizard-steps.js');
        // this.loadScript('./assets/js/process-scroll.js');
        // this.loadScript('./assets/js/navtabs.pkgd.js');
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  ngOnDestroy() {
    this._sharedService.jobObj = new JobCardInfo();
  }

  deleteJobCard() {
    this._jobService.deleteJob(this.JobCardID).subscribe(
      (res: any) => {
        this._sharedService.jobObj.JCBasicInfoList.splice(
          this._sharedService.jobObj.JCBasicInfoList.findIndex(
            (item) => item.JobCardID == this.JobCardID
          ),
          1
        );
        this.activatedModalRef.close();
        this._sharedService.success("success", "Job card deleted successfully");
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  // part delivery status
  changePartStatus(jobPart: JobPart) {
    if (jobPart.JobPartStatusName != undefined) {
      jobPart.JobPartStatusID =
        this._sharedService._commonMeta.ObjectStatus.find(
          (item) => item.StatusNameEnglish == jobPart.JobPartStatusName
        ).ObjectStatusID;
      this._jobService.changePartStatus(jobPart).subscribe(
        (res: any) => {
          this._sharedService.success(
            "Success",
            "Status changed Successfully."
          );
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      this._sharedService.warning("Warning", "Please Select Status.");
    }
  }

  //accept job JobProcess
  acceptJobProcess(jp: JobProcess) {
    //jobprocess id job card id  emp id isaccepted
    this._jobService.acceptJobProcess(jp).subscribe(
      (res) => {
        this._sharedService.success(
          "Success",
          "Job card " +
            (jp.IsAccepted == true ? "accepted" : "rejected") +
            " successfully"
        );
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  // technician accept task
  acceptJobTask(task: InspectionResult) {
    this._jobService.acceptTask(task).subscribe(
      (res) => {
        this._sharedService.success(
          "Success",
          "Job task Accepted Successfully"
        );
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  clearFilters() {
    this.searchQuery = undefined;
    // this.filter = new JobCardFilter();
    this.getAllJobCards(this.filter.TabID);
  }

  //#region Assign Technician
  assignTasks() {
    if (this.changeAssignment == true) {
      this.assignTask = new TasksAction();
      this.assignTask.ModifiedBy = this._sharedService.logged_user_id;
      this.assignTask.RepairTypeID =
        this.TechTypeID == 96
          ? 70
          : this.TechTypeID == 95
          ? 71
          : this.TechTypeID == 97
          ? 102
          : 139;
      this.assignTask.JobCardID = this.JobCardID;
      if (this.TechTypeID == 96) {
        this.assignTask.EmployeeID = this.JobCard.MechanicID;
      } else if (this.TechTypeID == 95) {
        this.assignTask.EmployeeID = this.JobCard.ElectricianID;
      } else if (this.TechTypeID == 97) {
        this.assignTask.EmployeeID = this.JobCard.OtherTechID;
      } else {
        this.assignTask.EmployeeID = this.JobCard.InspectionID;
      }
      this._jobService.assignTasks(this.assignTask).subscribe(
        (res) => {
          if (this.TechTypeID == 96) {
            this._sharedService.jobObj.JCBasicInfoList.find(
              (item) => item.JobCardID == this.assignTask.JobCardID
            ).MechanicID = this.assignTask.EmployeeID;
          } else if (this.TechTypeID == 95) {
            this._sharedService.jobObj.JCBasicInfoList.find(
              (item) => item.JobCardID == this.assignTask.JobCardID
            ).ElectricianID = this.assignTask.EmployeeID;
          } else if (this.TechTypeID == 97) {
            this._sharedService.jobObj.JCBasicInfoList.find(
              (item) => item.JobCardID == this.assignTask.JobCardID
            ).OtherTechID = this.assignTask.EmployeeID;
          } else {
            this._sharedService.jobObj.JCBasicInfoList.find(
              (item) => item.JobCardID == this.assignTask.JobCardID
            ).InspectionID = this.assignTask.EmployeeID;
          }

          this.changeAssignment = false;
          this.activatedModalRef.close();
          this._sharedService.success(
            "Success",
            "Technician Assigned successfully"
          );
        },
        (error) => {
          this.activatedModalRef.close();
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      this.changeAssignment = false;
      this._sharedService.warning("Error", "No change in assignment");
    }
  }

  assignSupForeman() {
    if (
      this.TechTypeID == 1
        ? this.JobCard.PreferredForemanID != undefined ||
          this.JobCard.PreferredForemanID != null
        : this.JobCard.SupervisorID != undefined ||
          this.JobCard.SupervisorID != null
    ) {
      var index = this._sharedService.jobObj.JCBasicInfoList.findIndex(
        (item) => item.JobCardID == this.JobCard.JobCardID
      );
      this._sharedService.jobObj.JCBasicInfoList[index] = this.JobCard;
      this._jobService
        .assignSupForeman(this.JobCard, this.TechTypeID == 1 ? 5 : 4)
        .subscribe(
          (res) => {
            var jc = this._sharedService.jobObj.JCBasicInfoList.find(
              (item) => item.JobCardID == this.JobCard.JobCardID
            );
            if (this.TechTypeID == 1) {
              if (
                this.JobCard.PreferredForemanID == undefined ||
                this.JobCard.PreferredForemanID == null
              ) {
                jc.ForemanName = undefined;
                jc.PreferredForemanID = undefined;
              } else {
                jc.ForemanName = this._sharedService.jobObj.UserRoles.find(
                  (item2) => item2.UserID == this.JobCard.PreferredForemanID
                ).EmployeeFullName;
                jc.PreferredForemanID = this.JobCard.PreferredForemanID;
              }
            } else {
              if (
                this.JobCard.SupervisorID == undefined ||
                this.JobCard.SupervisorID == null
              ) {
                jc.SupervisorName = undefined;
                jc.SupervisorID = undefined;
              } else {
                jc.SupervisorName = this._sharedService.jobObj.UserRoles.find(
                  (item2) => item2.UserID == this.JobCard.SupervisorID
                ).EmployeeFullName;
                jc.SupervisorID = this.JobCard.SupervisorID;
              }
            }

            this.activatedModalRef.close();
            this._sharedService.success(
              "Success",
              "Employee Assigned Successfully!"
            );
          },
          (error) => {
            this._sharedService.error("Error", error.Message);
          }
        );
    } else {
      this._sharedService.warning(
        "Warning",
        "Please select employee to assign!"
      );
    }
  }

  openAssignTechnician(modal: any, jobCardID: number, techTypeID: number) {
    this.JobCardID = jobCardID;
    this.TechTypeID = techTypeID;
    this.JobCard = new BasicInfo();
    var data = JSON.stringify(
      this._sharedService.jobObj.JCBasicInfoList.find(
        (item) => item.JobCardID == jobCardID
      )
    );
    this.JobCard = JSON.parse(data);
    this.activatedModalRef = this.modalService.open(modal);
  }

  closeAssignTechModal() {
    this.TechTypeID = undefined;
    this.JobCardID = undefined;
    this.JobCard = new BasicInfo();
    this.activatedModalRef.close();
  }
  //#endregion

  //#region Modal
  openModal(modal: any, id: number) {
    this.JobCardID = id;
    this.activatedModalRef = this.modalService.open(modal);
  }

  closeModal() {
    this.activatedModalRef.close();
  }

  openDeleteQueueModal(modal: any, id: number) {
    this.appointmentID = id;
    this.activatedModalRef = this.modalService.open(modal);
  }

  closeDeleteQueueModal() {
    this.activatedModalRef.close();
  }
  //#endregion

  //#region task profile
  openTaskModal(modal: any, id: number) {
    this.JobTaskID = id;
    this.activatedModalRef = this.modalService.open(modal, {
      backdrop: "static",
      size: "xl",
    });
    this.getTaskProfile();
  }

  getTaskProfile() {
    this._jobService.getTaskProfile(this.JobTaskID).subscribe(
      (res: any) => {
        this.taskProfile = res;
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }
  closeTaskModal() {
    this.activatedModalRef.close();
    this.taskProfile = new TaskProfile();
  }
  //#endregion

  //collapse jc
  collapseJC($event: any, jcID: number) {
    if (document.getElementById("card" + jcID).classList.contains("show")) {
      $(event.target).removeClass("fa-chevron-up");
      $(event.target).addClass("fa-chevron-down");
    } else {
      $(event.target).removeClass("fa-chevron-down");
      $(event.target).addClass("fa-chevron-up");
    }
  }

  //#region Assign Process modal
  openAssignModal(modal: any, jp: JobProcess) {
    var data: any = JSON.stringify(jp);
    this.currentProcess = JSON.parse(data);
    this.activatedModalRef = this.modalService.open(modal, {
      backdrop: "static",
    });
  }

  closeAssignModal() {
    this.activatedModalRef.close();
    this.currentProcess = undefined;
  }

  onKeypressEvent(event: any) {
    this.cPage = 1;
  }

  // assiging process to employee
  assignJP(jp: JobProcess) {
    if (this.changeAssignment == true) {
      if (jp.EmployeeID != undefined && jp.EmployeeID != jp.CurrentEmployeeID) {
        this._jobService.assignJobProcess(jp).subscribe(
          (res: any) => {
            var index = this._sharedService.jobObj.JobProcess.findIndex(
              (item) =>
                item.JobCardID == jp.JobCardID &&
                item.ProcessTypeID == jp.ProcessTypeID
            );
            this._sharedService.jobObj.JobProcess[index].EmployeeID =
              res[0].EmployeeID;
            this._sharedService.jobObj.JobProcess[index].EmployeeFullName =
              this._sharedService.jobObj.Employees.find(
                (item) => item.UserID == res[0].EmployeeID
              ).EmployeeFullName;
            this._sharedService.jobObj.JobProcess[index].JobProcessID =
              res[0].JobProcessID;
            this._sharedService.jobObj.JobProcess[index].JobCardID =
              res[0].JobCardID;
            this._sharedService.jobObj.JobProcess[index].ProcessTypeID =
              res[0].ProcessTypeID;
            this._sharedService.jobObj.JobProcess[index].ProcessStatusID = 15;
            // this._sharedService.jobObj.JobProcess[index].TypeNameEnglish = res[0].TypeNameEnglish;
            this._sharedService.jobObj.JobProcess[index].ModifiedBy =
              res[0].ModifiedBy;
            // this._sharedService.jobObj.JobProcess[index].ShowDropdown = false;
            this.activatedModalRef.close();
            if (
              this._sharedService.jobObj.JCBasicInfoList.find(
                (item) => item.JobCardID == res[0].JobCardID
              ).CurrentJobStatus == 19
            ) {
              this._sharedService.jobObj.JCBasicInfoList.find(
                (item) => item.JobCardID == res[0].JobCardID
              ).CurrentJobStatus = 20;
            }
            ////change tab when assigning valet
            // if (jp.ProcessTypeID == 8) {
            //   var index = this._sharedService.jobObj.JCBasicInfoList.findIndex(item => item.JobCardID == jp.JobCardID);
            //   if(index > -1){
            //     this._sharedService.jobObj.JCBasicInfoList[index].CurrentJobStatus = 20;
            //     console.log( this._sharedService.jobObj.JCBasicInfoList[index].CurrentJobStatus);
            //   }
            // }
            this._sharedService.success(
              "Success",
              "Task Assigned Successfully"
            );

            this.currentProcess = undefined;
          },
          (error) => {
            this._sharedService.error("Error", error.Message);
          }
        );
        this.changeAssignment = false;
      }
    } else {
      this.changeAssignment = false;
      this._sharedService.warning("Error", "No change in assignment");
    }
  }

  //#endregion

  openFile(jobCardID: number) {
    var jc = this._sharedService.jobObj.JCBasicInfoList.find(
      (item) => item.JobCardID == jobCardID
    );
    if (jc != undefined) {
      var url = this._sharedService.baseUrl + jc.TaxDocumentURL;

      var fileURL: any = url;
      var a = document.createElement("a");
      a.href = fileURL;
      a.target = "_blank";
      // Don't set download attribute
      // a.download = "Example.pdf";
      a.click();
    }
  }

  setTaxFree(isApproved: boolean, jobCardID: number) {
    this._jobService.SetTaxFree(isApproved, jobCardID).subscribe(
      (res: any) => {
        this._sharedService.success("Success", "Tax Free Card approved.");
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  setNotTaxFree(isApproved: boolean, jobCardID: number) {
    this._jobService.SetTaxFree(isApproved, jobCardID).subscribe(
      (res: any) => {
        this._sharedService.success("Success", "Tax Free Card rejected.");
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  deleteAppointment(appointmentID: number) {
    this._jobService.deleteAppointment(appointmentID).subscribe(
      (res: any) => {
        this._sharedService.jobObj.Appointments.splice(
          this._sharedService.jobObj.Appointments.findIndex(
            (i) => i.AppointmentID == appointmentID
          ),
          1
        );
        this._sharedService.success(
          "Success",
          "Appointment Deleted Successfully."
        );
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  setAppointmentData(app: Appointment) {
    debugger;
    // var data = this._sharedService.jobObj.Appointments.find(i => i.AppointmentID == app.AppointmentID);
    // if (data != undefined) {
    this._sharedService.appointmentData = app;

    // }
  }

  // setAppointmentData(appointmentID: number) {
  //   debugger
  //       var data = this._sharedService.appointments.find(i => i.AppointmentID == appointmentID);
  //       var checkListArray = this._sharedService.jobCardCheckList.filter(item => item.AppointmentID == appointmentID && item.CheckListTypeID == 45);
  //       var imageMarkerArray = this._sharedService.imageMarker.filter(item => item.AppointmentID == appointmentID);
  //       if (data != undefined || checkListArray != undefined || imageMarkerArray != undefined) {
  //         this._sharedService.appointmentData = data;
  //         this._sharedService.imageMarker = imageMarkerArray;
  //         this._sharedService.jobCardCheckList = checkListArray;
  //       }
  //     }

  open(modal: any, url: string, textData: string) {
    this.imageURL = url;
    this.heading = textData;
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }
  clear() {
    this.filter.SearchQuery = null;
    this.filter.MakeID = null;
    this.filter.ModelID = null;
    this.filter.ProductionYear = null;
    this.filter.pageNumber = 1;
    this._sharedService.jobCardTab = 19;
    this.filter.TabID = 19;
    this.filter.queuePageNumber = 1;
    this.getAllJobCards(this.filter.TabID);
  }
}
