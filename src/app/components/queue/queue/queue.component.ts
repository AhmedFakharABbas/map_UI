import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import {
  NgbModal,
  NgbModalRef,
  NgbTabChangeEvent,
  NgbTabset,
} from "@ng-bootstrap/ng-bootstrap";
import { ItemsList } from "@ng-select/ng-select/lib/items-list";
import { NotificationsService } from "angular2-notifications";
import {
  CanComponentDeactivate,
  CanDeactivateGuard,
} from "app/guards/can-deactivate-guard.service";
import { Appointment } from "app/models/appointment";
import { BasicInfoMeta } from "app/models/basic-info-meta";
import { Checklist } from "app/models/checklist";
import { Gallery } from "app/models/Gallery";
import { ImageMarker } from "app/models/image-marker";
import { SaveAppointment } from "app/models/saveAppointment";
import { Vehicle } from "app/models/vehicle";
import { CommonService } from "app/services/common.service";
import { JobService } from "app/services/job.service";
import { SharedService } from "app/services/shared.service";
import { debug } from "console";
import { ImageCompressService, ResizeOptions } from "ng2-image-compress";
import { ImgMapComponent } from "ng2-img-map";
import { element } from "protractor";
import { Observable, Subscription, UnsubscriptionError } from "rxjs";
import { QueuePreviewComponent } from "../queue-preview/queue-preview.component";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
})
export class QueueComponent implements CanComponentDeactivate, OnInit {
  saveAppointmentData: SaveAppointment;
  appointmentID: number = 0;
  activatedModalRef: NgbModalRef;
  modalHeader: string;
  imageURL: string;
  imageObj: Gallery;
  tabID: number = 1;
  shouldUpdate: boolean = false;
  compressedImages: Array<Gallery>;
  // vehicleList: Array<Vehicle>;
  plateNumber: string;
  appointmentDateTime: Date;
  customerMobile: string;

  sedan: string = "../../../../assets/img/exterior/exterior-sedan.jpg";
  pickup: string = "../../../assets/img/exterior/exterior-pickup.jpg";
  hatchback: string = "../../../assets/img/exterior/exterior-hatchback.PNG";
  SUV: string = "../../../assets/img/exterior/exterior-SUV.jpeg";
  coupe: string = "../../../assets/img/exterior/exterior-coupe.jpg";
  twoDoorPickup: string =
    "../../../assets/img/exterior/exterior-two-door-pickup.PNG";
  bus: string = "../../../assets/img/exterior/exterior-bus.PNG";
  convertible: string = "../../../assets/img/exterior/exterior-convertible.jpg";
  smallVehicle: string =
    "../../../assets/img/exterior/exterior-smallVehicle.jpg";
  markers: any[][] = [];
  imgMarker: ImageMarker;
  marker: Array<any>;
  url: string;
  markAll: number;
  takeApproval: boolean = false;
  changeSubscription: Subscription;
  count: number = 0;
  checkedAppointment = [];

  @ViewChild("imgMap", { static: false }) imgMap: ImgMapComponent;

  @ViewChild("tabset", { static: false }) tabSet: NgbTabset;

  @ViewChild("selectCustomerList", { static: false })
  customerListModal: ElementRef;
  @ViewChild("confirmSave", { static: false }) confirmSave: ElementRef;
  content: string;
  deleteContentModel: NgbModalRef;

  constructor(
    public _commonService: CommonService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private _jobService: JobService,
    public _sharedService: SharedService,
    public _router: Router
  ) {}

