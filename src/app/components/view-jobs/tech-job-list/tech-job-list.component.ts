import { Component, DebugElement, OnInit } from "@angular/core";
import { TechnicianJobsView } from "app/models/technician-jobs-view";
import { JobCardFilter } from "app/models/job-card-filter";
import { InspectionResult } from "app/models/inspection-result";
import { SharedService } from "app/services/shared.service";
import { JobService } from "app/services/job.service";
import { TaskTechnician } from "app/models/task-technician";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TaskProfile } from "app/models/task-profile";
import { TasksAction } from "app/models/tasks-action";
import { BasicInfo } from "app/models/basic-info";
import { JobProcess } from "app/models/job-process";
import { Router } from "@angular/router";
import { JobPart } from "app/models/JobPart";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";
import { JobCardInfo } from "app/models/job-card-info";
import { Appointment } from "app/models/appointment";

@Component({
  selector: "app-tech-job-list",
  templateUrl: "./tech-job-list.component.html",
  styleUrls: ["./tech-job-list.component.scss"],
})
export class TechJobListComponent implements OnInit {
  cPage: number = 1;
  JobCardID: number;
  jobCardArray: TechnicianJobsView;
  filter: JobCardFilter;
  radioTab: boolean;
  jobTask: InspectionResult;
  taskTechnician: Array<TaskTechnician>;
  showMore: boolean = false;
  role: number;
  tt: Array<any>;
  searchQuery: string;
  activatedModalRef: NgbModalRef;
  activatedModalRef1: NgbModalRef;
  taskAction: TasksAction;
  JobTaskID: number;
  taskProfile: TaskProfile;
  changeAssignment: boolean = false;
  JobCard: BasicInfo;
  assignTask: TasksAction;
  TechTypeID: number;
  currentProcess: JobProcess;
  currentPart: JobPart;
  partDeliveryStatus: number;
  jcReviewObj: JobCardInfo;
  imageURL: string;
  heading: string;
  pageNumber = 1;
  AppointmentTotal: number;
  pending: number;
  inProgress: number;
  completed: number;
  rejected: number;
  prepering: number;
  deleverd: number;
  isFilterApplied: boolean;

  constructor(
    public modalService: NgbModal,
    public _sharedService: SharedService,
    private _jobService: JobService,
    private _router: Router
  ) {
    this._sharedService.getTechJobCards.pipe(take(1)).subscribe((data) => {
      this.getJobCards(this.filter.TabID);
    });
    this._sharedService.changeTabID.subscribe((data) => {
      if (data == true) {
        this._sharedService.techJobCardTab = 4;
      } else {
        this._sharedService.techJobCardTab = 2;
      }
    });
  }

  ngOnInit() {
    this.filter = new JobCardFilter();
    this.jobCardArray = new TechnicianJobsView();
    this.jobCardArray.Appointments = new Array<Appointment>();
    this.jobTask = new InspectionResult();
    this.taskTechnician = new Array<TaskTechnician>();
    this.taskProfile = new TaskProfile();
    this.taskAction = new TasksAction();
    this.currentProcess = new JobProcess();
    this.jcReviewObj = new JobCardInfo();
    this.filter.TabID = this._sharedService.techJobCardTab;
    this.getJobCards(this.filter.TabID);
  }

  ngOnDestroy() {
    this._sharedService.changeTabID.unsubscribe();
    this._sharedService.changeTabID = new Subject<boolean>();
  }

