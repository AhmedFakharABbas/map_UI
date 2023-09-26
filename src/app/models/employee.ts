import { Role } from './role';
import { TaskTechnician } from './task-technician';

export class Employee  {
    EmployeeID: number;
    Email: string;
    Password: string;
    access_token:string;
    ConfirmPassword: string; 
    Id: string;
    FirstName: string;
    LastName: string;
    PositionID: number;
    Salary: number;
    ContactPhone: string;
    ContactMobile: string;
    Zipcode: number;    
    CityID: number;
    CountryID: number = 1 ;
    CityName: string;
    CountryName: string;
    Address1:string;
    Address2:string;
    UserID: number;
    IsActive: boolean;
    Token:string;
    WorkshopID: number; 
    WorkshopName: string;
    ImageURL:string;
    Roles: Array<Role>;
    UserName: string;
    CreatedBy: number;
    ModifiedBy: number;
    EmployeeFullName : string;
    TechnicianTypeID: number = 95;
    TaskTechnicians:Array<TaskTechnician>
    CompletedTasks:Array<TaskTechnician>
    GraphData:Array<TaskTechnician>
    TechnicianStats:Array<TaskTechnician>
    // show:boolean;
    constructor() {
        this.Roles = new Array<Role>();  
    }
} 