  ngOnInit() {
    this.changeSubscription = this._sharedService.resetAllFields.subscribe(
      (data) => {
        debugger;
        this.saveAppointmentData.AppointmentObj.PlateNumber = undefined;
        this.saveAppointmentData.AppointmentObj.AppointmentDateTime = undefined;
        this.saveAppointmentData.AppointmentObj.CustomerMobile = undefined;
        this.count = 0;
      }
    );

    this.takeApproval = false;
    this.saveAppointmentData = new SaveAppointment();

    // this.vehicleList = new Array<Vehicle>();

    this.route.queryParams.subscribe((params) => {
      this.appointmentID = +params["id"]; // (+) converts string 'id' to a number
    });
    if (this.appointmentID != undefined) {
      if (this._sharedService.appointmentData != undefined) {
        // if (this.appointmentObj == undefined) {
        //   this.appointmentObj = new Appointment();
        // }
        debugger;
        this.saveAppointmentData.AppointmentObj =
          this._sharedService.appointmentData;
        this.saveAppointmentData.ImageMarkers = this._sharedService.imageMarker;
        this.saveAppointmentData.JobCardCheckList =
          this._sharedService.jobCardCheckList;
        let initialCheckList = this.saveAppointmentData.JobCardCheckList.filter(
          (item) => item.IsChecked == true
        );

        if (initialCheckList.length == 12) {
          this.markAll = 1;
        } else {
          this.markAll = 0;
        }
      }
    }
    if (Number.isNaN(this.appointmentID)) {
      this.appointmentID = null;
    }
  }

  // stop user for to navigate without saving data
  canDeactivate(): any | Observable<boolean> | Promise<boolean> | boolean {
    if (this.shouldUpdate == true) {
      this.openConfirmSaveModel(this.confirmSave);
      return false;
    } else {
      return true;
    }
  }

  // ngAfterViewChecked() {
  //   if (this._sharedService.jobObj.JCBasicInfo.InspectionSignatureURL != undefined && this.takeApproval != true) {
  //     this.takeApproval = true;
  //   }
  // }
  ngOnDestroy() {
    this.route.url.subscribe((activeUrl) => {
      this.url = window.location.pathname;
    });
    // this._router.navigate([this.url]);
    // remove data on change of component
    if (this._sharedService.appointmentData != undefined) {
      this._sharedService.appointmentData = new Appointment();
    }
  }

  onSelectFile(fileInput: any, data: string) {
    this._sharedService.uploadPercentage = 100;
    this.shouldUpdate = true;
    var option: ResizeOptions = new ResizeOptions();
    option.Resize_Quality = 80;
    option.Resize_Type = "image/jpg";
    ImageCompressService.filesToCompressedImageSourceEx(fileInput.target.files,option).then((observableImages) => {
      observableImages.subscribe(
        (image) => {
          this._commonService .saveImage(image.imageDataUrl).subscribe((res: any) => {
              this.saveAppointmentData.AppointmentObj[data] = res;
              this._sharedService.uploadPercentage = 100;
            });
        },
        (error) => {
          this._sharedService.error("Error while converting", error.Message);
        }
      );
    });
  }

