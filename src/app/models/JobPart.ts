import { JobPartAlternates } from './job-part-alternates';

export class JobPart {
    isOpened:boolean;
    JobPartID: number;
    MainPartID:number;
    AutomotivePartID: number;
    JobCardID: number;
    JobTaskID: number;
    JobConcernID: number;
    ConcernDescription: string;
    TaskDescription: string;    
    IsNew: boolean;
    PurchasePrice: number;
    SellingPrice: number;
    Quantity: number;
    DiscountAmount: number;
    TaxPercentage: number;
    TotalAmount: number;
    NetAmount: number;
    Notes: string;
    JobPartStatusID: number;
    JobPartStatusName: string;
    ExpectedDeliveryTime: string;
    DeliveredOn: Date;
    SearchVendorDuration: number;
    CreatedBy: number;
    ModifiedBy: number;
    IsModified: boolean;
    MainCategoryID: number;
    SubCategoryID: number;
    SubSubCategoryID: number;
    PartNameEnglish: string;
    PartNameArabic: string;
    VendorID: number;
    VendorName: string;
    IsInclude: boolean;
    OldJobPartID: number;
    ManufacturerID: number;
    OrigionID: number;
    UnitTypeID: number;
    NetPrice: number;
    BrandID: number;
    JobPartAlternateID: number;
    PartConditionID: number = 65;
    EditMode: boolean = false;
    BrandName: string;
    OrigionName: string;
    UnitTypeName: string = 'Pieces';
    PriorityTypeID: number = 83;
    PartAlternate: JobPartAlternates;
    ApprovalStatus: string;
    TaxAmount: number = 0;
    AddPartTask: boolean = true;
    IsContractPart: boolean = false;
    Condition: string;
    MainCategoryNameArabic : string;
    MainCategoryNameEng: string;
    SubCategoryNameArabic: string;
    SubCategoryNameEng : string;
    IsAvailable:boolean = false;
    InternalCode:string;
    ConcernTypeEnglish : string;

    EditQuantity: boolean = false;
    constructor() {
        this.PartAlternate = new JobPartAlternates();
    }
}