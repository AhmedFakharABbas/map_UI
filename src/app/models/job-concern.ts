export class JobConcern{
    JobConcernID: number;
    ConcernDescription: string;
    Icon:string ='mechanical';
    ConcernTypeID:number = 70;
    JobCardID: number;
    CreatedBy: number;
    CreatedOn: Date;
    ModifiedBy: number;
    ModifiedOn: Date;
    IsModified: boolean;
    IsApproved: boolean = false;
    OldJobConcernID: number;  
    ConcernTypeName: string;
    TaskTime: number;
    Note: string;
    EditNote : boolean = false;
    addPart: boolean = true;
    addService: boolean = true;
    recentService: string;
    partQuantity: number;
}