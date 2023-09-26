import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
  NgbModal,
  NgbModalRef,
  NgbTabChangeEvent,
  NgbTabset,
} from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from "app/services/shared.service";
import { InspectionResult } from "app/models/inspection-result";
import { JobService } from "app/services/job.service";
import { JobPart } from "app/models/JobPart";
import { ResizeOptions, ImageCompressService } from "ng2-image-compress";
import { Gallery } from "app/models/Gallery";
import { CommonService } from "app/services/common.service";
import { FileUploader } from "ng2-file-upload";
import { Router } from "@angular/router";
import { JobConcern } from "app/models/job-concern";
import { TaskProfile } from "app/models/task-profile";
import { debug } from "console";
import { ChangeDetectionStrategy } from "@angular/core";
import { Checklist } from "app/models/checklist";
import { Part } from "app/models/part";
import { concat, Observable, of, Subject } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  switchMap,
  tap,
} from "rxjs/operators";
import { MainPart } from "app/models/main-part";
import { MainCategory } from "app/models/main-category";
import { SubCategory } from "app/models/sub-category";
import { element } from "protractor";
import { PartMeta } from "app/models/part-meta";
import { PartService } from "app/services/part.service";
// import { SharedService } from 'app/services/shared.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-inspection-results",
  templateUrl: "./inspection-results.component.html",
  styleUrls: ["./inspection-results.component.scss"],
})
export class InspectionResultsComponent implements OnInit {
  closeResult: string;
  inspectionResult: InspectionResult;
  activatedModalRef: NgbModalRef;
  activatedModalRef2: NgbModalRef;
  part: JobPart;
  repairType: number = 2;
  showMore: boolean = false;
  isExpanded: boolean = false;
  concernID: number;
  laborDescription: any;
  currentImg: Gallery;
  imageObj: Gallery;
  compressedImages: Array<Gallery>;
  ImgCounter: number = 0;
  response: string;
  encryptedName: string;
  TaskID: number;
  rotate: boolean;
  concernTypeID: number;
  partPreview: JobPart;
  JobTaskID: number;
  taskProfile: TaskProfile;
  verify_task: InspectionResult;
  task: InspectionResult;
  autoDeleteTask: boolean = false;
  counter: number;
  tabID: number = 1;
  shouldUpdate: boolean = false;
  addPart: boolean = false;
  addService: boolean = false;
  searchQuery: string;
  suggestedParts: Array<MainPart>;
  markAll: number;
  partInput$ = new Subject<string>();
  partName: string;
  MainCategoryID: number;
  SubCategoryID: number;
  _meta: PartMeta;

  action_state: boolean;

  selected_concern_name: string;
  checklist: Checklist;

  @ViewChild("tabset", { static: false }) tabSet: NgbTabset;

  public uploader: FileUploader = new FileUploader({
    url: this._sharedService.baseUrl + "api/Common/SaveFiles",
  });
  content: string;
  deleteContentModel: NgbModalRef;
  constructor(
    private modalService: NgbModal,
    public _sharedService: SharedService,
    private _jobService: JobService,
    private _commonService: CommonService,
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private _partService: PartService
  ) {
    this._sharedService.completeInspectionResult.subscribe((data) => {
      this.completeJobProcess();
    });
    this.partSearch = this.partSearch.bind(this);
  }

  ngOnInit() {
    this.getMetaData();
    console.log(
      "IsOpenedAgain",
      this._sharedService.jobObj.JCBasicInfo.IsOpenedAgain
    );
    console.log("17", this._sharedService.jobObj.JCBasicInfo.ApprovalStatusID);
    if (
      this._sharedService.routesArray != undefined &&
      this._sharedService.routesArray.length > 0
    ) {
      this._sharedService.currentRouteIndex =
        this._sharedService.routesArray.findIndex(
          (item) => item.name.indexOf("/inspection-results") > -1
        );
    }

    this.tabID = 1;
    $.getScript("../../../assets/js/time-input.js");

    this.TaskID = Math.floor(Math.random() * -1000 - 1);

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (response != "") {
        this._sharedService.loading = false;
        if (this.imageObj == undefined) {
          this.imageObj = new Gallery();
        }
        debugger;

        this.imageObj = new Gallery();
        this.imageObj.GalleryID = Math.floor(Math.random() * -1000 - 1);
        this.imageObj.IsVideo = true;
        this.imageObj.GalleryTypeID = 50;
        this.imageObj.ObjectID = this.TaskID;
        this.imageObj.IsModified = true;
        this.imageObj.ImageURL = JSON.parse(response);

        this._sharedService.jobObj.Gallery.push(this.imageObj);
        this.imageObj = new Gallery();
        this.cdr.detectChanges();
      } else {
        this._sharedService.error("Error", "Error while uploading video");
      }
      this.uploader.clearQueue();
      this._sharedService.loading = false;
    };
    this.inspectionResult = new InspectionResult();
    this.inspectionResult.RepairTypeID = 70;
    this.part = new JobPart();
    this.task = new InspectionResult();
    this.suggestedParts = new Array<MainPart>();

