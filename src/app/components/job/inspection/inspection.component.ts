import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  NgbModal,
  NgbModalRef,
  NgbTabChangeEvent,
  NgbTabset,
} from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from "app/services/shared.service";
import { ResizeOptions, ImageCompressService } from "ng2-image-compress";
import { CommonService } from "app/services/common.service";
import { ImgMapComponent } from "ng2-img-map";
import { ImageMarker } from "app/models/image-marker";
import { Gallery } from "app/models/Gallery";
import { JobProcess } from "app/models/job-process";
import { JobService } from "app/services/job.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-inspection",
  templateUrl: "./inspection.component.html",
  styleUrls: ["./inspection.component.scss"],
})
export class InspectionComponent implements OnInit {
  url: any = "";
  closeResult: string;
  FuelTankImagedata = [];
  activatedModalRef: NgbModalRef;
  ImgCounter: number = 0;
  dataURL: string;
  @ViewChild("imgMap", { static: false }) imgMap: ImgMapComponent;
  markers: any[][] = [];
  imgMarker: ImageMarker;
  marker: Array<any>;
  imageObj: Gallery;
  compressedImages: Array<Gallery>;
  currentImg: string;
  mileage: number = 0;
  mileageUnitID: number = 43;
  sedan: string = "../../../assets/img/exterior/exterior-sedan.jpg";
  pickup: string = "../../../assets/img/exterior/exterior-pickup.jpg";
  hatchback: string = "../../../assets/img/exterior/exterior-hatchback.png";
  SUV: string = "../../../assets/img/exterior/exterior-SUV.jpeg";
  coupe: string = "../../../assets/img/exterior/exterior-coupe.jpg";
  twoDoorPickup: string =
    "../../../assets/img/exterior/exterior-two-door-pickup.png";
  bus: string = "../../../assets/img/exterior/exterior-bus.png";
  convertible: string = "../../../assets/img/exterior/exterior-convertible.jpg";
  smallVehicle: string =
    "../../../assets/img/exterior/exterior-smallVehicle.jpg";
  takeApproval: boolean = false;
  tabID: number;
  shouldUpdate: boolean = false;
  modalHeader: string;
  imageURL: string;
  markAll: boolean = false;
  routeSub: string;
  content: string;

  @ViewChild("tabset", { static: false }) tabSet: NgbTabset;

