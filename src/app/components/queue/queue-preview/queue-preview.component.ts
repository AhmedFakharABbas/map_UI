import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ItemsList } from "@ng-select/ng-select/lib/items-list";
import { Checklist } from "app/models/checklist";
import { Gallery } from "app/models/Gallery";
// import { ImageMarker } from 'app/models/image-marker';
import { SaveAppointment } from "app/models/saveAppointment";
import { CommonService } from "app/services/common.service";
import { JobService } from "app/services/job.service";
import { SharedService } from "app/services/shared.service";
import { ImgMapComponent } from "ng2-img-map";

@Component({
  selector: "app-queue-preview",
  templateUrl: "./queue-preview.component.html",
  styleUrls: ["./queue-preview.component.scss"],
})
export class QueuePreviewComponent implements OnInit {
  saveAppointmentData: SaveAppointment;
  imageObj: Gallery;
  sedan: string = "../../../../assets/img/exterior/exterior-sedan.jpg";
  pickup: string = "../../../../assets/img/exterior/exterior-pickup.jpg";
  hatchback: string = "../../../../assets/img/exterior/exterior-hatchback.PNG";
  SUV: string = "../../../../assets/img/exterior/exterior-SUV.jpeg";
  coupe: string = "../../../../assets/img/exterior/exterior-coupe.jpg";
  twoDoorPickup: string =
    "../../../../assets/img/exterior/exterior-two-door-pickup.PNG";
  bus: string = "../../../../assets/img/exterior/exterior-bus.png";
  convertible: string = "../../../../assets/img/exterior/exterior-convertible.jpg";
  smallVehicle: string =
    "../../../../assets/img/exterior/exterior-smallVehicle.jpg";
  markers: any[][] = [];
  marker: Array<any>;
  activatedModalRef: NgbModalRef;
  checklist: Checklist;
  appointmentID: number;
  plateNumber: string;
  modalHeader: string;
  imageURL: string;
  currentImg: string;
  takeApproval: boolean = false;
  dataURL: string;
  // imgMarker: ImageMarker;

  @ViewChild("completeProcess", { static: false })
  completeProcessModal: ElementRef;
  @ViewChild("imgMap", { static: false }) imgMap: ImgMapComponent;

  constructor(
    public _sharedService: SharedService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private _jobService: JobService,
    private _commonService: CommonService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.saveAppointmentData = new SaveAppointment();

    console.log(this.saveAppointmentData.AppointmentObj.VehicleTypeID)

    // this.vehicleList = new Array<Vehicle>();

    if (this._sharedService.AppointmentID != undefined) {
      this.getSingleAppointment();
    }
  }

  markerBinding() {
    debugger
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
  // JobCardCheckListCheck(){
  //   this.saveAppointmentData.JobCardCheckList.forEach((item:any) =>{
  //     this.saveAppointmentData.JobCardCheckList.forEach((el:any) =>{
  //       if(item.JobCardCheckListID == true){
  //         el.JobCardCheckListID = true;
  //       }
  //     });

  //   });
  // }

  getSingleAppointment() {

    debugger;
    this._jobService
      .getSingleAppointment(
        this._sharedService.AppointmentID,
        this._sharedService.plateNumber
      )
      .subscribe(
        (res: any) => {
          debugger;
          this.saveAppointmentData.AppointmentObj = res.AppointmentObj;
          this.saveAppointmentData.ImageMarkers = res.ImageMarkers;
          this.saveAppointmentData.JobCardCheckList = res.JobCardCheckList;
          // this.saveAppointmentData.AppointmentObj.FuelTankReading = res.AppointmentObj.FuelTankReading;
          // // this.saveAppointmentData.AppointmentObj.VehicleFront = res.AppointmentObj.VehicleFront;
          this.markerBinding();
          console.log(this.saveAppointmentData.AppointmentObj.VehicleTypeID)

          // this.JobCardCheckListCheck();
        },
        (error) => {}
      );

  }

  viewNote(modal: any, cl: Checklist) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    this.checklist = new Checklist();
    this.checklist = cl;
  }

  galleryPreviewModal(modal: any, image: any) {
    this.currentImg = image.ImageURL;
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  open(modal: any, header: string, url: string) {
 if(url!=null||url!=undefined){    this.modalHeader = header;
    this.imageURL = url;
    // this.activatedModalRef = this.modalService.open(modal);
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  }

  openModel(model) {
    debugger;
    document.body.classList.add("signature-modal");
    this.activatedModalRef = this.modalService.open(model, {
      size: "lg",
      backdrop: "static",
    });
    $.getScript("../../../assets/js/e-signature.js");
  }
  closeSignatureModal() {
    document.body.classList.remove("signature-modal");
  }

  closeModal() {
    this.activatedModalRef.close();
  }

  onFetchDataURL() {
    this.dataURL = (<HTMLInputElement>(
      document.getElementById("sig-dataUrl")
    )).value;
  }

  openProcessConfirmationModel(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }
  closeProcessConfirmationModel() {
    this.activatedModalRef.close();
  }

  onSubmitSignature() {
    this._sharedService.uploadPercentage = 100;
    this._sharedService.showUploadPercentage == true
    setTimeout(() => {
      this.onFetchDataURL();
      this._commonService.saveImage(this.dataURL).subscribe(
        (res: any) => {
          this.saveAppointmentData.AppointmentObj.InspectionSignatureURL = res;
          this.updateAppointment();
          this._sharedService.uploadPercentage = 100;
          this._sharedService.success(
            "Success",
            "Signature saved successfully"
          );
          this.activatedModalRef.dismiss("dismiss");
          this.openProcessConfirmationModel(this.completeProcessModal);
          this.closeModal();
          if (this._sharedService.logged_user_role_id == 6) {
            this._router.navigate(["/job/job-list"]);
          } else if (this._sharedService.logged_user_role_id == 3) {
            this._router.navigate(["/job/list"]);
          }
          // let element: HTMLElement = document.getElementById('updateJob') as HTMLElement;
          // element.click();
        },
        (error) => {
          this._sharedService.error("Error", "API not working");
        }
      );
    }, 200);
  }

  updateAppointment() {
    this.saveAppointmentData.AppointmentObj.CreatedBy =
      this._sharedService.logged_user_id;
    this._jobService.updateAppointment(this.saveAppointmentData).subscribe(
      (res: any) => {
        this.saveAppointmentData = res;
        // this.shouldUpdate = false;
        this.markerBinding();
        // this._sharedService.success('Success', 'Appointment Saved Successfully');
        // this._router.navigate(['/job/job-list']);
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }
}
