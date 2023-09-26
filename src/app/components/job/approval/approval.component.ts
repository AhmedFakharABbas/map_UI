import { AfterViewChecked, AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
import { CommonService } from 'app/services/common.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from 'app/services/job.service';
import { Note } from 'app/models/note';
import { InspectionResult } from 'app/models/inspection-result';
import { JobPart } from 'app/models/JobPart';
import { JobPartAlternates } from 'app/models/job-part-alternates';
import { Router } from '@angular/router';
import { JobConcern } from 'app/models/job-concern';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { copyFileSync } from 'fs';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {
  isOpen:boolean;
  activatedModalRef: NgbModalRef;
  dataURL: string;
  note: Note;
  taskTtl: number = 0;
  partTtl: number = 0;
  concern: JobConcern;
  IsSorted: boolean = false;
  missingAlternates: Array<JobPart>;
  activatedModalRef1: NgbModalRef;
  public sections = 4;

  public scroll; 
  public selected = false;
  constructor(private renderer: Renderer2,public _sharedService: SharedService, private modalService: NgbModal, public _commonService: CommonService, public _jobService: JobService, private _router: Router) { }
  
  ngOnInit() {
    this.isOpen=false;
    console.log('17', this._sharedService.jobObj.JCBasicInfo.ApprovalStatusID);
    // if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
    //   this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/approval") > -1);
    // }
    // this._sharedService.jobObj.JobTasks.forEach(el=> {
    //   if (el.JobTaskTypeID == 51) {
    //     this._sharedService.jobObj.JCBasicInfo.InternalTasksCost = el.LaborCost;
    //   }
    // }

    // )
    // this._sharedService.jobObj.JobParts.forEach(el => {
    //   var altparts = this._sharedService.jobObj.JobPartAlternates.filter(item => item.JobPartID == el.JobPartID && el.IsInclude == true);
    //   if (altparts.length == 1) {
    //     this._sharedService.jobObj.JobPartAlternates.find(item => item.JobPartAlternateID == altparts[0].JobPartAlternateID).IsApproved = true;
    //     var cal = this._sharedService.jobObj.JobPartAlternates.find(item => item.JobPartAlternateID == altparts[0].JobPartAlternateID);
    //     cal.IsApproved = true;
    //     this.altPartPriceCalc(cal);   
    //   }

    // });


    //  this.calcTotal();
    // if(this._sharedService.jobObj.JobTasks != undefined){
    //   this._sharedService.jobObj.JobTasks.sort((a, b) => a.PriorityTypeID > b.PriorityTypeID ? -1 : a.PriorityTypeID < b.PriorityTypeID ? 1 : 0);
    // } 

  }

 

  //   //auto select alternate part if only one
  //   if (jp != undefined && jp.IsInclude == true) {
  //     var altparts = this._sharedService.jobObj.JobPartAlternates.filter(item => item.JobPartID == jp.JobPartID);
  //     if (altparts.length >= 1) {
  //       this._sharedService.jobObj.JobPartAlternates.find(item => item.JobPartAlternateID == altparts[0].JobPartAlternateID).IsApproved = true;
  //       var cal = this._sharedService.jobObj.JobPartAlternates.find(item => item.JobPartAlternateID == altparts[0].JobPartAlternateID);
  //       cal.IsApproved = true;
  //       cal.IsModified = true;

  //       // var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID)
  //       // jt.IsModified = true;
  //       // jt.IsInclude = true;
  //       this.altPartPriceCalc(cal);
  //     }
  //   }
  // }
  // selectTask(){

  // }
  closeJC() {
    this._jobService.closeJC(this._sharedService.jobObj.JCBasicInfo.JobCardID, this._sharedService.jobObj.JobInvoice.NetAmount, this._sharedService.jobObj.JCBasicInfo.KeyStatusID).subscribe((res: any) => {
      this._sharedService.success('Job card closed');
      if (this._sharedService.jobObj.JobInvoice.PrintInvoice == true) {
        this._router.navigate(['/', 'invoice', 'detail'], { queryParams: { JobInvoiceID: res } });
      }
      this.activatedModalRef.close();
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  // taskDiscount(jt: InspectionResult) {

  //   var discount =Number(jt.DiscountAmount);
  //   if (jt.IsInclude) {
  //      var jobTask = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jt.JobTaskID);
  //      jobTask.NetAmount = jobTask.LaborCost - discount;
  //      if (jobTask.JobTaskTypeID == 51) {
  //        this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount += discount;
  //        this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount -= discount;
  //      }
  //      if (jobTask.JobTaskTypeID == 52) {
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount += discount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount -= discount;
  //     }
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksCost -= discount; 
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount += discount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalCost -= discount;
  //   }
  //   else{
  //     jt.DiscountAmount = 0;
  //     console.log("select task");
  //   }
    
  //   // if (jt.NetAmount < jt.DiscountAmount) {
  //   //   this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jt.JobTaskID).DiscountAmount = 0;
  //   //   this._sharedService.warning('Warning', 'Discount cannot be greater than labor price');
  //   // }
  //   // else {
  //   //   this.calcTotal(jt);
  //   // }
  // }

  // // taskDiscount(JobTaskID : number, DiscountAmount: number) {
  // //   debugger
  // //   // if (jt.NetAmount < jt.DiscountAmount) {
  // //   //   this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jt.JobTaskID).DiscountAmount = 0;
  // //   //   this._sharedService.warning('Warning', 'Discount cannot be greater than labor price');
  // //   // }
  // //   // else {
  // //   //   this.calcTotal();
  // //   // }
  // // }

  // totalTaskDiscount() {
  //   if (this._sharedService.jobObj.JCBasicInfo.RepairDiscount == null) {
  //     this._sharedService.jobObj.JCBasicInfo.RepairDiscount = 0;
  //   }
  //   if (this._sharedService.jobObj.JCBasicInfo.TotalTasksCost < this._sharedService.jobObj.JCBasicInfo.RepairDiscount) {
  //     this._sharedService.jobObj.JCBasicInfo.RepairDiscount = 0;
  //     this._sharedService.warning('Warning', 'Discount cannot be greater than price');
  //   }
  //   // this.calcTotal(jt);
  // }

  // totalPartDiscount() {

  //   if (this._sharedService.jobObj.JCBasicInfo.PartDiscount == null) {
  //     this._sharedService.jobObj.JCBasicInfo.PartDiscount = 0;
  //   }
  //   if (this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice < this._sharedService.jobObj.JCBasicInfo.PartDiscount) {
  //     this._sharedService.jobObj.JCBasicInfo.PartDiscount = 0;
  //     this._sharedService.warning('Warning', 'Discount cannot be greater than price');
  //   }
  //   // this.calcTotal();
  // }

  // calcTaskTotal(flag: boolean, jt: InspectionResult) {

  //   var jt1 = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jt.JobTaskID);
  //   jt1.IsModified = true;
  //   if (this._sharedService.jobObj.PlanFeatures != undefined) {
  //     // set task to free if included in contract
  //     var fd = this._sharedService.jobObj.PlanFeatures.find(item => item.LaborTaskID == jt.LaborTaskID && item.NumberOfUnits != item.TotalUsage);
  //     if (fd != undefined) {
  //       jt.IsContractTask = true;

  //       // set count of used as well
  //       if (flag == true) {
  //         fd.TotalUsage += 1;
  //       }
  //       if (flag == false) {
  //         fd.TotalUsage -= 1;
  //       }
  //     }

  //   }

  //   ////auto select part if the task is auto generated
  //   // if (jt1.IsFree == true && jt.IsInclude == true && flag == true) {
  //   //   var jp = this._sharedService.jobObj.JobParts.filter(item => item.JobTaskID == jt.JobTaskID);
  //   //   if (jp != undefined) {
  //   //     jp.IsInclude = true;
  //   //     jp.IsModified = true;
  //   //     // this.setAlternate(jp);
  //   //   }
  //   // }

  //   ////un-select the part on un-selecting task  
  //   if (flag == false) {
  //     var jp = this._sharedService.jobObj.JobParts.filter(item => item.JobTaskID == jt1.JobTaskID);
  //     if (jp.length > 0) {
  //       jp.forEach(item => {
  //         if (item.IsInclude == true) {
  //           item.IsInclude = false;
  //           item.IsModified = true;
  //           item.JobPartAlternateID = null;
  //           this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount -= item.NetAmount;
  //           this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice -= item.TotalAmount;
  //           this._sharedService.jobObj.JCBasicInfo.TotalPartsDiscount -= item.DiscountAmount;
  //           this._sharedService.jobObj.JCBasicInfo.TotalPartsTax -= item.TaxAmount; 
  //           this._sharedService.jobObj.JobPartAlternates.forEach(el => {
  //             if (el.JobPartID == item.JobPartID) {
  //               el.IsApproved = false;
  //               el.IsModified = true;
  //             }
  //           })
  //         }
  //       });
        
  //       // this.setAlternate(jp)
  //       // this._sharedService.jobObj.JobPartAlternates.find(item => item.JobPartID == this._sharedService.jobObj.JobParts[index].JobPartID).IsApproved = false;
        
  //     }
  //     // var concern = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == jt.JobConcernID);
  //     // if (concern != undefined) {
  //     //   concern.TaskTime = concern.TaskTime - jt.LaborTime;
  //     // }
  //     jt1.IsInclude = false;
  //   } else {
  //     // var concern = this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == jt.JobConcernID);
  //     // if (concern != undefined) {
  //     //   concern.TaskTime = concern.TaskTime + jt.LaborTime;
  //     // }
  //     jt1.IsInclude = true;
  //   }
  //   this.calcTotal(jt);
  // }

  // calcTotal(jt) {
  //   this._sharedService.jobObj.JCBasicInfo.ServiceTypeID == 42
  //   var task = this._sharedService.jobObj.JobTasks.find( item => item.JobTaskID == jt.JobTaskID && (item.IsContractTask == false || item.IsContractTask == null ));
  //   // var getPart = this._sharedService.jobObj.JobParts.filter(item => item.IsInclude == true && item.JobTaskID == jt.JobTaskID && (item.IsContractPart == false || item.IsContractPart == null));
  //   if (jt.IsInclude == true) {
      
  //     task.TaxAmount = task.LaborCost * 0.16;
  //     task.TotalAmount = task.LaborCost;
  //     task.NetAmount = task.LaborCost - task.DiscountAmount;
        
  //       if(task.JobTaskTypeID == 51) {
  //         this._sharedService.jobObj.JCBasicInfo.InternalTasksCost += task.TotalAmount ;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount += task.NetAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalTax += task.TaxAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount += task.DiscountAmount;
  //       }
  //       if (task.JobTaskTypeID == 52) {
  //         this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost += task.TotalAmount ;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount += task.NetAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalTax += task.TaxAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount += task.DiscountAmount;
  //       }
     
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksCost = (this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount + 
  //     this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount) - this._sharedService.jobObj.JCBasicInfo.RepairDiscount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksTax = this._sharedService.jobObj.JCBasicInfo.TotalInternalTax +
  //     this._sharedService.jobObj.JCBasicInfo.TotalExternalTax;
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount =this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount +
  //     this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalCost = this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount + 
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksCost; 
  //   }
  //   if (jt.IsInclude == false) {
       
  //       if(task.JobTaskTypeID == 51) {
  //         this._sharedService.jobObj.JCBasicInfo.InternalTasksCost -= task.TotalAmount ;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount -= task.NetAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalTax -= task.TaxAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount -= task.DiscountAmount;
  //       }
  //       if (task.JobTaskTypeID == 52) {
  //         this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost -= task.TotalAmount ;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount -= task.NetAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalTax -= task.TaxAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount -= task.DiscountAmount;
  //       }
        
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksTax = this._sharedService.jobObj.JCBasicInfo.TotalInternalTax +
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalTax;
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount =this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount +
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksCost = this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount + 
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalCost = this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount + 
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksCost;
  //       task.DiscountAmount = 0;
  //   }
      //   if (item.DiscountAmount == undefined) {
      //     item.DiscountAmount = 0;
      //   }
      //   this.taskTtl = this.taskTtl + item.TotalAmount - item.DiscountAmount;
      //   ///sum tax amount of tasks
      //   // this._sharedService.jobObj.JCBasicInfo.TotalTaxAmount += item.TaxAmount;
      // })
      // this._sharedService.jobObj.JCBasicInfo.TotalTasksCost = this.taskTtl
    // }
    // else {
    //   this._sharedService.jobObj.JCBasicInfo.TotalTasksCost = 0;
    // }

    // if (getPart.length > 0) {
    //   getPart.filter(item => {
    //     if (item.TaxAmount == null) {
    //       this.partTtl += item.TotalAmount;
    //     }
    //     else {
    //       this.partTtl += item.TotalAmount;
    //       ////sum tax amount of parts
    //       this._sharedService.jobObj.JCBasicInfo.TotalTaxAmount += item.TaxAmount;
    //     }
    //   })
    //   this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice = this.partTtl
    // }
    // else {
    //   this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice = 0;
    // }

    // this._sharedService.jobObj.JCBasicInfo.InternalTasksCost = 0;
    // this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost = 0;

    // var intTask = this._sharedService.jobObj.JobTasks.filter(item => item.IsInclude == true && item.JobTaskTypeID == 51 && (item.IsContractTask == false || item.IsContractTask == null));
    // intTask.forEach(el => {
    //   this._sharedService.jobObj.JCBasicInfo.InternalTasksCost = this._sharedService.jobObj.JCBasicInfo.InternalTasksCost + el.TotalAmount - el.DiscountAmount;
    // })
    // var extTask = this._sharedService.jobObj.JobTasks.filter(item => item.IsInclude == true && item.JobTaskTypeID == 52 && (item.IsContractTask == false || item.IsContractTask == null));
    // extTask.forEach(el => {
    //   this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost = this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost + el.TotalAmount - el.DiscountAmount;
    //   this._sharedService.jobObj.JCBasicInfo.IsModified = true;
    // })

    ////set total tax amount
    // this._sharedService.totalTaxAmount = 0;
    // this._sharedService.jobObj.JobParts.forEach(element => {
    //   var ttl = 0;
    //   if (element.IsInclude == true) {
    //     if (element.TaxAmount == null) {
    //       element.TaxAmount = element.NetAmount * 0.16;
    //       element.NetAmount -= element.TaxAmount;
    //     }
    //     this._sharedService.totalTaxAmount += element.TaxAmount == undefined ? 0 : element.TaxAmount;
    //     ttl += element.TaxAmount == undefined ? 0 : element.TaxAmount;
    //   }
    //   // this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice += ttl;
    // });

    // this._sharedService.jobObj.JobTasks.forEach(element => {
    //   var ttl = 0;
    //   if (element.IsInclude == true) {
    //     element.TaxAmount = element.NetAmount * 0.16;
    //     ttl += element.TaxAmount == undefined ? 0 : element.TaxAmount;
    //     this._sharedService.totalTaxAmount += element.TaxAmount == undefined ? 0 : element.TaxAmount;
    //     this._sharedService.jobObj.JCBasicInfo.TotalTasksCost += ttl;
    //   }
    // });


    ////setting up total tasks and parts discount
    // if (this._sharedService.jobObj.JCBasicInfo.RepairDiscount != undefined) {
    //   this._sharedService.jobObj.JCBasicInfo.TotalTasksCost -= this._sharedService.jobObj.JCBasicInfo.RepairDiscount;
    // }
    // if (this._sharedService.jobObj.JCBasicInfo.PartDiscount != undefined) {
    //   this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice -= this._sharedService.jobObj.JCBasicInfo.PartDiscount
    // }
    // //total
    // this._sharedService.jobObj.JCBasicInfo.Total = this._sharedService.jobObj.JCBasicInfo.InternalTasksCost + this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost + this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice + this._sharedService.jobObj.JCBasicInfo.TotalTaxAmount;

    //reset alternate parts
    // var jobPart = this._sharedService.jobObj.JobParts.filter(item => item.IsInclude == false);
    // this._sharedService.jobObj.JobPartAlternates.find(item)
    // this._sharedService.jobObj.JobPartAlternates.forEach(el=>{
    //   if(el.JobPartAlternateID == jobPart.find(item=> item.JobPartID == el.JobPartID).JobPartAlternateID){
    //     el.IsApproved = false;
    //   }
    // })
    ///////set tax amount to zero if car id free tax
    // if (this._sharedService.jobObj.jcVehicleObj.PlateTypeID == 118 || this._sharedService.jobObj.JCBasicInfo.IsTaxFree == true) {
    //   this._sharedService.jobObj.JCBasicInfo.Total -= this._sharedService.jobObj.JCBasicInfo.TotalTaxAmount;
    //   this._sharedService.jobObj.JCBasicInfo.TotalTaxAmount = 0;
    // }

  // }

  // calcPartTotal(flag: boolean, jp: JobPart) {
  //   // set task to free if included in contract
  //   if (this._sharedService.jobObj.PlanFeatures != undefined) {
  //     var fd = this._sharedService.jobObj.PlanFeatures.find(item => item.AutomotivePartID == jp.AutomotivePartID && item.NumberOfUnits != item.TotalUsage);
  //     if (fd != undefined) {
  //       jp.IsContractPart = true;

  //       // set count of used as well
  //       if (flag == true) {
  //         fd.TotalUsage += 1;
  //       }
  //       if (flag == false) {
  //         fd.TotalUsage -= 1;
  //       }
  //     }

  //   }


  //   if (jp.IsInclude == false) {
  //     // this._sharedService.jobObj.JobPartAlternates.find(item => item.JobPartID == jp.JobPartID).IsApproved = false;
  //     this._sharedService.jobObj.JobPartAlternates.forEach(el => {
  //       if (el.JobPartID == jp.JobPartID) {
  //         el.IsApproved = false;
  //         el.IsModified = true;
  //       }
  //     })
  //     this._sharedService.jobObj.JobTasks.forEach(el => {
  //       if (el.JobTaskID == jp.JobTaskID) {
  //         el.IsModified = true;
  //         el.IsInclude = false;
  //       }
  //     })

  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount -= jp.NetAmount - this._sharedService.jobObj.JCBasicInfo.PartDiscount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice -= jp.TotalAmount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsDiscount -= jp.DiscountAmount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsTax -= jp.TaxAmount; 
       
  //     var jt = this._sharedService.jobObj.JobTasks.find(item=> item.JobTaskID == jp.JobTaskID);
  //     // if(jt.IsInclude == false){
  //     //   jt.DiscountAmount = 0;
  //     // }
  //     if(jt.JobTaskTypeID == 51) {
  //       this._sharedService.jobObj.JCBasicInfo.InternalTasksCost -= jt.TotalAmount ;
  //       this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount -= jt.NetAmount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalInternalTax -= jt.TaxAmount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount -= Number(jt.DiscountAmount);
  //     }
  //     if (jt.JobTaskTypeID == 52) {
  //       this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost -= jt.TotalAmount ;
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount -= jt.NetAmount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalTax -= jt.TaxAmount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount -= Number(jt.DiscountAmount);
  //     }
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksTax = this._sharedService.jobObj.JCBasicInfo.TotalInternalTax +
  //     this._sharedService.jobObj.JCBasicInfo.TotalExternalTax;
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount =this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount +
  //     this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksCost = (this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount + 
  //     this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount) - this._sharedService.jobObj.JCBasicInfo.RepairDiscount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalCost = this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount + 
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksCost;
  //     if (!jt.IsInclude){
  //       jt.DiscountAmount = 0;
  //     }
  //     if(this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount <= 0 ){
        
  //       this._sharedService.jobObj.JCBasicInfo.PartDiscount = 0;
  //       this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount = 0;
  //       // this._sharedService.jobObj.JCBasicInfo.TotalCost = 0;
  //     }

  //     if ( this._sharedService.jobObj.JCBasicInfo.TotalTasksCost <= 0) {
  //       this._sharedService.jobObj.JCBasicInfo.RepairDiscount = 0;
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksCost = 0;
  //     }
  //     // if (this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice < 0) {
  //     //   this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice = 0;
  //     // }
  //     this._sharedService.jobObj.JCBasicInfo.Total -= jp.NetAmount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalTaxAmount -= jp.TaxAmount;
  //     var part = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == jp.JobPartID)
  //     part.JobPartAlternateID = undefined;
  //     part.SellingPrice = 0;
  //     part.NetAmount = 0;
  //   }
  //   // else {

  //   // }

  // }

  // altPartPriceCalc(ap: JobPartAlternates) {

  //   var jp = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == ap.JobPartID);
  //   var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID);
  //   if (jp.JobPartAlternateID != ap.JobPartAlternateID) {

  //     if (jp.JobPartAlternateID != null) {
  //       var existingAltPart = this._sharedService.jobObj.JobPartAlternates.find(part => part.JobPartAlternateID == jp.JobPartAlternateID)
  //       if (existingAltPart != undefined) {
  //         // Removing existing part net amount from parts total amount 
  //         this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice -= existingAltPart.NetAmount;
  //         // Removing part labor from total as well
  //         var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID);
  //         this._sharedService.jobObj.JCBasicInfo.InternalTasksCost -= jt.NetAmount;
  //       }
  //     }
  //     jp.JobPartAlternateID = ap.JobPartAlternateID;
  //     jp.SellingPrice = ap.SellingPrice;
  //     jp.TaxAmount = ap.SellingPrice * 0.16;
  //     jp.DiscountAmount = (ap.SellingPrice * jp.Quantity) * (ap.DiscountPercentage / 100);
  //     jp.NetAmount = (jp.SellingPrice * jp.Quantity) - jp.DiscountAmount;
  //     jp.TotalAmount = ap.SellingPrice * jp.Quantity;
      
  //    var jt1 =  this._sharedService.jobObj.JobTasks.filter(item => item.JobTaskID == jp.JobTaskID);
  //    jt1.forEach(item => {
  //      if (!item.IsInclude) {
  //       jt.TaxAmount = jt.LaborCost * 0.16;
  //       jt.TotalAmount = jt.LaborCost;
  //       jt.NetAmount = jt.LaborCost - jt.DiscountAmount;
  //       jt.IsInclude = true;
  //       jt.IsModified = true;
  //       if(jt.JobTaskTypeID == 51 ) {
  //         this._sharedService.jobObj.JCBasicInfo.InternalTasksCost += jt.TotalAmount ;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount += jt.NetAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalTax += jt.TaxAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount += jt.DiscountAmount;
  //       }
  //       if (jt.JobTaskTypeID == 52) {
  //         this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost += jt.TotalAmount ;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount += jt.NetAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalTax += jt.TaxAmount;
  //         this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount += jt.DiscountAmount;
  //       }
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksCost =  (this._sharedService.jobObj.JCBasicInfo.TotalInternalNetAmount + 
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalNetAmount) - this._sharedService.jobObj.JCBasicInfo.RepairDiscount;
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksTax = this._sharedService.jobObj.JCBasicInfo.TotalInternalTax +
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalTax;
  //       this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount =this._sharedService.jobObj.JCBasicInfo.TotalInternalDiscount +
  //       this._sharedService.jobObj.JCBasicInfo.TotalExternalDiscount;
  //      }
  //    }); 

  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsDiscount += jp.DiscountAmount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount += jp.NetAmount ;
  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice += jp.TotalAmount;
  //     this._sharedService.jobObj.JCBasicInfo.TotalPartsTax += jp.TaxAmount; 
  //     this._sharedService.jobObj.JCBasicInfo.TotalCost = this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount + 
  //     this._sharedService.jobObj.JCBasicInfo.TotalTasksCost; 
      
  //     // +
  //     // this._sharedService.jobObj.JCBasicInfo.TotalTasksCost;
      
  //     // adding part labor in total as well
      
  //     if (jt.IsFree) {
  //       jt.IsModified = true;
  //       jt.IsInclude = true;
  //       this._sharedService.jobObj.JCBasicInfo.InternalTasksCost += jt.NetAmount;
  //     }
  //   }

  //   // this.calcTotal();
  // }

  // approvePart(ap: JobPartAlternates) {
  //   var jp = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == ap.JobPartID);
  //   jp.IsModified = true;
  //   jp.IsInclude = true;
  //   ap.IsApproved = true;
  //   this._sharedService.jobObj.JobPartAlternates.forEach(item => {
  //     if (item.JobPartAlternateID != ap.JobPartAlternateID && item.JobPartID == ap.JobPartID) {
  //       item.IsApproved = false;
  //       item.IsModified = true;
  //     }
  //   });
  //   var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID);
  //       jt.IsModified = true;
  //       jt.IsInclude = true;
  //   var jc =  this._sharedService.jobObj.JobConcerns.find(item => item.JobConcernID == jp.JobConcernID);
  //       jc.IsModified = true;
  //       jc.IsApproved = true;

  // }
 

  onSort() {
    if (this.IsSorted == true) {
      this._sharedService.jobObj.JobTasks.sort((a, b) => a.PriorityTypeID > b.PriorityTypeID ? -1 : a.PriorityTypeID < b.PriorityTypeID ? 1 : 0);
    }
    else {
      this._sharedService.jobObj.JobTasks.sort((a, b) => a.PriorityTypeID < b.PriorityTypeID ? -1 : a.PriorityTypeID > b.PriorityTypeID ? 1 : 0);

    }
  }


  closeModal() {
    this._sharedService.jobObj.JobInvoice.NetAmount = undefined;
    this.activatedModalRef.close();
  }

  closeJCModal(modal: any) {
    this.activatedModalRef = this.modalService.open(modal);
  }



  addNote() {
    this.note = new Note;
    if (this._sharedService.jobObj.Notes == undefined) {
      this._sharedService.jobObj.Notes = new Array<Note>();
    }
    this.note.NoteID = Math.floor((Math.random() * -1000) - 1);
    this.note.ObjectID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
    this.note.IsModified = true;
    this.note.NoteInfo = '';
    this.note.ObjectTypeID = 83;
    this._sharedService.jobObj.Notes.push(this.note);
  }

  removeNote(note: Note) {
    if (note.NoteID > 0) {
      this._jobService.deleteNote(note.NoteID).subscribe((res: any) => {
        this._sharedService.jobObj.Notes.splice(this._sharedService.jobObj.Notes.findIndex(item => item.NoteID == note.NoteID), 1);
        this._sharedService.success('Success', 'Note deleted successfully')
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
    else {
      this._sharedService.jobObj.Notes.splice(this._sharedService.jobObj.Notes.findIndex(item => item.NoteID == note.NoteID), 1);
    }
    this.note = new Note();
  }

  // viewConcern(modal: any, con: JobConcern) {
  //   this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  //   this.concern = new JobConcern();
  //   this.concern = con;
  // }

  verifyApproval() {

    this._jobService.aprroval(this._sharedService.jobObj.JCBasicInfo.JobCardID).subscribe(resposnse => {
      console.log(resposnse);
        this._router.navigate(['/', 'update-job', this._sharedService.jobObj.JCBasicInfo.JobCardID, 'take-approval']);
    }, error => {
      console.log(error);
    });

    // this.missingAlternates = new Array<JobPart>();

    // var parts: any = this._sharedService.jobObj.JobParts.filter(item => item.IsInclude == true);
    // var checkedParts: any = [];
    // var approvedTasks = this._sharedService.jobObj.JobTasks.find(item => item.IsInclude == true);
    // if (approvedTasks != undefined) {
    //   if (this._sharedService.jobObj.JobPartAlternates != undefined || this._sharedService.jobObj.JobPartAlternates.length > 0) {
    //     parts.forEach(el => {
    //       if (this._sharedService.jobObj.JobPartAlternates.findIndex(item => item.JobPartID == el.JobPartID && item.IsApproved == true) > -1) {
    //         checkedParts.push(el);
    //       }
    //       else {
    //         this.missingAlternates.push(el);
    //       }
    //     })
    //   }
    //   if (checkedParts.length == parts.length) {
    //     let element: HTMLElement = document.getElementById('updateJob') as HTMLElement;
    //     element.click();
    //     setTimeout(() => {
    //       this._router.navigate(['/', 'update-job', this._sharedService.jobObj.JCBasicInfo.JobCardID, 'take-approval']);
    //     }, 1000);
    //   }
    //   else {
    //     let element: HTMLElement = document.getElementById('alternateMissingbtn') as HTMLElement;
    //     element.click();
    //     this._sharedService.error('Error', 'Please select manufacturer of selected part!');
    //   }
    // }
    // else {
    //   this._sharedService.error('Error', 'Please select at-least one Task!');
    // }

  }

  openAlternateMissingModal(modal: any) {
    this.activatedModalRef1 = this.modalService.open(modal, { backdrop: 'static', size: 'lg' });
  }
  closeAlternateMissingModal() {
    this.activatedModalRef1.close();
  }
  partDiscount(partDiscount: any){
    if (partDiscount > 0  && this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount > partDiscount) {
      this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount -= partDiscount;
    this._sharedService.jobObj.JCBasicInfo.TotalCost -= partDiscount;
    }
    else{
      partDiscount = 0;
    }
    
  }
  taskInputDiscount(taskDiscount: any){
    if (taskDiscount > 0  && this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount > taskDiscount) {
      this._sharedService.jobObj.JCBasicInfo.TotalTasksCost -= taskDiscount;
      this._sharedService.jobObj.JCBasicInfo.TotalCost -= taskDiscount;
    }
    else{
       taskDiscount = 0;
    }
    
  }
  onSelectPart(jp: JobPart){
    if (jp.IsInclude) {
      jp.IsModified = true;
      var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID);
      if (!jt.IsInclude || jt.IsInclude == undefined) {
        jt.IsInclude = true;
        jt.IsModified = true
      }
      var jpa =  this._sharedService.jobObj.JobPartAlternates.filter(item => item.JobPartID == jp.JobPartID);
      if (!jpa[0].IsApproved || jpa[0].IsApproved == undefined) {
        jpa[0].IsApproved = true;
        jpa[0].IsModified = true;  
        jp.JobPartAlternateID = jpa[0].JobPartAlternateID;
        jp.AutomotivePartID = jpa[0].AutomotivePartID;
      }
      console.log("JobPart", jp);
      this.CalculateCost();
    }
    else{
      jp.IsModified = true;
      jp.IsInclude = false;

      var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID);
      if (jt.IsInclude) {
        jt.IsInclude = false;
        jt.IsModified = true;  
      }
      var jpa =  this._sharedService.jobObj.JobPartAlternates.filter(item => item.JobPartID == jp.JobPartID);
      jpa.forEach(item => {
        item.IsApproved = false;
        item.IsModified = true;
        jp.JobPartAlternateID = null;
        jp.AutomotivePartID = null;
      })
      console.log("JobPart", jp);
      this.CalculateCost();
    }
  }
  onSelectTask(jt: InspectionResult ){
    console.log(jt)
    debugger;
    if (jt.IsInclude) {
      jt.IsModified = true;
      if (jt.IsFree == true && jt.IsInclude == true) {
            var jp = this._sharedService.jobObj.JobParts.filter(item => item.JobTaskID == jt.JobTaskID);
            if (jp != undefined) {
              jp.forEach(item => {
                item.IsInclude = true;
                item.IsModified = true;
                var jpa = this._sharedService.jobObj.JobParts.filter(el => el.JobPartID == item.JobPartID);
                jpa.forEach(el => {
                    if (el.JobPartID == item.JobPartID) {
                      el.IsInclude = true;
                      el.IsModified = true;
                    }
                });
              });
            }
      }
      this.CalculateCost();
    }
    else {
      jt.IsInclude = false;
      jt.IsModified = true;

      var jp = this._sharedService.jobObj.JobParts.filter(item => item.IsInclude == true && item.JobTaskID == jt.JobTaskID);
      jp.forEach(item => {
        item.IsInclude = false;
        item.IsModified = true;

        var jpa = this._sharedService.jobObj.JobPartAlternates.find(items => items.IsApproved == true && items.JobPartID == item.JobPartID);
        jpa.IsApproved = false;
        jpa.IsModified = true;
        item.AutomotivePartID = null;
        item.JobPartAlternateID = null;
        console.log("JobPart", jp);
      })
      this.CalculateCost();
    }
  }
  // onSelectJobPartAlternate(jpa: JobPartAlternates){
  //   var jpa2 = this._sharedService.jobObj.JobPartAlternates.filter(item => item.IsApproved == true && item.JobPartID == jpa.JobPartID);
  //   if (jpa2.length == 0 || jpa2 == null) {
  //     jpa.IsApproved = true;
  //     jpa.IsModified = true;
  //     var jp = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == jpa.JobPartID);
  //     if (!jp.IsInclude) {
  //       jp.IsInclude = true;
  //       jp.IsModified = true;
  //       jp.JobPartAlternateID = jpa.JobPartAlternateID;
  //       jp.AutomotivePartID = jpa.AutomotivePartID;
  //       console.log("JobPart", jp);
  //     }
  //     var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID);
  //     if(!jt.IsInclude){
  //       jt.IsInclude = true;
  //       jt.IsModified = true;
  //     }
  //     this.CalculateCost();
  //   }
  //   else{
  //     var jp = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == jpa.JobPartID);
  //     jpa2.forEach(item => {
  //       item.IsApproved = false;
  //       item.IsModified = true;
  //     });
  //     jpa.IsApproved = true;
  //     jpa.IsModified = true;
  //     jp.JobPartAlternateID = null;
  //     jp.AutomotivePartID = null;
  //     console.log("JobPart", jp);
  //     this.CalculateCost();
  //   }
  // }

  CalculateCost(){
    debugger;

    this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount = 0;
    this._sharedService.jobObj.JCBasicInfo.TotalPartsDiscount = 0;
    this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost = 0;
    this._sharedService.jobObj.JCBasicInfo.InternalTasksCost = 0;
    this._sharedService.jobObj.JCBasicInfo.TotalCost = 0;
    this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount = 0;
    this._sharedService.jobObj.JCBasicInfo.TotalPartsTaxAmount=0;
    this._sharedService.jobObj.JCBasicInfo.TaskTaxAmount=0


    var jp = this._sharedService.jobObj.JobParts.filter(item => item.IsInclude == true);
    jp.forEach(item => {
      var jpa = this._sharedService.jobObj.JobPartAlternates.find(items => items.IsApproved == true && items.JobPartID == item.JobPartID);
          item.SellingPrice = jpa.SellingPrice;
          item.DiscountAmount = jpa.DiscountAmount;
          // item.NetAmount = ((jpa.SellingPrice - (jpa.SellingPrice * 0.16)) * jpa.Quantity) - (jpa.DiscountAmount * jpa.Quantity);
          let amountAfterDiscount=jpa.SellingPrice-jpa.DiscountAmount
          let tax=amountAfterDiscount* 0.16;
          // item.NetAmount=(amountAfterDiscount)
          item.NetAmount=(amountAfterDiscount * jpa.Quantity)
          //  item.NetAmount = (jpa.SellingPrice-jpa.DiscountAmount)* jpa.Quantity;

          // item.TaxAmount = jpa.NetAmount * 0.16;
          item.TaxAmount=tax
          this._sharedService.jobObj.JCBasicInfo.TotalPartsTaxAmount+= (tax*jpa.Quantity)
         
          let TotalPartsNetAmount=item.NetAmount;
           this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount += TotalPartsNetAmount;
        
          // this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount += (item.NetAmount*item.Quantity);
          let DiscountAmount=item.DiscountAmount*item.Quantity;
          this._sharedService.jobObj.JCBasicInfo.TotalPartsDiscount +=DiscountAmount;
        

          // this._sharedService.jobObj.JCBasicInfo.TotalPartsDiscount += item.DiscountAmount;
    });

    if (this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount > +this._sharedService.jobObj.JCBasicInfo.AdditionalPartDiscount) {
      this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount -=   +this._sharedService.jobObj.JCBasicInfo.AdditionalPartDiscount;
    }
    else{
    this._sharedService.jobObj.JCBasicInfo.AdditionalPartDiscount = 0;
    }
    var jt = this._sharedService.jobObj.JobTasks.filter(item => item.IsInclude == true);
    jt.forEach(item=> {
     
      if (this._sharedService.jobObj.PlanFeatures != undefined) {
            // set task to free if included in contract
            var fd = this._sharedService.jobObj.PlanFeatures.find(item => item.LaborTaskID == item.LaborTaskID && item.NumberOfUnits != item.TotalUsage);
            if (fd != undefined) {
              item.IsContractTask = true;
      
              // set count of used as well
              if (item.IsInclude == true) {
                fd.TotalUsage += 1;
              }
              if (item.IsInclude == false) {
                fd.TotalUsage -= 1;
              }
            }
      }
        if (item.IsFree == true) {
          item.LaborCost = 0;
          let amountafterDiscount=item.LaborCost - +item.DiscountAmount
          let tax=amountafterDiscount * 0.16;
          item.NetAmount=amountafterDiscount;
          item.TaxAmount=tax;
          this._sharedService.jobObj.JCBasicInfo.TaskTaxAmount +=tax
          // item.NetAmount = item.LaborCost - (item.LaborCost * 0.16) - +item.DiscountAmount;
          // item.TaxAmount = item.NetAmount * 0.16 
          if (item.JobTaskTypeID == 51) {
            this._sharedService.jobObj.JCBasicInfo.InternalTasksCost += item.NetAmount;
          }
          if (item.JobTaskTypeID == 52) {
            this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost += item.NetAmount;
          }
          this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount += +item.DiscountAmount;
        }
        else{
          let amountafterDiscount=item.LaborCost - +item.DiscountAmount
          let tax=amountafterDiscount * 0.16;
          item.NetAmount=amountafterDiscount;
          item.TaxAmount=tax;
          this._sharedService.jobObj.JCBasicInfo.TaskTaxAmount +=tax
          // item.NetAmount = item.LaborCost - (item.LaborCost * 0.16) - +item.DiscountAmount;
          // item.TaxAmount = item.NetAmount * 0.16 
          if (item.JobTaskTypeID == 51) {
            this._sharedService.jobObj.JCBasicInfo.InternalTasksCost += item.NetAmount;
          }
          if (item.JobTaskTypeID == 52) {
            this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost += item.NetAmount;
          }
          this._sharedService.jobObj.JCBasicInfo.TotalTasksDiscount += +item.DiscountAmount;
        }
    });
    if(this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost + this._sharedService.jobObj.JCBasicInfo.InternalTasksCost < +this._sharedService.jobObj.JCBasicInfo.AdditionalTaskDiscount){
      this._sharedService.jobObj.JCBasicInfo.AdditionalTaskDiscount = 0;
    }
    this._sharedService.jobObj.JCBasicInfo.IsModified = true;
    
    this._sharedService.jobObj.JCBasicInfo.TotalCost = this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount +
    this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost + this._sharedService.jobObj.JCBasicInfo.InternalTasksCost +this._sharedService.jobObj.JCBasicInfo.TotalPartsTaxAmount +
    this._sharedService.jobObj.JCBasicInfo.TaskTaxAmount - +this._sharedService.jobObj.JCBasicInfo.AdditionalTaskDiscount;
    // this._sharedService.jobObj.JCBasicInfo.TotalCost = this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount +
    // this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost + this._sharedService.jobObj.JCBasicInfo.InternalTasksCost +
    // ((this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost + this._sharedService.jobObj.JCBasicInfo.InternalTasksCost) * 0.16) +
    // (this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount * 0.16) - +this._sharedService.jobObj.JCBasicInfo.AdditionalTaskDiscount;
}

  // addTax() {
  //   debugger
  //   this._sharedService.jobObj.JCBasicInfo.Total = this._sharedService.jobObj.JCBasicInfo.Total + (this._sharedService.jobObj.JCBasicInfo.Total * this._sharedService.jobObj.JCBasicInfo.Tax / 100);
  // }

  isAvailable(){
    this._sharedService.jobObj.JobParts.forEach(item => item.IsAvailable) 
  }
  clickonPart(jp: JobPart){
    if(jp.isOpened==undefined||jp.isOpened==false){
      jp.isOpened=true;
      
      
    }
    else{
      jp.isOpened=false;
    }
    console.log(jp)
   
  }
  onClickJobTask(jt: InspectionResult ){
    if(jt.isOpened==undefined||jt.isOpened==false){
      jt.isOpened=true;
      
      
    }
    else{
      jt.isOpened=false;
    }
    console.log(jt)
  }

  onSelectJobPartAlternate(jp?: JobPart,jpa?: JobPartAlternates) {
    // console.log(jp.IsInclude) false
   console.log(jpa.IsModified);
   console.log(jpa.IsApproved);
   if(jpa.IsApproved==false){
     //if jp alternate is checked
    var jpa2 = this._sharedService.jobObj.JobPartAlternates.filter(item => item.IsApproved == true && item.JobPartID == jpa.JobPartID);
    console.log("jpa2",jpa2)
    if (jpa2.length == 0 || jpa2 == null) {
      //jp added
      jp.IsInclude = true;
        jp.IsModified = true;
        jp.JobPartAlternateID = jpa.JobPartAlternateID;
        jp.AutomotivePartID = jpa.AutomotivePartID;
        console.log("JobPart", jp);
      jpa.IsApproved = true;
      jpa.IsModified = true;
      //for job task 
      var jt = this._sharedService.jobObj.JobTasks.find(item => item.JobTaskID == jp.JobTaskID);
    console.log("job task",jt);
    if(!jt.IsInclude){
      jt.IsInclude = true;
      jt.IsModified = true;
    }

      this.CalculateCost();
      
    }
    else{
       //jp added and removed previously added
     
      jpa2.forEach(item => {
        item.IsApproved = false;
        item.IsModified = true;
      });
     
      jpa.IsApproved = true;
      jpa.IsModified = true;
      jp.JobPartAlternateID = null;
      jp.AutomotivePartID = null;
      console.log("JobPart", jp);
      this.CalculateCost();
    } 
    
    
  }
  else{
    //remove jp
  
    jp.IsInclude = false;
    jp.IsModified = false;
    jp.JobPartAlternateID = null;
    jp.AutomotivePartID = null;
    console.log("JobPart", jp);
    jpa.IsApproved=false;
    jpa.IsModified=false
    this.CalculateCost();
  }
    
  }
}
