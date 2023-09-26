import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
import { JobService } from 'app/services/job.service';
import { InspectionResult } from 'app/models/inspection-result';
import { JobProcess } from 'app/models/job-process';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { NgbModal, NgbModalRef, NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Checklist } from 'app/models/checklist';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss']
})
export class QaComponent implements OnInit {
  IsSorted: boolean = false;
  activatedModalRef: NgbModalRef;
  LaborTaskID: number = 0;
  workTypeID: number = 71;
  tabID: number;
  shouldUpdate: boolean = false;
  @ViewChild('tabset', { static: false }) tabSet: NgbTabset;
  constructor(public _sharedService: SharedService, private _jobService: JobService, public modalService: NgbModal) { }

  ngOnInit() {
    this.tabID = 1;
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/qa") > -1);
    }
  }

  taskVerification(jobTask: InspectionResult) {

    this._jobService.taskVerification(jobTask).subscribe(res => {
      this._sharedService.success('Success', 'Task Completed');
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }


  completeJobProcess(ProcessStatusID: number) {
    
    var chk = this._sharedService.jobObj.JobCardCheckList.findIndex(item => item.CheckListTypeID == 47 && item.IsChecked == false);
    if (chk == -1) {
      var jp: any = { ProcessStatusID: ProcessStatusID, ProcessTypeID: 12, JobCardID: this._sharedService.jobObj.JCBasicInfo.JobCardID };
      // this._sharedService.jobObj.JCBasicInfo.ModifiedBy = this._sharedService.logged_user_id;
      // jp.JobCardID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
      // jp.JobProcessID = this._sharedService.jobObj.JobProcess[this._sharedService.qaIndex].JobProcessID;
      this._jobService.completeJobProcess(jp).subscribe(res => {
        let element: HTMLElement = document.getElementById('updateExitJob') as HTMLElement;
        element.click();
        this._sharedService.success('Success', 'Process Completed');
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
    else {
      this._sharedService.jobObj.JCBasicInfo.QAStatusID = 16;
      this._sharedService.error('Error', 'Please mark Checklist.');
    }

  }

  onSort() {
    if (this.IsSorted == true) {
      this._sharedService.jobObj.JobTasks.sort((a, b) => a.PriorityTypeID > b.PriorityTypeID ? -1 : a.PriorityTypeID < b.PriorityTypeID ? 1 : 0);
    }
    else {
      this._sharedService.jobObj.JobTasks.sort((a, b) => a.PriorityTypeID < b.PriorityTypeID ? -1 : a.PriorityTypeID > b.PriorityTypeID ? 1 : 0);

    }
  }

  collapseConcern($event: any, concernID: number) {
    if (document.getElementById('concern' + concernID).classList.contains('show')) {
      $(event.target).removeClass('fa-chevron-up');
      $(event.target).addClass('fa-chevron-down');
    }
    else {
      $(event.target).removeClass('fa-chevron-down');
      $(event.target).addClass('fa-chevron-up');
    }
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

  public preventChange($event: NgbTabChangeEvent) {
    if ($event.nextId != this.tabID.toString()) {
      $event.preventDefault();
    }
  }

  changeTab(isNext: boolean, isExit?: boolean) {
    if (this.checkData()) {
      if (isNext == true) {
        this.tabID++;
      }
      else {
        this.tabID--;
      }
      this.tabSet.select(this.tabID.toString());
      if (this.shouldUpdate == true) {
        let element: HTMLElement;
        if(isExit){
          element = document.getElementById('updateExitJob') as HTMLElement;
        }
        else{
          this._jobService.updateJobCardChecklist().subscribe(response =>{
            console.log(response)
          }, error => {

          })
        // element = document.getElementById('updateJob') as HTMLElement;
        // this._jobService.updateJobCardChecklist(this._sharedService.jobObj.JobCardCheckList.filter(item => item.IsModified == true))
        //       }
        
        // element.click();
        this.shouldUpdate = false;
       
      }
    }}
  }

  checkData() {
    if (this.tabID == 1) { 
      if (this._sharedService.jobObj.JobCardCheckList.findIndex(item => item.CheckListTypeID == 47 && item.IsChecked == false) > -1) {
        this._sharedService.warning("Warning", "QA Checklist needs to be checked.");
        return false;
      }
      else {
        return true;
      }
    } 
    else {
      return true;
    }
  }

}
