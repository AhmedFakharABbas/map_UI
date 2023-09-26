import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedService } from "app/services/shared.service";
import { JobService } from "app/services/job.service";
import { BasicInfo } from "app/models/basic-info";
import { NgForm } from "@angular/forms";
import { JobProcess } from "app/models/job-process";
import { BasicInfoMeta } from "app/models/basic-info-meta";
import { VehicleJobCardData } from "app/models/vehicle-job-card-data";
import { Customer } from "app/models/customer";
import { Vehicle } from "app/models/vehicle";
import { Note } from "app/models/note";
import { JobPartAlternates } from "app/models/job-part-alternates";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { InspectionResult } from "app/models/inspection-result";
import { JobPart } from "app/models/JobPart";
import { debug } from "console";
import { Gallery } from "app/models/Gallery";
import { CastExpr } from "@angular/compiler";
import { Checklist } from "app/models/checklist";
import { take } from "rxjs/operators";

@Component({
  selector: "app-create-job",
  templateUrl: "./create-job.component.html",
  styleUrls: ["./create-job.component.scss"],
})
export class CreateJobComponent implements OnInit {
  isAvailable: boolean;
  closeResult: string;
  active: true;
  activeTab = ["./basic-info", "./customer-concerns"];
  JobCardID: number;
  jp: JobProcess;
  processComplete: boolean = false;
  closeJC: boolean = true;
  activatedModalRef: NgbModalRef;
  isCarKey: boolean = false;
  vehicleID: number;
  sub: any;
  viCompleted: boolean;
  concernDescription: string;

