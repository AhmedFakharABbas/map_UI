export class PurchaseOrderItem {
    PurchaseOrderItemID : number
	PurchaseOrderID:  number
	AutomotivePartID:  number
	AutomotivePartName: string;
	UnitQuantity :  number
	PurchaseQuantity :  number
	ReceivedQuantity :  number
	PurchasePrice :  number
	SellingPrice :  number
	StatusID : number
	StatusName: string;
	CreatedBy:  number
	CreatedOn: Date
	ModifiedBy:  number
	ModifiedOn: Date
	IsDeleted: boolean; 
}
