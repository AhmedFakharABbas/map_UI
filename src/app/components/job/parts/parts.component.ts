import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from 'app/services/shared.service';
import { JobPart } from 'app/models/JobPart';
import { JobService } from 'app/services/job.service';

@Component({
  selector: "app-parts",
  templateUrl: "./parts.component.html",
  styleUrls: ["./parts.component.scss"]
})
export class PartsComponent implements OnInit {
  closeResult: string;
  part: JobPart;
  activatedModalRef: NgbModalRef;

  constructor(private modalService: NgbModal, public _sharedService: SharedService, private _jobService: JobService) { }

  ngOnInit() { 
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/parts") > -1);
    }
    // if (this._sharedService.jobObj.JCBasicInfo.JobCardID != undefined) {
    //   this.dumpParts();
    // }
  }

  // dumpParts() {
  //   this._sharedService._basicInfoMeta.AutomotivePart = this._sharedService.jobObj.AutomotivePart
  // }

  getPartPrice() {
    return this.part.SellingPrice = this._sharedService.AutomotiveParts.find(item => item.AutomotivePartID == this.part.AutomotivePartID).NetPrice;
  }

  getVendorPartPrice() {
    this.part.SellingPrice = 0;
    var temp = this._sharedService._basicInfoMeta.VendorPartPrice.find(item => item.AutomotivePartID == this.part.AutomotivePartID).PartPrice;
    return this.part.SellingPrice = temp;
  }

  // now ui modal 
  submitPart() {
    this.part.IsModified = true;

    var concernTemp = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.part.JobConcernID);
    if (concernTemp != undefined && concernTemp.ConcernDescription != undefined) {
      this.part.ConcernDescription = concernTemp.ConcernDescription;
    }
    var taskTemp = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID);
    if (taskTemp != undefined && taskTemp.TaskDescription != undefined) {
      this.part.TaskDescription = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID).TaskDescription;
    }
    this.part.JobPartID = Math.floor((Math.random() * -1000) - 1);
    //this.part.PartNameEnglish = this._sharedService._basicInfoMeta.AutomotivePart.find(item => item.AutomotivePartID == this.part.AutomotivePartID).PartNameEnglish;

    this._sharedService.jobObj.JobParts.push(this.part);


    this.activatedModalRef.close();
    this.part = new JobPart();
  }

  open(modal: any) {
    this.part = new JobPart();
    this.activatedModalRef = this.modalService.open(modal, { size: 'lg' });
  }

  openEdit(modal: any, part: JobPart) {
    this.part = part;
    this.activatedModalRef = this.modalService.open(modal, { size: 'lg' });
  }

  editPart() {
    this.part.IsModified = true;
    var concernTemp = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.part.JobConcernID);
    var taskTemp = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID);
    if (concernTemp != undefined && concernTemp.ConcernDescription != undefined) {
      this.part.ConcernDescription = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.part.JobConcernID).ConcernDescription;
    }
    if (taskTemp != undefined && taskTemp.TaskDescription != undefined) {
      this.part.TaskDescription = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID).TaskDescription;
    }
    this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.part.JobPartID);
    this.activatedModalRef.close();
    this.part = new JobPart();
  }

  openDelete(modal: any, jp: JobPart) {
    this.part = jp;
    this.activatedModalRef = this.modalService.open(modal);
  }
  delete() {
    var index = this._sharedService.jobObj.JobParts.findIndex(item => item.JobPartID == this.part.JobPartID)
    if (this.part.JobPartID < 0)
      this._sharedService.jobObj.JobParts.splice(index, 1);
    else {
      this._jobService.deleteJobPart(this.part.JobPartID).subscribe((res: any) => {
        this._sharedService.jobObj.JobParts.splice(index, 1);
        this.activatedModalRef.close();
        this._sharedService.success('success', 'Part deleted successfully')
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
    this.activatedModalRef.close();
  }

  dismissModal() {
    this.activatedModalRef.dismiss();
  }

  closeModal() {
    this.activatedModalRef.close();
  }

  resetFieldsMain() {
    // partsFormData.reset();
    this.part.SubCategoryID = undefined;
    this.part.SubSubCategoryID = undefined;
    this.part.AutomotivePartID = undefined;
    this.part.SellingPrice = undefined;
    this.part.VendorID = undefined;
  }

  resetFieldsSub() {
    this.part.SubSubCategoryID = undefined;
    this.part.AutomotivePartID = undefined;
    this.part.SellingPrice = undefined;
    this.part.VendorID = undefined;
  }

  resetFieldsPart() {
    //this.part.AutomotivePartID = undefined;
    this.part.VendorID = undefined;
  }
  // resetFields2(){
  //   //this.part.AutomotivePartID = undefined;
  //   this.part.VendorID = undefined;
  //   this.part.SellingPrice = undefined;
  // }
}
