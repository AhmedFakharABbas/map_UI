import { Employee } from './employee';
import { Role } from './role'; 
import { VehicleJobCardData } from './vehicle-job-card-data'; 
import { JobPart } from './JobPart';
import { VendorPartPrice } from './vendor-part-price';
import { BasicInfo } from './basic-info';

export class BasicInfoMeta{ 
    VehicleJCData: VehicleJobCardData;
    Employees: Array<Employee>;
    UserRoles: Array<Role>;  
    AutomotivePart: Array<JobPart>;
    VendorPartPrice: Array<VendorPartPrice>;
    JobCard: Array<BasicInfo>;
}