export class JobProcess{
    JobProcessID: number;
    JobCardID: number;
    JobTaskID: number;
    ProcessTypeID: number;
    EmployeeID: number;
    EmployeeFullName: string;
    ActualTimeSpent: string;
    IsAccepted: boolean;
    IsCompleted:boolean;
    AcceptedDateTime: Date;
    EndDateTime: Date;
    CreatedBy: number;
    ModifiedBy: number;
    IsModified: boolean;
    TypeNameEnglish: string;
    IsChecked: boolean;
    CurrentEmployeeID: number;
    UserID: number;
    ShowDropdown: boolean = false;
    CurrentJobStatus: number;
    TotalTasks: number;
    TotalTimeSpent: number;
    JobCardNumber: string;
    ProcessStatusID: number;
    IsIRCompleted : boolean;
    IsOpenedAgain: boolean;
}