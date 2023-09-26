import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Checklist } from 'app/models/checklist';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-inspection-results-view',
  templateUrl: './inspection-results-view.component.html',
  styleUrls: ['./inspection-results-view.component.scss']
})
export class InspectionResultsViewComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  checklist: Checklist;
  activatedModalRef1: NgbModalRef;
  constructor(private modalService: NgbModal, public _sharedService: SharedService) { }

  ngOnInit() {
      if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0 && this._sharedService.logged_user_role_id != 4 && this._sharedService.logged_user_role_id != 5) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/inspection-results-view") > -1);
    }
  }

  viewNote(modal: any, cl: Checklist) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    this.checklist = new Checklist();
    this.checklist = cl;
  }

  // collapseConcern($event: any, concernID: number) {
  //   if (document.getElementById('concern' + concernID).classList.contains('show')) {
  //     $(event.target).removeClass('fa-chevron-up');
  //     $(event.target).addClass('fa-chevron-down');
  //   }
  //   else {
  //     $(event.target).removeClass('fa-chevron-down');
  //     $(event.target).addClass('fa-chevron-up');
  //   }
  // }
  collapseConcern(concernID: number) {
    //var tmp = document.getElementById('a'+concernID);
    var data = document.getElementById('chevron' + concernID)
    if (data.classList.contains('fa-chevron-down')) {
      data.classList.add('fa-chevron-up');
      data.classList.remove('fa-chevron-down');
    }
    else {
      data.classList.add('fa-chevron-down');
      data.classList.remove('fa-chevron-up');
    }
  }
  collapseOtherForm(closeRepair: boolean, closePart: boolean, index?: boolean) {
    // if (index != undefined) {
    //   if (closeRepair) {
    //     var temp = document.getElementById('create-repair' + index);
    //     temp.classList.add('show');

    //   }
    //   else if (closeRepair == false) {
    //     document.getElementById('create-repair' + index).classList.remove('show');
    //   }
    //   if (closePart) {
    //     document.getElementById('create-part' + index).classList.add('show');
    //   }
    //   else if (closePart == false) {
    //     document.getElementById('create-part' + index).classList.remove('show');
    //   }
    // }
    // else {
    //   if (closeRepair) {
    //     document.getElementById('create-repair').classList.add('show');
    //   }
    //   else if (closeRepair == false) {
    //     document.getElementById('create-repair').classList.remove('show');
    //   }
    //   if (closePart) {
    //     document.getElementById('create-part').classList.add('show');
    //   }
    //   else if (closePart == false) {
    //     document.getElementById('create-part').classList.remove('show');
    //   }
    // }
  }
  
  collapseOtherRepairs(event: any) {
    var tmp = document.getElementById('chevronOtherRep');
    if (tmp.classList.contains('fa-chevron-up')) {
      tmp.classList.remove('fa-chevron-up');
      tmp.classList.add('fa-chevron-down');
    }
    else {
      tmp.classList.remove('fa-chevron-down');
      tmp.classList.add('fa-chevron-up');
    }
  }
  collapseOtherParts($event: any) {
    var tmp = document.getElementById('chevronOtherPart');
    if (tmp.classList.contains('fa-chevron-up')) {
      tmp.classList.remove('fa-chevron-up');
      tmp.classList.add('fa-chevron-down');
    }
    else {
      tmp.classList.remove('fa-chevron-down');
      tmp.classList.add('fa-chevron-up');
    }
  }
  openProcessModal(modal: any) {
    if (this._sharedService.logged_user_id != undefined) {
        this._sharedService.isProcessModalOpened = true;
        this.activatedModalRef1 = this.modalService.open(modal, { backdrop: 'static' });
        // var x = <HTMLVideoElement>document.getElementById("alertAudioSup");
        // x.volume = 0.2;
        // x.play();

    }
}
closeProcessModal() {
    // if (this._sharedService.notifications.length == 1) {
    //     this.activatedModalRef1.close();
    //     this._sharedService.isProcessModalOpened = false;
    // }
    // if (this._router.url.includes('/job/list') || this._router.url.includes('/job/job-list')) {
    //     this._sharedService.getAllJobCards.next(true);
    // }
    // if (this._router.url.includes('/job/job-list')) {
    //     this._sharedService.getTechJobCards.next(true);
    // }
    // else {
    this.activatedModalRef1.close();
    // this._sharedService.isProcessModalOpened = false;
    // this._sharedService.notifications = new Array<UserNotification>();

    // 
    // }
    // var x = <HTMLVideoElement>document.getElementById("alertAudioSup");
    // x.pause();
}
updateJobProcess(){
  console.log("JobProcess",this._sharedService.jobObj.JobProcess);
  this._sharedService.jobObj.JobSingleProcess = this._sharedService.jobObj.JobProcess.find(item => item.ProcessTypeID == 9)
  this._sharedService.jobObj.JobSingleProcess.IsOpenedAgain = true;
  this._sharedService.jobObj.JCBasicInfo.IsOpenedAgain = true;
  ;
  //  for (let i = 0; i < this._sharedService.jobObj.JobProcess.length; i++) {
  //   if (this._sharedService.jobObj.JobProcess[i].ProcessTypeID >= 9 && this._sharedService.jobObj.JobProcess[i].ProcessTypeID <= 11) {
  //     jp[i] =  this._sharedService.jobObj.JobProcess[i];
  //     jp[i].IsOpenedAgain = true;
  //   }
    
  //  }
   console.log('JobSingleProcess',this._sharedService.jobObj.JobSingleProcess);
}

}
