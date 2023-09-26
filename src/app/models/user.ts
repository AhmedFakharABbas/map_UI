export class User {
    Id: string;
    UserName: string;
    CompanyName: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
    FirstName: string;
    LastName: string;
    Token: string;
    RoleID:number = 1;
    PhoneNumber:string
    phoneNumberObject: any;
    EmailVerifyToken: string
    PhoneVerifyToken: string
    IsAccountVerified: boolean;
    IsGoogleAccount: boolean;
    GoogleId: string;
    EncryptedName: string;
  
    constructor()
    {
      this.phoneNumberObject;
    }
  }
  
  