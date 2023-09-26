import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { SharedService } from './shared.service';
import { Observable } from 'rxjs';
import { JobCardInfo } from 'app/models/job-card-info';
import { JobCardFilter } from 'app/models/job-card-filter';
import { GetCustomerVehicle } from 'app/models/get-customer-vehicle';
import { InspectionResult } from 'app/models/inspection-result';
import { JobProcess } from 'app/models/job-process';
import { TaskTechnician } from 'app/models/task-technician';
import { UpdateJobPart } from 'app/models/update-job-part';
import { TasksAction } from 'app/models/tasks-action';
import { BasicInfo } from 'app/models/basic-info';
import { JobPart } from 'app/models/JobPart';
import { Checklist } from 'app/models/checklist';
import { Appointment } from 'app/models/appointment';
import { JobPartAlternates } from 'app/models/job-part-alternates';
import { SaveAppointment } from 'app/models/saveAppointment';
import { Part } from 'app/models/part';
import { PurchaseOrderProfile } from 'app/models/purchase-order-profile';
import { VendorModel } from 'app/models/vendor';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }

  saveJob(): Observable<any> {
    var url = 'api/JobCard/SaveJobCard';
    // this._sharedService.jobObj.JobConcern = jobObj.JobConcern.filter(item =>{
    //   // IsModified =true
    //   item.IsModified === true;
    // })   
    return this._customHttp.post(url, this._sharedService.jobObj);
  }

  getJobMetaData(data: String) {
    let url = 'api/JobCard/GetJobCardMetaData';
    // this._sharedService.customerFilter, plateNumber: data.PlateNumber, contactPersonMobile: data.ContactPersonMobile
    return this._customHttp.get(url, { customerFilter: data, WorkshopID: this._sharedService.currentWorkshopID });
  }

  getOldJobCardData(jobCardID) {
    let url = 'api/JobCard/GetOldJobCardData';
    return this._customHttp.get(url, { jobCardID: jobCardID });
  }

  getJobCommonMeta() {
    let url = 'api/JobCard/GetJobViewMetaData';
    return this._customHttp.get(url);
  }

  getJobCardCount(filter: JobCardFilter) {
    let url = 'api/JobCard/GetJobCardCount';
    return this._customHttp.post(url, filter);
  }

  getAllJobsData(filter: JobCardFilter) {
    
    let url = 'api/JobCard/GetAllJobCards';
    return this._customHttp.post(url, filter);
  }

  getTechnicianJobCards(jobCardFilter: JobCardFilter) {
    
    let url = 'api/JobCard/GetTechJobCards';
    return this._customHttp.post(url, jobCardFilter);
  }

  jobHistory(jobCardFilter: JobCardFilter) {
    let url = 'api/JobCard/JobHistory';
    return this._customHttp.post(url, jobCardFilter);
  }

  getSingleJob(jobID: number, appointmentID?: number) {
    let url = 'api/JobCard/GetSingleJobCard';
    return this._customHttp.get(url, { jobCardID: jobID, workshopID: this._sharedService.currentWorkshopID, appointmentID: appointmentID });
  }

  getTechSingleJobCard(jobID: number) {
    let url = 'api/JobCard/GetTechSingleJobCard';
    return this._customHttp.get(url, { jobCardID: jobID, workshopID: this._sharedService.currentWorkshopID });
  }

  saveJobPart(part: JobPart) {
    part.CreatedBy = this._sharedService.logged_user_id;
    let url = 'api/JobCard/SaveJobPart';
    return this._customHttp.put(url, part);
  }

  updateJobPart(jp: JobPart) {
    jp.ModifiedBy = +this._sharedService.logged_user_id;
    let url = 'api/JobCard/UpdateJobPart';
    return this._customHttp.put(url, jp);
  }
  saveJobTask(task: InspectionResult) {
    task.CreatedBy = this._sharedService.logged_user_id;
    let url = 'api/JobCard/SaveJobTask';
    return this._customHttp.put(url, task);
  }
  updateJobTask(task: InspectionResult) {
    
    task.ModifiedBy = this._sharedService.logged_user_id;
    let url = 'api/JobCard/UpdateJobTask';
    return this._customHttp.put(url, task);
  }

  updateJob(job: JobCardInfo): Observable<any> {
    
    let url = 'api/JobCard/UpdateJobCard';

    var jobObj = new JobCardInfo();
    var data = JSON.stringify(job);
    jobObj = JSON.parse(data);
    jobObj.JCBasicInfo = this._sharedService.jobObj.JCBasicInfo;
    jobObj.JobConcerns = this._sharedService.jobObj.JobConcerns.filter(item => item.IsModified == true);
    jobObj.JobCardCheckList = this._sharedService.jobObj.JobCardCheckList.filter(item => item.IsModified == true);
    jobObj.JobTasks = this._sharedService.jobObj.JobTasks.filter(item => item.IsModified == true);
    jobObj.JobParts = this._sharedService.jobObj.JobParts.filter(item => item.IsModified == true);
    jobObj.JobPartAlternates = this._sharedService.jobObj.JobPartAlternates.filter(item => item.IsModified == true);
    jobObj.JobProcess = this._sharedService.jobObj.JobProcess.filter(item => item.IsModified == true);
    // jobObj.JobPartPricing = this._sharedService.jobObj.JobPartPricing.filter(item => item.IsModified == true);
    jobObj.Notes = this._sharedService.jobObj.Notes.filter(item => item.IsModified == true);
    if (this._sharedService.jobObj.Gallery != undefined) {
      jobObj.Gallery = this._sharedService.jobObj.Gallery.filter(item => item.IsModified == true);
    }

    return this._customHttp.put(url, jobObj)
  }

  aprroval(job: any){
    
    var jobObj = new JobCardInfo();
    jobObj.JCBasicInfo = this._sharedService.jobObj.JCBasicInfo;
    jobObj.JobPartAlternates = this._sharedService.jobObj.JobPartAlternates.filter(item => item.IsModified == true);
    jobObj.JobTasks = this._sharedService.jobObj.JobTasks.filter(item => item.IsModified == true);
    jobObj.JobParts = this._sharedService.jobObj.JobParts.filter(item => item.IsModified == true);
    let url = 'api/JobCard/Approval';
    return this._customHttp.put(url, jobObj);
  }

  assignSupForeman(job: BasicInfo, RoleID: number): Observable<any> {
    let url = 'api/JobCard/AssignSupForeman';
    var modifiedBy = +this._sharedService.logged_user_id
    return this._customHttp.put(url, { jobCardID: job.JobCardID, EmployeeID: RoleID == 5 ? job.PreferredForemanID : job.SupervisorID, RoleID: RoleID, modifiedBy: modifiedBy })
  }

  deleteJob(jobID: number) {
    let url = 'api/JobCard/DeleteJobCard';
    return this._customHttp.delete(url, { jobCardID: jobID, modifiedBy: this._sharedService.logged_user_id })
  }

  deleteJobConcern(jcID: number) {
    let url = 'api/JobCard/DeleteJobConcern';
    return this._customHttp.delete(url, { jobConcernID: jcID, modifiedBy: this._sharedService.logged_user_id })
  }
  deleteJobTask(jtID: number) {
    let url = 'api/JobCard/DeleteJobTask';
    return this._customHttp.delete(url, { jobTaskID: jtID, modifiedBy: this._sharedService.logged_user_id })
  }
  deleteJobPart(jpID: number) {
    let url = 'api/JobCard/DeleteJobPart';
    return this._customHttp.delete(url, { jobPartID: jpID, modifiedBy: this._sharedService.logged_user_id })
  }

  removeImage(galID: number) {
    let url = 'api/JobCard/RemoveImage';
    return this._customHttp.delete(url, { galleryID: galID, modifiedBy: this._sharedService.logged_user_id })
  }

  // assign job process to employee, accept and complete it
  assignJobProcess(jp: JobProcess) {
    let url = 'api/JobCard/AssignJobProcess';
    var taskTechnician = { JobProcessID: jp.JobProcessID, JobCardID: jp.JobCardID, ProcessTypeID: jp.ProcessTypeID, EmployeeID: jp.EmployeeID, ModifiedBy: this._sharedService.logged_user_id }
    return this._customHttp.put(url, taskTechnician)
  }

  acceptJobProcess(jp: JobProcess) {
    let url = 'api/JobCard/AcceptJobProcess';
    var jobProcess = { JobCardID: jp.JobCardID, ProcessStatusID: jp.ProcessStatusID, ProcessTypeID: jp.ProcessTypeID, EmployeeID: this._sharedService.logged_user_id }
    return this._customHttp.put(url, jobProcess);
  }

  completeJobProcess(jp: JobProcess) {
    let url = 'api/JobCard/CompleteJobProcess';
    var jobProcess = { ProcessStatusID: jp.ProcessStatusID, ProcessTypeID: jp.ProcessTypeID, JobCardID: jp.JobCardID, EmployeeID: this._sharedService.logged_user_id, WorkshopID: this._sharedService.currentWorkshopID };
    return this._customHttp.put(url, jobProcess);
  }

  completeTechJobProcess(jp: JobProcess) {
    let url = 'api/JobCard/CompleteJobProcess';
    var jobProcess = { ProcessStatusID: jp.ProcessStatusID, ProcessTypeID: jp.ProcessTypeID, JobCardID: jp.JobCardID, EmployeeID: this._sharedService.logged_user_id, WorkshopID: this._sharedService.currentWorkshopID, IsIRCompleted: jp.IsIRCompleted };
    return this._customHttp.put(url, jobProcess);
  }

  // assign task to trechnician and complete it 
  assignTaskTechnician(task: InspectionResult): Observable<any> {
    let url = 'api/JobCard/AssignTaskTechnician';
    var taskTechnician = { TaskTechnicianID: task.TaskTechnicianID, JobCardID: task.JobCardID, JobTaskID: task.JobTaskID, EmployeeID: task.EmployeeID, ModifiedBy: this._sharedService.logged_user_id }
    return this._customHttp.post(url, taskTechnician)
  }

  //assign Overall Technician
  assignTasks(AssignTasks: TasksAction): Observable<any> {
    let url = 'api/JobCard/AssignTasks';
    return this._customHttp.post(url, AssignTasks)
  }

  acceptTask(task: InspectionResult) {
    let url = 'api/JobCard/AcceptTask';
    var jobProcess = { TaskTechnicianID: task.TaskTechnicianID, TaskStatusID: task.TaskStatusID, ModifiedBy: this._sharedService.logged_user_id }
    return this._customHttp.post(url, jobProcess);
  }

  acceptAllTasks(task: TasksAction) {
    let url = 'api/JobCard/AcceptAllTasks';
    //var model = { TaskStatusID: task.TaskStatusID, task }
    return this._customHttp.post(url, task);
  }

  completedJobTask(task: InspectionResult) {
    let url = 'api/JobCard/CompleteTaskTechnician';
    var taskTechnician = { TaskTechnicianID: task.TaskTechnicianID, JobTaskID: task.JobTaskID, JobCardID: task.JobCardID, TaskStatusID: task.TaskStatusID, ModifiedBy: this._sharedService.logged_user_id, WorkshopID: this._sharedService.currentWorkshopID };
    return this._customHttp.post(url, taskTechnician);
  }

  completeTasks(tasks: Array<TaskTechnician>) {
    let url = 'api/JobCard/CompleteTasks';
    return this._customHttp.post(url, tasks);
  }

  //  qa task verification
  taskVerification(task: InspectionResult) {
    let url = 'api/JobCard/TaskVerification';
    var taskVerification = { JobCardID: task.JobCardID, JobTaskID: task.JobTaskID, QAVerify: task.QAVerify, VerifiedBy: this._sharedService.logged_user_id };
    return this._customHttp.post(url, taskVerification);
  }

  closeJC(jobCardID: number, netAmount: number, keyStatusID: number) {
    let url = 'api/JobCard/CloseJobCard';
    return this._customHttp.delete(url, { jobCardID: jobCardID, modifiedBy: this._sharedService.logged_user_id, netAmount: netAmount, keyStatusID: keyStatusID });
  }

  deleteNote(noteID: number) {
    let url = 'api/JobCard/DeleteNote';
    return this._customHttp.delete(url, { noteID: noteID, modifiedBy: this._sharedService.logged_user_id });
  }

  deleteAltPart(alternatePartID: number) {
    this._customHttp.pendingRequests = 0;
    let url = 'api/JobCard/DeleteAlternatePart';
    return this._customHttp.delete(url, { alternatePartID, modifiedBy: this._sharedService.logged_user_id });
  }

  getTaskProfile(jobTaskID: number) {
    let url = 'api/JobCard/GetTaskProfile';
    return this._customHttp.get(url, { jobTaskID: jobTaskID });
  }

  startTask(jobTaskID: number, employeeID: number) {
    let url = 'api/JobCard/StartTask';
    return this._customHttp.get(url, { jobTaskID: jobTaskID, employeeID: employeeID })
  }

  ViewTaskTechnician(jobCardID: number) {
    let url = 'api/JobCard/ViewTaskTechnician';
    return this._customHttp.get(url, { jobCardID: jobCardID, userID: this._sharedService.logged_user_id })
  }

  changePartStatus(JobPart: JobPart) {
    let url = 'api/JobCard/ChangePartStatus';
    return this._customHttp.post(url, { JobPartID: JobPart.JobPartID, ModifiedBy: this._sharedService.logged_user_id, JobPartStatusID: JobPart.JobPartStatusID })
  }

  getApprovalPreview(jobID: number) {
    let url = 'api/JobCard/ApprovalPreview';
    return this._customHttp.get(url, { jobCardID: jobID, workshopID: this._sharedService.currentWorkshopID });
  }

  RemindPartDelivery(jobPartID: number, jobCardID: number) {
    let url = 'api/JobCard/RemindPartDelivery';
    return this._customHttp.get(url, { jobPartID: jobPartID, jobCardID: jobCardID, modifiedBy: this._sharedService.logged_user_id });
  }

  getVehicleHistory(jobCardID: number, vin: string) {
    let url = 'api/JobCard/VehicleHistory';
    return this._customHttp.get(url, { JobCardID: jobCardID, VIN: vin });
  }

  getTaskPricing(laborTaskID: number, cylinderTypeID: number, vehicleRegionID: number) {
    let url = 'api/JobCard/GetTaskPricing';
    return this._customHttp.get(url, { LaborTaskID: laborTaskID, CylinderTypeID: cylinderTypeID, VehicleRegionID: vehicleRegionID });
  }

  SetTaxFree(isApproved: boolean, jobCardID: number) {
    let url = 'api/JobCard/SetTaxFree';
    return this._customHttp.get(url, { isApproved: isApproved, jobCardID: jobCardID });
  }

  readAllNotifications(userID: number) {
    let url = 'api/Notification/ReadAllNotifications';
    return this._customHttp.get(url, { userID: userID });
  }

  getAllParts() {
    let url = 'api/JobCard/GetAllParts';
    return this._customHttp.get(url, { WorkshopID: this._sharedService.currentWorkshopID });
  }

  updateCheckList(jobCardCheckList: Array<Checklist>) {
    let url = 'api/JobCard/UpdateCheckList';
    return this._customHttp.put(url, jobCardCheckList)
  }

  updateJC(job: JobCardInfo): Observable<any> {
    let url = 'api/JobCard/UpdateJobPricing';

    var jobObj = new JobCardInfo();
    jobObj.JCBasicInfo = job.JCBasicInfo;
    jobObj.JCBasicInfo.ModifiedBy = this._sharedService.logged_user_id;
    jobObj.JobCardCheckList = job.JobCardCheckList.filter(item => item.IsModified == true);
    jobObj.JobTasks = job.JobTasks.filter(item => item.IsModified == true);
    jobObj.JobParts = job.JobParts.filter(item => item.IsModified == true);
    // jobObj.JobPartAlternates = job.JobPartAlternates.filter(item => item.IsModified == true);
    // jobObj.JobProcess = job.JobProcess.filter(item => item.IsModified == true); 
    // jobObj.Notes = job.Notes.filter(item => item.IsModified == true);
    // if (job.Gallery != undefined) {
    //   jobObj.Gallery = job.Gallery.filter(item => item.IsModified == true);
    // }

    return this._customHttp.put(url, jobObj)
  }

  saveAppointment(appointmentObj: Appointment): Observable<any> {
    var url = 'api/JobCard/SaveAppointment';
    return this._customHttp.post(url, appointmentObj);
  }
  updateAppointment(saveAppointmentData: SaveAppointment): Observable<any> {
    var url = 'api/JobCard/UpdateAppointment';
    return this._customHttp.put(url, saveAppointmentData);
  }

  deleteAppointment(appointmentID: number) {
    let url = 'api/JobCard/DeleteAppointment';
    return this._customHttp.delete(url, { appointmentID: appointmentID, modifiedBy: this._sharedService.logged_user_id })
  }

  searchPart(searchQuery: string, mainCategoryId:number,  subCategoryId:number, workshopID: number) {
    let url = 'api/Post/getSearchPart';
    return this._customHttp.getWithoutLoader(url, { searchQuery: searchQuery, mainCategoryID: mainCategoryId, subCategoryID: subCategoryId, WorkshopID: workshopID })
  }
  
  savePartAlternate(automotivePart: Part,vendor: VendorModel, purchaseOrder?: PurchaseOrderProfile) {
    
    automotivePart.CreatedBy = this._sharedService.logged_user_id;
    this._customHttp.pendingRequests = 0;
    let url = 'api/JobCard/AddAlternatePart';
    return this._customHttp.post(url, {automotivePart: automotivePart,purchaseOrder: purchaseOrder,vendor: vendor})
  }
 
  updatePartAlternate(JobPartAlternatesObj: JobPartAlternates) {
    let url = 'api/JobCard/UpdateAlternatePart';
    return this._customHttp.put(url, JobPartAlternatesObj)
  }
  getVehicleData(plateNumber : string): Observable<any> {
    var url = 'api/JobCard/GetVehicleData';
    return this._customHttp.get(url, {plateNumber});
  }
  searchAutomotivePart(searchQuery: string,  mainCategoryId:number,  subCategoryId:number, jobPartID:number, vehicleID:number) : Observable<Part[]> {
    let url = 'api/JobCard/SearchAutoMotiveParts';
    return this._customHttp.getWithoutLoader(url, { searchQuery: searchQuery, mainCategoryID: mainCategoryId, subCategoryID: subCategoryId, jobPartID: jobPartID, vehicleID: vehicleID })
  }
  
  updateJobCardChecklist(){
    var jobObj = new JobCardInfo();
    jobObj.JCBasicInfo = this._sharedService.jobObj.JCBasicInfo;
    jobObj.JCBasicInfo.ModifiedBy = this._sharedService.logged_user_id;
    jobObj.JobCardCheckList = this._sharedService.jobObj.JobCardCheckList.filter(item => item.IsModified == true);
      let url = "api/JobCard/UpdateJobCardChecklist"
      return this._customHttp.put(url, jobObj)
    }
    updateVisualInspection(){
      var jobObj = new JobCardInfo();
      jobObj.JCBasicInfo = this._sharedService.jobObj.JCBasicInfo;
      jobObj.JobCardCheckList = this._sharedService.jobObj.JobCardCheckList.filter(item => item.IsModified == true);
      jobObj.ImageMarkers = this._sharedService.jobObj.ImageMarkers.filter(item => item.IsModified == true);
      jobObj.Gallery = this._sharedService.jobObj.Gallery.filter(item => item.IsModified == true);
      let url = 'api/JobCard/UpdateVisualInspection';
      return this._customHttp.put(url, jobObj);
    }

    viewAllNotifications(userID: number , pageNumber: number){
      var url = 'api/JobCard/ViewAllNotifications';
      return this._customHttp.get(url,{userID, pageNumber})
    }

    getSingleAppointment(appointmentID:number, plateNumber:string){
      var url = 'api/JobCard/GetSingleAppointment';
      return this._customHttp.get(url ,{appointmentID, plateNumber})
    }

    partIsAvailable(jobPartID:number , isAvailable:boolean){
      var url = 'api/JobCard/PartIsAvailable';
      return this._customHttp.post(url,{jobPartID , isAvailable})
    }

    getVehicleSeries(MakeName:string , ModelName:string, YearCode:number, GroupName:string){
      var url = 'api/JobCard/getVehicleSeries';
      return this._customHttp.get(url, {MakeName, ModelName, YearCode, GroupName})
    }
}
