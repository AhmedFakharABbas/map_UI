import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
import { JobService } from 'app/services/job.service';
import { UpdateJobPart } from 'app/models/update-job-part';
import { JobPartAlternates } from 'app/models/job-part-alternates';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { JobPart } from 'app/models/JobPart';
import { catchError, distinctUntilChanged, switchMap, take, tap } from 'rxjs/operators';
import { AutomotivePartVehicle } from 'app/models/automotive-part-vehicle';
import { Part } from 'app/models/part';
import { concat, Observable, of, Subject } from "rxjs";
import { PurchaseOrderProfile } from 'app/models/purchase-order-profile';
import { VendorModel } from 'app/models/vendor';
import { VendorPartPrice } from 'app/models/vendor-part-price';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { debug } from 'console';
import { CustomHttpService } from 'app/services/custom-http.service';
import { PartService } from 'app/services/part.service';


@Component({
  selector: 'app-parts-pricing',
  templateUrl: './parts-pricing.component.html',
  styleUrls: ['./parts-pricing.component.scss']
})
export class PartsPricingComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  JobCardID: number;
  AltPartID: number;
  altPart: JobPartAlternates;
  editMode: boolean = false;
  JobPartID: number;
  unitId: number;
  pId: number;
  DiscountPercentage: number;
  EditQuantity: boolean = false;
  response:any;
  isAddPurchaseOrder: boolean
  isSuggestedPart :boolean;

  selectedJobPart: JobPart;




  automotivePart: Part;


  partSuggessions$: Observable<Part[]>;
  loading: boolean;
  itemCodeInput = new Subject<string>();

  purchaseOrder: PurchaseOrderProfile;
  vendor: VendorModel;
  sub:any;


  constructor(public modalService: NgbModal, public _partService: PartService,
    public _sharedService: SharedService,
    private _jobService: JobService,
    private _customHttpService: CustomHttpService) {
    this.sub = this._sharedService.completePartsPricing.subscribe(
      (data) => {
        this.completeJobProcess(17);
      }
    );
  }

ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.sub.unsubscribe();
}


  ngOnInit() {
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/part-price") > -1);
    }
    this.altPart = new JobPartAlternates();
    this._sharedService.jobObj.JobParts.forEach(el => {
      el.PartAlternate.UnitTypeID = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == el.JobPartID).UnitTypeID;
    })

    if (this._sharedService.AutomotiveParts == undefined || this._sharedService.AutomotiveParts.length == 0) {
      this._sharedService.getAllParts.next(false);
    }
  }

  ngAfterViewChecked() {
    if (this._sharedService.jobObj != undefined) {
      if (this.DiscountPercentage == undefined) {
        this.applicableDiscount();
      }
    }
  }

  completeJobProcess(ProcessStatusID: number) {
    if (this.JobCardID == undefined) {
      this.JobCardID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
    }
    var temp: boolean = false;
    if (this._sharedService.jobObj.JobParts.length > 0) {
      for (var val of this._sharedService.jobObj.JobParts) {
        if (this._sharedService.jobObj.JobPartAlternates.findIndex(item => item.JobPartID == val.JobPartID) == -1 && val.IsAvailable == true) {
          temp = false;
          break;
        }
        else {
          temp = true;
        }
      }
    }
    else {
      temp = true;
    }
    
   
    // var data = this._sharedService.jobObj.JobPartAlternates.find(item => item.JobPartStatusID == undefined);
    // if (data != undefined) {
    //   this._sharedService.jobObj.JCBasicInfo.ProcessStatusID = 17;
    // }
    // else {
    //   this._sharedService.error('Error', 'Status of some parts is missing.');
    //   this._sharedService.jobObj.JCBasicInfo.ProcessStatusID = 16;
    //   this._sharedService.jobObj.JCBasicInfo.PPStatusID = 16;
    // }
    if (temp == false) {
      this._sharedService.error('Error', 'At least One Alternate Part is required against each part');
      this._sharedService.jobObj.JCBasicInfo.ProcessStatusID = 16;
      this._sharedService.jobObj.JCBasicInfo.PPStatusID = 16;
    }
    else {
      this._sharedService.jobObj.JCBasicInfo.ProcessStatusID = 17;
    }
    if (this._sharedService.jobObj.JCBasicInfo.ProcessStatusID == 17) {
      this._sharedService.jobObj.JCBasicInfo.PPComplete = true;
      // let element: HTMLElement = document.getElementById('updateExitJob') as HTMLElement;
      // element.click();
      var jp: any = { ProcessStatusID: ProcessStatusID, ProcessTypeID: 10, JobCardID: this.JobCardID };
      this._jobService.completeJobProcess(jp).subscribe(res => {
        this._sharedService.success('Success', 'Process Completed');
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
  }


  addPart() {
    debugger
    //     if (altPart.Hours != undefined && altPart.Hours != null) {
    //       altPart.OrderTime = +altPart.Hours * 60;
    //     }
    //     // if (altPart.Minutes == undefined) {
    //     //   altPart.Minutes = 0;
    //     // }
    //     // if (altPart.Minutes != undefined && altPart.Minutes != null) {
    //     //   altPart.OrderTime = hours + +altPart.Minutes;
    //     // }

    //     if (altPart.JobPartStatusID != undefined) {
    //       altPart.JobPartStatusName = this._sharedService._commonMeta.ObjectStatus.find(item => item.ObjectStatusID == altPart.JobPartStatusID).StatusNameEnglish;
    //     }
    //     // new vendor Name
    //     if (altPart.PartLocation == 138) {
    //       if (altPart.VendorID > 0) {
    //       }
    //       else {
    //         var temp: any;
    //         temp = altPart.VendorID;
    //         altPart.VendorName = temp.label;
    //         altPart.VendorID = Math.floor((Math.random() * -1000) - 1);
    //         altPart.WorkshopID = this._sharedService.currentWorkshopID;
    //       }
    //     }

    //     if (altPart.BrandName.label == undefined) {
    //       // altPart.BrandName = altPart.Brand;
    //       altPart.BrandID = this._sharedService.jobObj.PartBrands.find(item => item.BrandName == altPart.BrandName).PartBrandID;
    //     }
    //     else {
    //       altPart.BrandName = altPart.BrandName.label;
    //       altPart.BrandID = Math.floor((Math.random() * -1000) - 1);
    //     }
    // debugger;
    //     if (altPart.OrigionName.label == undefined) {
    //       // if (altPart.Origin != undefined) {
    //       // altPart.OrigionName = altPart.Origin;
    //       altPart.OrigionID = this._sharedService.jobObj.BrandOrigins.find(item => item.OriginName == altPart.OrigionName).BrandOriginID;
    //       // }
    //     }
    //     else {
    //       altPart.OrigionName = altPart.OrigionName.label;
    //       altPart.OrigionID = Math.floor((Math.random() * -1000) - 1);
    //     }
    //     // altPart.DiscountPercentage = this.DiscountPercentage;

    //     var unique: boolean = true;
    //     altPart.JobPartID = JobPartID;
    //     this._sharedService.jobObj.JobPartAlternates.forEach(el => {
    //       if (el.BrandID == altPart.BrandID && el.OrigionID == altPart.OrigionID && el.PartConditionID == altPart.PartConditionID && el.JobPartID == altPart.JobPartID && el.VendorID == altPart.VendorID) {
    //         unique = false;
    //       }
    //     })
    //     // if (altPart.BrandID != undefined || altPart.BrandID != null) {
    //     if (unique) {
    //       altPart.IsModified = true;
    //       // altPart.BrandName = this._sharedService.jobObj.PartBrands.find(item => item.PartBrandID == altPart.BrandID).BrandName;
    //       // altPart.OrigionName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == altPart.OrigionID).TypeNameEnglish;
    //       altPart.UnitTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == altPart.UnitTypeID).TypeNameEnglish;
    //       altPart.JobPartAlternateID = Math.floor((Math.random() * -1000) - 1);
    //       altPart.CreatedBy = this._sharedService.logged_user_id;
    //       // var ap = JSON.stringify(altPart)
    //       debugger
    //       this._jobService.savePartAlternate(altPart).subscribe((res: any) => {
    //         var temp = this._sharedService.jobObj.JobPartAlternates.filter(item => item.JobPartID != altPart.JobPartID);
    //         this._sharedService.jobObj.JobPartAlternates = temp;
    //         this._sharedService.jobObj.JobPartAlternates = this._sharedService.jobObj.JobPartAlternates.concat(res);
    //         // get updated vendor list if new vendor is added. sending true so it will get data
    //         if (altPart.VendorID < 0) {
    //           this._sharedService.getAllParts.next(true);
    //         }
    //         this._sharedService.success('Alternate part added!');
    //         this.pId = altPart.JobPartID;
    //         this.unitId = altPart.UnitTypeID;
    //         var tempPartStatusID = altPart.JobPartStatusID;
    //         var tempLocationID = altPart.PartLocation;
    //         this.applicableDiscount();

    //         var p = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.pId);
    //         p.PartAlternate = new JobPartAlternates();
    //         p.PartAlternate.UnitTypeID = this.unitId;
    //         if (form) {
    //           form.resetForm();
    //           this.setFormValues(form, tempLocationID, tempPartStatusID);
    //         }

    //         ////set process to un-complete when adding new part
    //         this._sharedService.jobObj.JCBasicInfo.PPStatusID = 16;
    //       }, error => {
    //         this._sharedService.error('Error', error.Message);
    //       })
    //       // this._sharedService.jobObj.JobPartAlternates.push(JSON.parse(ap));
    //       // this._sharedService.jobObj.JobParts.find(item => item.JobPartID == JobPartID).PartAlternate = new JobPartAlternates();

    //     }
    //     else {
    //       this._sharedService.warning('Duplication not allowed!');
    //     }
    this.automotivePart.WorkshopID = this._sharedService.currentWorkshopID;
    this.automotivePart.UnitTypeID = this.selectedJobPart.UnitTypeID;
    this.automotivePart.IsInclude = this.selectedJobPart.IsInclude;

    // if(this.automotivePart.ItemCode == null || this.automotivePart.ItemCode == undefined){
    //   this.automotivePart.ItemCode = this.automotivePart.ItemNameArabic;
    // }
    if(this.purchaseOrder != undefined){
    if (this.purchaseOrder.DeliveryTime != undefined && this.purchaseOrder.DeliveryTime != null ) {
      this.purchaseOrder.DeliveryTime = +this.purchaseOrder.DeliveryTime * 60;
    }
  } 
    if ((this.automotivePart.BrandName != undefined && this.automotivePart.BrandName.label == undefined)) {
      this.automotivePart.BrandID = this._sharedService.jobObj.PartBrands.find(item => item.BrandName == this.automotivePart.BrandName).PartBrandID;
    }
    else if(this.automotivePart.BrandName != undefined && this.automotivePart.BrandName.label != undefined) {
      this.automotivePart.BrandName = this.automotivePart.BrandName.label;
      this.automotivePart.BrandID = Math.floor((Math.random() * -1000) - 1);
    }



    if ((this.automotivePart.OriginName != undefined && this.automotivePart.OriginName.label == undefined)) {
      this.automotivePart.OrigionID = this._sharedService.jobObj.BrandOrigins.find(item => item.OriginName == this.automotivePart.OriginName).BrandOriginID;
    }
    else if(this.automotivePart.OriginName != undefined && this.automotivePart.OriginName.label != undefined) {
      this.automotivePart.OriginName = this.automotivePart.OriginName.label;
      this.automotivePart.OrigionID = Math.floor((Math.random() * -1000) - 1);
    }


    if(this.purchaseOrder != undefined && this.purchaseOrder != null) {
    if ((this.purchaseOrder.VendorName != undefined && this.purchaseOrder.VendorName.label == undefined)) {
      this.purchaseOrder.VendorID = this._sharedService.PartVendors.find(item => item.VendorName == this.purchaseOrder.VendorName).VendorID;
    }
    else if(this.purchaseOrder.VendorName != undefined && this.purchaseOrder.VendorName.label != undefined) {
      this.purchaseOrder.VendorName = this.purchaseOrder.VendorName.label;
      this.purchaseOrder.VendorID = Math.floor((Math.random() * -1000) - 1);
    }
  }


  // if( this.vendor == undefined &&  this.purchaseOrder == undefined)
  // {
  //   this.vendor  =  new VendorModel();
  //   this.purchaseOrder = new PurchaseOrderProfile();
  // }


    this._jobService.savePartAlternate(this.automotivePart, this.vendor , this.purchaseOrder).subscribe((res: any) => {
      this._sharedService.jobObj.JobPartAlternates.push(res);
      var idx = this._sharedService.jobObj.SuggestedJobPartAlternates.findIndex(item => item.JobPartID == this.automotivePart.JobPartID && item.AutomotivePartID == this.automotivePart.AutomotivePartID);
      if (idx>=0)
      {
        this._sharedService.jobObj.SuggestedJobPartAlternates.splice(idx, 1);
      }
      this.closePartModal();
      // this._sharedService.loading == false;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })


  }

  setFormValues(form: NgForm, tempLocationID: number, tempPartStatusID: number) {
    if (tempLocationID == 138 && (tempPartStatusID == 27 || tempPartStatusID == 3)) {
      form.setValue({
        manufacturer: null,
        origin: null,
        part: null,
        price: null,
        unit: this.unitId,
        hour: 0,
        //mins: 0,
        vendor: null,
        discountPercentage: 0
      })
    }
    else if (tempPartStatusID == 27 || tempPartStatusID == 3) {
      form.setValue({
        manufacturer: null,
        origin: null,
        part: null,
        price: null,
        unit: this.unitId,
        hour: 0,
        //mins: 0,
        discountPercentage: 0
        //vendor: undefined,
      })
    }
    else if (tempLocationID == 138) {
      form.setValue({
        manufacturer: null,
        origin: null,
        part: null,
        price: null,
        unit: this.unitId,
        discountPercentage: 0,
        // hour: 0,
        // mins: 0,
        vendor: null,
      })
    }
    else {
      form.setValue({
        manufacturer: null,
        origin: null,
        part: null,
        price: null,
        unit: this.unitId,
        discountPercentage: 0
        // hour: 0,
        // mins: 0,
        //vendor: undefined,
      })
    }
  }

  //#region update Alternate part
  alternatePart: JobPartAlternates;
  editAltPart(partAlt: JobPartAlternates, JobPartID: number, modal: any) {
    partAlt.EditMode = true;
    this.JobPartID = JobPartID;
    if (partAlt.OrderTime != undefined) {
      partAlt.Hours = partAlt.OrderTime / 60;
      // partAlt.Minutes = partAlt.OrderTime % 60;
    }
    this.DiscountPercentage = partAlt.DiscountPercentage;
    var temp = JSON.stringify(partAlt);
    var part = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == JobPartID);
    part.PartAlternate = JSON.parse(temp);
    part.PartAlternate.VendorID = partAlt.VendorID;
    this.alternatePart = partAlt;
    this.alternatePart.PartNameArabic = part.PartNameArabic;
    this.alternatePart.MainCategoryNameArabic = part.MainCategoryNameArabic;
    this.alternatePart.SubCategoryNameArabic = part.SubCategoryNameArabic;
    this.alternatePart.AutomotivePartID = this.altPart.AutomotivePartID;
    this.alternatePart.JobPartID = JobPartID; 

    this.activatedModalRef = this.modalService.open(modal, { size: 'lg', keyboard: false, backdrop: 'static' })

  }

  onEditAltPart(jp: JobPartAlternates, form: NgForm) {
    // var hours = 0;
    // if (jp.Hours != undefined && jp.Hours != null) {
    //   hours = +jp.Hours * 60;
    // }
    // if (jp.Minutes == undefined) {
    //   jp.Minutes = 0;
    // }
    // if (jp.Minutes != undefined && jp.Minutes != null) {
    //   jp.OrderTime = hours + +jp.Minutes;
    // }

    // if (jp.JobPartStatusID != undefined) {
    //   jp.JobPartStatusName = this._sharedService._commonMeta.ObjectStatus.find(item => item.ObjectStatusID == jp.JobPartStatusID).StatusNameEnglish;
    // }

    // // new vendor Name
    // if (jp.PartLocation == 138) {
    //   if (jp.VendorID > 0) {
    //   }
    //   else {
    //     var temp: any;
    //     temp = jp.VendorID;
    //     jp.VendorName = temp.label;
    //     jp.VendorID = Math.floor((Math.random() * -1000) - 1);
    //     jp.WorkshopID = this._sharedService.currentWorkshopID;
    //   }
    // }

    // if (jp.BrandName.label != undefined) {
    //   jp.BrandName = jp.BrandName.label;
    //   jp.BrandID = Math.floor((Math.random() * -1000) - 1);
    // }

    // else {
    //    // jp.BrandName = jp.Brand;
    //   jp.BrandID = this._sharedService.jobObj.PartBrands.find(item => item.BrandName == jp.BrandName).PartBrandID;
    // }

    // if (jp.OrigionName.label != undefined) {
    //   jp.OrigionName = jp.OrigionName.label;
    //   jp.OrigionID = Math.floor((Math.random() * -1000) - 1);

    // }

    // jp.DiscountPercentage = this.DiscountPercentage;
    // else {
    //   // jp.OrigionName = jp.Origin;
    //   jp.OrigionID = this._sharedService.jobObj.BrandOrigins.find(item => item.OriginName == jp.OrigionName).BrandOriginID;
    // }

    // var unique: boolean = true;
    // jp.JobPartID = this.JobPartID;
    // this._sharedService.jobObj.JobPartAlternates.forEach(el => {
    //   if (el.BrandID == jp.BrandID && el.OrigionID == jp.OrigionID && el.PartConditionID == jp.PartConditionID && el.JobPartID == jp.JobPartID) {
    //     unique = false;
    //   }
    // })
    // if (unique) {
    // jp.IsModified = true;
    // jp.UnitTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == jp.UnitTypeID).TypeNameEnglish;
    this._jobService.updatePartAlternate(jp).subscribe((res: any) => {
  
      let index = this._sharedService.jobObj.JobPartAlternates.findIndex(item => item.JobPartAlternateID == jp.JobPartAlternateID);
      jp = res;
      this._sharedService.jobObj.JobPartAlternates[index] = Object.assign({}, jp);
      // if (jp.VendorID < 0) {
      //   this._sharedService.getAllParts.next(true);
      // }
      // this._sharedService.jobObj.JobParts.find(item => item.JobPartID == jp.JobPartID).EditMode = false;
      // this.pId = jp.JobPartID;
      // this.unitId = jp.UnitTypeID;
      // form.resetForm();
      // var p = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.pId);
      // p.PartAlternate = new JobPartAlternates();
      // this.applicableDiscount();
      // p.PartAlternate.UnitTypeID = this.unitId;
      // form.setValue({
      //   manufacturer: null,
      //   origin: null,
      //   part: null,
      //   price: null,
      //   unit: this.unitId,
      //   // hour: 0,
      //   // mins: 0,
      //   // vendor: null,
      //   discountPercentage: 0
      // })
      this._sharedService.success('Alternate part updated!');
      this.closePartModal();
      // this._sharedService.loading == false;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })


    // }
    // else {
    //   this._sharedService.warning('Duplication not allowed!');
    // }
  }

  saveSuggestedAltPart(jp: JobPartAlternates, form: NgForm) {

    jp.DiscountPercentage = this.DiscountPercentage;
    var jobPartAlternateID = jp.JobPartAlternateID;
    this._jobService.updatePartAlternate(jp).subscribe((res: any) => {
   
      let index = this._sharedService.jobObj.JobPartAlternates.findIndex(item => item.JobPartAlternateID == jp.JobPartAlternateID);
      jp = res;
      if (index >= 0) 
      {
        this._sharedService.jobObj.JobPartAlternates[index] = Object.assign({}, jp);
        this._sharedService.success('Alternate part','Alternate part updated!');
      }else
      {
        this._sharedService.jobObj.JobPartAlternates.push(jp);
        var idx = this._sharedService.jobObj.SuggestedJobPartAlternates.findIndex(item => item.JobPartID == jp.JobPartID && item.AutomotivePartID == jp.AutomotivePartID);
        if (idx>=0)
        {
          this._sharedService.jobObj.SuggestedJobPartAlternates.splice(idx, 1);
        }
        
        this._sharedService.success('Suggested Part','Suggested part is added!');
      }
      

      this.closePartModal();
    }, error => {
      this._sharedService.error('Error', error.Message);
    })


  }
  askPrice(partAlt: JobPartAlternates, jobPart: JobPart, modal: any){
   debugger
    partAlt.EditMode = true;
    this.JobPartID = jobPart.JobPartID;
    if (partAlt.OrderTime != undefined) {
      partAlt.Hours = partAlt.OrderTime / 60;
      // partAlt.Minutes = partAlt.OrderTime % 60;
    }
    this.DiscountPercentage = partAlt.DiscountPercentage;
    var temp = JSON.stringify(partAlt);
    // var part = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == JobPartID);
    jobPart.PartAlternate = JSON.parse(temp);
    jobPart.PartAlternate.VendorID = partAlt.VendorID;
    this.alternatePart = partAlt;
    this.alternatePart.Quantity = jobPart.Quantity;
    this.alternatePart.AutomotivePartID = partAlt.AutomotivePartID;
    this.alternatePart.PartNameArabic = jobPart.PartNameArabic;
    this.alternatePart.MainCategoryNameArabic = jobPart.MainCategoryNameArabic;
    this.alternatePart.SubCategoryNameArabic = jobPart.SubCategoryNameArabic;
    this.alternatePart.JobPartID = jobPart.JobPartID;

    this.activatedModalRef = this.modalService.open(modal, { size: 'lg', keyboard: false, backdrop: 'static' })
  }

  //#endregion

  //#region del modal
  openModal(modal: any, id: number) {
    this.AltPartID = id;
    this.activatedModalRef = this.modalService.open(modal);
  }

  closeModal() {
    this.activatedModalRef.close();
  }

  removePart(id: number) {
    if (id > 0) {
      this._jobService.deleteAltPart(id).subscribe((res: any) => {
        this._sharedService.jobObj.JobPartAlternates.splice(this._sharedService.jobObj.JobPartAlternates.findIndex(item => item.JobPartAlternateID == id), 1);
        this._sharedService.success('Success', 'Part deleted successfully');
        this.activatedModalRef.close();
      }, error => {
        this._sharedService.error('Error', error.Message);
      })
    }
    else {
      this._sharedService.jobObj.JobPartAlternates.splice(this._sharedService.jobObj.JobPartAlternates.findIndex(item => item.JobPartAlternateID == id), 1);
      this.activatedModalRef.close();
    }
    this.altPart = new JobPartAlternates();
  }

  //#endregion

  checkQuantity(jp: JobPart) {
    if (jp.Quantity == 0) {
      jp.Quantity = 1;
      this._sharedService.warning('Warning', 'Quantity cannot be zero!');
    }
  }

  setAlternatePrice(jobPartID: number, vendorID: number) {
    var part = this._sharedService.jobObj.JobParts.find(part => part.JobPartID == jobPartID);
    if (part != undefined && part.PartAlternate.VendorID == vendorID) {
      var vpp = this._sharedService.VendorPartPrices.find(price => price.AutomotivePartID == part.AutomotivePartID && price.VendorID == vendorID);
      if (vpp != undefined && vpp.PartPrice != undefined) {
        part.PartAlternate.SellingPrice = vpp.PartPrice;
      }
    }
  }

  setDiscount(partAlternate: JobPartAlternates) {
    if (partAlternate.PartLocation == 137 && this.editMode == false) {
      if (this._sharedService.jobObj.PlanFeatures != undefined) {
        var internalDiscount = this._sharedService.jobObj.PlanFeatures.find(item => item.FeatureNameEng == 'Internal warehouse');
        if (internalDiscount != undefined) {
          this.DiscountPercentage = internalDiscount.Discount;
        }
      }
    }

    if (partAlternate.PartLocation == 138 && this.editMode == false) {
      this.DiscountPercentage = 0;
    }
  }

  applicableDiscount() {
    if (this._sharedService.jobObj.jcVehicleObj.IsContractVehicle == true) {
      if (this._sharedService.jobObj.PlanFeatures != undefined) {
        var internalDiscount = this._sharedService.jobObj.PlanFeatures.find(item => item.FeatureNameEng == 'Internal warehouse');
        if (internalDiscount != undefined) {
          this.DiscountPercentage = internalDiscount.Discount;
        }
      }
    }
  }

  // openEditAltPartForm() {
  //   document.getElementById('alt-part' + index).classList.add('show');
  // }

  onUpdatePartJob(jp: JobPart) {
    
    this._jobService.updateJobPart(jp).subscribe((res: any) => {

      var index = this._sharedService.jobObj.JobParts.findIndex(item => item.JobPartID == jp.JobPartID)
      this._sharedService.jobObj.JobParts[index].EditQuantity = false;
      this._sharedService.success('Quantity updated successfully')

    }, error => {

    })
  }

  openPartModal(modal: any, JobPartID: number, isSuggestion:boolean) {
    this.isSuggestedPart = isSuggestion;

    this.selectedJobPart = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == JobPartID)





    this.searchfn();

    this.itemCodeInput.next('');

    console.log(this.itemCodeInput)


    this.activatedModalRef = this.modalService.open(modal, { size: 'lg', keyboard: false, backdrop: 'static' })

    // this.automotivePart = new Part();
  }

  private searchfn() {
    debugger
    this.partSuggessions$ = concat(
      of([]), // default items
      this.itemCodeInput.pipe(
        distinctUntilChanged(),
        tap(() => this.loading = true),
        switchMap(term => 
          this._jobService.searchAutomotivePart
          (term, this.selectedJobPart.MainCategoryID, this.selectedJobPart.SubCategoryID, this.selectedJobPart.JobPartID, this._sharedService.jobObj.JCBasicInfo.VehicleID).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.loading = false)
        ))
      )
    );
  }

  onCheckPart() {
    debugger
    if(this._sharedService.jobObj.JobPartAlternates.find(item => item.ItemCode == this.automotivePart.PartNameArabic && item.JobPartID ==  this.selectedJobPart.JobPartID) != undefined)
    {
      this._sharedService.warning('This part already exists against this job part')
      this.automotivePart = undefined;
    }
    else
    {
      if (this.automotivePart.AutomotivePartID == undefined || (this.automotivePart.AutomotivePartID != undefined &&
        (this.automotivePart.StockQuantity == 0 || this.automotivePart.StockQuantity == null))) {
        this.automotivePart.JobPartStatusID = 27;
        this.automotivePart.IsNew = true;
        if(this.automotivePart.ItemCode == null || this.automotivePart.ItemCode == undefined){
              this.automotivePart.ItemCode = this.automotivePart.ItemNameArabic;
        }
        this.purchaseOrder = new PurchaseOrderProfile();
        this.vendor = new VendorModel();
      }
      else {
        this.automotivePart.JobPartStatusID = 26;
      }  
      this.automotivePart.MainPartID = this.selectedJobPart.MainPartID;
      this.automotivePart.JobPartID = this.selectedJobPart.JobPartID;
      this.automotivePart.WorkshopID = this._sharedService.currentWorkshopID;
    }
  }

  onChoosePart(modal: any, altPart: JobPartAlternates, jobPart: JobPart) {  
    debugger
    if (this.automotivePart == undefined) {
      this.automotivePart = new Part();
    }
    this.automotivePart.AutomotivePartID = altPart.AutomotivePartID;
    this.automotivePart.JobPartID = jobPart.JobPartID;
    this.automotivePart.StockQuantity = altPart.StockQuantity;
    this.automotivePart.ItemCode = altPart.ItemCode;
    this.automotivePart.SellingPrice = altPart.SellingPrice;
    this.automotivePart.PartNameEnglish = altPart.PartNameArabic;

    this.automotivePart.BrandID = altPart.BrandID;

    this.automotivePart.BrandName = altPart.BrandName;
    this.automotivePart.OrigionID = altPart.OrigionID;
    this.automotivePart.OriginName = altPart.OrigionName;

    // if (this.automotivePart.StockQuantity == 0 || this.automotivePart.StockQuantity == null ||
    //   this.automotivePart.StockQuantity < jobPart.Quantity
    //   ) {
    //   this.automotivePart.JobPartStatusID = 27;
    //   this.automotivePart.IsNew = true;
    //   this.purchaseOrder = new PurchaseOrderProfile();
    //   this.vendor = new VendorModel();
    //   this.vendor = this._sharedService.PartVendors.find(item => item.VendorID == altPart.VendorID);
    //   this.purchaseOrder.VendorName = this.vendor.VendorName;

    // }
    // else{
      this.automotivePart.JobPartStatusID = 26;
    

    // this.automotivePart.MainPartID = this.selectedJobPart.MainPartID;
    // this.automotivePart.JobPartID = this.selectedJobPart.JobPartID;
    // this.automotivePart.WorkshopID = this._sharedService.currentWorkshopID;
    this.openPartModal(modal, jobPart.JobPartID, true);
  }

  trackByFn(item: Part) {
    return item.AutomotivePartID;
  }

  onAddPurchaseOrder() {
    this.automotivePart.JobPartStatusID = 27;
    this.purchaseOrder = new PurchaseOrderProfile();
    this.vendor = new VendorModel();
  }

  onChangeVendor() {
    this.vendor = new VendorModel();
    if (this.purchaseOrder.VendorName != undefined) {
      var vendor: VendorModel = this._sharedService.PartVendors.find(item => item.VendorName == this.purchaseOrder.VendorName)

      var vendorPartPrice: VendorPartPrice

      if (vendor != undefined) {
        this.vendor.VendorID = vendor.VendorID;
        this.vendor.CPPhone = vendor.CPPhone;
        this.vendor.CPFirstName = vendor.CPFirstName;
        this.vendor.CPLastName = vendor.CPLastName;
        this.vendor.Address1 = vendor.Address1;

        var vendorPartPrice = this._sharedService.VendorPartPrices.find(item => item.VendorName == this.vendor.VendorName && item.AutomotivePartID == this.automotivePart.AutomotivePartID)
      }


      if (vendorPartPrice != undefined) {
        this.purchaseOrder.SellingPrice = vendorPartPrice.PartPrice;
        this.purchaseOrder.PurchasePrice = vendorPartPrice.CostPrice;
      }
    }
  }

  closePartModal() {

    this.activatedModalRef.dismiss()

    this.automotivePart = undefined;
    this.purchaseOrder = new PurchaseOrderProfile();
    this.vendor = new VendorModel();
    this.isAddPurchaseOrder = false;


  }

  calcNetPrice() {
    this.automotivePart.NetPrice = +this.automotivePart.SellingPrice * 1.16;
  }


  onClickToggle(JobPartID:number){
    var jpa = this._sharedService.jobObj.JobPartAlternates.filter(item => item.JobPartID == JobPartID);
    var isAvailable = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == JobPartID)
    if(jpa.length > 0 && jpa != undefined){
      isAvailable.IsAvailable = true;
    }
    else if(jpa.length == 0){
      isAvailable.IsAvailable = !isAvailable.IsAvailable;
      console.log(isAvailable.IsAvailable)
      this._jobService.partIsAvailable(JobPartID , isAvailable.IsAvailable).subscribe((res:any) =>{
       
      }, error => {
  
      });
    }
    
   
  }

  // checkItemCode(itemCode: any) {
  //   debugger
  //   this._partService
  //     .checkItemCode(itemCode, this._sharedService.currentWorkshopID)
  //     .subscribe(
  //       (res) => {},
  //       (error) => {
  //         this._sharedService.warning("Error", error.Message);
  //         if (error.Message == "Same ItemCode already registered.") {
  //           this.automotivePart.ItemCode = undefined;
  //         } 
  //       }
  //     );
  // } 

  

}

