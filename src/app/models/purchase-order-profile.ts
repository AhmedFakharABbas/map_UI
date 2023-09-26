export class PurchaseOrderProfile {
    PurchaseOrderID: number
	TotalAmount : number
	TaxAmount: number
	Discount: number 
	NetAmount: number
	VendorID : number
    VendorName: any;
	StatusID: number
	StatusName: string;
	Notes: string
	CreatedBy: number
	CreatedOn : Date
	ModifiedBy : number
	ModifiedOn : Date
	IsDeleted : boolean;
    SellingPrice: number; 
    PurchasePrice: number;
    PurchaseQuantity: number;
    DeliveryTime: number; // minutes
	NoOfParts: number;
}