  getVehicleData() {
    this.plateNumber = this.saveAppointmentData.AppointmentObj.PlateNumber;
    this.appointmentDateTime =
      this.saveAppointmentData.AppointmentObj.AppointmentDateTime;
    this.customerMobile =
      this.saveAppointmentData.AppointmentObj.CustomerMobile;
    if (this.saveAppointmentData.AppointmentObj.PlateNumber != undefined) {
      this._jobService
        .getVehicleData(this.saveAppointmentData.AppointmentObj.PlateNumber)
        .subscribe(
          (res: any) => {
            this.saveAppointmentData = res;
            // if no appointment created then create new one
            if (
              this.saveAppointmentData.AppointmentObj == undefined &&
              (this.saveAppointmentData.Vehicles == undefined ||
                this.saveAppointmentData.Vehicles.length == 0)
            ) {
              if (this.saveAppointmentData.AppointmentObj == undefined) {
                this.saveAppointmentData.AppointmentObj = new Appointment();
              }
              this.saveAppointmentData.AppointmentObj.PlateNumber =
                this.plateNumber;
              this.saveAppointmentData.AppointmentObj.AppointmentDateTime =
                this.appointmentDateTime;
              this.saveAppointmentData.AppointmentObj.CustomerMobile =
                this.customerMobile;

              if (
                this.saveAppointmentData.AppointmentObj.PlateNumber !=
                  undefined &&
                this.saveAppointmentData.AppointmentObj.AppointmentDateTime &&
                this.saveAppointmentData.AppointmentObj.CustomerMobile
              ) {
                this.saveAppointment();
              }

              // this.tabID++;
              // this.tabSet.select(this.tabID.toString());
            }
            if (this.saveAppointmentData.AppointmentObj == undefined) {
              this.saveAppointmentData.AppointmentObj = new Appointment();
              this.saveAppointmentData.AppointmentObj.PlateNumber =
                this.plateNumber;
              this.saveAppointmentData.AppointmentObj.AppointmentDateTime =
                this.appointmentDateTime;
              this.saveAppointmentData.AppointmentObj.CustomerMobile =
                this.customerMobile;
            }
            // for selection of new vehicle if already registered
            if (
              this.saveAppointmentData.Vehicles != undefined &&
              this.saveAppointmentData.Vehicles.length > 0
            ) {
              this.openCustomerListModel(this.customerListModal);
            }
            // move tab in case of success
            // if (this.saveAppointmentData.Vehicles == undefined && this.saveAppointmentData.AppointmentObj != undefined) {
            //   this.tabID++;
            //   this.tabSet.select(this.tabID.toString());
            // }
            // this.saveAppointmentData.AppointmentObj.WorkshopID = this._sharedService.currentWorkshopID;

            // this._sharedService.success('Success', 'Appointment Saved Successfully');
            // this._router.navigate(['/job/job-list']);
          },
          (error) => {
            this.tabID--;
            this.tabSet.select(this.tabID.toString());
            this._sharedService.error("Error", error.Message);
          }
        );
    }
  }

  saveAppointment() {
    this.saveAppointmentData.AppointmentObj.WorkshopID =
      this._sharedService.currentWorkshopID;
    this.saveAppointmentData.AppointmentObj.CreatedBy =
      this._sharedService.logged_user_id;
    this._jobService
      .saveAppointment(this.saveAppointmentData.AppointmentObj)
      .subscribe(
        (res: any) => {
          this.saveAppointmentData = res;
          this._sharedService.AppointmentID = res.AppointmentObj.AppointmentID;
          console.log(this.saveAppointmentData);
          let checkAlllength = this.saveAppointmentData.JobCardCheckList.filter(
            (item) => item.CheckListTypeID == 45 && item.IsChecked == true
          ).length;
          if (checkAlllength == 12) {
            this.markAll = 1;
            console.log("condition should tru");
          } else {
            this.markAll = 0;
          }

          this.saveAppointmentData.AppointmentObj.VehicleTypeID =
            res.AppointmentObj.VehicleTypeID;
          if (
            this.saveAppointmentData.AppointmentObj.VehicleTypeID == undefined
          ) {
            this.saveAppointmentData.AppointmentObj.VehicleTypeID = 15;
          }
          // this.saveAppointmentData.AppointmentObj.WorkshopID = this._sharedService.currentWorkshopID;
          this.markerBinding();

          this.closeCustomerListModel();
          // this._sharedService.success('Success', 'Appointment Saved Successfully');
          // this._router.navigate(['/job/job-list']);
        },
        (error) => {
          this.tabID--;
          this.tabSet.select(this.tabID.toString());
          this._sharedService.error("Error", error.Message);
        }
      );
  }

