import { ChangeDetectorRef, Component, OnInit, } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router';
import { SharedService } from 'app/services/shared.service';
import { JobConcern } from 'app/models/job-concern';
import { JobService } from 'app/services/job.service';
import { JobPart } from 'app/models/JobPart';
import { InspectionResult } from 'app/models/inspection-result';
import { debug } from "console";
import { JobPartAlternates } from "app/models/job-part-alternates";
import { Part } from "app/models/part";
import { concat, Observable, of, Subject } from "rxjs";
import { catchError, distinctUntilChanged, switchMap, take, tap, debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: "app-customer-concerns",
  templateUrl: "./customer-concerns.component.html",
  styleUrls: ["./customer-concerns.component.scss"]
})
export class CustomerConcernsComponent implements OnInit {

  customerConcern: JobConcern;
  // inspectionResult: InspectionResult;
  // customerConcerns: Array<JobConcern>;
  activatedModalRef: NgbModalRef;
  activatedModalRef2: NgbModalRef;
  editMode: boolean = false;
  tabID: number = 69;
  index: number;
  partName: any;
  MainCategoryID:number;
  SubCategoryID:number;
  partUnit: any = 86;
  partQuantity: any;
  part: JobPart;
  task: InspectionResult;
  addPartTask: boolean = true;
  laborDescription: any;
  partBrandName: string;
  partPrice: number;
  suggestedParts: Array<Part>;
  newPartQuantity: number;
  concernDescription: any;

  PartSuggessions$: Observable<Part[]>;
  itemCodeInput = new Subject<string>();
  loading: boolean;
  partSuggestion: Part;
  // partsList = [];
  // partsListBuffer = [];
  // bufferSize = 50;
  // numberOfItemsFromEndBeforeFetchingMore = 10;
  // loading = false;
  sub : any;

  //inspectionResult: InspectionResult;
  constructor(private modalService: NgbModal, public _sharedService: SharedService, private _jobService: JobService, public cdr: ChangeDetectorRef) { 
    
    this.partSearch = this.partSearch.bind(this);
  }
  // ngOnDestroy(): void {
  //   //Called once, before the instance is destroyed.
  //   //Add 'implements OnDestroy' to the class.
  //   this.sub.unsubscribe();
  // }

  ngOnInit() {
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/customer-concerns") > -1);
    }
    this.part = new JobPart();
    this.task = new InspectionResult();

    // this._sharedService.partsList = this._sharedService.AutomotiveParts;
    // this._sharedService.partsListBuffer = this._sharedService.partsList.slice(0, this._sharedService.bufferSize);

