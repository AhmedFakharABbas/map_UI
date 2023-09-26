import { PurchaseOrderItem } from "./purchase-order-item";
import { PurchaseOrderProfile } from "./purchase-order-profile";

export class PurchaseOrder {
     purchaseOrder : PurchaseOrderProfile
     purchaseOrderItems : Array<PurchaseOrderItem>

     constructor()
     {
         this.purchaseOrder = new PurchaseOrderProfile();
         this.purchaseOrderItems = new Array<PurchaseOrderItem>();
     }
}
