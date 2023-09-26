export class ServiceCenter{
    // Roles: number;
    getSingleEmployee(userID: number) {
      throw new Error("Method not implemented.");
    }
    WorkshopID: number;
    WorkshopName:string; //for login 
    EnglishName: string;
    ArabicName: string;
    Zipcode: number;
    Address1: string;
    CountryCode:string
    Phone: string;
    Address2: string; 
    CityID: number;
    CountryID: number = 1;
    LogoImageURL: string;
    ContactPersonFirstName: string;
    ContactPersonLastName: string;
    ContactPersonMobile: string;
    ContactPhone: string;
    OwnerID: number;
    Email: string;
    ModifiedBy: number;
    CreatedBy: number;
    Password: string;
    ConfirmPassword: string;
}