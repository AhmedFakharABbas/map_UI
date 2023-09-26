import { JobConcern } from './job-concern';
import { BasicInfo } from './basic-info';
import { InspectionResult } from './inspection-result';
import { JobPart } from './JobPart';
import { Checklist } from './checklist';
import { Gallery } from './Gallery';
import { ImageMarker } from './image-marker';
import { Role } from './role';
import { JobProcess } from './job-process';
import { Invoice } from './invoice';
import { VendorPartPrice } from './vendor-part-price';
import { InvoiceTotal } from './invoice-total';
import { Customer } from './customer';
import { Colors } from './colors';
import { Vehicle } from './vehicle';
import { JobPartPricing } from './job-part-pricing';
import { Note } from './note';
import { LaborTasks } from './labor-tasks';
import { LaborPricing } from './labor-pricing';
import { PartBrands } from './part-brands';
import { JobPartAlternates } from './job-part-alternates';
import { Employee } from './employee';
import { BrandOrigin } from './brand-origin';
import { PlanFeature } from './plan-feature';
import { AutomotivePartVehicle } from './automotive-part-vehicle';
import { Appointment } from './appointment';
import { MainCategory } from './main-category';
import { SubCategory } from './sub-category';

export class JobCardInfo {
    JCBasicInfo: BasicInfo;
    JobInvoiceList: Array<BasicInfo>;
    JobInvoiceList2: Array<BasicInfo>;
    JobConcerns: Array<JobConcern>; 
    JobCardCheckList: Array<Checklist>;
    JobTasks: Array<InspectionResult>;
    HistoryTasks: Array<InspectionResult>;
    JobParts: Array<JobPart>;
    HistoryParts: Array<JobPart>;
    JobPartAlternates: Array<JobPartAlternates>;
    SuggestedJobPartAlternates: Array<JobPartAlternates>;
    JCBasicInfoList: Array<BasicInfo>;
    JobInvoice: BasicInfo;
    Gallery: Array<Gallery>;
    HistoryGallery: Array<Gallery>;
    ImageMarkers: Array<ImageMarker>;
    UserRoles: Array<Role>;
    JobProcess: Array<JobProcess>;
    ObjectStatus: Array<JobProcess>;
    Invoice: Invoice;
    jcCustomerObj: Customer;
    jcVehicleObj: Vehicle;
    jcVehicleList: Array<Vehicle>;
    AutomotivePart: Array<JobPart>;
    VendorPartPrice: Array<VendorPartPrice>;
    InvoiceTotal: Array<InvoiceTotal>;
    Customers: Array<Customer>;
    Colors: Array<Colors>;
    JobPartPricing: Array<JobPartPricing>;
    Notes: Array<Note>;
    LaborTasks: Array<LaborTasks>;
    LaborPricings: Array<LaborPricing>;
    PartBrands: Array<PartBrands>;
    BrandOrigins: Array<BrandOrigin>;
    Employees : Array<Employee>;
    PlanFeatures : Array<PlanFeature>;
    ContractPartsDetail : Array<JobPart>;
    ContractTasksDetail : Array<InspectionResult>;
    Appointments: Array<Appointment>;
    QSTechnicianID: number;
    AppointmentID:number;
    MainCategories: Array<MainCategory>
    SubCategories: Array<SubCategory>
    JobSingleProcess: JobProcess
    Appointment: Appointment
    JobInvoiceTotal: Invoice

    constructor() {
        this.JCBasicInfo = new BasicInfo();
        this.jcCustomerObj = new Customer();
        this.jcVehicleObj = new Vehicle();
        this.jcVehicleList = new Array<Vehicle>();
        this.JobTasks = new Array<InspectionResult>();
        this.JobParts = new Array<JobPart>();
        this.JobPartAlternates = new Array<JobPartAlternates>();
        this.JobConcerns = new Array<JobConcern>();
        this.JobCardCheckList = new Array<Checklist>();
        this.JCBasicInfoList = new Array<BasicInfo>();
        this.ImageMarkers = new Array<ImageMarker>();
        this.UserRoles = new Array<Role>();
        this.JobProcess = new Array<JobProcess>();
        this.ObjectStatus = new Array<JobProcess>();
        this.AutomotivePart = new Array<JobPart>();
        this.VendorPartPrice = new Array<VendorPartPrice>();
        this.InvoiceTotal = new Array<InvoiceTotal>();
        this.JobInvoiceList = new Array<BasicInfo>();
        this.JobInvoice = new BasicInfo();
        this.Customers = new Array<Customer>();
        this.Colors = new Array<Colors>();
        this.JobPartPricing = new Array<JobPartPricing>();
        this.Notes = new Array<Note>();
        this.LaborTasks = new Array<LaborTasks>();
        this.LaborPricings = new Array<LaborPricing>();
        this.PartBrands = new Array<PartBrands>();
        this.Employees = new Array<Employee>();
        this.BrandOrigins = new Array<BrandOrigin>();
        this.PlanFeatures = new Array<PlanFeature>();
        this.ContractPartsDetail = new Array<JobPart>();
        this.ContractTasksDetail = new Array<InspectionResult>();
        this.Appointments = new Array<Appointment>();
        this.JobSingleProcess = new JobProcess();
    }
}