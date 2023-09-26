import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { VehicleService } from "app/services/vehicle.service";
import { SharedService } from "app/services/shared.service";
import { GetCustomerVehicle } from "app/models/get-customer-vehicle";
import { JobService } from "app/services/job.service";
import { ImageCompressService, ResizeOptions } from "ng2-image-compress";
import { CommonService } from "app/services/common.service";
import { Vehicle } from "app/models/vehicle";
import { CreateVehicle } from "app/models/create-vehicle";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { element } from "protractor";
import { timingSafeEqual } from "crypto";
import { GeneralVehicle } from "app/models/general-vehicle";
import { GeneralVehicles } from "app/models/general-vehicles";
import * as internal from "assert";
import { runInThisContext } from "vm";

@Component({
  selector: "app-jc-create-vehicle",
  templateUrl: "./jc-create-vehicle.component.html",
  styleUrls: ["./jc-create-vehicle.component.scss"],
})
export class JcCreateVehicleComponent implements OnInit {
  _custMeta: GetCustomerVehicle;
  createVehicle: CreateVehicle;
  modalHeader: string;
  imageURL: string;
  activatedModalRef: NgbModalRef;
  SeriesYear: number;
  SeriesMake: string;
  SeriesModel: string;
  generalVehicle: GeneralVehicles;
  ObjectTypeID: number;
  groupName: string = null;
  MinYear: number;
  MaxYear: number;
  ModelName: string;
  modelGroupName: string;
  groupnameCount: number;
  ShowMoreBodyType: boolean = false;
  isValid: boolean = true;


  // selectedValue:string = " ";
  constructor(
    private _vehicleService: VehicleService,
    public _sharedService: SharedService,
    public _jobService: JobService,
    private _commonService: CommonService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.generalVehicle = new GeneralVehicles();
  }

  ngOnInit() {
    debugger;
    this.createVehicle = new CreateVehicle();
    this.createVehicle.vehicleObj.LicensePlateFront =
      this._sharedService.jobObj.jcVehicleObj.LicensePlateFront;
    this._custMeta = new GetCustomerVehicle();
  }

  onSaveVehicle() {
    debugger;
    if (this._sharedService.jobObj.jcCustomerObj.CustomerID != undefined) {
      this._sharedService.jobObj.jcVehicleObj.CustomerID =
        this._sharedService.jobObj.jcCustomerObj.CustomerID;
      this._sharedService.jobObj.jcVehicleObj.WorkshopID =
        this._sharedService.currentWorkshopID;
      this._sharedService.jobObj.jcVehicleObj.CreatedBy =
        this._sharedService.logged_user_id;
      this.createVehicle.vehicleObj = this._sharedService.jobObj.jcVehicleObj;
      this.createVehicle.vehicleObj.EnglishMakeName =
        this._sharedService._commonMeta.Makes.find(
          (item) =>
            item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID
        ).EnglishMakeName;
      this.createVehicle.vehicleObj.ArabicMakeName =
        this._sharedService._commonMeta.Makes.find(
          (item) =>
            item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID
        ).ArabicMakeName;
      this.createVehicle.vehicleObj.EnglishModelName =
        this._sharedService._commonMeta.Models.find(
          (item) =>
            item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
        ).EnglishModelName;
      this.createVehicle.vehicleObj.ArabicModelName =
        this._sharedService._commonMeta.Models.find(
          (item) =>
            item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
        ).ArabicModelName;
      this.createVehicle.vehicleObj.EngineCode =
        this._sharedService.jobObj.jcVehicleObj.EngineCode;

      this.createVehicle.vehicleObj.VehicleTypeName =
        this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectTypeID ==
            this._sharedService.jobObj.jcVehicleObj.VehicleTypeID
        ).TypeNameEnglish;

        debugger
      //   if(this.generalVehicle.GeneralVehicles != undefined){
      // this.createVehicle.vehicleObj.SeriesID =
      //   this.generalVehicle.GeneralVehicles.find(
      //     (item) =>
      //       item.EnglishMakeName ==
      //       this._sharedService.jobObj.jcVehicleObj.EnglishMakeName &&
      //       item.EnglishModelName == this._sharedService.jobObj.jcVehicleObj.EnglishModelName
      //   ).SerialNumber;
      //   }
 
      this.createVehicle.vehicleObj.EngineTypeName =
        this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "Engine" &&
            item.ObjectTypeID ==
              this._sharedService.jobObj.jcVehicleObj.EngineTypeID
        ).TypeNameEnglish;

