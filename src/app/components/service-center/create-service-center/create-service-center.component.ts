import { Component, OnInit } from "@angular/core";
import { ServiceCenter } from "app/models/service-center";
import { SharedService } from "app/services/shared.service";
import { ServiceCenterService } from "app/services/service-center.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router, ActivatedRoute } from "@angular/router";
import { ImageCompressService, ResizeOptions } from "ng2-image-compress";
import { CommonService } from "app/services/common.service";

@Component({
  selector: "app-create-service-center",
  templateUrl: "./create-service-center.component.html",
  styleUrls: ["./create-service-center.component.scss"],
})
export class CreateServiceCenterComponent implements OnInit {
  WorkshopID: number;
  closeResult: string;
  serviceCenterObj: ServiceCenter;
  countryCode: string;
  activatedModalRef: NgbModalRef;
  default_img: string = "/assets/img/no-image.png";

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private _serviceCenterService: ServiceCenterService,
    public _sharedService: SharedService,
    private _router: Router,
    private _commonService: CommonService
  ) {
    // this._router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
  }

  ngOnInit() {
    this.serviceCenterObj = new ServiceCenter();
    this.route.queryParams.subscribe((params) => {
      this.WorkshopID = +params["WorkshopID"]; // (+) converts string 'id' to a number
    });
    if (this.WorkshopID >= 1) {
      this.getSingleServiceCenter();
    }
  }

  getSingleServiceCenter() {
    this._serviceCenterService
      .getSingleServiceCenter(this.WorkshopID)
      .subscribe(
        (res: any) => {
          this.serviceCenterObj = res;
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
  }

  onSaveServiceCenter() {
    this.serviceCenterObj.CreatedBy = this._sharedService.logged_user_id;
    this._serviceCenterService
      .saveServiceCenter(this.serviceCenterObj)
      .subscribe(
        (res) => {
          this._sharedService.success("Success", "Service saved successfully");
          this.serviceCenterObj.WorkshopID = res;
          this._sharedService._commonMeta.Workshops.push(this.serviceCenterObj);
          this._router.navigate(["/", "service-center", "list"]);
        },
        (error) => {
          if (
            error.ModelState != undefined &&
            JSON.stringify(error).indexOf("Email") > -1
          ) {
            this._sharedService.error(
              "Error",
              this.serviceCenterObj.Email + " already exists"
            );
          } else {
            this._sharedService.error("Error", error.Message);
          }
        }
      );
  }

  onUpdateServiceCenter() {
    this.serviceCenterObj.ModifiedBy = this._sharedService.logged_user_id;
    this._serviceCenterService
      .updateServiceCenter(this.serviceCenterObj)
      .subscribe(
        (res) => {
          this._sharedService.success(
            "Success",
            "Service updated successfully"
          );
          this._router.navigate(["/", "service-center", "list"]);
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    console.log("Updated");
  }
  //#region  Upload and delete image
  uploadImage(fileInput: any) {
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
            console.log(image);
            this._commonService
              .saveImage(image.imageDataUrl)
              .subscribe((res: any) => {
                this.serviceCenterObj.LogoImageURL = res;
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

  public delete() {
    this.serviceCenterObj.LogoImageURL = undefined;
    //Note: send api call to delete image from server and also soft delete from db
  }

  open(model) {
    this.modalService.open(model);
  }
  //#endregion
}