  @ViewChild("completeProcess", { static: false })
  completeProcessModal: ElementRef;
  deleteContentModel: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    public _sharedService: SharedService,
    private _commonService: CommonService,
    private _jobService: JobService,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.routeSub =  this.route.snapshot.url.join('/')
    const url = this.route["_routerState"].snapshot.url;
    console.log(url);
  }

  ngOnInit() {
    if (
      this._sharedService.routesArray != undefined &&
      this._sharedService.routesArray.length > 0
    ) {
      this._sharedService.currentRouteIndex =
        this._sharedService.routesArray.findIndex(
          (item) => item.name.indexOf("/inspection") > -1
        );
    }
    // else{
    //   this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/inspection-view") > -1);
    // }

    this.updateMArkAllCheckbox();

    this.markerBinding();
    this.tabID = 1;
    // this.tabSet = new NgbTabset();
    // this.tabSet.tabs[4].active = true;
    this.route.params.subscribe((params: Params) => {
      var id1 = +params["/:id"];
      console.log(id1);
    });

    console.log(this._sharedService.jobCardId);
  }

  ngAfterViewChecked() {
    if (
      this._sharedService.jobObj.JCBasicInfo.InspectionSignatureURL !=
        undefined &&
      this.takeApproval != true
    ) {
      this.takeApproval = true;
    }
  }

  completeJobProcess() {
    // if (this._sharedService.jobObj.JobCardCheckList.findIndex(item => item.CheckListTypeID == 45 && item.IsChecked == false) == -1) {
    //   ////check all images of vehicle are added or not
    //   var vImages = this._sharedService.jobObj.Gallery.filter(item => item.GalleryTypeID >= 107 && item.GalleryTypeID <= 117);
    //   if (vImages.length == 11) {

    //   }
    //   else {
    //     this._sharedService.error('Error', 'Please upload all images of Vehicle.');
    //     this.takeApproval = false;
    //   }
    // }
    // else {
    //   this._sharedService.error('Error', 'Please mark check list.');
    //   this.takeApproval = false;
    // }
    this._sharedService.jobObj.JCBasicInfo.VIStatusID = 17;

    var jp: any = {
      ProcessStatusID: this._sharedService.jobObj.JCBasicInfo.VIStatusID,
      ProcessTypeID: 8,
      JobCardID: this._sharedService.jobObj.JCBasicInfo.JobCardID,
    };
    this._jobService.completeJobProcess(jp).subscribe(
      (res) => {
        // let element: HTMLElement = document.getElementById('updateExitJob') as HTMLElement;
        // element.click();
        this.router.navigate(["/"]);
        this._sharedService.success("Success", "Process Completed");
        ////auto update job card on completing process
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
        console.log("error", error);
      }
    );
  }

  //#region gallery

  onSelectFile(fileInput: any) {
    var option: ResizeOptions = new ResizeOptions();
    option.Resize_Quality = 80;
    option.Resize_Type = "image/jpg";
    this._sharedService.uploadPercentage = 100;
    ImageCompressService.filesToCompressedImageSourceEx(
      fileInput.target.files,
      option
    ).then((observableImages) => {
      observableImages.subscribe(
        (image) => {
          this._commonService
            .saveImage(image.imageDataUrl)
            .subscribe((res: any) => {
              this._sharedService.jobObj.JCBasicInfo.MileageImageURL = res;
              this._sharedService.jobObj.JCBasicInfo.IsModified = true;
              this.shouldUpdate = true;
            });
        },
        (error) => {
          this._sharedService.error("Error while converting", error.Message);
        }
      );
    });
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
                  if (this._sharedService.jobObj.Gallery == undefined) {
                    this._sharedService.jobObj.Gallery = new Array<Gallery>();
                  }
                  res.forEach((element) => {
                    this.imageObj = new Gallery();
                    this.imageObj.GalleryID = Math.floor(
                      Math.random() * -10000
                    );
                    this.imageObj.ImageURL = element.ImageURL;
                    this.imageObj.EncryptedName = element.EncryptedName;
                    this.imageObj.OrignalName = element.OriginalName;
                    this.imageObj.GalleryTypeID = 48;
                    this.imageObj.ObjectID =
                      this._sharedService.jobObj.JCBasicInfo.JobCardID;
                    this.imageObj.IsModified = true;
                    this._sharedService.jobObj.Gallery.push(this.imageObj);
                  });
                  // console.log("Gallery", this._sharedService.jobObj.Gallery);
                  // console.log('asd', this.requestData.RequestedParts)
                  this._sharedService.success(
                    "Success",
                    "Image saved successfully"
                  );
                  // previousImagesLength = this.requestData.QuotationPartsImages.length;
                  this.ImgCounter = this.ImgCounter + 1;
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

  public deleteFuelTankImage() {
    this._sharedService.jobObj.JCBasicInfo.FuelTankMeterImageURL = undefined;
  }

  openRemoveImage(modal: any, gal: Gallery) {
    debugger;
    this.imageObj = gal;
    if (this.imageObj.IsVideo == true) {
      this.content = " Video";
    } else {
      this.content = "Picture";
    }
    // this.activatedModalRef = this.modalService.open(modal);
    this.deleteContentModel = this.modalService.open(modal);
  }

  onRemoveImage() {
    var index = this._sharedService.jobObj.Gallery.findIndex(
      (item) => item.ImageURL == this.imageObj.ImageURL
    );
    if (this.imageObj.GalleryID < 0) {
      this._sharedService.jobObj.Gallery.splice(index, 1);
      this.imageObj = new Gallery();
    } else {
      this._jobService.removeImage(this.imageObj.GalleryID).subscribe(
        (res: any) => {
          this._sharedService.jobObj.Gallery.splice(index, 1);
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

  galleryPreviewModal(modal: any, image: any) {
    this.currentImg = image.ImageURL;
    // this.activatedModalRef = this.modalService.open(modal);
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    // console.log("image gallery preview ", image , idx);
    this.shouldUpdate = true;
  }

  open(modal: any) {
    // this.activatedModalRef = this.modalService.open(modal);
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  dismissModal() {
    this.activatedModalRef.dismiss();
  }

  closeModal() {
    this.activatedModalRef.close();
  }

  //#endregion

  //#region  Vehicle Image
  uploadVehicleImage(fileInput: any, imageTypeID: number, JobCardID: number) {
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
            this._commonService
              .saveImage(image.imageDataUrl)
              .subscribe((res: any) => {
                // var chkImage = this._sharedService.jobObj.Gallery.findIndex(i => i.ObjectID == JobCardID && i.GalleryTypeID == imageTypeID);
                // if (chkImage > -1) {
                //   this._sharedService.jobObj.Gallery[chkImage].ImageURL = res;
                //   this._sharedService.jobObj.Gallery[chkImage].IsModified = true;
                // }
                // else {
                //   this.imageObj = new Gallery();
                //   this.imageObj.GalleryID = Math.floor((Math.random() * -10000));
                //   this.imageObj.ImageURL = res;
                //   this.imageObj.GalleryTypeID = imageTypeID;
                //   this.imageObj.ObjectID = JobCardID;
                //   this.imageObj.IsModified = true;
                //   this._sharedService.jobObj.Gallery.push(this.imageObj);
                // }
                this._sharedService.jobObj.JCBasicInfo.VehicleFront = res;
                this._sharedService.uploadPercentage = 100;
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

  //#endregion

  //#region Signature
  openModel(model) {
    document.body.classList.add("signature-modal");
    this.activatedModalRef = this.modalService.open(model, {
      size: "lg",
      backdrop: "static",
    });
    $.getScript("../../../assets/js/e-signature.js");

    // if (this._sharedService.jobObj.JobCardCheckList.findIndex(item => item.CheckListTypeID == 45 && item.IsChecked == false) == -1) {
    //   ////check all images of vehicle are added or not
    //   var vImages = this._sharedService.jobObj.Gallery.filter(item => item.GalleryTypeID >= 107 && item.GalleryTypeID <= 117);
    //   if (vImages.length == 11) {
    //     document.body.classList.add('signature-modal');
    //     this.activatedModalRef = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
    //     $.getScript('../../../assets/js/e-signature.js');
    //   }
    //   else {
    //     this._sharedService.error('Error', 'Please upload all images of Vehicle.');
    //     this.takeApproval = false;
    //   }
    // }
    // else {
    //   this._sharedService.error('Error', 'Please mark check list.');
    //   this.takeApproval = false;
    // }

    // if (this._sharedService.jobObj.JobCardCheckList.findIndex(item => item.CheckListTypeID == 45 && item.IsChecked == true) > -1) {
    //   document.body.classList.add('signature-modal');
    //   this.activatedModalRef = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
    //   $.getScript('../../../assets/js/e-signature.js');
    // }
    // else {
    //   this._sharedService.error('Error', 'Please mark check list.');
    // }
  }

  closeSignatureModal() {
    document.body.classList.remove("signature-modal");
  }

  onFetchDataURL() {
    this.dataURL = (<HTMLInputElement>(
      document.getElementById("sig-dataUrl")
    )).value;
  }

  onSubmitSignature() {
    setTimeout(() => {
      this.onFetchDataURL();
      this._commonService.saveImage(this.dataURL).subscribe(
        (res: any) => {
          this._sharedService.jobObj.JCBasicInfo.InspectionSignatureURL = res;
          this._sharedService.jobObj.JCBasicInfo.IsModified = true;
          //this.completeJobProcess();
          this.shouldUpdate = true;
          this.updateVisualInspection();
          this._sharedService.success(
            "Success",
            "Signature saved successfully"
          );
          this.activatedModalRef.dismiss("dismiss");
          this.closeModal();
          this.openProcessConfirmationModel(this.completeProcessModal);
          // let element: HTMLElement = document.getElementById('updateJob') as HTMLElement;
          // element.click();
        },
        (error) => {
          this._sharedService.error("Error", "API not working");
        }
      );
    }, 200);
  }

  //#endregion

  //#region image marker work

  markerBinding() {
    if (
      this._sharedService.jobObj.ImageMarkers != undefined &&
      this._sharedService.jobObj.ImageMarkers.length > 0
    ) {
      this.markers = new Array<any>();
      this._sharedService.jobObj.ImageMarkers.forEach((element) => {
        this.marker = new Array<any>();
        this.marker.push(element.Latitude);
        this.marker.push(element.Longitude);
        this.marker.push(element.ImageMarkerID);
        this.marker.push(element.JobCardID);
        this.markers.push(this.marker);
      });
    }
  }

  onMark(marker: number[]) {
    this.imgMap.draw();
    this.onChange(this.markers);
  }

  onChange(marker: any) {
    for (
      var i = this._sharedService.jobObj.ImageMarkers.length - 1;
      i > -1;
      i--
    ) {
      this._sharedService.jobObj.ImageMarkers.splice(i, 1);
    }
    this.markers.forEach((element) => {
      this.imgMarker = new ImageMarker();
      this.imgMarker.Latitude = element[0];
      this.imgMarker.Longitude = element[1];
      this.imgMarker.IsModified = true;
      this.imgMarker.JobCardID =
        this._sharedService.jobObj.JCBasicInfo.JobCardID;
      this._sharedService.jobObj.ImageMarkers.push(this.imgMarker);
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

  //#endregion

  //modal for mileage verification
  openMileageVerificationModal(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, {
      backdrop: "static",
    });
  }

  closeMileageVerificationModal() {
    this.activatedModalRef.close();
    this.mileage = undefined;
  }

  // verifyMileage() {
  //   debugger
  //   this.mileageUnitID;
  //   if (this.mileage != undefined && (this._sharedService.jobObj.JCBasicInfo.Mileage - 2 <= this.mileage && this._sharedService.jobObj.JCBasicInfo.Mileage + 2 >= this.mileage && this._sharedService.jobObj.JCBasicInfo.MileageUnit == this.mileageUnitID)) {
  //     this.takeApproval = true;
  //     this._sharedService.jobObj.JCBasicInfo.IsMileageVerified = true;
  //     this.closeMileageVerificationModal();
  //   }
  //   else {
  //     this._sharedService.error("Error", "Please enter correct Mileage.")
  //     this.closeMileageVerificationModal();
  //     this.mileage = undefined;
  //   }

  // }

  addMileage() {
    this._sharedService.jobObj.JCBasicInfo.Mileage = this.mileage;
    this._sharedService.jobObj.JCBasicInfo.MileageUnit = this.mileageUnitID;
    this._sharedService.jobObj.JCBasicInfo.IsModified = true;
    this.closeMileageVerificationModal();
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
                this._sharedService.jobObj.JCBasicInfo.MileageImageURL = res;
                this._sharedService.jobObj.JCBasicInfo.IsModified = true;
                this.shouldUpdate = true;
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

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId != this.tabID.toString()) {
      $event.preventDefault();
    }
  }

  changeTab(isNext: boolean) {
    if (isNext == false) {
      this.tabID--;
      console.log("tabSet", this.tabSet.activeId);
      this.tabSet.select(this.tabID.toString());
    }
    if (this.checkData() && isNext == true) {
      this.tabID++;

      // if (isNext == true) {
      //   this.tabID++;
      // }
      // else {
      //   this.tabID--;
      // }
      console.log("tabSet", this.tabSet.activeId);
      this.tabSet.select(this.tabID.toString());
      if (this.shouldUpdate == true) {
        // let element: HTMLElement = document.getElementById('updateJob') as HTMLElement;
        // element.click();
        this._jobService.updateVisualInspection().subscribe((res: any) => {
          console.log(res);
        });
        this.shouldUpdate = false;
      }
    }
  }

  checkData() {
    if (this.tabID == 1) {
      // if (this._sharedService.jobObj.JobCardCheckList.findIndex(item => item.CheckListTypeID == 45 && item.IsChecked == false) > -1) {
      //   this._sharedService.warning("Warning", "All Inspection Points needs to be checked.");
      //   return false;
      // }
      // else {
      //   return true;
      // }
      return true;
    } else if (this.tabID == 3) {
      if (this._sharedService.jobObj.JCBasicInfo.FuelTankReading == undefined) {
        this._sharedService.warning(
          "Warning",
          "Please add fuel meter reading/image."
        );
        return false;
      } else if (this._sharedService.jobObj.JCBasicInfo.Mileage == undefined) {
        this._sharedService.warning("Warning", "Please add mileage reading.");
        return false;
      } else if (
        this._sharedService.jobObj.JCBasicInfo.MileageImageURL == undefined
      ) {
        this._sharedService.warning("Warning", "Please add mileage image.");
        return false;
      } else {
        return true;
      }
    } else if (this.tabID == 4) {
      // var vImages = this._sharedService.jobObj.Gallery.filter(item => item.GalleryTypeID >= 107 && item.GalleryTypeID <= 117);
      // if (vImages.length > 11) {
      //   this._sharedService.warning("Warning", "Please upload all images of Vehicle.");
      //   return false;
      // }
      // else {
      return true;
      // }
    } else {
      return true;
    }
  }

  // checkVehicleImages() {
  //   var vImages = this._sharedService.jobObj.Gallery.filter(item => item.GalleryTypeID >= 107 && item.GalleryTypeID <= 117);
  //   if (vImages.length == 11) {
  //     if (this.shouldUpdate == true) {
  //       let element: HTMLElement = document.getElementById('updateJob') as HTMLElement;
  //       element.click();
  //       this.shouldUpdate = false;
  //     }
  //     return true;
  //   }
  //   else {
  //     this._sharedService.warning("Warning", "Please upload all images of Vehicle.");
  //     this.takeApproval = false;
  //   }
  // }

  openProcessConfirmationModel(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }
  closeProcessConfirmationModel() {
    this.activatedModalRef.close();
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
          this._sharedService.jobObj.JCBasicInfo.VehicleFront = data.ImageURL;
        }
      } else {
        this._sharedService.jobObj.JCBasicInfo.VehicleFront = url;
      }
      // this.activatedModalRef = this.modalService.open(modal);
      this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    }
  }
  updateMArkAllCheckbox() {
    var notCheckedPoints = this._sharedService.jobObj.JobCardCheckList.find(
      (el) => el.CheckListTypeID === 45 && el.IsChecked == false
    );
    if (
      notCheckedPoints == undefined &&
      this._sharedService.jobObj.JobCardCheckList.findIndex(
        (el) => el.CheckListTypeID === 45 && el.IsChecked == true
      ) > -1
    )
      this.markAll = true;
    else this.markAll = false;
  }

  markAllIC() {
    this._sharedService.jobObj.JobCardCheckList.forEach((el) => {
      if (el.CheckListTypeID === 45) {
        el.IsChecked = this.markAll;
        el.IsModified = true;
      }
    });
    this.shouldUpdate = true;
  }
  back() {
    this.router.navigate([
      "/" +
        "update-job" +
        "/" +
        this._sharedService.jobCardId +
        "/" +
        "inspection",
    ]);
  }
  changeTabSet(value: boolean) {
    // this._sharedService.changeDealerTab.next();
  }
  updateVisualInspection() {
    if (this.shouldUpdate == true) {
      this._jobService.updateVisualInspection().subscribe((res: any) => {
        console.log(res);
      });
      this.shouldUpdate = false;
    }
  }
}
