export class  Invoice {
    JobInvoiceID: number;
    JobCardID: number;
    ChargeToName: string;
    SalesTaxNumber: string;
    TotalPartsPrice: number;
    CustomerSignatureURL: string;
    CashierSignatureURL: string;
    ExternalTasksCost: number;
    InternalTasksCost: number;
    NetAmount: number;
    InspectionCost: number;
    AmountPaid: number;
    DiscountPercentage: number;
    DiscountAmount: number; 
    InvoiceStatusID: number;
    CreatedBy: number;
    ModifiedBy: number;
    ReturnAmount: number;
    TotalAmount: number;
    DiscountComments: string;
    WorkshopID: number;
    RemainingAmount : number;
    Comments: string;
    TotalCost: number;
}