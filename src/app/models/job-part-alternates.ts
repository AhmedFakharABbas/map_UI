import { NumberValueAccessor } from "@angular/forms";

export class JobPartAlternates{
    JobPartAlternateID: number;
    AutomotivePartID:number;
    JobPartID: number;
    PartConditionID: number = 65;
    SellingPrice: number; 
    BrandID: number;
    OrigionID: number;
    UnitTypeID: number;
    IsApproved: boolean;
    IsDeleted: number;
    ModifiedBy: number;
    CreatedBy: number;
    IsModified: boolean;
    BrandName: any;
    OrigionName: any;
    VendorName: any;
    ItemCode:string;
    UnitTypeName: string;
    ConditionName: string;
    EditMode: boolean = false;
    // Brand: any;
    // Origin: any;
    JobPartStatusID : number;
    JobPartStatusName : string;
    Hours: number;
    Minutes: number;
    OrderTime :  number;
    PartLocation :  number = 137;
    VendorID :  number;
    DiscountPercentage : number; 
    NetAmount : number;
    WorkshopID: number;
    UnitQuantity : number;
    Quantity:number;
    Viscosity:string;
    PartNameArabic :string;
    MainCategoryNameArabic:string;
    SubCategoryNameArabic:string;
    StockQuantity:number;
    DiscountAmount:number;
    TaxAmount:number;

}