  getJobCards(ObjectStatusID: number) {
    this.filter.UserID = this._sharedService.logged_user_id;
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this.filter.UserRoleID = this._sharedService.logged_user_role_id;
    this.filter.TabID = this._sharedService.techJobCardTab;
    this._jobService.getTechnicianJobCards(this.filter).subscribe(
      (res: any) => {
        this.jobCardArray = res;
        if (res.Appointment != undefined) {
          if (res.Appointment.AppointmentCount != undefined) {
            this.AppointmentTotal = res.Appointment.AppointmentCount;
          }
        }

        this._sharedService.loading = false;
        this.pending = this.jobCardArray.JobCardBasicInfo.Pending;
        this.inProgress = this.jobCardArray.JobCardBasicInfo.InProgress;
        this.completed = this.jobCardArray.JobCardBasicInfo.Completed;
        this.rejected = this.jobCardArray.JobCardBasicInfo.Rejected;
        this.prepering = this.jobCardArray.JobCardBasicInfo.Preparing;
        this.deleverd = this.jobCardArray.JobCardBasicInfo.Delivered;

//filter: 51:'JobTaskTypeID
//jp of jobCardArray.JobParts
//filter: jc.JobCardID:'JobCardID';
                               let jobTask=this.jobCardArray.JobTasks.filter(item => item.JobCardID == 12882 && item.LaborDescriptionEng!=null)
                               console.log('jobTask'); 
                               console.log(jobTask);
                               let jobPart= this.jobCardArray.JobParts.filter(item => item.JobCardID == 12882)
                               console.log("jobPart");
                               console.log(jobPart);
                               console.log("All job parts")
                               console.log(this.jobCardArray.JobParts);

      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }
  applyFilter() {
    this.filter.UserID = this._sharedService.logged_user_id;
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this.filter.UserRoleID = this._sharedService.logged_user_role_id;
    this.filter.TabID = this._sharedService.techJobCardTab;
    if (
      this.filter.ProductionYear != undefined ||
      this.filter.MakeID != undefined ||
      this.filter.ModelID != undefined ||
      this.filter.SearchQuery != undefined
    ) {
      this.isFilterApplied = true;
      this._jobService.getTechnicianJobCards(this.filter).subscribe(
        (res: any) => {
          this.jobCardArray = res;
          if (res.Appointment != undefined) {
            if (res.Appointment.AppointmentCount != undefined) {
              this.AppointmentTotal = res.Appointment.AppointmentCount;
            }
          }

          this._sharedService.loading = false;
          this.pending = this.jobCardArray.JobCardBasicInfo.Pending;
          this.inProgress = this.jobCardArray.JobCardBasicInfo.InProgress;
          this.completed = this.jobCardArray.JobCardBasicInfo.Completed;
          this.rejected = this.jobCardArray.JobCardBasicInfo.Rejected;
          this.prepering = this.jobCardArray.JobCardBasicInfo.Preparing;
          this.deleverd = this.jobCardArray.JobCardBasicInfo.Delivered;
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    }
  }
  completeTasks() {
    this.taskTechnician = new Array<TaskTechnician>();
    this.tt = this.jobCardArray.JobTasks.filter(
      (item) => item.JobCardID == this.JobCardID && item.IsAccepted == true
    );
    this.tt.forEach((element: any) => {
      var task: TaskTechnician = new TaskTechnician();
      task.TaskTechnicianID = element.TaskTechnicianID;
      task.JobCardID = element.JobCardID;
      // task.JobTaskID = element.JobTaskID;
      task.IsCompleted = true;
      task.ModifiedBy = this._sharedService.logged_user_id;
      // task.WorkshopID = element.WorkshopID;
      this.taskTechnician.push(task);
    });
    this._jobService.completeTasks(this.taskTechnician).subscribe(
      (res: any) => {
        this.tt.forEach((element) => {
          this.jobCardArray.JobTasks.find(
            (item) => item.JobTaskID == element.JobTaskID
          ).IsCompleted = true;
        });
        this.jobCardArray.JCBasicInfoList.find(
          (item) => item.JobCardID == this.JobCardID
        ).JobTaskStatusID = 3;
        this._sharedService.success("success", "Tasks completed successfully");
        this.activatedModalRef.close();
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  //complete task
  isCompleted(jobTask: InspectionResult) {
    if (jobTask.EmployeeID != undefined) {
      this._jobService.completedJobTask(jobTask).subscribe(
        (res) => {
          var data = this.jobCardArray.JobTasks.find(
            (item) =>
              item.JobCardID == jobTask.JobCardID && item.IsCompleted == false
          );
          if (data == null) {
            this.jobCardArray.JCBasicInfoList.find(
              (item) => item.JobCardID == jobTask.JobCardID
            ).JobTaskStatusID = 3;
          }

          this._sharedService.success("Success", "Task Completed");
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    }
  }

  onKeypressEvent(event: any) {
    this.cPage = 1;
  }
  // technician accept task
  acceptJobTask(task: InspectionResult) {
    this._jobService.acceptTask(task).subscribe(
      (res: any) => {
        task.AcceptedDateTime = res.AcceptedDateTime;
        if (res.TaskStatusID == 18) {
          this._sharedService.warning("Task Rejected");
          this.jobCardArray.JCBasicInfoList.find(
            (item) => item.JobCardID == task.JobCardID
          ).JobTaskStatusID = 4;
        } else {
          this._sharedService.success("Task Accepted");
          this.jobCardArray.JCBasicInfoList.find(
            (item) => item.JobCardID == task.JobCardID
          ).JobTaskStatusID = 2;
        }
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  // technician accept all tasks
  acceptAllTasks(jobCardID: number) {
    this.taskAction.EmployeeID = this._sharedService.logged_user_id;
    this.taskAction.JobCardID = jobCardID;
    var temp: any = this.jobCardArray.JobTasks.find(
      (item) => item.JobCardID == jobCardID
    );
    this.taskAction.RepairTypeID = temp.RepairTypeID;
    this.taskAction.ModifiedBy = this._sharedService.logged_user_id;
    this._jobService.acceptAllTasks(this.taskAction).subscribe(
      (res: any) => {
        if (this.taskAction.TaskStatusID == 18) {
          this._sharedService.warning("Task Rejected");
          this.jobCardArray.JCBasicInfoList.find(
            (item) => item.JobCardID == jobCardID
          ).JobTaskStatusID = 4;
        } else {
          // this.tabID = 2;
          this._router.navigate(["/", "job", "view-tasks"], {
            queryParams: { JobCardID: jobCardID },
          });
          this._sharedService.success("Task Accepted");
          this.jobCardArray.JCBasicInfoList.find(
            (item) => item.JobCardID == jobCardID
          ).JobTaskStatusID = 2;
        }
        this.jobCardArray.JobTasks.forEach((element) => {
          this.jobCardArray.JobTasks.splice(
            this.jobCardArray.JobTasks.findIndex(
              (item) => item.JobCardID == jobCardID
            ),
            1
          );
        });
        res.forEach((element) => {
          this.jobCardArray.JobTasks.push(element);
        });
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  //accept job JobProcess
  acceptJobProcess(
    ProcessStatusID: number,
    ProcessTypeID: number,
    JobCardID: number
  ) {
    //job process id job card id  emp id is accepted
    var jp: any = {
      ProcessStatusID: ProcessStatusID,
      ProcessTypeID:
        this._sharedService.logged_user_role_id == 7 ? 10 : ProcessTypeID,
      JobCardID: JobCardID,
    };
    this._jobService.acceptJobProcess(jp).subscribe(
      (res) => {
        if (jp.ProcessStatusID == 18) {
          // this.jobCardArray.JCBasicInfoList.splice(this.jobCardArray.JCBasicInfoList.findIndex(item => item.JobCardID == jp.JobCardID), 1);
          this.jobCardArray.JCBasicInfoList.find(
            (item) => item.JobCardID == jp.JobCardID
          ).JobTaskStatusID = 4;
          this._sharedService.techJobCardTab = 4;
          this.jobCardArray.JobProcess.find(
            (item) =>
              item.JobCardID == jp.JobCardID &&
              item.ProcessTypeID == jp.ProcessTypeID
          ).ProcessStatusID = 18;
          this._sharedService.warning("Process Rejected");
        } else {
          this._sharedService.success(
            "Success",
            "Job card accepted successfully"
          );
          this.jobCardArray.JCBasicInfoList.find(
            (item) => item.JobCardID == jp.JobCardID
          ).JobTaskStatusID = 2;
          // this.tabID = 2;
          if (ProcessTypeID == 8) {
            this._router.navigate(["/update-job/", +JobCardID, "inspection"]);
            // this._router.navigate(['/', 'update-job', 'inspection'], { queryParams: { JobCardID: JobCardID } });
          } else if (ProcessTypeID == 9) {
            this._router.navigate([
              "/update-job/",
              +JobCardID,
              "inspection-results",
            ]);
          }
          this.jobCardArray.JobProcess.find(
            (item) =>
              item.JobCardID == jp.JobCardID &&
              item.ProcessTypeID == jp.ProcessTypeID
          ).ProcessStatusID = 16;
          this._sharedService.techJobCardTab = 2;
          this.getJobCards(this._sharedService.techJobCardTab);
        }
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  remindPartDelivery(jp: JobPart) {
    this._jobService.RemindPartDelivery(jp.JobPartID, jp.JobCardID).subscribe(
      (res) => {
        this._sharedService.success("Success", "Reminder has been sent");
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  //#region Modal
  openModal(modal: any, id: number) {
    this.JobCardID = id;
    this.activatedModalRef = this.modalService.open(modal);
  }

  closeModal() {
    this.changeAssignment = false;
    this.activatedModalRef.close();
  }
  //#endregion

  //#region Assign Technician
  assignTasks(JobCard: BasicInfo, closeModal?: boolean) {
    if (this.changeAssignment == true) {
      if (this.JobCardID == undefined) {
        this.JobCardID = JobCard.JobCardID;
      }
      this.assignTask = new TasksAction();
      this.assignTask.ModifiedBy = this._sharedService.logged_user_id;
      this.assignTask.RepairTypeID =
        this.TechTypeID == 96 ? 70 : this.TechTypeID == 95 ? 71 : 73;
      this.assignTask.JobCardID = this.JobCardID;
      if (this.TechTypeID == 96) {
        this.assignTask.EmployeeID = JobCard.MechanicID;
      } else if (this.TechTypeID == 95) {
        this.assignTask.EmployeeID = JobCard.ElectricianID;
      } else {
        this.assignTask.EmployeeID = JobCard.OtherTechID;
      }
      this._jobService.assignTasks(this.assignTask).subscribe(
        (res) => {
          if (this.TechTypeID == 96) {
            this.jobCardArray.JCBasicInfoList.find(
              (item) => item.JobCardID == this.assignTask.JobCardID
            ).MechanicID = this.assignTask.EmployeeID;
            if (this.jcReviewObj.JobTasks != undefined) {
              this.jcReviewObj.JobTasks.forEach((item) => {
                if (
                  item.JobCardID == this.assignTask.JobCardID &&
                  item.RepairTypeID == 70
                ) {
                  item.EmployeeID = this.assignTask.EmployeeID;
                }
              });
            }
          } else if (this.TechTypeID == 95) {
            this.jobCardArray.JCBasicInfoList.find(
              (item) => item.JobCardID == this.assignTask.JobCardID
            ).ElectricianID = this.assignTask.EmployeeID;
            if (this.jcReviewObj.JobTasks != undefined) {
              this.jcReviewObj.JobTasks.forEach((item) => {
                if (
                  item.JobCardID == this.assignTask.JobCardID &&
                  item.RepairTypeID == 71
                ) {
                  item.EmployeeID = this.assignTask.EmployeeID;
                }
              });
            }
          } else {
            this.jobCardArray.JCBasicInfoList.find(
              (item) => item.JobCardID == this.assignTask.JobCardID
            ).OtherTechID = this.assignTask.EmployeeID;
            if (this.jcReviewObj.JobTasks != undefined) {
              this.jcReviewObj.JobTasks.forEach((item) => {
                if (
                  item.JobCardID == this.assignTask.JobCardID &&
                  item.RepairTypeID != 70 &&
                  item.RepairTypeID != 71
                ) {
                  item.EmployeeID = this.assignTask.EmployeeID;
                }
              });
            }
          }

          var jc = this.jobCardArray.JCBasicInfoList.find(
            (item) => item.JobCardID == this.assignTask.JobCardID
          );
          if (jc != undefined) {
            jc.JobTaskStatusID = 2;
            this._sharedService.techJobCardTab = 2;
          }

          this.changeAssignment = false;
          if (closeModal) {
            this.activatedModalRef.close();
          }
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

  //for formen from big modal
  assignAllTasks(JobCard: BasicInfo, TaskTypeID: number) {
    this.assignTask = new TasksAction();
    this.assignTask.ModifiedBy = this._sharedService.logged_user_id;
    this.assignTask.RepairTypeID = TaskTypeID;
    this.assignTask.JobCardID = JobCard.JobCardID;
    this.assignTask.EmployeeID =
      TaskTypeID == 70
        ? JobCard.MechanicID
        : TaskTypeID == 71
        ? JobCard.ElectricianID
        : TaskTypeID == 72
        ? JobCard.BodyRepairTechID
        : TaskTypeID == 73
        ? JobCard.sparePartTechID
        : TaskTypeID == 102
        ? JobCard.OtherTechID
        : 139
        ? JobCard.InspectionTechID
        : 0;
    this._jobService.assignTasks(this.assignTask).subscribe(
      (res) => {
        if (this.jcReviewObj.JobTasks != undefined) {
          this.jcReviewObj.JobTasks.forEach((item) => {
            if (
              item.JobCardID == this.assignTask.JobCardID &&
              item.RepairTypeID == this.assignTask.RepairTypeID
            ) {
              item.EmployeeID = this.assignTask.EmployeeID;
            }
          });
        }

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
  }

  openAssignTechnician(modal: any, jobCardID: number, techTypeID: number) {
    this.JobCardID = jobCardID;
    this.TechTypeID = techTypeID;
    this.JobCard = new BasicInfo();
    var data = JSON.stringify(
      this.jobCardArray.JCBasicInfoList.find(
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

  //#region assign IR
  openAssignIRModal(modal: any, jobCardID: number) {
    this.JobCardID = jobCardID;
    this.currentProcess = this.jobCardArray.JobProcess.find(
      (item) => item.JobCardID == jobCardID && item.ProcessTypeID == 9
    );
    this.activatedModalRef = this.modalService.open(modal, {
      backdrop: "static",
    });
  }

  assignJP(jp: JobProcess) {
    if (this.changeAssignment == true) {
      if (jp.EmployeeID != undefined && jp.EmployeeID != jp.CurrentEmployeeID) {
        this._jobService.assignJobProcess(jp).subscribe(
          (res: any) => {
            var index = this.jobCardArray.JobProcess.findIndex(
              (item) =>
                item.JobCardID == jp.JobCardID &&
                item.ProcessTypeID == jp.ProcessTypeID
            );
            this.jobCardArray.JobProcess[index].EmployeeID = res[0].EmployeeID;
            this.jobCardArray.JobProcess[index].JobProcessID =
              res[0].JobProcessID;
            this.jobCardArray.JobProcess[index].JobCardID = res[0].JobCardID;
            this.jobCardArray.JobProcess[index].ProcessTypeID =
              res[0].ProcessTypeID;
            this.jobCardArray.JobProcess[index].ModifiedBy = res[0].ModifiedBy;
            this._sharedService.techJobCardTab = 2;
            var jc = this.jobCardArray.JCBasicInfoList.find(
              (item) => item.JobCardID == jp.JobCardID
            );
            if (jc != undefined) {
              jc.JobTaskStatusID = 2;
            }
            // this.jobCardArray.JobProcess[index].ShowDropdown = false;
            this.activatedModalRef.close();

            if (
              this.jobCardArray.JCBasicInfoList.find(
                (item) => (item.JobCardID = res[0].JobCardID)
              ).CurrentJobStatus == 31
            ) {
              this.jobCardArray.JCBasicInfoList.find(
                (item) => (item.JobCardID = res[0].JobCardID)
              ).CurrentJobStatus = 32;
            }
            this._sharedService.success(
              "Success",
              "Task Assigned Successfully"
            );
          },
          (error) => {
            this._sharedService.error("Error", error.Message);
          }
        );
        this.changeAssignment = false;
        //this.currentProcess = undefined;
      }
    } else {
      this.changeAssignment = false;
      this._sharedService.warning("Error", "No change in assignment");
    }
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

  //#region Part status
  changePartStatus(jobPart: JobPart) {
    if (jobPart.JobPartStatusName != undefined) {
      if (this._sharedService.logged_user_role_id != 8) {
        jobPart.JobPartStatusID =
          this._sharedService._commonMeta.ObjectStatus.find(
            (item) => item.StatusNameEnglish == jobPart.JobPartStatusName
          ).ObjectStatusID;
      }

      this._jobService.changePartStatus(jobPart).subscribe(
        (res: any) => {
          this.jobCardArray.JobParts.find(
            (item) => item.JobPartID == jobPart.JobPartID
          ).JobPartStatusID = 5;
          this._sharedService.success(
            "Success",
            "Status changed Successfully."
          );
          // this.activatedModalRef.close();
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      this._sharedService.warning("Warning", "Please Select Status.");
    }
  }

  openPartDeliveredModal(modal: any, jp: JobPart) {
    var data: any = JSON.stringify(jp);
    this.currentPart = JSON.parse(data);
    this.activatedModalRef = this.modalService.open(modal, {
      backdrop: "static",
    });
  }

  closePartDeliveredModal() {
    this.activatedModalRef.close();
    this.currentPart = undefined;
  }

  //#endregion

  //#region review modal
  openReviewModal(modal: any, jc: BasicInfo) {
    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      backdrop: "static",
    });
    this._jobService.ViewTaskTechnician(jc.JobCardID).subscribe(
      (res: any) => {
        this.jcReviewObj = res;
        this.jcReviewObj.JCBasicInfo = new BasicInfo();
        this.jcReviewObj.JCBasicInfo = jc;
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  //#endregion

  updateJC() {
    this.jcReviewObj.JCBasicInfo.ModifiedBy =
      this._sharedService.logged_user_id;
    this._jobService.updateJC(this.jcReviewObj).subscribe(
      (res) => {
        this.closeModal();
        this._sharedService.success("Success", "Labor cost is updated");

        this.jcReviewObj = new JobCardInfo();
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

  // set data for job card creation
  setAppointmentData(appointmentID: number) {
    debugger;
    var data = this.jobCardArray.Appointments.find(
      (i) => i.AppointmentID == appointmentID
    );
    var checkListArray = this.jobCardArray.JobCardCheckLists.filter(
      (item) =>
        item.AppointmentID == appointmentID && item.CheckListTypeID == 45
    );
    var imageMarkerArray = this.jobCardArray.ImageMarkers.filter(
      (item) => item.AppointmentID == appointmentID
    );
    if (
      data != undefined ||
      checkListArray != undefined ||
      imageMarkerArray != undefined
    ) {
      this._sharedService.appointmentData = data;
      this._sharedService.imageMarker = imageMarkerArray;
      this._sharedService.jobCardCheckList = checkListArray;
    }
  }

  //#region mark complete
  openMarkCompleteModal(modal: any) {
    this.activatedModalRef1 = this.modalService.open(modal, {
      backdrop: "static",
    });
  }

  closeMarkCompleteModal() {
    this.activatedModalRef1.close();
  }

  markIRComplete() {
    this.updateJC();
    // this._sharedService.completeInspectionResult.next(true);

    var valid: boolean = false;
    var concern = this._sharedService.jobObj.JobConcerns.filter(
      (item) => item.ConcernTypeID == 70
    );
    var chk = this.jcReviewObj.JobCardCheckList.filter(
      (item) =>
        item.CheckListTypeID == 46 &&
        (item.StatusID == 11 || item.StatusID == 12 || item.StatusID == 33)
    );
    // var rp = this.jcReviewObj.JobTasks.find(item => item.IsFree == false && (item.LaborPrice == 0 || item.LaborPrice == undefined));
    var rp = this.jcReviewObj.JobTasks.find(
      (item) =>
        item.IsFree == false &&
        (item.LaborCost == 0 || item.LaborCost == undefined)
    );
    if (concern.length > 0) {
      if (chk.length != 10) {
        this._sharedService.warning(
          "Inspection Points",
          "All inspection points needs to be checked."
        );
      } else {
        valid = true;
      }
    } else {
      valid = true;
    }
    if (valid) {
      if (rp != undefined) {
        console.log(rp);
        this._sharedService.warning(
          "Labour Required",
          "Labor is required for all tasks except fitting tasks"
        );
      } else {
        var ProcessStatusID = 17;
        this.jcReviewObj.JCBasicInfo.IRStatusID = 17;
        this.jcReviewObj.JCBasicInfo.IsIRCompleted = true;
        this.jcReviewObj.JCBasicInfo.IsModified = true;
        var jp: any = {
          ProcessStatusID: ProcessStatusID,
          ProcessTypeID: 9,
          JobCardID: this.jcReviewObj.JCBasicInfo.JobCardID,
        };
        this._jobService.completeJobProcess(jp).subscribe(
          (res) => {
            this._sharedService.success(
              "Inspection Results",
              "Process is completed successfully"
            );
          },
          (error) => {
            this._sharedService.error("Error", error.Message);
          }
        );
      }
    }

    this.closeMarkCompleteModal();
  }

  //#endregion

  open(modal: any, url: string, textData: string) {
    this.imageURL = url;
    this.heading = textData;
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }
  clear() {
    if (this.isFilterApplied == true) {
      this.filter.SearchQuery = null;
      this.filter.MakeID = null;
      this.filter.ModelID = null;
      this.filter.ProductionYear = null;
      this.filter.pageNumber = 1;
      this.filter.TabID = 1;
      this.getJobCards(this.filter.TabID);
      this.isFilterApplied = false;
    }
  }
}
