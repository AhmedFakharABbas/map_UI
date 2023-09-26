export class Customer {
    CustomerID: number;
    FirstName: string;
    LastName: string;
    CustomerFullName:string;
    ContactPhone: string;
    ContactMobile: string;
    ContactEmail: string;
    Zipcode: number;
    Address1: string;
    Address2: string;
    CityID: number;
    CountryID:number = 1;
    IsActive: boolean;
    PendingAmount: number;
    Birthday: any;
    WorkshopID: number;
    CreatedBy: number;
    ModifiedBy: number;
    CustomerTypeID: number = 68;
    CompanyName: string;
    ContactPersonName: string;
    MaxCreditLimit: number;
    CountryName: string;
    CityName: string;
    TotalJobs : number;
    CreditAmount : number;
    CustomerTypeName : string; 
}
