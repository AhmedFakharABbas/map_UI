import { InspectionResult } from './inspection-result';
import { BasicInfo } from './basic-info';
import { JobProcess } from './job-process';
import { JobConcern } from './job-concern';
import { JobPart } from './JobPart';
import { Appointment } from './appointment';
import { ImageMarker } from './image-marker';
import { Checklist } from './checklist';

export class TechnicianJobsView {
    JobTasks: Array<InspectionResult>;
    JCBasicInfoList: Array<BasicInfo>;
    JobCardBasicInfo: BasicInfo;
    JobProcess : Array<JobProcess>;
    JobConcerns: Array<JobConcern>;
    JobParts: Array<JobPart>;
    Appointments: Array<Appointment>;
    ImageMarkers: Array<ImageMarker>;
    JobCardCheckLists: Array<Checklist>;
    UserRoles: any;
    constructor() {
        this.JobTasks = new Array<InspectionResult>();
        this.JCBasicInfoList = new Array<BasicInfo>();
        this.JobProcess = new Array<JobProcess>();
        this.JobConcerns = new Array<JobConcern>();
        this.JobParts = new Array<JobPart>();
        this.Appointments = new Array<Appointment>();
        this.ImageMarkers = new Array<ImageMarker>();
        this.JobCardCheckLists = new Array<Checklist>();
    }
}