      this._vehicleService.saveVehicle(this.createVehicle).subscribe(
        (res) => {
          this._sharedService.success("Success", "Vehicle saved successfully");

          this._sharedService.jobObj.jcVehicleObj = res;
          this._sharedService.jobObj.JCBasicInfo.VehicleID =
            this._sharedService.jobObj.jcVehicleObj.VehicleID;
          this._sharedService.jcVehicleMode = true;
          if (this._sharedService.jobObj.jcVehicleList == undefined) {
            this._sharedService.jobObj.jcVehicleList = new Array<Vehicle>();
          }
          this._sharedService.jobObj.jcVehicleList.push(
            this._sharedService.jobObj.jcVehicleObj
          );
          this._sharedService.selectedPlateNum =
            this._sharedService.jobObj.jcVehicleObj.PlateNumber;
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    }

     else {
      this._sharedService.error(
        "Error",
        "Cannot save vehicle without customer!"
      );
    }
  }

  onUpdateVehicle() {
    debugger
    this._sharedService.jobObj.jcVehicleObj.ModifiedBy =
      this._sharedService.logged_user_id;
    this.createVehicle.vehicleObj = this._sharedService.jobObj.jcVehicleObj;
    this._vehicleService.updateVehicle(this.createVehicle).subscribe(
      (res) => {
        this._sharedService.success("Success", "Vehicle updated successfully");
        this._sharedService.jobObj.jcVehicleObj.SeriesID = res;
        this._sharedService.jcVehicleMode = true;
        this._sharedService.jobObj.jcVehicleObj.EnglishMakeName =
          this._sharedService._commonMeta.Makes.find(
            (item) =>
              item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID
          ).EnglishMakeName;
        this._sharedService.jobObj.jcVehicleObj.EnglishModelName =
          this._sharedService._commonMeta.Models.find(
            (item) =>
              item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
          ).EnglishModelName;
        this._sharedService.jobObj.jcVehicleObj.EngineTypeName =
          this._sharedService._commonMeta.objectTypes.find(
            (item) =>
              item.ObjectTypeID ==
              this._sharedService.jobObj.jcVehicleObj.EngineTypeID
          ).TypeNameEnglish;
        this._sharedService.jobObj.jcVehicleObj.VehicleTypeName =
          this._sharedService._commonMeta.objectTypes.find(
            (item) =>
              item.ObjectTypeID ==
              this._sharedService.jobObj.jcVehicleObj.VehicleTypeID
          ).TypeNameEnglish;
        this._sharedService.jobObj.jcVehicleObj.ColorCode =
          this._sharedService.jobObj.Colors.find(
            (item) =>
              item.ColorID == this._sharedService.jobObj.jcVehicleObj.ColorID
          ).ColorCode;

      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  uploadImage(fileInput: any, imageType: number) {
    if (this._sharedService.validateFile(fileInput.target.files[0].name)) {
      var option: ResizeOptions = new ResizeOptions();
      option.Resize_Quality = 80;
      option.Resize_Type = "image/jpg";
      ImageCompressService.filesToCompressedImageSourceEx(
        fileInput.target.files,
        option
      ).then((observableImages) => {
        observableImages.subscribe(
          (image) => {
            // images.push(image);
            this._commonService
              .saveImage(image.imageDataUrl)
              .subscribe((res: any) => {
                this._sharedService.uploadPercentage = 100;
                if (imageType == 1) {
                  this._sharedService.jobObj.jcVehicleObj.LicensePlateFront =
                    res;
                } else {
                  this._sharedService.jobObj.jcVehicleObj.LicensePlateBack =
                    res;
                }
              });
          },
          (error) => {
            console.log("Error while converting");
          }
        );
      });
    } else {
      this._sharedService.warning(
        "Warning",
        "Only png and jpeg formats are allowed"
      );
    }
  }

  mapRegion(MakeID: number) {
    if (this._sharedService.jobObj.jcVehicleObj.MakeID != undefined)
      this._sharedService.jobObj.jcVehicleObj.VehicleRegionID =
        this._sharedService._commonMeta.Makes.find(
          (item) => item.MakeID == MakeID
        ).RegionTypeID;
  }

  checkVehicle(plateNumber: any, CustomerID: number, vin: any) {
    this._vehicleService
      .checkVehicle(
        plateNumber,
        CustomerID,
        this._sharedService.currentWorkshopID,
        vin,
        this.createVehicle.vehicleObj.VehicleID
      )
      .subscribe(
        (res) => {},
        (error) => {
          this._sharedService.warning("Error", error.Message);
          if (error.Message == "Same Plate Number already exists.") {
            this._sharedService.jobObj.jcVehicleObj.PlateNumber = undefined;
          } else if (error.Message == "Same VIN already registered.") {
            this._sharedService.jobObj.jcVehicleObj.VIN = undefined;
          }
        }
      );
  }

  previewImage(modal: any, header: string, url: string) {
    let imageurl = this._sharedService.jobObj.jcVehicleObj.LicensePlateFront
      ? this._sharedService.baseUrl +
        this._sharedService.jobObj.jcVehicleObj.LicensePlateFront
      : this._sharedService.default_img;

    if (imageurl != "/assets/img/no-image1.jpg") {
      this.modalHeader = header;
      if (url == "VehicleFront") {
        var data = this._sharedService.jobObj.Gallery.find(
          (i) => i.GalleryTypeID == 107
        );
        if (data != undefined) {
          this.imageURL = data.ImageURL;
        }
      } else {
        this.imageURL = url;
      }
      // this.activatedModalRef = this.modalService.open(modal);
      this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    }
  }

  checkCardType() {
    console.log("faceLift", this.createVehicle.faceLift);
  }

  selectCylinderType(ObjectTypeID: any) {
    if (this._sharedService.jobObj.jcVehicleObj.EngineCapacity != undefined) {
      if (this._sharedService.jobObj.jcVehicleObj.EngineCapacity < 1400) {
        var cylinderType = this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "CylinderCount" &&
            item.TypeNameEnglish == "3 Cylinder"
        );
        this._sharedService.jobObj.jcVehicleObj.CylinderTypeID =
          cylinderType.ObjectTypeID;
      } else if (
        this._sharedService.jobObj.jcVehicleObj.EngineCapacity >= 1400 &&
        this._sharedService.jobObj.jcVehicleObj.EngineCapacity < 2500
      ) {
        var cylinderType = this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "CylinderCount" &&
            item.TypeNameEnglish == "4 Cylinder"
        );
        this._sharedService.jobObj.jcVehicleObj.CylinderTypeID =
          cylinderType.ObjectTypeID;
      } else if (
        this._sharedService.jobObj.jcVehicleObj.EngineCapacity >= 2500 &&
        this._sharedService.jobObj.jcVehicleObj.EngineCapacity <= 3500
      ) {
        var cylinderType = this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "CylinderCount" &&
            item.TypeNameEnglish == "6 Cylinder"
        );
        this._sharedService.jobObj.jcVehicleObj.CylinderTypeID =
          cylinderType.ObjectTypeID;
      } else if (
        this._sharedService.jobObj.jcVehicleObj.EngineCapacity >= 4200
      ) {
        if (ObjectTypeID == undefined) {
          var cylinderType = this._sharedService._commonMeta.objectTypes.find(
            (item) =>
              item.ObjectNameEnglish == "CylinderCount" &&
              item.TypeNameEnglish == "8 Cylinder"
          );
          this._sharedService.jobObj.jcVehicleObj.CylinderTypeID =
            cylinderType.ObjectTypeID;
        } else if (ObjectTypeID != undefined) {
          var cylinderType = this._sharedService._commonMeta.objectTypes.find(
            (item) =>
              item.ObjectNameEnglish == "CylinderCount" &&
              ((item.ObjectTypeID == ObjectTypeID && ObjectTypeID == 80) ||
                (item.ObjectTypeID == ObjectTypeID && ObjectTypeID == 81) ||
                (item.ObjectTypeID == ObjectTypeID && ObjectTypeID == 82))
          );

          if (cylinderType != undefined) {
            cylinderType.IsSelected = true;
            (<HTMLInputElement>(
              document.getElementById(cylinderType.TypeNameEnglish)
            )).checked = true;
            this._sharedService._commonMeta.objectTypes
              .filter(
                (item) =>
                  item.ObjectNameEnglish == "CylinderCount" &&
                  cylinderType.ObjectTypeID != item.ObjectTypeID
              )
              .forEach((element) => {
                element.IsSelected = false;
                (<HTMLInputElement>(
                  document.getElementById(element.TypeNameEnglish)
                )).checked = false;
              });
          } else {
            var cylinderType = this._sharedService._commonMeta.objectTypes.find(
              (item) =>
                item.ObjectNameEnglish == "CylinderCount" &&
                item.IsSelected == true
            );
            cylinderType.IsSelected = true;
            (<HTMLInputElement>(
              document.getElementById(cylinderType.TypeNameEnglish)
            )).checked = true;

            this._sharedService._commonMeta.objectTypes
              .filter(
                (item) =>
                  item.ObjectNameEnglish == "CylinderCount" &&
                  cylinderType.ObjectTypeID != item.ObjectTypeID
              )
              .forEach((element) => {
                element.IsSelected = false;

                (<HTMLInputElement>(
                  document.getElementById(element.TypeNameEnglish)
                )).checked = false;
              });
          }
        }
      }

      cylinderType.IsSelected = true;

      (<HTMLInputElement>(
        document.getElementById(cylinderType.TypeNameEnglish)
      )).checked = true;

      this._sharedService._commonMeta.objectTypes
        .filter(
          (item) =>
            item.ObjectNameEnglish == "CylinderCount" &&
            cylinderType.ObjectTypeID != item.ObjectTypeID
        )
        .forEach((element) => {
          element.IsSelected = false;

          (<HTMLInputElement>(
            document.getElementById(element.TypeNameEnglish)
          )).checked = false;
        });
    }
  }
  resetCylinderType(ObjectTypeID: any) {
    var cylinderType = this._sharedService._commonMeta.objectTypes.find(
      (item) =>
        item.ObjectNameEnglish == "CylinderCount" &&
        item.ObjectTypeID == ObjectTypeID
    );
    cylinderType.IsSelected = true;
    (<HTMLInputElement>(
      document.getElementById(cylinderType.TypeNameEnglish)
    )).checked = true;

    this._sharedService._commonMeta.objectTypes
      .filter(
        (item) =>
          item.ObjectNameEnglish == "CylinderCount" &&
          cylinderType.ObjectTypeID != item.ObjectTypeID
      )
      .forEach((element) => {
        element.IsSelected = false;

        (<HTMLInputElement>(
          document.getElementById(element.TypeNameEnglish)
        )).checked = false;
      });
  }

