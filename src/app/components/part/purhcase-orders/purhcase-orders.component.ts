import { ChangeDetectorRef } from '@angular/core';
// import { PurchaseOrderItem } from './../../../models/purchase-order-item';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ObjectStatus } from '../../../models/object-status';
import { PurchaseOrderProfile } from '../../../models/purchase-order-profile';
import { PurchaseOrderItem } from '../../../models/purchase-order-item';
import { PartService } from '../../../services/part.service';
import { SharedService } from '../../../services/shared.service';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-purhcase-orders',
  templateUrl: './purhcase-orders.component.html',
  styleUrls: ['./purhcase-orders.component.scss']
})
export class PurhcaseOrdersComponent implements OnInit {

  purchaseOrders: Array<PurchaseOrderProfile>
  statuses: Array<ObjectStatus>
  activeModalRef: NgbModalRef;

  purchaseOrderItems: Array<PurchaseOrderItem>;

  purchaseOrder: PurchaseOrderProfile
  purchaseOrderID: number;
  vendorName : string;
  statusID : number;
  oldStatusID : number;
  selectedTab = 34;
  PageNo = 1;
  PendingCount : number;
  ApprovedCount: number;
  CancelledCount: number;
  RecievedCount: number;
  RejectedCount: number;
  ReturnedCount: number;
  TotalPurchaseOrders : number;

  constructor(public _sharedService: SharedService,
    private _partService: PartService,
    private _modalService: NgbModal,
    private _cdr : ChangeDetectorRef) { }


  ngOnInit() {
    this.purchaseOrders = new Array<PurchaseOrderProfile>();

    this.onGetAllPurchaseOrders(34,1);
  }

  onGetAllPurchaseOrders(StatusID: number, PageNo: number)
  {
    this._partService.getAllPurchaseOrders(StatusID, PageNo).subscribe((res: any) =>{
      this.purchaseOrders = res.PurchaseOrders;
      this.PendingCount = res.PendingCount;
      this.ApprovedCount = res.ApprovedCount;
      this.CancelledCount = res.CancelledCount;
      this.RecievedCount = res.RecievedCount;
      this.RejectedCount = res.RejectedCount;
      this.ReturnedCount = res.ReturnedCount;

      this.calculatePages(StatusID);



    })
  }


  onChangeorderStatus(or: PurchaseOrderProfile, modal: any ,StatusID? : number,isStatusReceived? : boolean )
  {
    this.purchaseOrderID = or.PurchaseOrderID;
    this.vendorName = or.VendorName;

    if(StatusID != undefined){
    this.statusID = StatusID;
    or.StatusID = StatusID;
    or.StatusName = this.statuses.find(item => item.ObjectStatusID == StatusID).StatusNameEnglish;
  }
    
    this._partService.getSinglePurchaseOrder(or.PurchaseOrderID).subscribe((res: any) =>{

      this.purchaseOrderItems = res.purchaseOrderItems;
      this.purchaseOrder = res.purchaseOrders;
      this.purchaseOrder.StatusID  = or.StatusID;

      this.purchaseOrderItems.forEach(item =>{
        item.StatusID = or.StatusID;
        item.StatusName = or.StatusName; 
        if(item.StatusID  == 37 && isStatusReceived != true){
        item.ReceivedQuantity = item.PurchaseQuantity;
      }
      
      })
      
    
      this.activeModalRef = this._modalService.open(modal,{size: 'lg', keyboard: false ,backdrop: 'static'})
    })
  
  
  }
  
  closeModal()
  {
    this.statusID = undefined;
    this.activeModalRef.dismiss();
  }

  onUpdatePurchaseOrder()
  {
    this._partService.updatePurchaseOrder(this.purchaseOrder,this.purchaseOrderItems).subscribe((res: any) =>{

      this.activeModalRef.dismiss();
      this.statusID = undefined;

      this._sharedService.success('Updated Successfully')

      // this.purchaseOrderItems = res.purchaseOrderItems;
      // this.purchaseOrder = res.purchaseOrders;

      // this.activeModalRef = this._modalService.open(modal,{size: 'lg', keyboard: false ,backdrop: 'static'})
    })
  }

 
  getEnteredQuantity(quantity : number, item: PurchaseOrderItem ) {

    if(quantity > item.PurchaseQuantity) {
      item.ReceivedQuantity = item.PurchaseQuantity;
    }else {
      item.ReceivedQuantity = quantity;
    }
    this._cdr.detectChanges();
  }
  calculatePages(status:number){
    debugger;
    switch(status){
      case 34:
        this.TotalPurchaseOrders = this.PendingCount
        break
      case 35:
        this.TotalPurchaseOrders = this.ApprovedCount
        break
      case 36:
        this.TotalPurchaseOrders = this.CancelledCount
        break
      case 37:
        this.TotalPurchaseOrders = this.RecievedCount
        break
        case 38:
      this.TotalPurchaseOrders = this.RejectedCount
        break
        case 39:
      this.TotalPurchaseOrders = this.RejectedCount
        break
    }
    // this.companyRequests.TotalPages = this.companyRequests.TotalPages/8;
  }
}