  @ViewChild("assignQS", { static: false }) assignQSModal: ElementRef;
  @ViewChild("assignValet", { static: false }) assignValetModal: ElementRef;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private _jobService: JobService,
    public _sharedService: SharedService,
    public _router: Router
  ) {
    this.sub = this._sharedService.getAllParts.subscribe((data) => {
      debugger
      this.getAllParts(data);
    });
  }

  ngOnInit() {
    debugger;
    this.route.params.subscribe((params) => {
      this.JobCardID = +params["id"];

      if (isNaN(this.JobCardID) || this.JobCardID == undefined) {
        this.JobCardID = 0;
      }
    });
    console.log( this.JobCardID);
    // if (this._sharedService.isCreatingJob == false) {
    this._sharedService._basicInfoMeta = new BasicInfoMeta();

    this.getSingleJob();

    // }

    // else {
    //   this._sharedService.isCreatingJob = false;
    // }
    this._sharedService.createdCustomer = false;
    this._sharedService.jcVehicleMode = false;
    this._sharedService.jcCustomerMode = false;
    if (this.JobCardID >= 1) {
      this._sharedService.routesArray = [
        {
          name: "/" + "/update-job/" + this.JobCardID + "/basic-info",
          formObj: NgForm,
        },
        {
          name: "/" + "/update-job/" + this.JobCardID + "/customer-concerns",
          formObj: NgForm,
        },
        {
          name: "/" + "/update-job/" + this.JobCardID + "/inspection",
          formObj: NgForm,
        },
        {
          name: "/" + "/update-job/" + this.JobCardID + "/inspection-results",
          formObj: NgForm,
        },
        {
          name: "/" + "/update-job/" + this.JobCardID + "/part-price",
          formObj: NgForm,
        },
        {
          name: "/" + "/update-job/" + this.JobCardID + "/approval",
          formObj: NgForm,
        },
        {
          name: "/" + "/update-job/" + this.JobCardID + "/qa",
          formObj: NgForm,
        },
        {
          name: "/" + "/update-job/" + this.JobCardID + "/vehicle-history",
          formObj: NgForm,
        },
      ];
    } else {
      this._sharedService.routesArray = [
        { name: "/" + "/create-job/basic-info", formObj: NgForm },
        { name: "/" + "/create-job/customer-concerns", formObj: NgForm },
        { name: "/" + "/create-job/inspection", formObj: NgForm },
        { name: "/" + "/create-job/inspection-results", formObj: NgForm },
        { name: "/" + "/create-job/part-price", formObj: NgForm },
        { name: "/" + "/create-job/approval", formObj: NgForm },
        { name: "/" + "/create-job/qa", formObj: NgForm },
        { name: "/" + "/create-job/vehicle-history", formObj: NgForm },
      ];
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }

  getSingleJob() {
    var appointmentID;

    if (this._sharedService.appointmentData != undefined) {
      appointmentID = this._sharedService.appointmentData.AppointmentID;
    }
    this._jobService.getSingleJob(this.JobCardID, appointmentID).subscribe(
      (res: any) => {
        debugger;
        this._sharedService.jobObj = res;

 
        //to filter inspection points

        var length = this._sharedService.jobObj.JobCardCheckList.filter(
          (item) => item.CheckListTypeID == 46
        ).length;

        if (
          this._sharedService.jobObj.JobCardCheckList.filter(
            (item) => item.CheckListTypeID == 46 && item.StatusID == 33
          ).length == length
        ) {
          this._sharedService.markAll = 3;
        } else if (
          this._sharedService.jobObj.JobCardCheckList.filter(
            (item) => item.CheckListTypeID == 46 && item.StatusID == 11
          ).length == length
        ) {
          this._sharedService.markAll = 1;
        } else if (
          this._sharedService.jobObj.JobCardCheckList.filter(
            (item) => item.CheckListTypeID == 46 && item.StatusID == 12
          ).length == length
        ) {
          this._sharedService.markAll = 2;
        } else {
          this._sharedService.markAll = null;
        }

        /// assign data if card created from appointment
        if (this._sharedService.appointmentData != undefined) {
          if (this._sharedService.jobObj.JCBasicInfo == undefined) {
            this._sharedService.jobObj.JCBasicInfo = new BasicInfo();
            this._sharedService.jobObj.jcVehicleObj = new Vehicle();
          }
          this._sharedService.jobObj.AppointmentID =
            this._sharedService.appointmentData.AppointmentID;

          this._sharedService.jobObj.JCBasicInfo.MileageUnit =
            this._sharedService.appointmentData.MileageUnit;
          this._sharedService.jobObj.JCBasicInfo.Mileage =
            this._sharedService.appointmentData.Mileage;
          this._sharedService.appointmentData;
          this._sharedService.jobObj.JCBasicInfo.MileageImageURL =
            this._sharedService.appointmentData.MileageImageURL;
          this._sharedService.jobObj.jcVehicleObj.LicensePlateFront =
            this._sharedService.appointmentData.LicensePlateFront;
          this._sharedService.jobObj.jcVehicleObj.LicensePlateBack =
            this._sharedService.appointmentData.LicensePlateBack;
          this._sharedService.jobObj.jcVehicleObj.VehicleTypeID =
            res.Appointment.VehicleTypeID;
          this._sharedService.appointmentData.VehicleTypeID =
            res.Appointment.VehicleTypeID;

          if (
            this._sharedService.jobObj.Appointment.InspectionSignatureURL !=
            undefined
          ) {
            this._sharedService.jobObj.JCBasicInfo.IsVICompleted = true;
            this.viCompleted = true;
          }
          // this.pushAppointmentData(this._sharedService.appointmentData.LicensePlateBack, 107);
          this.pushAppointmentData(
            this._sharedService.appointmentData.VehicleFront,
            107
          );
          // this.pushAppointmentData(this._sharedService.appointmentData.VehicleRear, 108);
          // this.pushAppointmentData(this._sharedService.appointmentData.VehicleRight, 109);
          // this.pushAppointmentData(this._sharedService.appointmentData.VehicleLeft, 110);
          // this.pushAppointmentData(this._sharedService.appointmentData.VehicleInside, 111);
          // this.pushAppointmentData(this._sharedService.appointmentData.VehicleRoof, 112);
          // this.pushAppointmentData(this._sharedService.appointmentData.Dashboard, 113);
          // this.pushAppointmentData(this._sharedService.appointmentData.Rim1, 114);
          // this.pushAppointmentData(this._sharedService.appointmentData.Rim2, 115);
          // this.pushAppointmentData(this._sharedService.appointmentData.Rim3, 116);
          // this.pushAppointmentData(this._sharedService.appointmentData.Rim4, 117);

          this._sharedService.jobObj.Gallery.forEach((element) => {
            if (element.GalleryTypeID != 107) {
              element.GalleryTypeID = 48;
              element.IsModified = true;
            }
          });

          if (this._sharedService.appointmentData.IsValet == true) {
            if (this._sharedService.jobObj.JobProcess == undefined) {
              this._sharedService.jobObj.JobProcess = new Array<JobProcess>();
            }
            this._sharedService.jobObj.JobProcess[0].EmployeeID =
              this._sharedService.appointmentData.CreatedBy;
          }

          this._sharedService.getJobCardMetaChange.next(true);
        }
        ///////set alternate part on page reload
        if (document.getElementById("setAlternatePart") != undefined) {
          document.getElementById("setAlternatePart").click();
        }

        // if (this.JobCardID > 0) {
        ////set prices after removing tax
        // this._sharedService.jobObj.JobTasks.forEach(el => {
        //   if (el.IsInclude == true) {
        //     var taxAmount = el.NetAmount * 0.16;
        //     // this._sharedService.totalTaxAmount += taxAmount;
        //     el.NetAmount = el.NetAmount - taxAmount;
        //   }
        // });
        // var taxInternal = this._sharedService.jobObj.JCBasicInfo.InternalTasksCost * 0.16;
        // this._sharedService.jobObj.JCBasicInfo.InternalTasksCost = this._sharedService.jobObj.JCBasicInfo.InternalTasksCost - taxInternal;

        // this._sharedService.jobObj.JobParts.forEach(el => {
        //   if (el.IsInclude == true) {
        //     var taxAmount = el.NetAmount * 0.16;
        //     this._sharedService.totalTaxAmount += taxAmount;
        //     el.NetAmount = el.NetAmount - taxAmount;
        //   }
        // });
        // this._sharedService.jobObj.JCBasicInfo.Total = this._sharedService.jobObj.JCBasicInfo.TotalTasksCost + this._sharedService.jobObj.JCBasicInfo.TotalPartsPrice;
        // }

        if (this._sharedService.jobObj.jcCustomerObj == null) {
          this._sharedService.jobObj.jcCustomerObj = new Customer();
        }
        if (this._sharedService.jobObj.jcVehicleObj == null) {
          this._sharedService.jobObj.jcVehicleObj = new Vehicle();
        }
        if (this._sharedService.jobObj.Notes == undefined) {
          this._sharedService.jobObj.Notes = new Array<Note>();
        }
        if (this._sharedService.jobObj.JobPartAlternates == undefined) {
          this._sharedService.jobObj.JobPartAlternates =
            new Array<JobPartAlternates>();
        }
        if (this._sharedService.jobObj.JobInvoice == undefined) {
          this._sharedService.jobObj.JobInvoice = new BasicInfo();
        }
        this._sharedService.jobObj.JobParts.forEach((el) => {
          el.PartAlternate = new JobPartAlternates();
        });

        if (this.JobCardID > 0) {
          this._sharedService.jcCustomerMode = true;
          this._sharedService.jcVehicleMode = true;
        }
        if (!isNaN(this.JobCardID) && this.JobCardID > 0) {
          this._sharedService._basicInfoMeta = new BasicInfoMeta();
          this._sharedService._basicInfoMeta.VendorPartPrice =
            this._sharedService.jobObj.VendorPartPrice;

          // this._sharedService.jobObj.JobPartAlternates.forEach(item => {
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).BrandID = item.BrandID;
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).OrigionID = item.OrigionID;
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).UnitTypeID = item.UnitTypeID;
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).SellingPrice = item.SellingPrice;
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).PartConditionID = item.PartConditionID;
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).BrandName = item.BrandName;
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).OrigionName = item.OrigionName;
          //   this._sharedService.jobObj.JobParts.find(item2 => item2.JobPartID == item.JobPartID).UnitTypeName = item.UnitTypeName;
          // })

          // routes
          if (
            this._sharedService.user != undefined &&
            this._sharedService.user.Roles != undefined
          ) {
            this._sharedService.routesArray = new Array<any>();
            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 || +item.RoleID == 2 || +item.RoleID == 3
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/basic-info",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name:
                  "/" + "update-job/" + this.JobCardID + "/customer-concerns",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push(
                {
                  name:
                    "/" +
                    "update-job/" +
                    this.JobCardID +
                    "/inspection-results",
                  formObj: NgForm,
                }
                //   {
                //   name: "/" + "update-job/" + this.JobCardID + "/inspection",
                //   formObj: NgForm,
                // }
              );
            }
            if (
              this._sharedService.user.Roles.filter((item) => +item.RoleID == 4)
                .length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/basic-info-view",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name:
                  "/" +
                  "update-job/" +
                  this.JobCardID +
                  "/customer-concerns-view",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/inspection-view",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter((item) => +item.RoleID == 5)
                .length > 0
            ) {
              this._sharedService.routesArray.push({
                name:
                  "/" +
                  "update-job/" +
                  this.JobCardID +
                  "/customer-concerns-view",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/inspection-view",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 ||
                  +item.RoleID == 2 ||
                  +item.RoleID == 4 ||
                  +item.RoleID == 5
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name:
                  "/" + "update-job/" + this.JobCardID + "/inspection-results",
                formObj: NgForm,
              });
            }
            if (
              this._sharedService.user.Roles.filter((item) => +item.RoleID == 3)
                .length > 0
            ) {
              this._sharedService.routesArray.push(
                //   {
                //   name:
                //     "/" +
                //     "update-job/" +
                //     this.JobCardID +
                //     "/inspection-results-view",
                //   formObj: NgForm,
                // }
                {
                  name: "/" + "update-job/" + this.JobCardID + "/part-price",
                  formObj: NgForm,
                }
              );
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) => +item.RoleID == 1 || +item.RoleID == 2
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/part-price",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 || +item.RoleID == 2 || +item.RoleID == 3
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/approval",
                formObj: NgForm,
              });
            }
            if (
              this._sharedService.user.Roles.filter((item) => +item.RoleID == 4)
                .length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/approval-view",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 || +item.RoleID == 2 || +item.RoleID == 9
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/qa",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) => +item.RoleID == 3 || +item.RoleID == 4
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/qa-view",
                formObj: NgForm,
              });
            }
            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 || +item.RoleID == 2 || +item.RoleID == 4
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/vehicle-history",
                formObj: NgForm,
              });
            }
            if (
              this._sharedService.user.Roles.filter((item) => +item.RoleID == 7)
                .length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/inspection-view",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name:
                  "/" +
                  "update-job/" +
                  this.JobCardID +
                  "/inspection-results-view",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/part-price",
                formObj: NgForm,
              });
            }
            if (
              this._sharedService.user.Roles.filter((item) => +item.RoleID == 8)
                .length > 0
            ) {
              this._sharedService.routesArray.push({
                name:
                  "/" + "update-job/" + this.JobCardID + "/inspection-results",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name: "/" + "update-job/" + this.JobCardID + "/vehicle-history",
                formObj: NgForm,
              });
            }
          }
        }
        if (
          this._sharedService.jobObj.JCBasicInfo == null ||
          this.JobCardID == 0
        ) {
          this._sharedService.jobObj.JCBasicInfo = new BasicInfo();

          // routes
          if (
            this._sharedService.user != undefined &&
            this._sharedService.user.Roles != undefined
          ) {
            this._sharedService.routesArray = new Array<any>();
            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 ||
                  +item.RoleID == 2 ||
                  +item.RoleID == 3 ||
                  +item.RoleID == 4 ||
                  +item.RoleID == 5 ||
                  +item.RoleID == 6
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "create-job/basic-info",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name: "/" + "create-job/customer-concerns",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 ||
                  +item.RoleID == 2 ||
                  +item.RoleID == 3 ||
                  +item.RoleID == 4 ||
                  +item.RoleID == 5
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "create-job/inspection",
                formObj: NgForm,
              });
              this._sharedService.routesArray.push({
                name: "/" + "create-job/inspection-results",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 ||
                  +item.RoleID == 2 ||
                  +item.RoleID == 3 ||
                  +item.RoleID == 4
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "create-job/approval",
                formObj: NgForm,
              });
            }

            if (
              this._sharedService.user.Roles.filter(
                (item) =>
                  +item.RoleID == 1 ||
                  +item.RoleID == 2 ||
                  +item.RoleID == 3 ||
                  +item.RoleID == 8
              ).length > 0
            ) {
              this._sharedService.routesArray.push({
                name: "/" + "create-job/qa",
                formObj: NgForm,
              });
            }
          }
        }

        if (
          this._sharedService.routesArray != undefined &&
          this._sharedService.routesArray.length > 0
        ) {
          this._sharedService.currentRouteIndex =
            this._sharedService.routesArray.findIndex(
              (item) => item.name == this._router.url
            );
        }
        if (this._sharedService.logged_user_role_id == 3) {
          this._sharedService.jobObj.JCBasicInfo.AdvisorID =
            +this._sharedService.logged_user_id;
        }
        this._sharedService.jobObj.JobParts.forEach((el) => {
          el.PartAlternate.UnitTypeID =
            this._sharedService.jobObj.JobParts.find(
              (item) => item.JobPartID == el.JobPartID
            ).UnitTypeID;
        });
        //to calculate the 16% of parts  tax