  getSeries() {
    debugger;

    this.SeriesMake = this._sharedService._commonMeta.Makes.find(
      (item) => item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID
    ).EnglishMakeName;
    this.SeriesModel = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
    ).EnglishModelName;
    this.SeriesYear = this._sharedService.jobObj.jcVehicleObj.ProductionYear;

    if (
    this.groupnameCount > 0
    ) {
      this.groupName = this._sharedService.jobObj.jcVehicleObj.GroupName;
    } else {
      this.groupName = null;
    }

    if (
      this._sharedService.jobObj.jcVehicleObj.MakeID != undefined &&
      this._sharedService.jobObj.jcVehicleObj.ModelID &&
      this._sharedService.jobObj.jcVehicleObj.ProductionYear
    ) {
      this._jobService
        .getVehicleSeries(
          this.SeriesMake,
          this.SeriesModel,
          this.SeriesYear,
          this.groupName
        )
        .subscribe(
          (res: any) => {
            debugger;
            this.generalVehicle = new GeneralVehicles();

            this.generalVehicle = res;

            if (this.generalVehicle == null) {
              this.generalVehicle = new GeneralVehicles();
            } else {
              this._sharedService.jobObj.jcVehicleObj.VehicleTypeID =
                this._sharedService._commonMeta.objectTypes.find(
                  (item) =>
                    item.ObjectNameEnglish == "Body" &&
                    item.TypeNameEnglish.toLowerCase() ==
                      this.generalVehicle.GeneralVehicles[0].BodyType.toLowerCase()
                ).ObjectTypeID;
              //this._sharedService.jobObj.jcVehicleObj.EngineTypeID =
let EngineTypeID=
                this._sharedService._commonMeta.objectTypes.find(
                  (item) =>
                    item.ObjectNameEnglish == "Engine" &&
                    item.TypeNameEnglish ==
                      this.generalVehicle.GeneralVehicles[0].FuelType1
                );
                if(EngineTypeID!=undefined){
                  this._sharedService.jobObj.jcVehicleObj.EngineTypeID =EngineTypeID.ObjectTypeID;
                }
              
              if (
                this.generalVehicle.GeneralVehicles[0].face_lift != undefined
              ) {
                if (this.generalVehicle.GeneralVehicles[0].face_lift == true) {
                  this._sharedService.jobObj.jcVehicleObj.FaceLiftTypeID = 148;
                } else if (
                  this.generalVehicle.GeneralVehicles[0].face_lift == false
                ) {
                  this._sharedService.jobObj.jcVehicleObj.FaceLiftTypeID = 149;
                }
              }
              // var test = this.generalVehicle.GeneralVehicles[0].face_lift.toString();
              // this.createVehicle.vehicleObj.FaceLiftTypeID  = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectNameEnglish == "FaceLift" && item.TypeNameEnglish == test).ObjectTypeID;
            }
          },
          (error) => {}
        );
      // this._jobService
      //   .getVehicleSeries(
      //     this.SeriesMake,
      //     this.SeriesModel,
      //     this.SeriesYear,
      //     this.groupName
      //   )
      //   .subscribe((res: any) => {
      //     debugger;
      //     this.generalVehicle = res;
      //     if (this.generalVehicle == null) {
      //       this.generalVehicle = new GeneralVehicles();
      //     } else {
      //       this.createVehicle.vehicleObj.VehicleTypeID =
      //         this._sharedService._commonMeta.objectTypes.find(
      //           (item) =>
      //             item.ObjectNameEnglish == "Body" &&
      //             item.TypeNameEnglish ==
      //               this.generalVehicle.GeneralVehicles[0].BodyType
      //         ).ObjectTypeID;
      //       this.createVehicle.vehicleObj.EngineTypeID =
      //         this._sharedService._commonMeta.objectTypes.find(
      //           (item) =>
      //             item.ObjectNameEnglish == "Engine" &&
      //             item.TypeNameEnglish ==
      //               this.generalVehicle.GeneralVehicles[0].FuelType1
      //         ).ObjectTypeID;
      //       this.createVehicle.vehicleObj.FaceLiftTypeID;
      //       if (
      //         this.generalVehicle.GeneralVehicles[0].face_lift != undefined
      //       ) {
      //         if (this.generalVehicle.GeneralVehicles[0].face_lift == true) {
      //           this.createVehicle.vehicleObj.FaceLiftTypeID = 148;
      //         } else if (
      //           this.generalVehicle.GeneralVehicles[0].face_lift == false
      //         ) {
      //           this.createVehicle.vehicleObj.FaceLiftTypeID = 149;
      //         }
      //       }
      //       // var test = this.generalVehicle.GeneralVehicles[0].face_lift.toString();
      //       // this.createVehicle.vehicleObj.FaceLiftTypeID  = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectNameEnglish == "FaceLift" && item.TypeNameEnglish == test).ObjectTypeID;
      //     }

      //     // if (this.generalVehicle == null) {
      //     //   this.generalVehicle = new GeneralVehicles();

      //     //   if (
      //     //     this._sharedService.jobObj.jcVehicleObj.MakeID != undefined &&
      //     //     this._sharedService.jobObj.jcVehicleObj.ModelID &&
      //     //     this._sharedService.jobObj.jcVehicleObj.ProductionYear
      //     //   ) {
      //     //     debugger;
      //     //     this._jobService
      //     //       .getVehicleSeries(
      //     //         this.SeriesMake,
      //     //         this.SeriesModel,
      //     //         this.SeriesYear,
      //     //         this.groupName
      //     //       )
      //     //       .subscribe(
      //     //         (res: any) => {
      //     //           debugger;
      //     //           this.generalVehicle = res;

      //     //           if (this.generalVehicle == null) {
      //     //             this.generalVehicle = new GeneralVehicles();
      //     //           } else {
      //     //             this._sharedService.jobObj.jcVehicleObj.VehicleTypeID =
      //     //               this._sharedService._commonMeta.objectTypes.find(
      //     //                 (item) =>
      //     //                   item.ObjectNameEnglish == "Body" &&
      //     //                   item.TypeNameEnglish ==
      //     //                     this.generalVehicle.GeneralVehicles[0].BodyType
      //     //               ).ObjectTypeID;
      //     //             this._sharedService.jobObj.jcVehicleObj.EngineTypeID =
      //     //               this._sharedService._commonMeta.objectTypes.find(
      //     //                 (item) =>
      //     //                   item.ObjectNameEnglish == "Engine" &&
      //     //                   item.TypeNameEnglish ==
      //     //                     this.generalVehicle.GeneralVehicles[0].FuelType1
      //     //               ).ObjectTypeID;
      //     //             var test =
      //     //               this.generalVehicle.GeneralVehicles[0].face_lift.toString();
      //     //             this._sharedService.jobObj.jcVehicleObj.FaceLiftTypeID =
      //     //               this._sharedService._commonMeta.objectTypes.find(
      //     //                 (item) =>
      //     //                   item.ObjectNameEnglish == "FaceLift" &&
      //     //                   item.TypeNameEnglish == test
      //     //               ).ObjectTypeID;
      //     //             if (
      //     //               this.generalVehicle.GeneralVehicles[0].face_lift !=
      //     //               undefined
      //     //             ) {
      //     //               debugger;
      //     //               if (
      //     //                 this.generalVehicle.GeneralVehicles[0].face_lift ==
      //     //                 true
      //     //               ) {
      //     //                 this._sharedService.jobObj.jcVehicleObj.FaceLiftTypeID = 148;
      //     //               } else if (
      //     //                 this.generalVehicle.GeneralVehicles[0].face_lift ==
      //     //                 false
      //     //               ) {
      //     //                 this._sharedService.jobObj.jcVehicleObj.FaceLiftTypeID = 149;
      //     //               }
      //     //             }
      //     //           }
      //     //         },
      //     //         (error) => {}
      //     //       );
      //     //   }
      //     // }
      //   });
    }
  }

  getProductionYears() {
    this.SeriesMake = this._sharedService._commonMeta.Makes.find(
      (item) => item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID
    ).EnglishMakeName;
    this.SeriesModel = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
    ).EnglishModelName;
    this.SeriesYear = null;

    if ( this.groupnameCount > 0
    ) {
      this.groupName = this._sharedService.jobObj.jcVehicleObj.GroupName;
    } else {
      this.groupName = null;
    }

    if (
      this._sharedService.jobObj.jcVehicleObj.MakeID != undefined &&
      this._sharedService.jobObj.jcVehicleObj.ModelID
    ) {
      this._jobService
        .getVehicleSeries(
          this.SeriesMake,
          this.SeriesModel,
          this.SeriesYear,
          this.groupName
        )
        .subscribe(
          (res: any) => {
            debugger;
            this.generalVehicle = new GeneralVehicles();
            this.generalVehicle = res;

            let filteredGenralVehicle;

            if (this.generalVehicle == null) {
              this.generalVehicle = new GeneralVehicles();
            } else {
              filteredGenralVehicle =
                this.generalVehicle.GeneralVehicles.filter(
                  (item) => item.FuelType1 != null && item.BodyType != null
                );
              if (filteredGenralVehicle.length > 0) {
                console.log(filteredGenralVehicle);
                this._sharedService.jobObj.jcVehicleObj.VehicleTypeID =
                
                  this._sharedService._commonMeta.objectTypes.find(
                    (item) =>
                      item.ObjectNameEnglish == "Body" &&
                      item.TypeNameEnglish.toLocaleLowerCase() ==
                        filteredGenralVehicle[0].BodyType.toLowerCase()
                  ).ObjectTypeID;
                // if (
                //   this._sharedService.jobObj.jcVehicleObj.VehicleTypeID !=
                //   this._sharedService.appointmentData.VehicleTypeID
                // ) {
                //   this._sharedService.warning("Vehicle Type is changed");
                // }
                this._sharedService.jobObj.jcVehicleObj.EngineTypeID =
                  this._sharedService._commonMeta.objectTypes.find(
                    (item) =>
                      item.ObjectNameEnglish == "Engine" &&
                      item.TypeNameEnglish.toLowerCase() ==
                        filteredGenralVehicle[0].FuelType1.toLowerCase()
                  ).ObjectTypeID;
              }
              this.MinYear = this.generalVehicle.MinYear;
              this.MaxYear = this.generalVehicle.MaxYear;
            }
          },
          (error) => {}
        );
    }
  }

  changeModel() {
    debugger;
    this.ModelName = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
    ).EnglishModelName;
    this.modelGroupName = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
    ).GroupName;

    if (
      this._sharedService.jobObj.jcVehicleObj.GroupName == undefined &&
      this.modelGroupName != undefined
    ) {
      this._sharedService.jobObj.jcVehicleObj.GroupName = this.modelGroupName;
    }
  }

  onRemoveYear() {
    this.MinYear = null;
    this.MaxYear = null;

    this._sharedService.jobObj.jcVehicleObj.ProductionYear = undefined;
  }

  changeMake() {
    //to reset the the rest of fileds region start
    this._sharedService.jobObj.jcVehicleObj.ModelID = undefined;
    this._sharedService.jobObj.jcVehicleObj.ProductionYear = undefined;
    this.MinYear = undefined;
    this.MaxYear = undefined;
    this._sharedService.jobObj.jcVehicleObj.GroupName = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineCapacity = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineCode = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineNumber=undefined;
   this._sharedService.jobObj.jcVehicleObj.VehicleTypeID=undefined;
    this._sharedService.jobObj.jcVehicleObj.ColorCode=undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineTypeID=26;
    this._sharedService.jobObj.jcVehicleObj.CylinderTypeID=76;
    this.generalVehicle.GeneralVehicles=undefined;
    this._sharedService.jobObj.jcVehicleObj.FaceLiftTypeID=undefined;
    //to reset the the rest of fileds  region end 
    debugger;
    var index = this._sharedService._commonMeta.Models.findIndex(
      (item) =>
        item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID &&
        item.GroupName != undefined
    );
    if (index > -1) {
      var make = this._sharedService._commonMeta.Models.filter(
        (item) =>
          item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID &&
          item.GroupName != undefined
      );
      this.groupnameCount = make.length;
    }

    if (index == -1) {
      this.groupnameCount = undefined;
    }
  }

  onChangeMake() {
    this.groupnameCount = null;
    this._sharedService.jobObj.jcVehicleObj.MakeID = undefined;
    this._sharedService.jobObj.jcVehicleObj.ModelID = undefined;
  }
  onChangeGroupName() {
    this._sharedService.jobObj.jcVehicleObj.GroupName = null;
  }

  onVINPaste(event){
    let clipData=  event.clipboardData;
    let pastedText = clipData.getData('text');
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(pastedText)){
    
   event.preventDefault();
   return false;
    }
  }
  
}