    if (this._sharedService.AutomotiveParts == undefined || this._sharedService.AutomotiveParts.length == 0) {
      this._sharedService.getAllParts.next(false);
    }
  }

  // ngAfterViewChecked() {
  //   if (this._sharedService.jobObj != undefined) {
  //     if (this.DiscountPercentage == undefined) {
  //       this.applicableDiscount();
  //     }
  //   }
  // }

  searchfn() {
    debugger
    this.PartSuggessions$ = concat(
      of([]), // default items
      this.itemCodeInput.pipe(
        filter(res => {
          return res !== null && res.length >= 2;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.loading = true),
        switchMap(term => {
          return this._jobService.searchPart(term, this.MainCategoryID, this.SubCategoryID, this._sharedService.currentWorkshopID).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.loading = false)
          );
        })
      )
    );
    if (this.PartSuggessions$ != null) {
      
     this.sub = this.PartSuggessions$.subscribe((res: any) => {
        debugger
        this.suggestedParts = res;        
        this._sharedService.partLoading = false;

        
        
      });
    }
  }
  trackByFn(item: Part) {
    return item.AutomotivePartID;
  }


  onClickCustomerDropdown(){
    this.searchfn();
    
    this.itemCodeInput.next('');
  }

  //#region modal
  open(modal: any) {
    this.customerConcern = new JobConcern();
    if (this._sharedService.jobObj.JCBasicInfo.ServiceTypeID === 140) {
      this.customerConcern.IsApproved = true;
      this.customerConcern.ConcernTypeID = 72;
      this.part.AddPartTask = true;
      this.task.LaborTime = 15;
    }

    this.activatedModalRef = this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
  }
  partSearch() {
    this.cdr.detectChanges();
    if (this.partName != undefined && this.partName.length > 0) {
      this._sharedService.partLoading = true;
      this._jobService.searchPart(this.partName, this.MainCategoryID, this.SubCategoryID, this._sharedService.currentWorkshopID).subscribe(res => {
        debugger
        this.suggestedParts = res;
        this._sharedService.partLoading = false;
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
  }
  setTaskTime() {
    var hours = 0;
    if (this.task.Hours != undefined && this.task.Hours != null) {
      hours = +this.task.Hours * 60;
    }
    if (this.task.Minutes == undefined) {
      this.task.Minutes = 0;
    }
    if (this.task.Minutes != undefined && this.task.Minutes != null) {
      this.task.LaborTime = hours + +this.task.Minutes;
    }
  }

  onAddConcern() {
    debugger
      this.customerConcern.IsModified = true;
    this.customerConcern.ConcernTypeName = this._sharedService._commonMeta.objectTypes.find(item=> item.ObjectNameEnglish == 'JobConcern' && item.ObjectTypeID == this.customerConcern.ConcernTypeID).TypeNameEnglish;
    if(this.customerConcern.ConcernDescription == undefined || this.customerConcern == null){
      this.customerConcern.ConcernDescription = this.customerConcern.ConcernTypeName;
    }
    let concernType=this.customerConcern.ConcernTypeID;

    this._sharedService.jobObj.JobConcerns.push(Object.assign(this.customerConcern));
    this.customerConcern.JobConcernID = Math.floor((Math.random() * -1000) - 1);

    if (this.partName != undefined) {
      if (this.partName.label != undefined) {
               
        this.part.PartNameArabic = this.partName.label;
        this.part.Quantity = this.partQuantity;
        this.part.UnitTypeID = this.partUnit;
        this.part.UnitTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.partUnit).TypeNameEnglish;
      } else {
        // checking into suggested parts list and assigning the partid in this part type concern added.
        if ( this.suggestedParts != undefined && this.suggestedParts.length > 0){
          debugger
          var findPartID;
          this.partName = this.partName.trim();
          var findPart = this.suggestedParts.find(item => item.ItemNameArabic == this.partName || item.ItemNameEng == this.partName);
          if (findPart != undefined) {
            findPartID = findPart.AutomotivePartID
            this.part.AutomotivePartID = findPartID;
          }
        }
        this.part.PartNameArabic = this.partName;
        this.part.PartNameEnglish = this.partName;
        this.part.Quantity = this.partQuantity;

        if(this._sharedService.jobObj.JCBasicInfo.ServiceTypeID === 140){
        this.part.AutomotivePartID = this._sharedService.AutomotiveParts.find(item => item.PartNameArabic == this.part.PartNameArabic).AutomotivePartID;
        this.part.SellingPrice = this._sharedService.AutomotiveParts.find(item => item.PartNameArabic == this.part.PartNameEnglish).SellingPrice;
        this.part.MainPartID = this._sharedService.AutomotiveParts.find(item => item.PartNameArabic == this.part.PartNameEnglish).MainPartID;
        this.part.MainCategoryID = this._sharedService.AutomotiveParts.find(item => item.PartNameArabic == this.part.PartNameEnglish).MainCategoryID;
        this.part.SubCategoryID = this._sharedService.AutomotiveParts.find(item => item.PartNameArabic == this.part.PartNameEnglish).SubCategoryID;
        }
        else{
        this.part.MainPartID = findPart.MainPartID;
        this.part.MainCategoryID = findPart.MainCategoryID;
        this.part.SubCategoryID = findPart.SubCategoryID;
        }
    

        // var partData = this._sharedService.AutomotiveParts.find(item => item.PartNameArabic == this.part.PartNameArabic);
        // if (partData != undefined) {
        //   this.part.AutomotivePartID = partData.AutomotivePartID;
        // }
        this.part.UnitTypeID = this.partUnit;
        if (this.partUnit != undefined) {
          this.part.UnitTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.partUnit).TypeNameEnglish;
        }
      }
    
      console.log(this.addPartTask)

      // this.concernDescription =  this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == ).ConcernDescription;
      // if(this.concernDescription == undefined || this.concernDescription == null){
      //   this.concernDescription = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID).ConcernTypeName;
      // }
      if (this.part.AddPartTask == true) {
        var con = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
        if (con != undefined) {
          this.task.IsInclude = con != undefined && con.IsApproved == true ? true : false;
          this.task.JobConcernID = con.JobConcernID;
          this.task.ConcernDescription = con.ConcernDescription;
        }
        debugger
        this.task.JobTaskID = Math.floor((Math.random() * -1000) - 1);
        this.part.JobTaskID = this.task.JobTaskID;
        var des = new String("Work on ");
        this.task.LaborDescriptionEng = des.concat(this.part.PartNameArabic);
        this.task.LaborPrice = 0;
        this.task.RepairTypeID = 70;
        this.task.JobTaskTypeID = 51;
        this.task.LaborTaskID = 0;
        this.task.LaborPricingID = 0;
        //invoke getTime function which will set time in inspection object
        this.setTaskTime();
        this.task.LaborTime = this.task.LaborTime;
        // this.task.IsFree = true;
        this.task.IsModified = true;
        this._sharedService.jobObj.JobTasks.push(this.task);

      }


      this.part.ConcernDescription = this.customerConcern.ConcernDescription;
      this.part.IsModified = true;
      this.part.JobPartID = Math.floor((Math.random() * -1000) - 1);
      this.part.JobConcernID = this.customerConcern.JobConcernID;
      this.part.IsInclude = this.customerConcern.IsApproved;
      this._sharedService.jobObj.JobParts.push(this.part);

    }

    if (this.customerConcern.ConcernTypeID == 139) {
      this.task.JobConcernID = this.customerConcern.JobConcernID;
      this.onCreateTask();
    }
    // this._sharedService.jobObj.CustomerConcerns.push(Object.assign(this.customerConcern));
    this.customerConcern = new JobConcern();
    if (this._sharedService.jobObj.JCBasicInfo.ServiceTypeID === 140) {
      debugger;
      this.customerConcern.IsApproved = true;
      this.customerConcern.ConcernTypeID = 72;
      this.part.AddPartTask = true;
      this.task.LaborTime = 15;
    }

    // ad data for part alternate 
    if (this.partBrandName != undefined) {
      var altPart = new JobPartAlternates();
      var data = this._sharedService.jobObj.PartBrands.find(i => i.BrandName == this.partBrandName);
      if (data != undefined) {
        altPart.BrandName = this.partBrandName;
        altPart.BrandID = data.PartBrandID;
        altPart.SellingPrice = this.partPrice;
        altPart.UnitTypeID = this.part.UnitTypeID;
        altPart.JobPartStatusID = 26; //26 is for ready to deliver
        altPart.JobPartID = this.part.JobPartID;
        altPart.IsModified = true;

        this._sharedService.jobObj.JobPartAlternates.push(altPart);
      }

    }
    this.part = new JobPart();
    this.task = new InspectionResult();
    this.partName = undefined;
    this.partQuantity = undefined;
    this.partBrandName = undefined;
    this.partPrice = undefined;
    this.addPartTask = true;
   //to avoide reset of tab to mechanical
    if(concernType!=undefined){
      this.customerConcern.ConcernTypeID= concernType;
    }
  
  }

  openEdit(jc: JobConcern) {
    this.part = new JobPart();
    // this.task = new InspectionResult();
    // this.task.Hours = 0;
    // this.task.Minutes = 0;
    this.partName = undefined;
    this.partQuantity = undefined;
    this.partUnit = undefined;
    var data = JSON.stringify(jc);
    this.customerConcern = JSON.parse(data);
    this.part = this._sharedService.jobObj.JobParts.find(item => item.JobConcernID == jc.JobConcernID);
    this.part = this._sharedService.jobObj.JobParts.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
    if (this.part == undefined) {
      this.part = new JobPart();
    }
    if (this.part != undefined) {
      var taskData = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID);
      if (taskData != undefined) {
        // this.task.Hours = taskData.Hours;
        // this.task.Minutes = taskData.Minutes;

        if (taskData.Hours != undefined) {
          this.task.Hours = Math.floor(taskData.LaborTime / 60);
          this.task.Minutes = taskData.LaborTime % 60;
        }

      }
      if (taskData == undefined || this.customerConcern.ConcernTypeID == 139) {
        this.task = this._sharedService.jobObj.JobTasks.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
      }
    }
    if (this.part && this.part.Quantity != undefined) {
      this.partQuantity = this.part.Quantity;
      this.partUnit = this.part.UnitTypeID;
    }
    else {
      this.partQuantity = undefined;
      this.partUnit = undefined;
    }
    if (this.part && this.part.PartNameArabic) {
      this.partName = this.part.PartNameArabic;
    }
    else {
      this.partName = undefined;
    }

    if (this.task != undefined && this.task.LaborDescriptionEng != undefined) {
      this.laborDescription = this.task.LaborDescriptionEng;
    }

    if (this.task != undefined && this.task.LaborTime != undefined) {
      this.task.Hours = Math.floor(taskData.LaborTime / 60);
      this.task.Minutes = taskData.LaborTime % 60;
    }

     /// set part brand and price
     if (this.customerConcern.ConcernTypeID == 72 && this.customerConcern.IsApproved == true) {
      var altData = this._sharedService.jobObj.JobPartAlternates.find(i => i.JobPartID == this.part.JobPartID);
      if(altData != undefined){
        this.partBrandName = this._sharedService.jobObj.PartBrands.find(i => i.PartBrandID == altData.BrandID).BrandName;
        this.partPrice = altData.SellingPrice;
      }
    }

    // this.task = this._sharedService.jobObj.JobTasks.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
    // if (this.task != undefined) {
    //   this.laborDescription = this.task.LaborDescriptionEng;
    // }
  }

  openEditConcern(modal: any, jc: JobConcern) {
    debugger
    this.part = new JobPart();
    this.task = new InspectionResult();
    this.part.AddPartTask = false;
    this.partName = undefined;
    this.partQuantity = undefined;

    var data = JSON.stringify(jc);
    this.customerConcern = JSON.parse(data);
    this.activatedModalRef = this.modalService.open(modal, { size: "lg", backdrop: 'static' });
    this.part = this._sharedService.jobObj.JobParts.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
    if (this.part == undefined) {
      this.part = new JobPart();
    }
    if (this.part != undefined) {
      var taskData = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID);
      if (taskData != undefined) {
        this.task.Hours = Math.floor(taskData.LaborTime / 60);
        this.task.Minutes = taskData.LaborTime % 60;
      }
    }
    if (this.part && this.part.Quantity != undefined) {
      this.partQuantity = this.part.Quantity;
      this.partUnit = this.part.UnitTypeID;
    }
    if (this.part && this.part.PartNameArabic) {
      this.partName = this.part.PartNameArabic;
    }

    if (this.customerConcern.ConcernTypeID == 139) {
      var taskLbr = this._sharedService.jobObj.JobTasks.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
      if (taskLbr != undefined) {
        this.laborDescription = taskLbr.LaborDescriptionEng;
      }

    }
    if (this._sharedService.jobObj.JCBasicInfo.ServiceTypeID === 140) {
      this.customerConcern.IsApproved = true;
      this.customerConcern.ConcernTypeID = 72;
      this.part.AddPartTask = true;
      this.task.LaborTime = 15;
    }
    /// set part brand and price
    if (this.customerConcern.ConcernTypeID == 72 && this.customerConcern.IsApproved == true) {
      var altData = this._sharedService.jobObj.JobPartAlternates.find(i => i.JobPartID == this.part.JobPartID);

      this.partBrandName = this._sharedService.jobObj.PartBrands.find(i => i.PartBrandID == altData.BrandID).BrandName;
      this.partPrice = altData.SellingPrice;
    }


  }

  editConcern() {
    debugger
    // this.task = new InspectionResult();
    this.customerConcern.IsModified = true;
    var index = this._sharedService.jobObj.JobConcerns.findIndex(item => item.JobConcernID == this.customerConcern.JobConcernID);
    if (index > -1) {
      this._sharedService.jobObj.JobConcerns[index] = Object.assign({}, this.customerConcern)
    }
    if (this.part == undefined) {
      this.part = new JobPart();
    }
    if (this.partName != undefined) {
      this.part.JobConcernID = this.customerConcern.JobConcernID;
      this.part.IsInclude = this.customerConcern.IsApproved;
      this.part.IsModified = true;
      if (this.partName.label != undefined) {
        this.part.PartNameArabic = this.partName.label;
        this.part.Quantity = this.partQuantity;
        this.part.UnitTypeID = this.partUnit;
        this.part.UnitTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.partUnit).TypeNameEnglish;
      } else {
        this.part.PartNameArabic = this.partName;
        this.part.Quantity = this.partQuantity;
        this.part.UnitTypeID = this.partUnit;
        if (this.partUnit != undefined) {
          this.part.UnitTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.partUnit).TypeNameEnglish;
        }
        var temp = this._sharedService.AutomotiveParts.find(item => item.PartNameArabic == this.part.PartNameArabic);
        if (temp != undefined) {
          this.part.AutomotivePartID = temp.AutomotivePartID;
        }
      }
      //update task time 
      var taskData = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID);
      if (taskData != undefined) {
        var hours
        if (this.task.Hours != undefined && this.task.Hours != null) {
          hours = +this.task.Hours * 60;
        }
        if (this.task.Minutes == undefined) {
          this.task.Minutes = 0;
        }
        if (this.task.Minutes != undefined && this.task.Minutes != null) {
          taskData.LaborTime = hours + +this.task.Minutes;
        }

      }
      // add new random task when not added already  
      if (this.part.AddPartTask == true && this._sharedService.jobObj.JobTasks.findIndex(item => item.JobTaskID == this.part.JobTaskID) == -1) {
        if (this.task == undefined) {
          this.task = new InspectionResult();
        }
        var con = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
        if (con != undefined) {
          this.task.IsInclude = con != undefined && con.IsApproved == true ? true : false;
          this.task.JobConcernID = con.JobConcernID;
          this.task.ConcernDescription = con.ConcernDescription;
        }
        this.task.JobTaskID = Math.floor((Math.random() * -1000) - 1);
        this.part.JobTaskID = this.task.JobTaskID;
        var des = new String("Work on ");
        this.task.LaborDescriptionEng = des.concat(this.part.PartNameArabic);
        this.task.LaborPrice = 0;
        this.task.RepairTypeID = 70;
        this.task.JobTaskTypeID = 51;
        this.task.LaborTaskID = 0;
        this.task.LaborPricingID = 0;
        //invoke getTime function which will set time in inspection object
        this.setTaskTime();
        this.task.LaborTime = this.task.LaborTime;
        this.task.IsFree = true;
        this.task.IsModified = true;
        this._sharedService.jobObj.JobTasks.push(this.task);

      }
      ////// if user updates time then w'll update time from concern
      // var taskData = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == this.part.JobTaskID);
      // if (taskData != undefined) {
      //   this.task.LaborTime = taskData.LaborTime;
      //   this.task.IsModified = true;
      // }

      if (this.part.JobPartID == undefined) {
        this.part.ConcernDescription = this.customerConcern.ConcernDescription;
        this.part.JobPartID = Math.floor((Math.random() * -1000) - 1);
        this._sharedService.jobObj.JobParts.push(this.part);
      }
      else {
        let index1 = this._sharedService.jobObj.JobParts.findIndex(item => item.JobPartID == this.part.JobPartID);
        this._sharedService.jobObj.JobParts[index1] = Object.assign({}, this.part);
      }
     
    }
     // ad data for part alternate 
     if (this.partBrandName != undefined) {
      var altPart = new JobPartAlternates();
      var apIndex =  this._sharedService.jobObj.JobPartAlternates.findIndex(i => i.JobPartID == this.part.JobPartID);
      altPart = this._sharedService.jobObj.JobPartAlternates.find(i => i.BrandName == this.partBrandName);
      if (altPart != undefined) {
        altPart.BrandName = this.partBrandName;
        altPart.BrandID = this._sharedService.jobObj.PartBrands.find(i => i.BrandName == this.partBrandName).PartBrandID;
        altPart.SellingPrice = this.partPrice;
        altPart.UnitTypeID = this.part.UnitTypeID;
        altPart.JobPartStatusID = 26; //26 is for ready to deliver
        altPart.JobPartID = this.part.JobPartID;
        altPart.IsModified = true;
        this._sharedService.jobObj.JobPartAlternates[apIndex] = Object.assign({}, altPart)
      }

    }

    if (this.customerConcern.ConcernTypeID == 139) {
      var taskData = this._sharedService.jobObj.JobTasks.find(item => item.JobConcernID == this.customerConcern.JobConcernID);
      if (this.laborDescription != undefined && taskData != undefined) {
        taskData.LaborDescriptionEng = this.laborDescription;
        taskData.LaborTaskID = this._sharedService.jobObj.LaborTasks.find(item => item.LaborDescriptionEng == this.laborDescription || item.LaborDescriptionArabic == this.laborDescription).LaborTaskID;
        taskData.IsModified = true;
      }
    }

    this.customerConcern = new JobConcern();
    this.part = new JobPart();
    this.partName = undefined;
    this.partQuantity = undefined;

    if(this._sharedService.jobObj.JCBasicInfo.ServiceTypeID == 140){
      this.customerConcern.ConcernTypeID = 72;
    }
  }

  dismissModal() {
    this.part = new JobPart();
    this.partName = undefined;
    this.partQuantity = undefined;
    this.activatedModalRef.dismiss();
  }

  closeModal() {
    this.part = new JobPart();
    this.partName = undefined;
    this.partQuantity = undefined;
    this.laborDescription = undefined;
    this.activatedModalRef.close();
    this.sub.unsubscribe();
  }

  //#endregion

  //#region delete
  openDeleteConcern(modal: any, jc: JobConcern) {
    this.customerConcern = jc;
    this.activatedModalRef2 = this.modalService.open(modal);
  }

  closeDeleteModal() {
    this.activatedModalRef2.close();
  }

  delete() {
    var index = this._sharedService.jobObj.JobConcerns.findIndex(item => item.JobConcernID == this.customerConcern.JobConcernID);
    if (this._sharedService.jobObj.JobParts.length > 0) {
      var index1 = this._sharedService.jobObj.JobParts.findIndex(item => item.JobConcernID == this.customerConcern.JobConcernID);
      if (index1 > -1) {
        this._sharedService.jobObj.JobParts[index1].ConcernDescription = undefined;
        this._sharedService.jobObj.JobParts[index1].JobConcernID = undefined;
      }

    }
    if (this._sharedService.jobObj.JobTasks.length > 0) {
      var temp = this._sharedService.jobObj.JobTasks.findIndex(item => item.JobConcernID == this.customerConcern.JobConcernID);
      if (temp > -1) {
        this._sharedService.jobObj.JobTasks[temp].ConcernDescription = undefined;
        this._sharedService.jobObj.JobTasks[temp].JobConcernID = undefined;
      }

    }

    if (this.customerConcern.JobConcernID < 0)
      this._sharedService.jobObj.JobConcerns.splice(index, 1);
    else {
      this._jobService.deleteJobConcern(this.customerConcern.JobConcernID).subscribe((res: any) => {
        this._sharedService.jobObj.JobConcerns.splice(index, 1);
        this.activatedModalRef2.close();
        this._sharedService.success('success', 'Concern deleted successfully')
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
    this.activatedModalRef2.close();
    this.customerConcern = new JobConcern();
  }
  //#endregion


  onCreateTask() {

  
    debugger
    this.task.LaborDescriptionEng = this.laborDescription;
    var concerndata = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == this.task.JobConcernID);
    if (concerndata != undefined) {
      this.task.ConcernDescription = concerndata.ConcernDescription;
    }

    

    var lt = this._sharedService.jobObj.LaborTasks.find(item => item.LaborDescriptionEng == this.task.LaborDescriptionEng);
    if (lt != undefined) {
      this.task.LaborTaskID = lt.LaborTaskID;
    }

    if (this.task.LaborTime != undefined && this.task.LaborPrice != null) {
      this.task.NetAmount = (this.task.LaborTime / 60) * this.task.LaborPrice;
    } else {
      this.task.NetAmount = 0;
    }

    this.task.IsModified = true;
    this.task.IsInclude = false;
    // this.inspectionResult.JobConcernID = this.concernID;
    if (this.task.JobConcernID != null) {
      this.task.IsInclude = concerndata.IsApproved;
    }
    var icon = this._sharedService._commonMeta.objectTypes.find(item => (item.ObjectNameEnglish == 'JobConcern' && item.ObjectTypeID == this.task.RepairTypeID));
    if (icon != undefined) {
      this.task.Icon = icon.Icon;
    }

    this.task.JobTaskID = Math.floor((Math.random() * -1000) - 1);
    this.task.RepairTypeID = 139; //139 for inspection 

    this._sharedService.jobObj.JobTasks.push(this.task);
    this._sharedService.jobObj.JobTasks.sort((a, b) => a.PriorityTypeID > b.PriorityTypeID ? -1 : a.PriorityTypeID < b.PriorityTypeID ? 1 : 0);
    //this.concernID = null;
    this.task = new InspectionResult();
    this.laborDescription = undefined;
  }


  //#virtualScroll 
  onScrollToEnd() {
    this.fetchMore();
    this.spliceParts();
  }

  onScroll({ end }) {
    if (this._sharedService.partLoading || this._sharedService.partsList.length <= this._sharedService.partsListBuffer.length) {
      return;
    }

    if (end + this._sharedService.numberOfItemsFromEndBeforeFetchingMore >= this._sharedService.partsListBuffer.length) {
      this.fetchMore();
    }
    this.spliceParts();
  }

  private fetchMore() {
    const len = this._sharedService.partsListBuffer.length;
    const more = this._sharedService.partsList.slice(len, this._sharedService.bufferSize + len);
    this._sharedService.partLoading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this._sharedService.partLoading = false;
      this._sharedService.partsListBuffer = this._sharedService.partsListBuffer.concat(more);
    }, 200)
  }

  spliceParts() {
    var jp = this._sharedService.jobObj.JobParts;
    if (jp.length > 0) {
      jp.forEach(item => {
        var spl = this._sharedService.partsListBuffer.findIndex(part => part.AutomotivePartID == item.AutomotivePartID);
        if (spl > -1) {
          this._sharedService.partsListBuffer.splice(spl, 1);
          this._sharedService.partsListBuffer = [...this._sharedService.partsListBuffer];
        }
      });
    }
  }
  //#endVirtualScroll

  onAmountEnter(event){
  
        if(event.charCode>=48 && event.charCode<=57 && this.partPrice!=undefined){
          var max_chars = 10;
          let number=this.partPrice.toString();
      
          if(this.partPrice > max_chars) {
            this.partPrice = +number.substring(0, max_chars);
          }
        }
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 46 && event.charCode != 47 && event.charCode <= 57

      }
}
