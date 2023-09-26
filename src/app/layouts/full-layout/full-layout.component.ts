import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { SharedService } from "app/services/shared.service";
import { Router } from "@angular/router";
import { Employee } from "app/models/employee";
import { CommonService } from "app/services/common.service";
import { SignalrService } from "app/services/signalr.service";
import { AuthService } from "app/services/auth.service";
import { UserNotification } from "app/models/user-notification";
import { JobService } from "app/services/job.service";
// import { UserNotification } from '/';

@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  styleUrls: ["./full-layout.component.scss"],
})
export class FullLayoutComponent implements OnInit {
  totalNotifications: number;

  // userNotification : UserNotification;

  isCollapsed: boolean;
  constructor(
    public _sharedService: SharedService,
    private _route: Router,
    private _commonService: CommonService,
    public signalr: SignalrService,
    private _jobService: JobService
  ) {}
  modules = [
    {
      generalName: "General",
      generalMenu: [
        {
          serviceCenterName: "Service Center",
          serviceCenterMenu: [
            {
              dashboard: "Dashboard",
              createNew: "Create New",
              viewAll: "View All",
              viewServiceCenter: "Service Center",
              manageWorkingHours: "Manage Working Hours",
              viewWorkingHours: "View Working Hours",
              settings: "Settings",
            },
          ],
          staffName: "Staff",
          staffMenu: [
            {
              createUser: "Create Employee",
              viewALlEmployees: "View All Employees",
            },
          ],
        },
      ],
      businessName: "Business",
      businessMenu: [
        {
          workshopName: "Workshop",
          workshopMenu: [
            {
              addCustomer: "Add Customer",
              viewAllCustomers: "View All Customers",
              addvehicle: "Add Vehicle",
              viewAllvehicle: "View All Vehicles",
              laborPricing: "Labor Pricing",
              createJob: "Create Job",
              viewAllJobs: "View All Jobs",
              jobHistory: "Job Card History",
              createContract: "Create Contract",
              techJobList: "Job List",
              generateInvoice: "Generate Invoice",
              invoiceList: "Invoice List",
            },
          ],
          partShopName: "Part Shop",
          partShopMenu: [
            {
              createVendor: "Create Vendor",
              viewAllVendor: "View All Vendors",
              createPart: "Create Part",
              viewAllPart: "View All Parts",
              searchParts: "Search Parts",
              compareParts: "Compare Parts",
              purchaseOrders: "Purchase Orders",
            },
          ],
        },
      ],
    },
  ];
  ngOnInit() {
    // $("#close-sidebar").click(function () {
    //   $(".page-wrapper").removeClass("toggled");
    //   // $(".sidebar-menu").addClass("toggle-off");
    // });

    // $("#show-sidebar").click(function () {
    //   $(".page-wrapper").addClass("toggled");
    // });1024
    if (screen.width <= 1050) {
      this.isCollapsed = false;
      this.onToggle();
    }
    this.getMetaData();
    this.signalr.initializeSignalRConnection();
    this.getAllNotifications();
    if (
      JSON.parse(localStorage.getItem("sidebarToggle")) == true &&
      screen.width > 1050
    ) {
      document.getElementById("chkTest").click();
    }
  }
  closeSidebar() {
    if (screen.width <= 1050) {
      let sidebarToggle = localStorage.getItem("sidebarToggle");
      if (sidebarToggle == "false") {
        document.getElementById("chkTest").click();
        // localStorage.setItem("sidebarToggle", "false");
      }
    }
  }
  getAllNotifications() {
    //   var x = document.getElementById("toggleNotifications").getAttribute("aria-expanded");
    // if (x == "false"){
    this._jobService
      .viewAllNotifications(
        this._sharedService.logged_user_id,
        this._sharedService.notePage
      )
      .subscribe(
        (res: any) => {
          this._sharedService._commonMeta.Notifications = res;
        },
        (error) => {}
      );
    // }
  }
  getMetaData() {
    this._commonService.getMetaData().subscribe(
      (res: any) => {
        this._sharedService._commonMeta.Cities = res.Cities;
        this._sharedService._commonMeta.ContractPlans = res.ContractPlans;
        this._sharedService._commonMeta.Countries = res.Countries;
        this._sharedService._commonMeta.JobCardCheckList = res.JobCardCheckList;
        this._sharedService._commonMeta.Makes = res.Makes;
        this._sharedService._commonMeta.ModelVariant = res.ModelVariant;
        this._sharedService._commonMeta.Models = res.Models;
        this._sharedService._commonMeta.Notification = res.Notification;
        this._sharedService._commonMeta.ObjectStatus = res.ObjectStatus;
        this._sharedService._commonMeta.ServiceContracts = res.ServiceContracts;
        this._sharedService._commonMeta.Years = res.Years;
        this._sharedService._commonMeta.objectTypes = res.objectTypes;
        this._sharedService.totalNotifications =
          res.Notification.TotalNotifications;
        this._sharedService.previousNotificationCount =
          this._sharedService._commonMeta.Notification.UnReadNotifications;
        this._sharedService._commonMeta.Workshops = res.Workshops;
        this._sharedService._commonMeta.GroupName = res.GroupName;

        if (
          this._sharedService.user != undefined &&
          this._sharedService.user.Roles != undefined &&
          this._sharedService.user.Roles[0].RoleID == 1
        ) {
          if (
            localStorage.getItem("workshopID") != undefined &&
            localStorage.getItem("workshopID") != "undefined"
          ) {
            this._sharedService.currentWorkshopID = +JSON.parse(
              localStorage.getItem("workshopID")
            );
          }
          if (
            this._sharedService.logged_user_role_id == 1 &&
            this._sharedService._commonMeta.Workshops != undefined &&
            this._sharedService._commonMeta.Workshops.length > 0
          ) {
            if (
              this._sharedService.currentWorkshopID == undefined ||
              this._sharedService.currentWorkshopID == 0 ||
              isNaN(this._sharedService.currentWorkshopID)
            ) {
              this._sharedService.currentWorkshopID =
                this._sharedService._commonMeta.Workshops[0].WorkshopID;
            }
          }
        }

        //// trigger notifications on refresh for valet
        if (
          this._sharedService._commonMeta.PendingNotifications != undefined &&
          this._sharedService._commonMeta.PendingNotifications.length > 0
        ) {
          this._sharedService._commonMeta.PendingNotifications.forEach(
            (element) => {
              var notification = new UserNotification();
              notification.JobCardID = element.JobCardID;
              notification.RecipientID = element.RecipientID;
              notification.TextData = element.TextData;
              notification.NotificationID = element.NotificationID;
              notification.IsNew = element.IsNew;
              this._sharedService.notifications.push(notification);
            }
          );
          document.getElementById("processNotificationBtn").click();
        }

        //// trigger notifications on refresh for tech
        if (
          this._sharedService._commonMeta.TechPendingNotifications !=
            undefined &&
          this._sharedService._commonMeta.TechPendingNotifications.length > 0
        ) {
          this._sharedService._commonMeta.TechPendingNotifications.forEach(
            (element) => {
              var notification = new UserNotification();
              notification.JobCardID = element.JobCardID;
              notification.RecipientID = element.RecipientID;
              notification.TextData = element.TextData;
              notification.NotificationID = element.NotificationID;
              notification.IsNew = element.IsNew;
              // var nIndex = this._sharedService.notifications.findIndex(notify=>notify.JobCardID==notification.JobCardID);
              // if(nIndex == -1)
              this._sharedService.notifications.push(notification);
            }
          );
          document.getElementById("taskNotificationBtn").click();
        }
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  onLogout() {
    localStorage.clear();
    this._sharedService.currentTab = undefined;
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    this._sharedService.user = new Employee();
    this._sharedService.token = undefined;
    this._route.navigate(["/auth/login"]);
    this._sharedService.logged_user_id = undefined;
    this._sharedService.logged_user_role = undefined;
    this._sharedService.logged_user_role_id = undefined;
    this._sharedService.currentWorkshopID = undefined;
    this.signalr.disconnect();
  }

  onChangeWorkshop() {
    localStorage.setItem(
      "currentWorkshopName",
      this._sharedService.currentWorkshopName
    );
    this._sharedService.currentWorkshopID =
      this._sharedService._commonMeta.Workshops.find(
        (item) => item.EnglishName === this._sharedService.currentWorkshopName
      ).WorkshopID;
    localStorage.setItem(
      "workshopID",
      JSON.stringify(this._sharedService.currentWorkshopID)
    );
    window.location.reload();
  }

  onToggle() {
    debugger;
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem("sidebarToggle", JSON.stringify(this.isCollapsed));
    if (this.isCollapsed == true) {
      document.getElementById("sidebar").classList.add("toggle-off");
      document
        .getElementById("page-content")
        .classList.add("sidebar-collapsed");
    } else {
      document.getElementById("sidebar").classList.remove("toggle-off");
      document
        .getElementById("page-content")
        .classList.remove("sidebar-collapsed");
    }
  }

  public collapse(event: any) {
    $(".sidebar-submenu").slideUp(200);
    if ($(event.target).parent().hasClass("active")) {
      $(".sidebar-dropdown").removeClass("active");
      $(event.target).parent().removeClass("active");
    } else if ($(event.target).parent().parent().hasClass("active")) {
      $(".sidebar-dropdown").removeClass("active");
      $(event.target).parent().parent().removeClass("active");
    } else {
      $(".sidebar-dropdown").removeClass("active");
      if ($(event.target).parent().hasClass("sidebar-dropdown")) {
        $(event.target).parent().addClass("active");
        $(event.target).next(".sidebar-submenu").slideDown(200);
      } else {
        $(event.target).parent().parent().addClass("active");
        $(event.target).parent().next(".sidebar-submenu").slideDown(200);
      }
    }
  }
}
