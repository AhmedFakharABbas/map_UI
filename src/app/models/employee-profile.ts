import { Employee } from './employee';
import { Role } from './role';
import { BasicInfo } from './basic-info';
import { JobProcess } from './job-process';
import { InspectionResult } from './inspection-result';

export class EmployeeProfile {
    Employee: Employee;
    JCBasicInfoList: Array<BasicInfo>;
    UserRoles: Array<Role>;
    JobTasks: Array<InspectionResult>;
    JobProcess: Array<JobProcess>;
    ActiveJobProcess: Array<JobProcess>;
    ProcessCount: JobProcess; 
    constructor() {
        this.Employee = new Employee();
        this.JCBasicInfoList = new Array<BasicInfo>();
        this.UserRoles = new Array<Role>();
        this.JobTasks = new Array<InspectionResult>();
        this.JobProcess = new Array<JobProcess>();
        this.ActiveJobProcess = new Array<JobProcess>();
        this.ProcessCount = new JobProcess; 
    
    }
}