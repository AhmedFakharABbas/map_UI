export class JobPartPricing {
    JobPartPricingID: number;
    JobCardID: number;
    JobPartID: number;
    VendorID: number;
    IsNew: boolean;
    SellingPrice: number;
    Quantity: number = 1;
    DiscountAmount: number;
    NetAmount: number;
    TotalAmount: number;
    JobPartStatusID: number = 3;
    DeliveredOn: Date;
    ExpectedDeliveryTime: string;
    CreatedBy: number;
    IsChecked: boolean;
    IsModified: boolean;
    ManufacturerID: number;
    OrigionID: number;
    UnitTypeID: number; 

}