  updateAppointment() {
    // this._queuePreview.getSingleAppointment();

    this.saveAppointmentData.AppointmentObj.CreatedBy =
      this._sharedService.logged_user_id;

    this._jobService.updateAppointment(this.saveAppointmentData).subscribe(
      (res: any) => {
        this.saveAppointmentData = res;
        this.shouldUpdate = false;

        this.markerBinding();

        if (this.tabID == 3) {
          this.takeApproval = true;
        }

        this.tabID++;
        this.tabSet.select(this.tabID.toString());

        // this._sharedService.success('Success', 'Appointment Saved Successfully');
        // this._router.navigate(['/job/job-list']);
      },
      (error) => {
        this.tabID--;
        this.tabSet.select(this.tabID.toString());
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  // checkImages() {
  //   if (this.AppointmentObj.MileageImageURL == undefined || this.AppointmentObj.LicensePlateFront == undefined || this.AppointmentObj.LicensePlateBack == undefined || this.AppointmentObj.VehicleFront == undefined
  //     || this.AppointmentObj.VehicleRear == undefined || this.AppointmentObj.VehicleRight == undefined || this.AppointmentObj.VehicleLeft == undefined || this.AppointmentObj.VehicleInside == undefined
  //     || this.AppointmentObj.VehicleRoof == undefined || this.AppointmentObj.Dashboard == undefined) {
  //     this._sharedService.warning("Warning", "Please add all Images.");
  //     return false;
  //   }
  //   else {
  //     return true;
  //   }
  // }

  open(modal: any, header: string, url: string) {
    
    this.modalHeader = header;
    this.imageURL = url;
    // this.activatedModalRef = this.modalService.open(modal);
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId != this.tabID.toString()) {
      $event.preventDefault();
    }
  }

  changeTab(isNext: boolean) {

debugger
    if(this.tabID == 1){
    this.getVehicleData();
    }
    // save data before calling vehicle data (we got undefined object if found no record of appointment)
    this.plateNumber = this.saveAppointmentData.AppointmentObj.PlateNumber;
    this.appointmentDateTime =
      this.saveAppointmentData.AppointmentObj.AppointmentDateTime;
    this.customerMobile =
      this.saveAppointmentData.AppointmentObj.CustomerMobile;

    if (isNext == false) {
      this.tabID--;
      this.tabSet.select(this.tabID.toString());
    }
    // don't move tabs if required data is  not entered
    if (this.tabID == 1 && isNext == true) {
      // this.tabID++;
      console.log(this.saveAppointmentData.AppointmentObj.AppointmentDateTime);
      console.log(this.saveAppointmentData.AppointmentObj);

      if (((this.saveAppointmentData.AppointmentObj.PlateNumber == undefined||this.saveAppointmentData.AppointmentObj.PlateNumber ==""
      || this.saveAppointmentData.AppointmentObj.CustomerMobile == undefined|| this.saveAppointmentData.AppointmentObj.CustomerMobile == ""
      || this.saveAppointmentData.AppointmentObj.AppointmentDateTime == undefined || this.saveAppointmentData.AppointmentObj.AppointmentDateTime=="") && this._sharedService.logged_user_role_id == 3)|| (this._sharedService.logged_user_role_id ==6&&(this.saveAppointmentData.AppointmentObj.PlateNumber == undefined||this.saveAppointmentData.AppointmentObj.PlateNumber =="")  ))
      {
        this._sharedService.warning("Warning", "Please add all required fields.");
      }


       else if(this.saveAppointmentData.AppointmentObj.PlateNumber == undefined && this._sharedService.logged_user_role_id == 6)
       {
        this._sharedService.warning("Warning", "Please add Plate Number.");
       }
      //  if( this.saveAppointmentData.AppointmentObj.PlateNumber != undefined
      // && this.saveAppointmentData.AppointmentObj.CustomerMobile != undefined
      // && this.saveAppointmentData.AppointmentObj.AppointmentDateTime != undefined)
      
      else {
        this.tabID++;

        this.tabSet.select(this.tabID.toString());
        this.saveAppointment();
        this._sharedService.success("Success", "Queue Created successfully!");

        console.log(this.saveAppointmentData.AppointmentObj);
        //  this.getVehicleData();
      }
    } else if (this.tabID == 2 && isNext == true) {
      if (
        (this.saveAppointmentData.AppointmentObj.MileageImageURL == undefined ||
          this.saveAppointmentData.AppointmentObj.LicensePlateFront ==
            undefined ||
          this.saveAppointmentData.AppointmentObj.LicensePlateBack ==
            undefined ||
          this.saveAppointmentData.AppointmentObj.VehicleFront == undefined) &&
        this._sharedService.logged_user_role_id != 3
      ) {
        this._sharedService.warning("Warning", "Please add all images.");
      } else {
        if (this.shouldUpdate == true) {
          this.updateAppointment();
          this._sharedService.success("Success", "Queue updated successfully!");
          this.shouldUpdate = false;
        } else {
          this.tabID++;
          this.tabSet.select(this.tabID.toString());
        }
      }
    } else if (this.tabID == 3 && isNext == true) {
      this.shouldUpdate = true;
      if (this.shouldUpdate == true) {
        this._sharedService.plateNumber =
          this.saveAppointmentData.AppointmentObj.PlateNumber;
        this.updateAppointment();
        this.shouldUpdate = false;
        this._sharedService.success("Success", "Queue updated successfully!");
      }
      // navigate after submitting
      // if (this._sharedService.logged_user_role_id == 3) {
      //   this._router.navigate(['/job/list']);
      // }
      // else {
      //   this._router.navigate(['/job/job-list']);
      // }
      // this._sharedService.jobObj.JCBasicInfo.VIStatusID = 17;
    }
  }

  galleryUpload($event: any) {
    var option: ResizeOptions = new ResizeOptions();
    option.Resize_Quality = 80;
    option.Resize_Type = "image/jpg";

    this.compressedImages = new Array<Gallery>();
    var imgCount = $event.target.files.length;
    ImageCompressService.filesToCompressedImageSourceEx(
      $event.target.files,
      option
    ).then((observableImages) => {
      observableImages.subscribe(
        (image: any) => {
          this.imageObj = new Gallery();
          this.imageObj.ImageDataUrl = image.compressedImage.imageDataUrl;
          this.imageObj.OrignalName = image.compressedImage.fileName;

          imgCount--;
          this.compressedImages.push(this.imageObj);
          // console.log("image OBJ" + this.imageObj);

          if (imgCount <= 0) {
            // send compresed image base64 to api to save
            this._commonService.saveGallery(this.compressedImages).subscribe(
              (res) => {
                if (res != undefined) {
                  if (this.saveAppointmentData.Gallery == undefined) {
                    this.saveAppointmentData.Gallery = new Array<Gallery>();
                  }
                  res.forEach((element) => {
                    this.imageObj = new Gallery();
                    this.imageObj.GalleryID = Math.floor(
                      Math.random() * -10000
                    );
                    this.imageObj.ImageURL = element.ImageURL;
                    this.imageObj.EncryptedName = element.EncryptedName;
                    this.imageObj.OrignalName = element.OriginalName;
                    this.imageObj.GalleryTypeID = 147;
                    this.imageObj.ObjectID =
                      this.saveAppointmentData.AppointmentObj.AppointmentID;
                    this.imageObj.IsModified = true;
                    this.saveAppointmentData.Gallery.push(this.imageObj);
                  });
                  // console.log("Gallery", this._sharedService.jobObj.Gallery);
                  // console.log('asd', this.requestData.RequestedParts)
                  this._sharedService.success(
                    "Success",
                    "Image saved successfully"
                  );
                  // previousImagesLength = this.requestData.QuotationPartsImages.length;
                  // this.ImgCounter = this.ImgCounter + 1;
                  $event = undefined;
                }
              },
              (error) => {
                this._sharedService.error("Api not working", error.Message);
              }
            );
          }
        },
        (error) => {
          $event = undefined;
          this._sharedService.error("Error Converting", error.Message);
        }
      );
    });
  }

  openRemoveImage(modal: any, gal: Gallery) {
    debugger;
    this.imageObj = gal;
    debugger;
    if (this.imageObj.IsVideo == true) {
      this.content = " Video";
    } else {
      this.content = "Picture";
    }
    this.imageObj = gal;
    this.deleteContentModel = this.modalService.open(modal);
  }

  onRemoveImage() {
    var index = this.saveAppointmentData.Gallery.findIndex(
      (item) => item.ImageURL == this.imageObj.ImageURL
    );
    if (this.imageObj.GalleryID < 0) {
      this.saveAppointmentData.Gallery.splice(index, 1);
      this.imageObj = new Gallery();
    } else {
      this._jobService.removeImage(this.imageObj.GalleryID).subscribe(
        (res: any) => {
          this.saveAppointmentData.Gallery.splice(index, 1);
          this.activatedModalRef.close();
          this.imageObj = new Gallery();
          this._sharedService.success("success", "Image deleted successfully");
        },
        (error) => {
          this.imageObj = new Gallery();
          this._sharedService.error("Error", error.Message);
        }
      );
    }
    this.deleteContentModel.close();
  }

  openCustomerListModel(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  closeCustomerListModel() {
    if (this.activatedModalRef != undefined) {
      this.activatedModalRef.close();
    }
  }

  selectVehicleCustomer(CustomerID: number, VehicleID: number) {
    var data = this.saveAppointmentData.Vehicles.find(
      (i) => i.VehicleID == VehicleID && i.CustomerID == CustomerID
    );
    if (data != undefined) {
      this.saveAppointmentData.AppointmentObj.PlateNumber = data.PlateNumber;
      this.saveAppointmentData.AppointmentObj.VehicleID = VehicleID;
      this.saveAppointmentData.AppointmentObj.LicensePlateFront =
        data.LicensePlateFront;
      this.saveAppointmentData.AppointmentObj.LicensePlateBack =
        data.LicensePlateBack;

      this.tabID++;
      this.tabSet.select(this.tabID.toString());
      this.saveAppointment();
    }
  }

  markerBinding() {
    if (
      this.saveAppointmentData.ImageMarkers != undefined &&
      this.saveAppointmentData.ImageMarkers.length > 0
    ) {
      this.markers = new Array<any>();
      this.saveAppointmentData.ImageMarkers.forEach((element) => {
        this.marker = new Array<any>();
        this.marker.push(element.Latitude);
        this.marker.push(element.Longitude);
        this.marker.push(element.ImageMarkerID);
        this.marker.push(element.JobCardID);
        this.marker.push(element.ImageMarkerID);
        this.markers.push(this.marker);
      });
    }
  }

  onMark(marker: number[]) {
    if (this.saveAppointmentData.ImageMarkers == undefined) {
      this.saveAppointmentData.ImageMarkers = new Array<ImageMarker>();
    }
    this.shouldUpdate = true;
    this.imgMap.draw();
    this.onChange(this.markers);
  }

  onClickVehicleIcon() {
    if (this.markers.length > 0) this.markers = [];
  }

  onChange(marker: any) {
    for (
      var i = this.saveAppointmentData.ImageMarkers.length - 1;
      i > -1;
      i--
    ) {
      this.saveAppointmentData.ImageMarkers.splice(i, 1);
    }
    this.markers.forEach((element) => {
      this.imgMarker = new ImageMarker();
      this.imgMarker.Latitude = element[0];
      this.imgMarker.Longitude = element[1];
      if (element[4] == undefined || element[4] == 0) {
        this.imgMarker.ImageMarkerID = Math.floor(Math.random() * -10000);
      } else {
        this.imgMarker.ImageMarkerID = element[4];
      }
      this.imgMarker.AppointmentID =
        this.saveAppointmentData.AppointmentObj.AppointmentID;
      this.saveAppointmentData.ImageMarkers.push(this.imgMarker);
      this.shouldUpdate = true;
    });
  }

  selectMarker(index: number) {
    if (this.imgMap != undefined) {
      this.imgMap.markerActive = index;
      this.imgMap.draw();
    }
  }
  deleteMarkerID: number = undefined;
  removeMarker(index: number, marker: any) {
    this.markers.splice(index, 1);
    if (index === this.imgMap.markerActive) {
      this.imgMap.markerActive = null;
    } else if (index < this.imgMap.markerActive) {
      this.imgMap.markerActive--;
    }
    this.imgMap.draw();
    this.onChange(this.markers);
    this.deleteMarkerID = undefined;
  }

  openConfirmSaveModel(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  closeConfirmSaveModel() {
    if (this.activatedModalRef != undefined) {
      this.activatedModalRef.close();
      // this.route.url.subscribe(activeUrl => {
      //   this.url = window.location.pathname;
      // });
      // move to list after saving/ignoring
      this.shouldUpdate = false;
      if (this._sharedService.logged_user_role_id == 3) {
        this._router.navigate(["/job/list"]);
      } else {
        this._router.navigate(["/job/job-list"]);
      }
    }
  }

  markAllIC(event) {
    debugger;
    const checked = event.target.checked;

    this.saveAppointmentData.JobCardCheckList.forEach((el) => {
      if (el.CheckListTypeID === 45 && checked == true) {
        el.IsChecked = true;
        el.IsModified = true;
      } else if (el.CheckListTypeID === 45 && checked == false) {
        el.IsChecked = false;
        el.IsModified = true;

        this.checkedAppointment = [];
      }
    });
    this.shouldUpdate = true;
  }
  // selectCheckboxes(){
  //   var els = document.getElementById('selectAll');
  //   this.saveAppointmentData.JobCardCheckList.filter(el => {
  //      if (el.CheckListTypeID === 45 && el.IsChecked == false) {
  //       els.checked = false;
  //      }

  //    });
  // }

  onClickUpload() {
    this._sharedService.info(
      "Tip",
      "Add upto 10 photos for maximum performance"
    );
  }
  querMarkClick(event, CheckListelement) {
    debugger;
    console.log(this.markAll);
    const checked = event.target.checked;
    console.log(this.checkedAppointment);
    if (checked == true) {
      this.checkedAppointment.push(CheckListelement.CheckListID);
      let checklistIndex = this.saveAppointmentData.JobCardCheckList.findIndex(
        (element) =>
          element.CheckListTypeID == 45 &&
          element.CheckListID == CheckListelement.CheckListID
      );
      this.saveAppointmentData.JobCardCheckList[checklistIndex].IsChecked =
        true;
    } else {
      let checklistIndex = this.saveAppointmentData.JobCardCheckList.findIndex(
        (element) =>
          element.CheckListTypeID == 45 &&
          element.CheckListID == CheckListelement.CheckListID
      );
      this.saveAppointmentData.JobCardCheckList[checklistIndex].IsChecked =
        false;
      let index = this.checkedAppointment.indexOf(CheckListelement.CheckListID);
      console.log(index);
      if (index > -1) {
        this.checkedAppointment.splice(index, 1);
      }
    }
    if (this.checkedAppointment.length == 12) {
      this.markAll = 1;
    } else {
      this.markAll = undefined;
    }
  }
  // onClickCheckBox(){

  //   for(let i =0 ; i<13; i++){
  //   if(this.saveAppointmentData.JobCardCheckList.find(item => item.CheckListTypeID = 45 ).IsChecked == true){
  //     this.saveAppointmentData.JobCardCheckList.find(item => item.CheckListTypeID = 45 ).IsChecked = false;
  //     this.count = this.count - 1;
  //   }

  //   if(this.saveAppointmentData.JobCardCheckList.find(item => item.CheckListTypeID = 45 ).IsChecked == false){
  //     this.saveAppointmentData.JobCardCheckList.find(item => item.CheckListTypeID = 45 ).IsChecked = true;
  //     this.count = this.count + 1;
  //   }

  // var x =this.saveAppointmentData.JobCardCheckList.find(item => item.CheckListTypeID = 45 ).IsChecked = !this.saveAppointmentData.JobCardCheckList.find(item => item.CheckListTypeID = 45 ).IsChecked;
  // console.log(x)
  // this.shouldUpdate = true;
  // var y =this.saveAppointmentData.JobCardCheckList.find(item => item.CheckListTypeID = 45 ).IsModified = true;
  // console.log(y)
}
