import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InspectionResult } from 'app/models/inspection-result';
import { JobPart } from 'app/models/JobPart';
import { JobService } from 'app/services/job.service';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss']
})
export class ViewTasksComponent implements OnInit {

  JobCardID: number;
  currentPart: JobPart;
  activatedModalRef: NgbModalRef;
  LaborTaskID: number = 0;
  workTypeID: number = 71;
  modalHeader: string;
  shouldUpdate: boolean = false;
  currentImg: string;



  constructor(public modalService: NgbModal, private route: ActivatedRoute, public _sharedService: SharedService, private _jobService: JobService) {

    this._sharedService.getTasks.subscribe(
      (data) => {
        this.ViewTaskTechnician();
      }
    );

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.JobCardID = +params['JobCardID'];
    })
    this.ViewTaskTechnician();
  }

  ViewTaskTechnician() {
    this._jobService.ViewTaskTechnician(this.JobCardID).subscribe((res: any) => {
      this._sharedService.jobObj = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  // start TAsk
  startTask(jobTask: InspectionResult) {
    this._jobService.startTask(jobTask.JobTaskID, this._sharedService.logged_user_id).subscribe((res: any) => {
      this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jobTask.JobTaskID).StartDateTime = res.StartDateTIme;
      this._sharedService.success('Success', 'Task Started!');
      jobTask.AcceptedDateTime = new Date();
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  //complete task
  isCompleted(jobTask: InspectionResult) {

    var temp: any;
    this._sharedService.jobObj.JobTasks.forEach(el => {
      if (el.JobTaskID == jobTask.JobTaskID) {
        temp = this._sharedService.jobObj.JobParts.filter(item => item.JobTaskID == el.JobTaskID && item.JobPartStatusID != 5 && item.IsInclude == true);
      }
    })

    if (temp.length == 0) {
      jobTask.TaskStatusID = 17;
      jobTask.EmployeeID = this._sharedService.logged_user_id;
      if (jobTask.EmployeeID != undefined) {
        this._jobService.completedJobTask(jobTask).subscribe((res: any) => {
          this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jobTask.JobTaskID).ActualTimeSpent = res.ActualTimeSpent;
          this._sharedService.success('Success', 'Task Completed');
        }, error => {
          this._sharedService.error('Error', error.Message);
        })
      }
    }
    else {
      this._sharedService.warning('warning', 'All parts must be received for this task!');
    }

  }

  //#region part Status
  changePartStatus(jobPart: JobPart) {
    if (jobPart.JobPartStatusName != undefined) {
      jobPart.JobPartStatusID = 5;
      this._jobService.changePartStatus(jobPart).subscribe((res: any) => {
        this._sharedService.jobObj.JobParts.find(item => item.JobPartID == jobPart.JobPartID).JobPartStatusID = 5;
        this._sharedService.success('Success', 'Status changed Successfully.');
        this.activatedModalRef.close();
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
    else {
      this._sharedService.warning('Warning', 'Please Select Status.');
    }
  }

  openPartDeliveredModal(modal: any, jp: JobPart) {
    var data: any = JSON.stringify(jp);
    this.currentPart = JSON.parse(data);
    this.activatedModalRef = this.modalService.open(modal, { backdrop: 'static' });
  }

  closePartDeliveredModal() {
    this.activatedModalRef.close();
    this.currentPart = undefined;
  }
  //#endregion

  remindPartDelivery(jp: JobPart) {
    this._jobService.RemindPartDelivery(jp.JobPartID, jp.JobCardID).subscribe(res => {
      this._sharedService.success('Success', 'Reminder has been sent');
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  openTaskCheckListModal(modal: any, laborTaskID: number) {
    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      windowClass: 'modalTop',
      backdrop: 'static'
    });
  }

  closeTaskCheckListModal() {
    this.activatedModalRef.close();
  }

  updateCheckList() {

    var jcl = this._sharedService.jobObj.JobCardCheckList.filter(item => item.IsModified == true);
    jcl.forEach(element => {
      element.JobCardID = this.JobCardID;
    });

    if (jcl.length > 0) {
      this._jobService.updateCheckList(jcl).subscribe((res: any) => {
        this._sharedService.success('Success', 'Check List Updated Successfully.');
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
  }

  checkList(CheckListTypeID: number) {
    
    var data = this._sharedService.jobObj.JobCardCheckList.filter(item => item.CheckListTypeID == CheckListTypeID && item.StatusID != 0);
    if (data.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  galleryPreviewModal(modal: any, image: any) {
    this.currentImg = image.ImageURL;
    // this.activatedModalRef = this.modalService.open(modal);
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    // console.log("image gallery preview ", image , idx);
    this.shouldUpdate = true;
  }

}
