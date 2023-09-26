import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Checklist } from 'app/models/checklist';
import { Gallery } from 'app/models/Gallery';
import { CommonService } from 'app/services/common.service';
import { SharedService } from 'app/services/shared.service';
import { ImageCompressService, ResizeOptions } from 'ng2-image-compress';

@Component({
  selector: 'app-inspection-view',
  templateUrl: './inspection-view.component.html',
  styleUrls: ['./inspection-view.component.scss']
})
export class InspectionViewComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  currentImg: string;
  marker: Array<any>;
  markers: any[][] = [];
  checklist: Checklist;
  imageObj: Gallery;
  sedan: string =         '../../../assets/img/exterior/exterior-sedan.jpg';
  pickup: string =        '../../../assets/img/exterior/exterior-pickup.jpg';
  hatchback: string =     '../../../assets/img/exterior/exterior-hatchback.png';
  SUV: string =           '../../../assets/img/exterior/exterior-SUV.jpeg';
  coupe: string =         '../../../assets/img/exterior/exterior-coupe.jpg';
  twoDoorPickup: string = '../../../assets/img/exterior/exterior-two-door-pickup.png';
  bus: string =           '../../../assets/img/exterior/exterior-bus.png';
  convertible: string =   '../../../assets/img/exterior/exterior-convertible.jpg';
  smallVehicle: string =  '../../../assets/img/exterior/exterior-smallVehicle.jpg';
  imageURL: string;
  heading: string;

  constructor(private modalService: NgbModal, private _commonService: CommonService, public _sharedService: SharedService) { }

  ngOnInit() {
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0 && this._sharedService.logged_user_role_id != 3) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/inspection-view") > -1);
    }
    this.markerBinding();
  }

  markerBinding() {
    if (this._sharedService.jobObj.ImageMarkers != undefined && this._sharedService.jobObj.ImageMarkers.length > 0) {
      this._sharedService.jobObj.ImageMarkers.forEach(element => {
        this.marker = new Array<any>();
        this.marker.push(element.Latitude);
        this.marker.push(element.Longitude);
        this.marker.push(element.ImageMarkerID);
        this.marker.push(element.JobCardID);
        this.markers.push(this.marker);
      });
    }
  }

  open(modal: any, url: string, textData: string, isGallery?: boolean) {
    if (isGallery == true) {
      var data = this._sharedService.jobObj.Gallery.find(item => item.GalleryTypeID == +url);
      if (data != undefined) {
        this.imageURL = data.ImageURL;
        this.heading = textData;
      }
      // this._sharedService.jobObj.Gallery.find(item => {
      //   if (item.GalleryTypeID == +url) {
      //     this.imageURL = item.ImageURL;
      //     this.heading = textData;
      //   }
      // });
    }
    else {
      this.imageURL = url;
      this.heading = textData;
    }
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  galleryPreviewModal(modal: any, image: any) {
    this.currentImg = image.ImageURL;
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  viewNote(modal: any, cl: Checklist) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    this.checklist = new Checklist();
    this.checklist = cl;
  }
  // uploadVehicleImage(fileInput: any, imageTypeID: number, JobCardID: number) {
  //   if (this._sharedService.validateFile(fileInput.target.files[0].name)) {
  //     var option: ResizeOptions = new ResizeOptions();
  //     option.Resize_Quality = 80;
  //     option.Resize_Type = 'image/jpg';
  //     ImageCompressService.filesToCompressedImageSourceEx(fileInput.target.files, option).then(observableImages => {
  //       observableImages.subscribe((image) => {
  //         this._commonService.saveImage(image.imageDataUrl).subscribe((res: any) => {
  //           this.imageObj = new Gallery();
  //           this.imageObj.GalleryID = Math.floor((Math.random() * -10000));
  //           this.imageObj.ImageURL = res;
  //           this.imageObj.GalleryTypeID = imageTypeID;
  //           this.imageObj.ObjectID = JobCardID;
  //           this.imageObj.IsModified = true;
  //           this._sharedService.jobObj.Gallery.push(this.imageObj);
  //         })

  //       }, (error) => {
  //         console.log("Error while converting");
  //       });
  //     });
  //   } else {
  //     this._sharedService.warning("Warning", "Only png and jpeg formats are allowed");
  //   }

  // }

}