    // this.partsList = this._sharedService.AutomotiveParts;
    // this.partsListBuffer = this.partsList.slice(0, this.bufferSize);
    // this.markAll = 1;
  }

  getMetaData() {
    this._partService.getMetaData().subscribe((res: any) => {
      this._meta = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  viewNote(modal: any, cl: Checklist) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    this.checklist = new Checklist();
    this.checklist = cl;
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }

  completeJobProcess() {
    debugger;
    var valid: boolean = false;
    var concern = this._sharedService.jobObj.JobConcerns.filter(
      (item) => item.ConcernTypeID == 70
    );
    var chk = this._sharedService.jobObj.JobCardCheckList.filter(
      (item) =>
        item.CheckListTypeID == 46 &&
        (item.StatusID == 11 || item.StatusID == 12 || item.StatusID == 33)
    );
    // var rp = this._sharedService.jobObj.JobTasks.find(item => item.IsFree == false && (item.LaborPrice == 0 || item.LaborPrice == undefined));
    var rp = this._sharedService.jobObj.JobTasks.find(
      (item) =>
        item.IsFree == false &&
        (item.LaborCost == 0 || item.LaborCost == undefined)
    );
    if (rp != undefined) {
      this._sharedService.warning(
        "Inspection Result",
        "Labor cost should be add against all the task."
      );
    } else {
      valid = true;
    }
    if (valid) {
      if (rp != undefined) {
        this._sharedService.warning(
          "Inspection Result",
          "Labor cost should be add against all the task."
        );
      }
      ////select those parts whose tasks are not added
      else if (
        this._sharedService.jobObj.JobParts.filter(
          (item) => item.JobTaskID == 0 || item.JobTaskID == undefined
        ).length > 0
      ) {
        var btn = document.getElementById("noTaskBtn");
        btn.click();
      }
      // this._sharedService.jobObj.JCBasicInfo.ServiceTypeID == 40 &&
      else {
        var ProcessStatusID = 17;
        this._sharedService.jobObj.JCBasicInfo.IRStatusID = 17;
        this._sharedService.jobObj.JCBasicInfo.IsIRCompleted = true;
        this._sharedService.jobObj.JCBasicInfo.IsModified = true;
        var jp: any = {
          ProcessStatusID: ProcessStatusID,
          ProcessTypeID: 9,
          JobCardID: this._sharedService.jobObj.JCBasicInfo.JobCardID,
        };
        this._jobService.completeJobProcess(jp).subscribe(
          (res) => {
            ///auto update job card alsoon complete job process
            let element: HTMLElement = document.getElementById(
              "updateJob"
            ) as HTMLElement;
            if (element != null || element != undefined) {
              element.click();
            }
            this._sharedService.success("Success", "Process Completed");
          },
          (error) => {
            this._sharedService.error("Error", error.Message);
          }
        );
      }
    }
  }

  completeTechJobProcess() {
    debugger;
    var valid: boolean = false;
    var temp = this._sharedService.jobObj.JobCardCheckList.filter(
      (item) =>
        item.CheckListTypeID == 46 &&
        (item.StatusID == 11 || item.StatusID == 12 || item.StatusID == 33)
    );
    // this._sharedService.jobObj.JCBasicInfo.ServiceTypeID == 40 &&
    var concern = this._sharedService.jobObj.JobConcerns.filter(
      (item) => item.ConcernTypeID == 70
    );
    if (concern.length > 0) {
      if (temp.length != 10) {
        valid = false;
        this._sharedService.error(
          "Error",
          "All inspection points need to be checked!"
        );
      } else {
        valid = true;
      }
    } else {
      valid = true;
    }
    //select those parts whose tasks are not added
    if (valid) {
      if (
        this._sharedService.jobObj.JobParts.filter(
          (item) => item.JobTaskID == 0 || item.JobTaskID == undefined
        ).length > 0
      ) {
        document.getElementById("noTaskBtn").click();
      } else {
        if (
          this._sharedService.jobObj.JobTasks.map(
            (item) => item.JobConcernID
          ).filter((item, i, ar) => item != undefined && ar.indexOf(item) === i)
            .length === this._sharedService.jobObj.JobConcerns.length
        ) {
          var IsIRCompleted = 1;
          this._sharedService.jobObj.JCBasicInfo.IsIRCompleted = true;
          var jp: any = {
            ProcessStatusID: 0,
            ProcessTypeID: 0,
            JobCardID: this._sharedService.jobObj.JCBasicInfo.JobCardID,
            IsIRCompleted: IsIRCompleted,
          };
          this._jobService.completeTechJobProcess(jp).subscribe(
            (res) => {
              this._sharedService.success(
                "Inspection Results",
                "Process is completed successfully"
              );
              ///auto update job card alsoon complete job process
              // let element: HTMLElement = document.getElementById('updateJob') as HTMLElement;
              // element.click();
              this._router.navigate(["/job/job-list"]);
            },
            (error) => {
              this._sharedService.error("Error", error.Message);
            }
          );
        } else {
          this._sharedService.warning(
            "Warning",
            "There should be service against each concern!"
          );
        }
      }
    }
  }

  clearForm() {
    this.inspectionResult = new InspectionResult();
    this.part = new JobPart();
    this.TaskID = Math.floor(Math.random() * -1000 - 1);
    this.concernID = undefined;
    this.laborDescription = undefined;
    this.partName = undefined;
  }

  onChangePart(event:any){
    debugger
    console.log(event);
    this.part.InternalCode = event.InternalCode;
  }

  //#region part

  onCreatePart(action_state: number) {
    debugger;
    if (this.partName != undefined) {
      // this.part.MainCategoryID = this.MainCategoryID;
      // this.part.SubCategoryID = this.SubCategoryID;
      this.part.JobCardID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
      this.part.IsNew = true;
      this.part.JobConcernID = this.concernID;
      this.part.PartNameArabic = this.partName;
      debugger
      if (this.suggestedParts != undefined && this.suggestedParts.length > 0) {
        var findPart = this.suggestedParts.find(
          (item) =>
            item.InternalCode == this.part.InternalCode
        );
        if (findPart != undefined) {
          this.part.MainPartID = findPart.MainPartID;
          this.part.MainCategoryID = findPart.MainCategoryID;
          this.part.SubCategoryID = findPart.SubCategoryID;
          this.part.PartNameEnglish = findPart.ItemNameEng;
        } else {
          this.part.PartNameEnglish = this.partName;
        }
      }
      if (
        this.part.MainCategoryID == undefined ||
        this.part.SubCategoryID == undefined
      ) {
        this._sharedService.warning(
          "Please choose category and subcategory for this new part"
        );
        return;
      }
      this.part.IsInclude = false;
      if (this.concernID != null) {
        var concern = this._sharedService.jobObj.JobConcerns.find(
          (item) => item.JobConcernID == this.concernID
        );
        this.part.JobConcernID = concern.JobConcernID;
        this.part.ConcernDescription = concern.ConcernDescription;
        this.part.IsInclude = concern.IsApproved;
      }
      this.part.UnitTypeID = this._sharedService._commonMeta.objectTypes.find(
        (item) => item.TypeNameEnglish == this.part.UnitTypeName
      ).ObjectTypeID;
      this._jobService.saveJobPart(this.part).subscribe((res: any) => {
        // if (closeForm) {
        //   this.addPart = false;
        // }
        this.part.JobPartID = res.jobTask.JobPartID;
        if (this.part.JobTaskID == undefined) {
          this._sharedService.jobObj.JobTasks.push(res.jobTask);
          this.task = new InspectionResult();
        }
        this.part.JobTaskID = res.jobTask.JobTaskID;
        this._sharedService.jobObj.JobParts.push(this.part);

        this.partName = undefined;
        this.part = new JobPart();

        if (action_state == 1) {
          this.activatedModalRef.dismiss();
        } else if (action_state == 2) {
          this.activatedModalRef.dismiss();
          if (this.concernID != undefined) {
            document.getElementById(this.concernID + "addPart").click();
          } else {
            document.getElementById("otherAddPart").click();
          }
        } else {
          this.activatedModalRef.dismiss();
          if (this.concernID != undefined) {
            document.getElementById(this.concernID + "addRepair").click();
          } else {
            document.getElementById("otherAddRepair").click();
          }
        }

        this._sharedService.success("Success", "Part is added.");
      });
    }
    // if (closeForm) {
    //   if (otherPart) {
    //     document.getElementById('c-part' + (index != undefined ? index : '')).classList.remove('show');
    //   }
    //   else {
    //     document.getElementById('create-part' + (index != undefined ? index : '')).classList.remove('show');
    //     if (openRepair) {
    //       document.getElementById('create-repair' + (index != undefined ? index : '')).classList.add('show');
    //     }
    //   }
    // }
  }

  onEditPart(part: JobPart, modal: any,isPartOfService) {
    debugger
    this.partSearch();
    // this.inspectionResult = new InspectionResult();
    debugger
    var data = JSON.stringify(part);
    
    
    this.part = JSON.parse(data);
   
     if(isPartOfService){
     this.part.JobTaskID=part.JobTaskID
    }
    else{
      this.part.JobTaskID=undefined;
     }
    this.concernID = this.part.JobConcernID;
    this.MainCategoryID = this.part.MainCategoryID
    this.SubCategoryID = this.part.SubCategoryID;
    this.partName = part.PartNameArabic;
    this.repairType = 1;

    var concern: JobConcern = this._sharedService.jobObj.JobConcerns.find(
      (item) => item.JobConcernID == this.concernID
    );

    this.selected_concern_name =
      concern != undefined ? concern.ConcernDescription : "Other";

    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      keyboard: false,
      backdrop: "static",
    });

    this.showMore = true;
    this.isExpanded = true;
  }

  onUpdatePart(action_state: number) {
    // this.shouldUpdate = true
    //this.part.JobConcernID = this.concernID;
    this.part.IsInclude = false;
    if (this.part.JobConcernID != null) {
      var concern = this._sharedService.jobObj.JobConcerns.find(
        (item) => item.JobConcernID == this.concernID
      );
      // this.part.JobConcernID = concern.JobConcernID;
      // this.part.ConcernDescription = concern.ConcernDescription;
      this.part.IsInclude = concern.IsApproved;
      // if (closeForm) {
      //   concern.addPart = false;
      // }
    } else {
      // if (closeForm) {
      //   this.addPart = false;
      // }
    }
    this.part.UnitTypeID = this._sharedService._commonMeta.objectTypes.find(
      (item) => item.TypeNameEnglish == this.part.UnitTypeName
    ).ObjectTypeID;
    this.repairType = 1;

    // this.part.MainCategoryID = this.MainCategoryID;
    // this.part.SubCategoryID = this.SubCategoryID;
    // this.part.JobCardID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
    // this.part.IsNew = true;
    // this.part.JobConcernID = this.concernID;
    this.part.PartNameEnglish = this.partName;
    this.part.PartNameArabic = this.partName;
    if (this.suggestedParts != undefined && this.suggestedParts.length > 0) {
      var findPart = this.suggestedParts.find(
        (item) =>
          item.ItemNameEng == this.part.PartNameEnglish ||
          item.ItemNameArabic == this.part.PartNameArabic
      );
      if (findPart != undefined) {
        this.part.MainPartID = findPart.MainPartID;
        this.part.MainCategoryID = findPart.MainCategoryID;
        this.part.SubCategoryID = findPart.SubCategoryID;
      }
    }

    if (
      this.part.MainCategoryID == undefined ||
      this.part.SubCategoryID == undefined
    ) {
      this._sharedService.warning(
        "Please choose category and subcategory for this new part"
      );
      return;
    }

    // }
    let index = this._sharedService.jobObj.JobParts.findIndex(
      (item) => item.JobPartID == this.part.JobPartID
    );
    // this._sharedService.jobObj.JobParts[index] = Object.assign({}, this.part);
    var jobTaskIndex = this._sharedService.jobObj.JobTasks.findIndex(
      (task) => task.JobTaskID == this.part.JobTaskID
    );
    this._jobService.updateJobPart(this.part).subscribe((res: any) => {
      // if (closeForm) {
      //   this.addPart = false;
      // }
      // this.part.JobPartID = res.jobTask.JobPartID;
      if (this.part.JobTaskID != res.jobTask.JobTaskID) {
        this._sharedService.jobObj.JobTasks.push(res.jobTask);
      } else {
        this._sharedService.jobObj.JobTasks[jobTaskIndex] = res.jobTask;
      }
      this._sharedService.jobObj.JobParts[index] = Object.assign({}, this.part);

      // this._sharedService.jobObj.JobParts.push(this.part);
      // if (this.part.AddPartTask == true) {
      // this.task.JobTaskID = Math.floor((Math.random() * -1000) - 1);
      // this.part.JobTaskID = this.task.JobTaskID;
      // var con = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.concernID);
      // // this.task.IsInclude = con != undefined && con.IsApproved == true ? true : false;
      // if (con != undefined) {
      //   this.task.IsInclude = con.IsApproved == true ? true : false;
      //   this.task.JobConcernID = con.JobConcernID;
      //   this.task.ConcernDescription = con.ConcernDescription;
      // }
      // var des = new String("Work on ");
      // this.task.LaborDescriptionEng = des.concat(this.part.PartNameEnglish);
      // this.task.LaborPrice = 0;
      // this.task.RepairTypeID = 70;
      // this.task.JobTaskTypeID = 51;
      // this.task.LaborTaskID = 0;
      // this.task.LaborPricingID = 0;
      // //invoke getTime function which will set time in inspection object
      // //this.setTaskTime();
      // this.task.LaborTime = this.inspectionResult.LaborTime;
      // this.task.IsFree = true;
      // this.task.IsModified = true;
      // this._sharedService.jobObj.JobTasks.push(this.task);
      this.task = new InspectionResult();
      // }
      this.partName = undefined;
      this.part = new JobPart();

      if (action_state == 1) {
        this.activatedModalRef.dismiss();
      } else if (action_state == 2) {
        this.activatedModalRef.dismiss();
        if (this.concernID != undefined) {
          document.getElementById(this.concernID + "addPart").click();
        } else {
          document.getElementById("otherAddPart").click();
        }
      } else {
        this.activatedModalRef.dismiss();
        if (this.concernID != undefined) {
          document.getElementById(this.concernID + "addRepair").click();
        } else {
          document.getElementById("otherAddRepair").click();
        }
      }

      this._sharedService.success("Success", "Part is updated.");
    });

    ///add auto generated part
    // if (this.part.AddPartTask == true) {
    //   this.addPartTask();
    // }
    ////delete auogenerated task if the user changes part mapping with system tasks
    // this._sharedService.jobObj.JobTasks.forEach(element => {
    //   if (element.IsFree == true) {
    //     var index = this._sharedService.jobObj.JobParts.findIndex(item => item.JobTaskID == element.JobTaskID);
    //     if (this._sharedService.jobObj.JobParts.findIndex(item => item.JobTaskID == element.JobTaskID) == -1) {
    //       //delete task no part aganist found and free task
    //       this.autoDeleteTask = true;
    //       this.inspectionResult.JobTaskID = element.JobTaskID;
    //       // this.onDeleteTask();
    //     }
    //   }
    // });

    // let index2 = this._sharedService.parts.findIndex(item => item.JobPartID == this.part.JobPartID);
    // this._sharedService.jobObj.JobParts[index2] = Object.assign({}, this.part);
    // this.concernID = null;
    // this.partName = undefined;
    // this.part = new JobPart();

    // document.getElementById('create-part' + (partIndex != undefined ? partIndex : '')).classList.remove('show');
    // if (closeForm) {
    //   if (otherPart) {
    //     document.getElementById('c-part' + (partIndex != undefined ? partIndex : '')).classList.remove('show');
    //   }
    //   else {
    //     document.getElementById('create-part' + (partIndex != undefined ? partIndex : '')).classList.remove('show');
    //     if (openRepair) {
    //       partIndex
    //       document.getElementById('create-repair' + (partIndex != undefined ? partIndex : '')).classList.add('show');
    //     }
    //   }
    // }
  }

  openDeletePart(modal: any, jp: JobPart) {
    this.part = jp;
    this.activatedModalRef = this.modalService.open(modal);
  }

  onDeletePart() {
    var index = this._sharedService.jobObj.JobParts.findIndex(
      (item) => item.JobPartID == this.part.JobPartID
    );
    if (this.part.JobPartID < 0) {
      this._sharedService.jobObj.JobParts.splice(index, 1);
      this.part = new JobPart();
    } else {
      this._jobService.deleteJobPart(this.part.JobPartID).subscribe(
        (res: any) => {
          this._sharedService.jobObj.JobParts.splice(index, 1);
          this.activatedModalRef.close();
          this.part = new JobPart();
          this._sharedService.success("success", "Part deleted successfully");
        },
        (error) => {
          this.part = new JobPart();
          this._sharedService.error("Error", error.Message);
        }
      );
    }
    this.activatedModalRef.close();
  }
  //#endregion

  //#region REPAIR

  getLaborPrice() {
    if (this.laborDescription.label == undefined) {
      this.inspectionResult.LaborDescriptionEng = this.laborDescription;
      this.inspectionResult.LaborTaskID =
        this._sharedService.jobObj.LaborTasks.find(
          (item) =>
            item.LaborDescriptionEng ==
            this.inspectionResult.LaborDescriptionEng
        ).LaborTaskID;

      this._jobService
        .getTaskPricing(
          this.inspectionResult.LaborTaskID,
          this._sharedService.jobObj.jcVehicleObj.CylinderTypeID,
          this._sharedService.jobObj.jcVehicleObj.VehicleRegionID
        )
        .subscribe(
          (res: any) => {
            var lp = res;
            if (lp != undefined) {
              this.inspectionResult.LaborPrice = 0;
              this.inspectionResult.Hours = 0;
              this.inspectionResult.Minutes = 0;

              this.inspectionResult.LaborPricingID = lp.LaborPricingID;
              this.inspectionResult.LaborPrice = lp.FixedPrice;
              this.inspectionResult.LaborTime = lp.LaborTime;
              this.inspectionResult.Hours = Math.floor(lp.LaborTime / 60);
              this.inspectionResult.Minutes = Math.ceil(lp.LaborTime % 60);

              this.cdr.detectChanges();
            } else {
              this.inspectionResult.LaborPrice = undefined;
              this.inspectionResult.Hours = undefined;
              this.inspectionResult.Minutes = undefined;
            }
            //this._sharedService.success('success', 'Part deleted successfully');
          },
          (error) => {
            this.part = new JobPart();
            //this._sharedService.error('Error', error.Message);
          }
        );
    }
  }

  setTaskTime() {
    this.shouldUpdate = true;
    var hours = 0;
    if (
      this.inspectionResult.Hours != undefined &&
      this.inspectionResult.Hours != null
    ) {
      hours = +this.inspectionResult.Hours * 60;
    }
    if (this.inspectionResult.Minutes == undefined) {
      this.inspectionResult.Minutes = 0;
    }
    if (
      this.inspectionResult.Minutes != undefined &&
      this.inspectionResult.Minutes != null
    ) {
      this.inspectionResult.LaborTime = hours + +this.inspectionResult.Minutes;
    }
  }

  onCreateTask(action_state: number) {
    debugger;
    if (this.laborDescription != undefined) {
      // this.shouldUpdate = true
      //this.setTaskTime();
      // var hours = 0;
      // if (this.inspectionResult.Hours != undefined && this.inspectionResult.Hours != null) {
      //   hours = +this.inspectionResult.Hours * 60;
      // }
      // if (this.inspectionResult.Minutes == undefined) {
      //   this.inspectionResult.Minutes = 0;
      // }
      // if (this.inspectionResult.Minutes != undefined && this.inspectionResult.Minutes != null) {
      //   this.inspectionResult.LaborTime = hours + +this.inspectionResult.Minutes;
      // }

      if (this.laborDescription.label != undefined) {
        this.inspectionResult.LaborDescriptionEng = this.laborDescription.label;
        this.inspectionResult.LaborTaskID = -1;
        this.inspectionResult.LaborPricingID = -1;
        // this.inspectionResult.TaskDescription = this.laborDescription.label;
      } else {
        var findLabor = this._sharedService.jobObj.LaborTasks.find(
          (labor) => labor.LaborDescriptionEng == this.laborDescription
        );
        if (findLabor) {
          this.inspectionResult.LaborTaskID = findLabor.LaborTaskID;
        }
        this.inspectionResult.LaborDescriptionEng = this.laborDescription;
        var concerndata = this._sharedService.jobObj.JobConcerns.find(
          (item) => item.JobConcernID == this.inspectionResult.JobConcernID
        );
        if (concerndata != undefined) {
          this.inspectionResult.ConcernDescription =
            concerndata.ConcernDescription;
        }
        // this.inspectionResult.LaborTaskID = this._sharedService.jobObj.LaborTasks.find(item => item.LaborDescriptionEng == this.inspectionResult.LaborDescriptionEng).LaborTaskID;
        // var tmp = this._sharedService.jobObj.LaborPricings.find(item => item.LaborTaskID == this.inspectionResult.LaborTaskID);
        // if (tmp != undefined) {
        //   this.inspectionResult.LaborPricingID = tmp.LaborPricingID;
        // }
      }

      // if (this.inspectionResult.LaborTime != undefined && this.inspectionResult.LaborPrice != null) {
      //   this.inspectionResult.NetAmount = (this.inspectionResult.LaborTime / 60) * this.inspectionResult.LaborPrice;
      // } else {
      //   this.inspectionResult.NetAmount = 0;
      // }

      this.inspectionResult.IsInclude = false;
      this.inspectionResult.JobConcernID = this.concernID;
      this.inspectionResult.JobCardID =
        this._sharedService.jobObj.JCBasicInfo.JobCardID;
      if (this.concernID != null) {
        var concern = this._sharedService.jobObj.JobConcerns.find(
          (item) => item.JobConcernID == this.concernID
        );
        this.inspectionResult.JobConcernID = concern.JobConcernID;
        this.inspectionResult.IsInclude = concern.IsApproved;
        // if (closeForm) {
        //   concern.addService = false;
        // }
      }
      // else {
      //   if (closeForm) {
      //     this.addService = false;
      //   }
      // }
      this.inspectionResult.Icon =
        this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "JobConcern" &&
            item.ObjectTypeID == this.inspectionResult.RepairTypeID
        ).Icon;
      this.inspectionResult.JobTaskID = this.TaskID;
      // this.inspectionResult.JobTaskID = Math.floor((Math.random() * -1000) - 1);
      // if (this.inspectionResult.LaborDescriptionEng != undefined) {
      //   this.inspectionResult.LaborDescriptionEng = this._sharedService.jobObj.LaborTasks.find(item => item.LaborTaskID == this.inspectionResult.LaborTaskID).LaborDescriptionEng;
      //   }
      this.inspectionResult.Gallery = this._sharedService.jobObj.Gallery.filter(
        (img) => img.ObjectID == this.TaskID
      );
      this._jobService
        .saveJobTask(this.inspectionResult)
        .subscribe((res: any) => {
          debugger;
          // if (closeForm) {
          //   this.addService = false;
          // }

          this.inspectionResult = res.jobTask;
          this._sharedService.jobObj.JobTasks.push(this.inspectionResult);
          this._sharedService.jobObj.JobTasks.sort((a, b) =>
            a.PriorityTypeID > b.PriorityTypeID
              ? -1
              : a.PriorityTypeID < b.PriorityTypeID
              ? 1
              : 0
          );
          //this.concernID = null;
          this._sharedService.jobObj.Gallery =
            this._sharedService.jobObj.Gallery.filter(
              (img) =>
                !(
                  img.ObjectID == this.inspectionResult.JobTaskID &&
                  img.GalleryTypeID == 50
                )
            );
          this.inspectionResult.Gallery.forEach((element) => {
            this._sharedService.jobObj.Gallery.push(element);
            this._sharedService.success("Success", "Repair is added.");
          });
          var rt = this.inspectionResult.RepairTypeID;
          this.inspectionResult = new InspectionResult();
          this.inspectionResult.RepairTypeID = rt;
          this.laborDescription = undefined;
          this.TaskID = Math.floor(Math.random() * -1000 - 1);

          if (action_state == 1) {
            this.activatedModalRef.dismiss();
          } else if (action_state == 2) {
            this.activatedModalRef.dismiss();
            if (this.concernID != undefined) {
              document.getElementById(this.concernID + "addRepair").click();
            } else {
              document.getElementById("otherAddRepair").click();
            }
          } else {
            this.activatedModalRef.dismiss();
            if (this.concernID != undefined) {
              document.getElementById(this.concernID + "addPart").click();
            } else {
              document.getElementById("otherAddPart").click();
            }
          }
        });
    }
  }

  openEditTask(ir: InspectionResult, modal: any) {
    this.part = new JobPart();
    this.inspectionResult = ir;
    this.concernID = ir.JobConcernID;
    this.laborDescription = ir.LaborDescriptionEng;
    this.repairType = 2;
    this.TaskID = ir.JobTaskID;

    var concern: JobConcern = this._sharedService.jobObj.JobConcerns.find(
      (item) => item.JobConcernID == this.concernID
    );

    this.selected_concern_name =
      concern != undefined ? concern.ConcernDescription : "Other";

    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      keyboard: false,
      backdrop: "static",
    });

    this.showMore = true;
    this.isExpanded = true;
  }

  onUpdateTask(action_state: number) {
    if (this.laborDescription != undefined) {
      // this.shouldUpdate = true
      //this.setTaskTime();
      // var hours = 0;
      // if (this.inspectionResult.Hours != undefined && this.inspectionResult.Hours != null) {
      //   hours = +this.inspectionResult.Hours * 60;
      // }
      // if (this.inspectionResult.Minutes == undefined) {
      //   this.inspectionResult.Minutes = 0;
      // }
      // if (this.inspectionResult.Minutes != undefined && this.inspectionResult.Minutes != null) {
      //   this.inspectionResult.LaborTime = hours + +this.inspectionResult.Minutes;
      // }

      if (this.laborDescription.label != undefined) {
        this.inspectionResult.LaborDescriptionEng = this.laborDescription.label;
        this.inspectionResult.LaborTaskID = -1;
        this.inspectionResult.LaborPricingID = -1;
        // this.inspectionResult.TaskDescription = this.laborDescription.label;
      }
      this.inspectionResult.LaborDescriptionEng = this.laborDescription;
      var concerndata = this._sharedService.jobObj.JobConcerns.find(
        (item) => item.JobConcernID == this.inspectionResult.JobConcernID
      );

      if (concerndata != undefined) {
        this.inspectionResult.ConcernDescription =
          concerndata.ConcernDescription;
        this.inspectionResult.IsInclude = concerndata.IsApproved;
      }
      // this.inspectionResult.LaborTaskID = this._sharedService.jobObj.LaborTasks.find(item => item.LaborDescriptionEng == this.inspectionResult.LaborDescriptionEng).LaborTaskID;
      // var tmp = this._sharedService.jobObj.LaborPricings.find(item => item.LaborTaskID == this.inspectionResult.LaborTaskID);
      // if (tmp != undefined) {
      //   this.inspectionResult.LaborPricingID = tmp.LaborPricingID;
      // }

      // if (this.inspectionResult.LaborTime != undefined && this.inspectionResult.LaborPrice != null) {
      //   this.inspectionResult.NetAmount = (this.inspectionResult.LaborTime / 60) * this.inspectionResult.LaborPrice;
      // } else {
      //   this.inspectionResult.NetAmount = 0;
      // }

      // this.inspectionResult.IsInclude = false;
      // this.inspectionResult.JobConcernID = this.concernID;
      // this.inspectionResult.JobCardID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
      // if (this.concernID != null) {
      //   var concern = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.inspectionResult.JobConcernID );
      //   this.inspectionResult.JobConcernID = concern.JobConcernID;
      //   this.inspectionResult.IsInclude = concern.IsApproved;
      //   // if (closeForm) {
      //   //   concern.addService = false;
      //   // }
      // }
      // else {
      //   if (closeForm) {
      //     this.addService = false;
      //   }
      // }
      this.inspectionResult.Icon =
        this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "JobConcern" &&
            item.ObjectTypeID == this.inspectionResult.RepairTypeID
        ).Icon;
      //this.inspectionResult.JobTaskID = this.TaskID;
      // this.inspectionResult.JobTaskID = Math.floor((Math.random() * -1000) - 1);
      // if (this.inspectionResult.LaborDescriptionEng != undefined) {
      //   this.inspectionResult.LaborDescriptionEng = this._sharedService.jobObj.LaborTasks.find(item => item.LaborTaskID == this.inspectionResult.LaborTaskID).LaborDescriptionEng;
      //   }
      this.inspectionResult.Gallery = this._sharedService.jobObj.Gallery.filter(
        (img) =>
          img.ObjectID == this.inspectionResult.JobTaskID &&
          img.GalleryTypeID == 50
      );
      this._jobService
        .updateJobTask(this.inspectionResult)
        .subscribe((res: any) => {
          debugger;
          // if (closeForm) {
          //   this.addService = false;
          // }

          this.inspectionResult = res.jobTask;
          var taskIdx = this._sharedService.jobObj.JobTasks.findIndex(
            (task) => task.JobTaskID == this.inspectionResult.JobTaskID
          );
          if (taskIdx >= 0) {
            this._sharedService.jobObj.JobTasks[taskIdx] =
              this.inspectionResult;
          }

          this._sharedService.jobObj.JobTasks.sort((a, b) =>
            a.PriorityTypeID > b.PriorityTypeID
              ? -1
              : a.PriorityTypeID < b.PriorityTypeID
              ? 1
              : 0
          );
          //this.concernID = null;
          this._sharedService.jobObj.Gallery =
            this._sharedService.jobObj.Gallery.filter(
              (img) =>
                !(
                  img.ObjectID == this.inspectionResult.JobTaskID &&
                  img.GalleryTypeID == 50
                )
            );
          this.inspectionResult.Gallery.forEach((element) => {
            this._sharedService.jobObj.Gallery.push(element);
          });
          var rt = this.inspectionResult.RepairTypeID;
          this.inspectionResult = new InspectionResult();
          this.inspectionResult.RepairTypeID = rt;
          this.laborDescription = undefined;
          this.TaskID = Math.floor(Math.random() * -1000 - 1);
          this._sharedService.success("Success", "Repair is updated.");

          if (action_state == 1) {
            this.activatedModalRef.dismiss();
          } else if (action_state == 2) {
            this.activatedModalRef.dismiss();
            if (this.concernID != undefined) {
              document.getElementById(this.concernID + "addRepair").click();
            } else {
              document.getElementById("otherAddRepair").click();
            }
          } else {
            this.activatedModalRef.dismiss();
            if (this.concernID != undefined) {
              document.getElementById(this.concernID + "addPart").click();
            } else {
              document.getElementById("otherAddPart").click();
            }
          }
        });
    }
    // document.getElementById('create-repair' + (serviceIndex != undefined ? serviceIndex : '')).classList.remove('show');
    // if (closeForm) {
    //   document.getElementById('create-repair' + (serviceIndex != undefined ? serviceIndex : '')).classList.remove('show');
    //   if (openPart) {
    //     document.getElementById('create-part' + (serviceIndex != undefined ? serviceIndex : '')).classList.add('show');
    //   }
    // }
  }

  openDeleteTask(modal: any, ir: InspectionResult) {
    this.inspectionResult = ir;
    this.activatedModalRef = this.modalService.open(modal);
  }

  onDeleteTask() {
    var index = this._sharedService.jobObj.JobTasks.findIndex(
      (item) => item.JobTaskID == this.inspectionResult.JobTaskID
    );
    if (this.inspectionResult.JobTaskID != undefined) {
      var part = this._sharedService.jobObj.JobParts.find(
        (item) => item.JobTaskID == this.inspectionResult.JobTaskID
      );
      if (part != undefined) {
        part.JobTaskID = undefined;
      }
    }
    if (this.inspectionResult.JobTaskID < 0) {
      this._sharedService.jobObj.JobTasks.splice(index, 1);
      this.inspectionResult = new InspectionResult();
    } else {
      this._jobService.deleteJobTask(this.inspectionResult.JobTaskID).subscribe(
        (res: any) => {
          this._sharedService.jobObj.JobTasks.splice(index, 1);
          if (this.autoDeleteTask == false) {
            this.activatedModalRef.close();
            this.cdr.detectChanges();
            this._sharedService.success(
              "success",
              "Job task deleted successfully"
            );
          }
          this.inspectionResult = new InspectionResult();
        },
        (error) => {
          this.inspectionResult = new InspectionResult();
          this._sharedService.error("Error", error.Message);
        }
      );
    }
    if (this.autoDeleteTask == false) {
      this.activatedModalRef.close();
    }
  }

  openRemoveImage(modal: any, gal: Gallery) {
    debugger;
    this.imageObj = gal;
    if (this.imageObj.IsVideo == true) {
      this.content = " Video";
    } else {
      this.content = "Picture";
    }
    this.imageObj = gal;

    this.deleteContentModel = this.modalService.open(modal);
  }

  onRemoveImage() {
    var index = this._sharedService.jobObj.Gallery.findIndex(
      (item) => item.ImageURL == this.imageObj.ImageURL
    );
    if (this.imageObj.GalleryID < 0) {
      this._sharedService.jobObj.Gallery.splice(index, 1);
      this.imageObj = new Gallery();
    } else {
      this._jobService.removeImage(this.imageObj.GalleryID).subscribe(
        (res: any) => {
          this._sharedService.jobObj.Gallery.splice(index, 1);
          this.activatedModalRef.close();
          this.imageObj = new Gallery();
          this._sharedService.success("success", "Image deleted successfully");
        },
        (error) => {
          this.imageObj = new Gallery();
          this._sharedService.error("Error", error.Message);
        }
      );
    }
    this.deleteContentModel.close();
  }
  //#endregion

  //#region image upload
  galleryPreviewModal(modal: any, image: Gallery) {
    this.currentImg = new Gallery();
    this.currentImg = image;
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    // this.activatedModalRef = this.modalService.open(modal);
    // console.log("image gallery preview ", image , idx);
  }

  galleryUpload($event: any) {
    debugger;
    var option: ResizeOptions = new ResizeOptions();
    option.Resize_Quality = 80;
    option.Resize_Type = "image/jpg";

    this.compressedImages = new Array<Gallery>();
    var imgCount = $event.target.files.length;
    ImageCompressService.filesToCompressedImageSourceEx(
      $event.target.files,
      option
    ).then((observableImages) => {
      observableImages.subscribe(
        (image: any) => {
          this.imageObj = new Gallery();
          this.imageObj.ImageDataUrl = image.compressedImage.imageDataUrl;
          this.imageObj.OrignalName = image.compressedImage.fileName;

          imgCount--;
          this.compressedImages.push(this.imageObj);
          // console.log("image OBJ" + this.imageObj);

          if (imgCount <= 0) {
            // send compresed image base64 to api to save
            this._commonService.saveGallery(this.compressedImages).subscribe(
              (res) => {
                debugger;
                if (res != undefined) {
                  if (this._sharedService.jobObj.Gallery == undefined) {
                    this._sharedService.jobObj.Gallery = new Array<Gallery>();
                  }
                  res.forEach((element) => {
                    this.imageObj = new Gallery();
                    this.imageObj.GalleryID = Math.floor(
                      Math.random() * -10000
                    );

                    this.imageObj.ImageURL = element.ImageURL;
                    this.imageObj.EncryptedName = element.EncryptedName;
                    this.imageObj.OrignalName = element.OriginalName;
                    this.imageObj.GalleryTypeID = 50;
                    this.imageObj.ObjectID = this.TaskID;
                    this.imageObj.IsVideo = false;
                    this.imageObj.IsModified = true;
                    this._sharedService.jobObj.Gallery.push(this.imageObj);
                    this.imageObj = new Gallery();
                    this.cdr.detectChanges();
                  });
                  // console.log("Gallery", this._sharedService.jobObj.Gallery);
                  // console.log('asd', this.requestData.RequestedParts)
                  this._sharedService.success(
                    "Success",
                    "Image saved successfully"
                  );
                  // previousImagesLength = this.requestData.QuotationPartsImages.length;
                  this.ImgCounter = this.ImgCounter + 1;
                  $event = undefined;
                }
              },
              (error) => {
                this._sharedService.error("Api not working", error.Message);
              }
            );
          }
        },
        (error) => {
          $event = undefined;
          this._sharedService.error("Error Converting", error.Message);
        }
      );
    });
  }

  // onRemoveImage(url: string) {
  //
  //   var currentImgID = this._sharedService.jobObj.Gallery.findIndex(item => item.ImageURL == url);
  //   this._sharedService.jobObj.Gallery.splice(currentImgID, 1);
  //   this.ImgCounter = this.ImgCounter - 1;
  // }

  uploadVideo($event: any, IsVideo: boolean) {
    debugger;
    if ($event.target.files.length > 0) {
      if ($event.target.files[0].size < 20000000) {
        this._sharedService.loading = true;
        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
          form.append("Modified By", this._sharedService.logged_user_id);
          form.append("IsModified", true);
        };
        this.uploader.options.additionalParameter = {
          fileCategoryID: 1,
        };
        this.response = "";
        this.uploader.uploadAll();
      } else {
        alert("File size exceeds");
      }
    }
  }

  //#endregion

  clickRepairToggle(index: number) {
    if (this.isExpanded == false) {
      var temp = document.getElementById("create-repair" + index);
      document.getElementById("create-repair" + index).click();
    }
  }

  clickPartToggle(index: number) {
    if (this.isExpanded == false) {
      document.getElementById("create-part" + index).click();
    }
  }

  setTaskType() {
    if (this.concernID != undefined) {
      this.concernTypeID = this._sharedService.jobObj.JobConcerns.find(
        (item) => item.JobConcernID == this.concernID
      ).ConcernTypeID;
      this.inspectionResult.RepairTypeID = this.concernTypeID;
      this.inspectionResult.JobConcernID = this.concernID;
    }
    if (this.concernID != undefined && this.concernTypeID == 139) {
      var task = this._sharedService.jobObj.JobTasks.filter(
        (item) => item.JobConcernID == this.concernID
      );
      if (task != undefined && task.length == 1) {
        this.inspectionResult = task[0];
        this.laborDescription = this.inspectionResult.LaborDescriptionEng;
      }
    }
    if (this.concernID == undefined) {
      this.concernTypeID = undefined;
    }
  }

  // calcTime(ir: InspectionResult) {
  //   if (ir.Minutes == undefined) ir.Minutes = 0;
  //   var hours = 0;
  //   if (ir.Hours != undefined && ir.Hours != null) {
  //     hours = +ir.Hours * 60;
  //   }
  //   ir.LaborTime = hours + +ir.Minutes;
  //   var task = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == ir.JobTaskID);
  //   task.LaborTime = ir.LaborTime;
  //   if (task.LaborPrice != undefined) {
  //     task.NetAmount = (task.LaborTime / 60) * task.LaborPrice;
  //   }
  //   task.IsModified = true;
  // }

  bindTime(ir: InspectionResult) {
    var task = this._sharedService.jobObj.JobTasks.find(
      (item) => item.JobTaskID == ir.JobTaskID
    );
    task.Hours = Math.floor(ir.LaborTime / 60);
    task.Minutes = Math.ceil(ir.LaborTime % 60);
  }

  navigateTosetLabour(ir: InspectionResult) {
    if (ir.LaborCost == 0) {
      this.verify_task = ir;
      document.getElementById("verifyPriceBtn").click();
    } else {
      this.setLabor(ir);
    }
  }

  setLabor(ir: InspectionResult) {
    this._jobService.updateJobTask(ir).subscribe((res: any) => {
      var index = this._sharedService.jobObj.JobTasks.findIndex(
        (item) => item.JobTaskID == ir.JobTaskID
      );

      this._sharedService.jobObj.JobTasks[index].LaborCost = ir.LaborCost;

      // if (ir.LaborTime != undefined && ir.LaborTime != 0) {
      //   // task.NetAmount = (ir.LaborTime / 60) * ir.LaborPrice;
      //   task.NetAmount = ir.LaborPrice;
      // }
      this._sharedService.success("Success", "Labor cost is updated.");
    });
  }

  setZeroLabor() {
    this._jobService.updateJobTask(this.verify_task).subscribe((res: any) => {
      // task.NetAmount = 0;
      // task.IsModified = true;
      this.activatedModalRef2.close();
      this._sharedService.success("Success", "Labor cost is updated.");
    });
  }

  closeVerifyPriceModal() {
    this.activatedModalRef2.close();
    this.verify_task = new InspectionResult();
  }

  openVerifyPriceModal(modal: any) {
    //this.part = jp;
    this.activatedModalRef2 = this.modalService.open(modal);
  }

  closeTaskNotFoundModal() {
    this.activatedModalRef2.close();
  }

  openTaskNotFoundModal(modal: any) {
    //this.part = jp;
    this.activatedModalRef2 = this.modalService.open(modal);
  }

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
    if (this.JobTaskID > 0) {
      this._jobService.getTaskProfile(this.JobTaskID).subscribe(
        (res: any) => {
          this.taskProfile = res;
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      this.taskProfile = new TaskProfile();
      this.taskProfile.JobTask = this._sharedService.jobObj.JobTasks.find(
        (item) => item.JobTaskID == this.JobTaskID
      );
      this.taskProfile.JobParts = this._sharedService.jobObj.JobParts.filter(
        (item) => item.JobTaskID == this.JobTaskID
      );
      this.taskProfile.Gallery = this._sharedService.jobObj.Gallery.filter(
        (item) => item.ObjectID == this.JobTaskID
      );
    }
  }

  closeTaskModal() {
    this.activatedModalRef.close();
    this.taskProfile = new TaskProfile();
  }
  //#endregion

  addPartTask() {
    this._sharedService.jobObj.JobParts.forEach((element) => {
      if (element.AddPartTask == undefined) {
        element.AddPartTask = false;
      }
      if (
        element.AddPartTask == true &&
        (element.JobTaskID == undefined || element.JobTaskID == null)
      ) {
        var con = this._sharedService.jobObj.JobConcerns.find(
          (item) => item.JobConcernID == element.JobConcernID
        );
        if (con != undefined) {
          this.task.ConcernDescription = con.ConcernDescription;
          this.task.JobConcernID = con.JobConcernID;
          this.task.IsInclude =
            con != undefined && con.IsApproved == true ? true : false;
        }
        this.task.JobTaskID = Math.floor(Math.random() * -1000 - 1);
        this.part.JobTaskID = this.task.JobTaskID;
        element.JobTaskID = this.task.JobTaskID;
        var des = new String("Work on ");
        this.task.LaborDescriptionEng = des.concat(element.PartNameEnglish);
        this.task.LaborPrice = 0;
        this.task.RepairTypeID = 70;
        this.task.JobTaskTypeID = 51;
        this.task.LaborTaskID = 0;
        this.task.LaborPricingID = 0;
        this.task.LaborTime = 0;
        this.task.IsFree = true;
        this.task.IsModified = true;
        this._sharedService.jobObj.JobTasks.push(this.task);
      }
    });
  }

  collapseConcern(concernID: number) {
    //var tmp = document.getElementById('a'+concernID);
    var data = document.getElementById("chevron" + concernID);
    if (data.classList.contains("fa-chevron-down")) {
      data.classList.add("fa-chevron-up");
      data.classList.remove("fa-chevron-down");
    } else {
      data.classList.add("fa-chevron-down");
      data.classList.remove("fa-chevron-up");
    }
  }

  //collapse concern
  // collapseConcern(event: any, concernID: number) {
  //   var temp = document.getElementById('chevron' + concernID);
  //   if (temp.classList.contains('fa-chevron-down')) {
  //     $(event.target).removeClass('fa-chevron-down');
  //     $(event.target).addClass('fa-chevron-up');
  //     return;
  //   }
  //   if (temp.classList.contains('fa-chevron-up')) {
  //     $(event.target).removeClass('fa-chevron-up');
  //     $(event.target).addClass('fa-chevron-down');
  //     return;
  //   }

  //   // if (document.getElementById('concern' + concernID).children[0].classList.addClass('class')) {
  //   //   $(event.target).removeClass('fa-chevron-up');
  //   //   $(event.target).addClass('fa-chevron-down');
  //   // }
  //   // else {
  //   //   $(event.target).removeClass('fa-chevron-down');
  //   //   $(event.target).addClass('fa-chevron-up');
  //   // }
  // }

  collapseOtherRepairs(event: any) {
    var tmp = document.getElementById("chevronOtherRep");
    if (tmp.classList.contains("fa-chevron-up")) {
      tmp.classList.remove("fa-chevron-up");
      tmp.classList.add("fa-chevron-down");
    } else {
      tmp.classList.remove("fa-chevron-down");
      tmp.classList.add("fa-chevron-up");
    }
  }

  collapseOtherParts($event: any) {
    var tmp = document.getElementById("chevronOtherPart");
    if (tmp.classList.contains("fa-chevron-up")) {
      tmp.classList.remove("fa-chevron-up");
      tmp.classList.add("fa-chevron-down");
    } else {
      tmp.classList.remove("fa-chevron-down");
      tmp.classList.add("fa-chevron-up");
    }
  }

  // getAllParts() {
  //   if (this._sharedService.AutomotiveParts == undefined || this._sharedService.AutomotiveParts.length == 0) {
  //     this._jobService.getAllParts().subscribe((res: any) => {
  //       this._sharedService.AutomotiveParts = res.AutomotiveParts;
  //       this._sharedService.VendorPartPrices = res.VendorPartPrices;
  //       this._sharedService.PartVendors = res.PartVendors;

  //       this._sharedService.partsList = this._sharedService.AutomotiveParts;
  //       this._sharedService.partsListBuffer = this._sharedService.partsList.slice(0, this._sharedService.bufferSize);
  //     }, error => {
  //     })
  //   }
  // }

  // //#region  virtualScroll
  // onScrollToEnd() {
  //   this.fetchMore();
  //   this.spliceParts();
  // }

  // onScroll({ end }) {
  //   if (this._sharedService.partLoading || this._sharedService.partsList.length <= this._sharedService.partsListBuffer.length) {
  //     return;
  //   }

  //   if (end + this._sharedService.numberOfItemsFromEndBeforeFetchingMore >= this._sharedService.partsListBuffer.length) {
  //     this.fetchMore();
  //   }
  //   this.spliceParts();
  // }

  // private fetchMore() {
  //   const len = this._sharedService.partsListBuffer.length;
  //   const more = this._sharedService.partsList.slice(len, this._sharedService.bufferSize + len);
  //   this._sharedService.partLoading = true;
  //   // using timeout here to simulate backend API delay
  //   setTimeout(() => {
  //     this._sharedService.partLoading = false;
  //     this._sharedService.partsListBuffer = this._sharedService.partsListBuffer.concat(more);
  //   }, 200)
  // }

  // spliceParts() {
  //   var jp = this._sharedService.jobObj.JobParts;
  //   if (jp.length > 0) {
  //     jp.forEach(item => {
  //       var spl = this._sharedService.partsListBuffer.findIndex(part => part.AutomotivePartID == item.AutomotivePartID);
  //       if (spl > -1) {
  //         this._sharedService.partsListBuffer.splice(spl, 1);
  //         this._sharedService.partsListBuffer = [...this._sharedService.partsListBuffer];
  //       }
  //     });
  //   }
  // }
  // //#endregion VirtualScroll

  partSearch() {
    debugger
    this.cdr.detectChanges();
    if (
      (this.partName != undefined && this.partName.length > 1) ||
      this.part.MainCategoryID != undefined ||
      this.part.SubCategoryID != undefined
    ) {
      this._sharedService.partLoading = true;
      this._jobService
        .searchPart(
          this.partName,
          this.part.MainCategoryID,
          this.part.SubCategoryID,
          this._sharedService.currentWorkshopID
        )
        .subscribe(
          (res) => {
            this.suggestedParts = res;
            this._sharedService.partLoading = false;
          },
          (error) => {
            this._sharedService.error("Error", error.Message);
          }
        );
    }
  }

  closeModal() {
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
      } else {
        this.tabID--;
      }
      this.tabSet.select(this.tabID.toString());
      if (this.shouldUpdate == true) {
        this._jobService.updateJC(this._sharedService.jobObj).subscribe(
          (res) => {
            this.shouldUpdate = false;
            this._sharedService.success(
              "Success",
              "Inspection points are updated."
            );
          },
          (error) => {
            this._sharedService.error("Error", error.Message);
          }
        );
        // let element: HTMLElement;
        // if (isExit) {
        //   element = document.getElementById('updateExitJob') as HTMLElement;
        // }
        // else {
        //   element = document.getElementById('updateJob') as HTMLElement;
        // }
        // element.click();
      }
    }
  }

  checkData() {
    if (this.tabID == 1) {
      var concern = this._sharedService.jobObj.JobConcerns.filter(
        (item) => item.ConcernTypeID == 70
      );
      if (concern.length > 0) {
        var temp = this._sharedService.jobObj.JobCardCheckList.findIndex(
          (item) =>
            item.CheckListTypeID == 46 &&
            item.StatusID != 11 &&
            item.StatusID != 12 &&
            item.StatusID != 33
        );
        if (temp > -1) {
          this._sharedService.warning(
            "Warning",
            "Inspection points needs to be checked."
          );
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  updateJobCard() {
    let element: HTMLElement;
    // element = document.getElementById('updateExitJob') as HTMLElement;
    element = document.getElementById("updateJob") as HTMLElement;
    element.click();
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

  markAllIR(id: number) {
    this.shouldUpdate = true;
    if (id === 1) {
      this._sharedService.jobObj.JobCardCheckList.forEach((el) => {
        if (el.CheckListTypeID === 46) {
          el.StatusID = 11;
          el.IsModified = true;
        }
      });
    } else if (id == 2) {
      this._sharedService.jobObj.JobCardCheckList.forEach((el) => {
        if (el.CheckListTypeID === 46) {
          el.StatusID = 12;
          el.IsModified = true;
        }
      });
    } else {
      this._sharedService.jobObj.JobCardCheckList.forEach((el) => {
        if (el.CheckListTypeID === 46) {
          el.StatusID = 33;
          el.IsModified = true;
        }
      });
    }
  }

  openServiceModal(modal: any, JobConcernID?: number) {
    this.concernID = JobConcernID;

    var concern: JobConcern = this._sharedService.jobObj.JobConcerns.find(
      (item) => item.JobConcernID == this.concernID
    );

    this.selected_concern_name =
      concern != undefined ? concern.ConcernDescription : "Other";
    if (this.activatedModalRef != undefined) {
      this.activatedModalRef.close();
    }

    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      keyboard: false,
      backdrop: "static",
    });

    this.showMore = true;
    this.isExpanded = true;
  }

  openPartModal(modal: any, JobConcernID?: number) {
    debugger
    this.concernID = JobConcernID;

    var concern: JobConcern = this._sharedService.jobObj.JobConcerns.find(
      (item) => item.JobConcernID == this.concernID
    );

    this.selected_concern_name =
      concern != undefined ? concern.ConcernDescription : "Other";
    if (this.activatedModalRef != undefined) {
      this.activatedModalRef.close();
    }
    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      keyboard: false,
      backdrop: "static",
      centered: true
    });

    this.part = new JobPart();
    this.partName = undefined;

    this.showMore = true;
    this.isExpanded = true;
  }
  onSelectCategory(mc: MainCategory) {
    debugger
    var findPart = this.suggestedParts.find(
      (item) =>
        item.ItemNameEng == this.partName ||
        item.ItemNameArabic == this.partName
    );

    if (findPart != undefined || this.part.JobPartID != undefined) {
      this.partName = undefined;
      this.part.JobPartID = undefined;
      this.part.SubCategoryID = undefined;
    }

    // this.part.MainCategoryID =
    //   this.part.MainCategoryID == mc.MainCategoryID
    //     ? undefined
    //     : mc.MainCategoryID;

    this.part.MainCategoryID = this.MainCategoryID;
  }
  onSelectSubCategory(sc: SubCategory) {
    console.log(this.SubCategoryID);
    var findPart = this.suggestedParts.find(
      (item) =>
        item.ItemNameEng == this.partName ||
        item.ItemNameArabic == this.partName
    );

    if (findPart != undefined || this.part.JobPartID != undefined) {
      this.partName = undefined;
      this.part.JobPartID = undefined;
    }

    // this.part.SubCategoryID =
    //   this.part.SubCategoryID == sc.SubCategoryID
    //     ? undefined
    //     : sc.SubCategoryID;

    this.part.SubCategoryID = this.SubCategoryID;

  }

  addTag(tag: string) {
    /* https://github.com/ng-select/ng-select/issues/809 */
    return tag;
  }
  InspectionMark(event, statusID, inspectionPoint) {
    // let index =this._sharedService.jobObj.JobCardCheckList.findIndex(element=>element.CheckListTypeID == 46 &&element.)
    // debugger;
    let mark = event.target.checked;
    if (mark == true) {
      let VisualInspectionList =
        this._sharedService.jobObj.JobCardCheckList.filter(
          (element) =>
            element.CheckListTypeID == 46 && element.StatusID == statusID
        );
      if (VisualInspectionList.length == 10) {
        const digits = ("" + statusID).split("");
        this._sharedService.markAll = +digits[1];
      }

      let jobcardlistindex =
        this._sharedService.jobObj.JobCardCheckList.findIndex(
          (element) =>
            element.JobCardCheckListID == inspectionPoint.JobCardCheckListID
        );
      this._sharedService.jobObj.JobCardCheckList[jobcardlistindex].StatusID =
        statusID;
      this._sharedService.jobObj.JobCardCheckList[jobcardlistindex].IsModified =
        true;
    }
  }
}