if(this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount!=undefined){
  this._sharedService.jobObj.JCBasicInfo.TotalPartsTaxAmount=this._sharedService.jobObj.JCBasicInfo.TotalPartsNetAmount*.16
  }
  //to calculate the 16% of labour  tax
  if(this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost!=undefined|| this._sharedService.jobObj.JCBasicInfo.InternalTasksCost !=
    undefined){
      let totalCost = this._sharedService.jobObj.JCBasicInfo.InternalTasksCost +this._sharedService.jobObj.JCBasicInfo.ExternalTasksCost;
      
    this._sharedService.jobObj.JCBasicInfo.TaskTaxAmount=totalCost*.16
    }
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  onSaveJobCard() {
    debugger;
    if (this._sharedService.jobObj.Appointment != undefined) {
      if (
        this._sharedService.jobObj.Appointment.InspectionSignatureURL !=
        undefined
      ) {
        this._sharedService.jobObj.JCBasicInfo.IsVICompleted = true;
      }
    }

    // if(this._sharedService.jobObj.JCBasicInfo.ServiceTypeID === 140){
    //   this._sharedService.jobObj.JCBasicInfo.IsIRCompleted = true;
    //   this._sharedService.jobObj.JCBasicInfo.IsVICompleted = true;
    // }

    console.log(this._sharedService.jobObj.JCBasicInfo.IsVICompleted);

    if (this.activatedModalRef != undefined) {
      this.activatedModalRef.close();
    }
    this._sharedService.jobObj.JCBasicInfo.CustomerID =
      this._sharedService.jobObj.jcCustomerObj.CustomerID;
    this._sharedService.jobObj.JCBasicInfo.VehicleID =
      this._sharedService.jobObj.jcVehicleObj.VehicleID;

    if (
      this._sharedService.jobObj.jcVehicleObj.VehicleID != undefined &&
      this._sharedService.jobObj.jcCustomerObj.CustomerID != undefined
    ) {
      this._sharedService.jobObj.JCBasicInfo.CreatedBy =
        this._sharedService.logged_user_id;
      this._sharedService.jobObj.JCBasicInfo.WorkshopID =
        this._sharedService.currentWorkshopID;
      this._sharedService.jobObj.JCBasicInfo.UserRoleID =
        this._sharedService.logged_user_role_id;

      ////set job card id for appointment images data
      if (this._sharedService.appointmentData != undefined) {
        var imgs = this._sharedService.jobObj.Gallery.filter(
          (i) => i.ObjectID == 1122
        );
        if (imgs.length > 0) {
          imgs.forEach((element) => {
            element.ObjectID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
          });
        }
        this._sharedService.jobObj.JCBasicInfo.AppointmentID =
          this._sharedService.appointmentData.AppointmentID;
      }
      this._jobService.saveJob().subscribe(
        (res) => {
          debugger
          this._sharedService.jobObj.JCBasicInfo.JobCardID = res.jobCardID;
          this._sharedService.appointmentData = undefined;
          this._sharedService.success("Success", "Job card Created");
          this._sharedService.jcCustomerMode = false;
          this._sharedService.jcVehicleMode = false;
          if (this._sharedService.logged_user_role_id == 6) {
            this._router.navigate(["/", "update-job", res, "inspection"]);
          } else {
            this._router.navigate(["/", "job", "list"]);
          }
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      if (this._sharedService.jobObj.jcCustomerObj.CustomerID == undefined) {
        this._sharedService.warning(
          "Error",
          "Cannot save Job Card without Customer"
        );
      }
      // else if (this._sharedService.jobObj.JCBasicInfo.Mileage == undefined) {
      //   this._sharedService.error('Error', 'Cannot save Job Card without Mileage');
      // }
      else {
        this._sharedService.warning(
          "Error",
          "Cannot save Job Card without Vehicle"
        );
      }
    }
  }

  getAllParts(getAll?: boolean) {
    debugger
    if (
      this._sharedService.AutomotiveParts == undefined ||
      this._sharedService.AutomotiveParts.length == 0 ||
      getAll == true
    ) {
      this._jobService.getAllParts().subscribe(
        (res: any) => {
          this._sharedService.AutomotiveParts = res.AutomotiveParts;
          this._sharedService.VendorPartPrices = res.VendorPartPrices;
          this._sharedService.PartVendors = res.PartVendors;
          this._sharedService.partsList = this._sharedService.AutomotiveParts;
          this._sharedService.partsListBuffer =
            this._sharedService.partsList.slice(
              0,
              this._sharedService.bufferSize
            );
        },
        (error) => {
          console.log("error", error);
        }
      );
    }
  }

  onUpdateJob() {
    //this._sharedService.jobObj.JCBasicInfo.Tax = this._sharedService.totalTaxAmount;
    var checkPart =
      this._sharedService.jobObj.JobParts == undefined
        ? null
        : this._sharedService.jobObj.JobParts.filter(
            (item) => item.Quantity != 0
          );
    var p =
      this._sharedService.jobObj.JobParts == undefined
        ? null
        : this._sharedService.jobObj.JobParts.filter(
            (item) =>
              item.IsInclude == true &&
              (item.JobPartAlternateID == null ||
                item.JobPartAlternateID == undefined)
          );
    // && (p.length > 0 ? (this._sharedService.jobObj.JCBasicInfo.ApprovalSignatureURL == undefined || this._sharedService.jobObj.JCBasicInfo.ApprovalSignatureURL == null) ? true : false : true)
    if (
      checkPart == null ||
      (checkPart.length == this._sharedService.jobObj.JobParts.length &&
        this._sharedService.jobObj.JobConcerns.length > 0)
    ) {
      this._sharedService.jobObj.JCBasicInfo.ModifiedBy =
        this._sharedService.logged_user_id;
      this._jobService.updateJob(this._sharedService.jobObj).subscribe(
        (res: any) => {
          if (this.closeJC == true) {
            if (
              this._sharedService.logged_user_role_id == 5 ||
              this._sharedService.logged_user_role_id == 6 ||
              this._sharedService.logged_user_role_id == 7 ||
              this._sharedService.logged_user_role_id == 8 ||
              this._sharedService.logged_user_role_id == 9
            ) {
              this._router.navigate(["/job/job-list"]);
            } else {
              this._router.navigate(["/", "job", "list"]);
            }
          }
          this.closeJC = false;
          this._sharedService.success("Success", "Job card updated");

          this._sharedService.jobObj.JobConcerns = res.JobConcerns;
          this._sharedService.jobObj.JobTasks = res.JobTasks;
          this._sharedService.jobObj.JobParts = res.JobParts;
          this._sharedService.jobObj.JobPartAlternates = res.JobPartAlternates;
          this._sharedService.jobObj.JobParts =
            this._sharedService.jobObj.JobParts == undefined
              ? new Array<JobPart>()
              : this._sharedService.jobObj.JobParts;

          this._sharedService.jobObj.JobParts.forEach((el) => {
            el.PartAlternate = new JobPartAlternates();
          });
          // this._sharedService.jobObj.Gallery = res.Gallery;
          if (this._sharedService.jobObj.JobProcess != undefined)
            this._sharedService.jobObj.JobProcess.forEach(function (
              obj,
              index
            ) {
              this[index].IsModified = false;
            },
            this._sharedService.jobObj.JobProcess);

          if (this._sharedService.jobObj.JobCardCheckList != undefined)
            this._sharedService.jobObj.JobCardCheckList.forEach(function (
              obj,
              index
            ) {
              this[index].IsModified = false;
            },
            this._sharedService.jobObj.JobCardCheckList);

          if (this._sharedService.jobObj.JobPartPricing != undefined)
            this._sharedService.jobObj.JobPartPricing.forEach(function (
              obj,
              index
            ) {
              this[index].IsModified = false;
            },
            this._sharedService.jobObj.JobPartPricing);

          if (this._sharedService.jobObj.Notes != undefined)
            this._sharedService.jobObj.Notes.forEach(function (obj, index) {
              this[index].IsModified = false;
            }, this._sharedService.jobObj.Notes);

          if (this._sharedService.jobObj.JobPartAlternates != undefined)
            this._sharedService.jobObj.JobPartAlternates.forEach(function (
              obj,
              index
            ) {
              this[index].IsModified = false;
            },
            this._sharedService.jobObj.JobPartAlternates);

          if (this._sharedService.logged_user_role_id == 3) {
            this._router.navigate([
              "/",
              "update-job",
              this._sharedService.jobObj.JCBasicInfo.JobCardID,
              "take-approval",
            ]);
          }
          // jobObj.JobCardCheckList = this._sharedService.jobObj.JobCardCheckList.filter(item => item.IsModified == true);
          // jobObj.JobProcess = this._sharedService.jobObj.JobProcess.filter(item => item.IsModified == true);
          // jobObj.JobPartPricing = this._sharedService.jobObj.JobPartPricing.filter(item => item.IsModified == true);
          // jobObj.Notes = this._sharedService.jobObj.Notes.filter(item => item.IsModified == true);
          // jobObj.Gallery = this._sharedService.jobObj.Gallery.filter(item => item.IsModified == true);
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      if (this._sharedService.jobObj.JobConcerns.length == 0) {
        this._sharedService.warning(
          "Error",
          "Cannot update Job Card without any concern!"
        );
      } else if (
        checkPart.length != this._sharedService.jobObj.JobParts.length
      ) {
        this._sharedService.warning("Error", "Please enter part quantity.");
      }
      // else {
      //   this._sharedService.error('Error', 'Please select manufacturer of selected part!');
      // }
    }
  }

  goToNextPage() {
    debugger;
    if (
      this._sharedService.currentRouteIndex >= 1 &&
      this._sharedService.jobObj.JCBasicInfo.JobCardID == undefined
    ) {
      this._sharedService.warning(
        "Warning",
        "Cannot move to Job Inspection without creating Job Card!"
      );
    } else {
      this._sharedService.currentRouteIndex++;
      console.log(this._sharedService.routesArray);
      this._router.navigate([
        this._sharedService.routesArray[this._sharedService.currentRouteIndex]
          .name,
      ]);
    }
  }

  goToPreviousPage() {
    this._sharedService.currentRouteIndex--;
    this._router.navigate([
      this._sharedService.routesArray[this._sharedService.currentRouteIndex]
        .name,
    ]);
  }

  assignModal(modal: any) {
    if (
      this._sharedService.logged_user_role_id == 6 ||
      this._sharedService.jobObj.JobConcerns.length > 0
    ) {
      this.activatedModalRef = this.modalService.open(modal);
    } else {
      this._sharedService.warning(
        "Error",
        "Cannot save Job Card without any concern!"
      );
    }
  }

  closeModal() {
    this.activatedModalRef.close();
  }

  assignTo() {
    debugger;
    if (this._sharedService.jobObj.JCBasicInfo.ServiceTypeID === 140) {
      if (
        this._sharedService.jobObj.UserRoles.filter(
          (item) => item.RoleID == 8 && item.TechnicianTypeID == 146
        ).length > 1
      ) {
        this.assignModal(this.assignQSModal);
      } else {
        this.onSaveJobCard();
      }
    } else {
      this.assignModal(this.assignValetModal);
    }
  }

  ContractDetailsModal(modal: any) {
    ///get contract consumption data here and map accordingly
    this.vehicleID = this._sharedService.jobObj.jcVehicleObj.VehicleID;
    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      windowClass: "modalTop",
    });
  }

  closeContractDetailsModal(event?: any) {
    this.activatedModalRef.close();
  }

  checkAlternates() {
    var jp = new Array<JobPart>();
    // this._sharedService.jobObj.JobParts.forEach(element => {
    //   if (this._sharedService.jobObj.JobPartAlternates.filter(i => i.JobPartID == element.JobPartID).length == 0) {
    //     jp.push(element);
    //   }
    // });
    this._sharedService.jobObj.JobParts.forEach((element) => {
      if (
        this._sharedService.jobObj.JobPartAlternates.filter(
          (i) => i.JobPartID == element.JobPartID
        ).length == 0 &&
        element.IsAvailable == true
      ) {
        jp.push(element);
      }
    });
    if (jp.length > 0) {
      var tmp = "";
      jp.forEach((element) => {
        tmp = tmp + element.PartNameArabic + " , ";
      });
      var verb = jp.length == 1 ? " is" : "s are";
      this._sharedService.warning(
        "Warning",
        tmp.slice(0, tmp.length - 2) + " price" + verb + " missing."
      );
    } else {
      this._sharedService.partAvailable = false;
      this._sharedService.completePartsPricing.next(true);
    }
    this._router.navigate(["/job/job-list"]);
  }

  pushAppointmentData(imgURL: string, galleryTypeID: number) {
    var imageObj = new Gallery();
    imageObj.GalleryID = Math.floor(Math.random() * -10000);
    imageObj.ImageURL = imgURL;
    imageObj.GalleryTypeID = galleryTypeID;
    imageObj.ObjectID = 1122; //change on save call
    imageObj.IsModified = true;
    this._sharedService.jobObj.Gallery.push(imageObj);
  }

  onChangeVICompleted() {
    if (this.viCompleted == true) {
      this._sharedService.jobObj.JCBasicInfo.IsVICompleted = false;
      this.viCompleted = false;
    } else {
      this._sharedService.jobObj.JCBasicInfo.IsVICompleted = true;
      this.viCompleted = true;
    }
    console.log(
      this._sharedService.jobObj.JCBasicInfo.IsVICompleted,
      this.viCompleted
    );
  }
}
