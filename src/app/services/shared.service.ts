import { Injectable } from "@angular/core";
import { Employee } from "app/models/employee";
import { NotificationsService } from "angular2-notifications";
import { environment } from "environments/environment";
import { NgForm } from "@angular/forms";
import { JobCardInfo } from "app/models/job-card-info";
import { BasicInfoMeta } from "app/models/basic-info-meta";
import { JobCommonMeta } from "app/models/job-common-meta";
import { CommonMeta } from "app/models/common-meta";
import { Part } from "app/models/part";
import { InspectionResult } from "app/models/inspection-result";
import { JobProcess } from "app/models/job-process";
import { JobPart } from "app/models/JobPart";
import { UserNotification } from "app/models/user-notification";
import { TaskTechnician } from "app/models/task-technician";
import { Contract } from "app/models/contract";
import { VendorPartPrice } from "app/models/vendor-part-price";
import { VendorModel } from "app/models/vendor";
import { Subject } from "rxjs";
import { Appointment } from "app/models/appointment";
import { SaveAppointment } from "app/models/saveAppointment";
import { ImageMarker } from "app/models/image-marker";
import { Checklist } from "app/models/checklist";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  markAll: number;
  pageNumber: number = 1;
  logged_user_role_id: number;
  logged_user_id: number;
  logged_user_role: string;
  loading: boolean = false;
  user: Employee;
  token: string;
  pageSize: number = 10;
  baseUrl: string = environment.API_URL;
  marker_radius: number = environment.MARKER_RADIUS;
  currentTab = undefined;
  currentRouteIndex: number = 0;
  routesArray: any;
  jobObj: JobCardInfo;
  contractObj: Contract;
  partObj: Part;
  _basicInfoMeta: BasicInfoMeta;
  _jobCommonMeta: JobCommonMeta;
  _commonMeta: CommonMeta;
  currentWorkshopID: number;
  currentWorkshopName: string;
  EmployeeID: number;
  // isCreatingJob: boolean = false;
  jcCustomerMode: boolean = false;
  jcAddVehicle: boolean = false;
  createdCustomer: boolean = false;
  jcVehicleMode: boolean = false;
  default_img: string = "/assets/img/no-image1.jpg";
  plus_image: string = "/assets/img/plus-Image.png";
  avatar: string = "/assets/img/avatar.png";
  customerFilter: string;
  plateNumber: string;
  contactMobile: string;
  selectedPlateNum: string;
  // tasks: Array<InspectionResult>;
  // parts: Array<JobPart>;
  recentProcesses: Array<JobProcess> = [];
  recentTasks: Array<TaskTechnician>;
  notifications: Array<UserNotification> = [];
  isProcessModalOpened: boolean = false;
  isTaskModalOpened: boolean = false;
  AutomotiveParts: Array<Part> = [];
  VendorPartPrices: Array<VendorPartPrice> = [];
  PartVendors: Array<VendorModel> = [];

  partsList = [];
  partsListBuffer = [];
  bufferSize = 500;
  numberOfItemsFromEndBeforeFetchingMore = 100;
  partLoading = false;
  uploadPercentage: number;
  showUploadPercentage: boolean = false;

  getTasks: Subject<boolean> = new Subject<boolean>();
  getTechJobCards: Subject<boolean> = new Subject<boolean>();
  getAllJobCards: Subject<boolean> = new Subject<boolean>();
  getAllParts: Subject<boolean> = new Subject<boolean>();
  completePartsPricing: Subject<boolean> = new Subject<boolean>();
  completeInspectionResult: Subject<boolean> = new Subject<boolean>();
  changeTabID: Subject<boolean> = new Subject<boolean>();
  CustomerID_CP: number;
  getContractConsumption: Subject<boolean> = new Subject<boolean>();
  resetAllFields: Subject<boolean> = new Subject<boolean>();
  getJobCardMetaChange: Subject<boolean> = new Subject<boolean>();
  resetForm: Subject<boolean> = new Subject<boolean>();
  changeDealerTab: Subject<number> = new Subject<number>();
  tabSetId: string = "";
  appointmentData: Appointment;
  appointments: Array<Appointment> = [];
  jobCardId: number;
  imageMarker: Array<ImageMarker> = [];
  jobCardCheckList: Array<Checklist> = [];
  totalNotifications: number;
  AppointmentID: number;
  previousNotificationCount: number;
  partAvailable: boolean;

  queueInspectionApproval: boolean = false;
  // jobcard tab

  jobCardTab = 19;
  // tech jobcard tab

  techJobCardTab = 1;

  // notifications tab

  notePage = 1;

  // invoice tab

  invoiceTab = 6;

  constructor(private _notificationService: NotificationsService) {
    if (
      localStorage.getItem("employee") != undefined &&
      localStorage.getItem("employee") != "undefined"
    ) {
      this.user = JSON.parse(localStorage.getItem("employee"));
      this.logged_user_id = this.user.UserID;
      this.EmployeeID = this.user.EmployeeID;
      // if (this.user.Roles.length > 0 && this.user.Roles != undefined) {
      //   this.logged_user_role = this.user.Roles[0].Icon;
      //   this.logged_user_role_id = this.user.Roles[0].RoleID;
      // }
      this.logged_user_role = localStorage.getItem("logged_user_role");
      this.logged_user_role_id = +JSON.parse(
        localStorage.getItem("logged_user_role_id")
      );

      if (this.logged_user_role_id != 1) {
        this.currentWorkshopID = this.user.WorkshopID;
        this.currentWorkshopName = this.user.WorkshopName;
      }
    }

    if (
      localStorage.getItem("token") != undefined &&
      localStorage.getItem("token") != "undefined"
    ) {
      this.token = localStorage.getItem("token");
    }

    if (
      localStorage.getItem("workshopID") != undefined &&
      localStorage.getItem("workshopID") != "undefined"
    ) {
      this.currentWorkshopID = +JSON.parse(localStorage.getItem("workshopID"));
      this.currentWorkshopName = localStorage.getItem("currentWorkshopName");
    }

    this.routesArray = [
      { name: "/" + "create-job/basic-info", formObj: NgForm },
      { name: "/" + "create-job/customer-concerns", formObj: NgForm },
      { name: "/" + "create-job/inspection", formObj: NgForm },
      { name: "/" + "create-job/inspection-results", formObj: NgForm },
      { name: "/" + "create-job/part-price", formObj: NgForm },
      { name: "/" + "create-job/approval", formObj: NgForm },
      { name: "/" + "create-job/qa", formObj: NgForm },
    ];
    this.jobObj = new JobCardInfo();
    this._basicInfoMeta = new BasicInfoMeta();
    this._jobCommonMeta = new JobCommonMeta();
    this._commonMeta = new CommonMeta();
    this.AutomotiveParts = new Array<Part>();
    this.VendorPartPrices = new Array<VendorPartPrice>();
    this.PartVendors = new Array<VendorModel>();
    this.imageMarker = new Array<ImageMarker>();
    // this.tasks = new Array<InspectionResult>();
    // this.parts = new Array<JobPart>();
  }

  isUserLogin() {
    if (
      this.user != undefined &&
      this.user.access_token != undefined &&
      this.user.access_token != ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  public setRoleID(id: number, logged_user_role: string) {
    this.logged_user_role_id = id;
    this.logged_user_role = logged_user_role;
  }
  // Success Type
  public success(title: string, message?: string) {
    this._notificationService.success(title, message);
  }

  // error Type
  error(title: string, message?: string) {
    this._notificationService.error(title, message);
  }

  warning(title: string, message?: string) {
    this._notificationService.warn(title, message);
  }

  info(title: string, message?: string) {
    this._notificationService.info(title, message);
  }

  updateTab(number: number) {
    this.currentTab = number;
  }

  CheckInputCharacters(e) {
    var unicode = e.charCode ? e.charCode : e.keyCode;
    if (unicode != 8) {
      if ( unicode == 32 ||
        (unicode >= 65 && unicode <= 90) ||
        (unicode >= 97 && unicode <= 122)
      )
        return true;
      else {
        if ( 
          (unicode < 48 || unicode > 57) &&
          (unicode < 0x0600 || unicode > 0x06ff)
        )
          //if not a number or arabic
          return false;
      }
    }
  }

  dateFormat(date: any) {
    if (date != undefined) {
      let temp = date;
      let year = temp.year;
      let month = temp.month;
      let day = temp.day;
      let bday = month + "/" + day + "/" + year;
      return bday;
    }
  }

  changeDateFormat(date: any) {
    if (date != undefined) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return { year: year, month: +month, day: +day };
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (
      ext.toLowerCase() == "png" ||
      ext.toLowerCase() == "jpeg" ||
      ext.toLowerCase() == "jpg"
    ) {
      return true;
    } else {
      return false;
    }
  }
}
