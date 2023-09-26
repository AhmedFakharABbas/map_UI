export class VendorModel {
    VendorID: number;
    VendorName: string;
    CityID: number;
    CountryID: number = 1;
    Zipcode: number;
    Address1: string;
    Address2: string;
    CPFirstName: string;
    CPLastName: string;
    CPPositionID: number;
    CPPositionName: string;
    CPPhone: string;
    CPEmail: string;
    StatusID: number;
    IsSellNew: boolean;
    IsSellUsed: boolean;
    LogoURL: string;
    RegistrationNumber: string;
    WorkshopID: number;
    CreatedBy: number;
    ModifiedBy: number;
    CountryName: string;
    CityName: string;
    TypeNameEnglish: string;
    Phonenumber: string;
}