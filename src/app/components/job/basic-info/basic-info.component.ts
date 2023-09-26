import { Component, OnInit } from "@angular/core";
import { SharedService } from "app/services/shared.service";
import { GetCustomerVehicle } from "app/models/get-customer-vehicle";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as $ from "jquery";
import { JobService } from "app/services/job.service";
import { Vehicle } from "app/models/vehicle";
import { Customer } from "app/models/customer";
import { AttachSession } from "protractor/built/driverProviders";
import { Note } from "app/models/note";
import { JobConcern } from "app/models/job-concern";
import { InspectionResult } from "app/models/inspection-result";
import { ImageCompressService, ResizeOptions } from "ng2-image-compress";
import { CommonService } from "app/services/common.service";
import { Gallery } from "app/models/Gallery";
import { FileToUpload } from "app/models/file-to-upload";
import { take } from "rxjs/operators";
import { Subscription } from "rxjs";
import { BasicInfo } from "app/models/basic-info";
import { JobCardInfo } from "app/models/job-card-info";

@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
})
export class BasicInfoComponent implements OnInit {
  jobID: number;
  // basicinfoObj: BasicInfo;
  _custMeta: GetCustomerVehicle;
  activatedModalRef: NgbModalRef;
  activatedModalRef2: NgbModalRef;
  isModified: boolean;
  jcIsNew: boolean = true;
  note: Note;
  showMore: boolean = false;
  imageObj: Gallery;
  vehicleID: number;
  message: string;
  changeSubscription: Subscription;
  isOpened: boolean = false;
  fileName: string;
  // modalHeader: string;
  constructor(
    public _jobService: JobService,
    private modalService: NgbModal,
    public _sharedService: SharedService,
    private _commonService: CommonService
  ) {}

  ngOnInit() {
    this._custMeta = new GetCustomerVehicle();
    if (
      this._sharedService.routesArray != undefined &&
      this._sharedService.routesArray.length > 0
    ) {
      this._sharedService.currentRouteIndex =
        this._sharedService.routesArray.findIndex(
          (item) => item.name.indexOf("/basic-info") > -1
        );
    }

    // if (this._sharedService.isCreatingJob == true) {
    //   this._sharedService.isCreatingJob = false;
    //   if ((this._sharedService.plateNumber != undefined && this._sharedService.plateNumber != '') || (this._sharedService.contactMobile != undefined && this._sharedService.contactMobile != ''))
    //     this.getJobMetaData(this._sharedService.plateNumber, this._sharedService.contactMobile);
    // }

    this.jcIsNew = true;
    this._sharedService.customerFilter = "";
    // this._sharedService.jobObj = new JobCardInfo();
    if (this._sharedService.jobObj.Gallery == undefined) {
      this._sharedService.jobObj.Gallery = new Array<Gallery>();
    }
    //// if job card is creating from appointment w'll set data automatically
    // get data by plate number if available other wise with mobile
    if (this._sharedService.appointmentData != undefined) {
      this._sharedService.jobObj.JCBasicInfo.FuelTankReading =
        this._sharedService.appointmentData.FuelTankReading;
      this._sharedService.jobObj.JCBasicInfo.MileageImageURL =
        this._sharedService.appointmentData.MileageImageURL;
      this._sharedService.jobObj.JCBasicInfo.Mileage =
        this._sharedService.appointmentData.Mileage;
      this._sharedService.jobObj.JCBasicInfo.MileageUnit =
        this._sharedService.appointmentData.MileageUnit;
      this.imageObj = new Gallery();
      this.imageObj.GalleryID = Math.floor(Math.random() * -10000);
      this.imageObj.ImageURL = this._sharedService.appointmentData.VehicleFront;
      this.imageObj.GalleryTypeID = 107;
      this.imageObj.ObjectID = this.imageObj.GalleryID;
      this.imageObj.IsModified = true;

      this._sharedService.jobObj.Gallery.push(this.imageObj);
      debugger;
      if (this._sharedService.appointmentData.PlateNumber != undefined) {
        this._sharedService.customerFilter =
          this._sharedService.appointmentData.PlateNumber;
        this.changeSubscription = this._sharedService.getJobCardMetaChange
          .pipe(take(1))
          .subscribe((data) => {
            this.getJobMetaData();
          });
      } else {
        this._sharedService.customerFilter =
          this._sharedService.appointmentData.CustomerMobile;
        this.changeSubscription = this._sharedService.getJobCardMetaChange
          .pipe(take(1))
          .subscribe((data) => {
            this.getJobMetaData();
          });
      }

      // setTimeout(() => {
      //   this.getJobMetaData();
      // }, 500);
    }
  }

  ngOnDestroy() {
    if (
      this._sharedService.logged_user_role_id == 6 &&
      (this._sharedService.jobObj.JCBasicInfo.JobCardID == undefined ||
        this._sharedService.jobObj.JCBasicInfo.JobCardID == 0)
    ) {
      document.getElementById("saveJob").click();
    }
    if (this._sharedService.appointmentData != undefined) {
      this._sharedService.appointmentData = undefined;
    }
  }

  // @ViewChild('jobCardForm', { static: false })
  // form: NgForm;
  // canDeactivate(): any | Observable<boolean> | Promise<boolean> | boolean {
  //   debugger
  //   if (this.form.dirty) {
  //     this._sharedService.jobObj.JCBasicInfo.IsModified = true;
  //   }
  //   // if (this.form.dirty && this.form.invalid) {
  //   //   this._sharedService.error("Input all the required fields");
  //   //   this.form.ngSubmit.emit();
  //   //   return false;
  //   // } else {
  //   //   return true;
  //   // }
  //  return this.form.dirty ? window.confirm("You have unsaved changes do you want to continue?") : true;
  // }

  // search vehicle data from jobcard
  getJobMetaData() {
    debugger;
    // this._custMeta.PlateNumber = vehicle;
    // this._custMeta.ContactPersonMobile = contactMobile;
    this._sharedService.jobObj.jcVehicleObj = new Vehicle();
    this._jobService
      .getJobMetaData(this._sharedService.customerFilter)
      .subscribe(
        (res: any) => {
          debugger;
          this._sharedService._basicInfoMeta = res;

          this._sharedService.jobObj.Customers = res.Customers;
          // select user popup
          if (this._sharedService.jobObj.Customers.length > 0) {
            // this.openSelectCustomersModal('selectCustomerList');
            document.getElementById("customerList-btn").click();
          }
          // else {
          //   this._sharedService.jobObj.jcCustomerObj = res.Customers[0];
          // }
          // this._sharedService.jobObj.jcCustomerObj = res.Customers[0];
          // this._sharedService.jobObj.jcVehicleObj = this._sharedService.jobObj.jcVehicleList[0];

          this._sharedService.jobObj.jcVehicleList = res.Vehicles;
          this._sharedService.jobObj.PlanFeatures = res.PlanFeatures;
          this._sharedService.jobObj.ContractPartsDetail =
            res.ContractPartsDetail;
          this._sharedService.jobObj.ContractTasksDetail =
            res.ContractTasksDetail;
          this._sharedService.plateNumber = null;
          this._sharedService.contactMobile = null;

          // this._sharedService.jobObj. = res.PlanFeatures;

          // if(this._sharedService.jobObj.jcVehicleList.length >= 2){
          //   this._sharedService.jobObj.jcVehicleObj = new Vehicle();
          // }
          if (this._sharedService.jobObj.jcVehicleObj != undefined) {
            this._sharedService.selectedPlateNum =
              this._sharedService.jobObj.jcVehicleObj.PlateNumber;
          }
          // if (this._sharedService.jobObj.jcVehicleObj != undefined && this._sharedService.jobObj.jcVehicleObj.IsContractVehicle != undefined && this._sharedService.jobObj.jcVehicleObj.IsContractVehicle == true) {
          //   this._sharedService.jobObj.JCBasicInfo.ServiceTypeID = 42;
          // }
          // change to view mode
          // this._sharedService.jcCustomerMode = true;
          // this._sharedService.jcVehicleMode = true;
          this.jcIsNew = true;
          if(this._sharedService.jobObj.jcVehicleObj.VehicleTypeID != undefined){
          this._sharedService.jobObj.jcVehicleObj.VehicleTypeID =
            this._sharedService.appointmentData.VehicleTypeID;
          }
        },
        (error) => {
          // show error msg after analyzing input
          var data = this._sharedService.customerFilter.toString();

          if (data.indexOf("-") > -1) {
            this.message = "plate number";
          } else if (data.length >= 17 && data.length <= 20) {
            this.message = "vin";
          } else {
            this.message = "mobile";
          }
          document.getElementById("hidden-btn").click();
          this._sharedService.jobObj.JCBasicInfo.JobCardTypeID = 33;
          this.jcIsNew = false;

          this._sharedService.jobObj.jcVehicleObj.VehicleTypeID =
            this._sharedService.appointmentData.VehicleTypeID;
          // this._sharedService.error('Error', error.Message);
        }
      );
  }

  selectVehicleCustomer(CustomerID: number, VehicleID: number) {
    debugger
    if (CustomerID > 0) {
      this._sharedService.jobObj.jcCustomerObj =
        this._sharedService.jobObj.Customers.find(
          (item) => item.CustomerID == CustomerID
        );
      this._sharedService.jobObj.jcVehicleObj =
        this._sharedService.jobObj.jcVehicleList.find(
          (item) => item.VehicleID == VehicleID
        );
      this._sharedService.jcCustomerMode = true;
      this._sharedService.jcVehicleMode = true;
    } else if (CustomerID == 0) {
      this._sharedService.jobObj.jcCustomerObj = new Customer();
      this._sharedService.jobObj.jcVehicleObj =
        this._sharedService.jobObj.jcVehicleList.find(
          (item) => item.VehicleID == VehicleID
        );
      this._sharedService.jcVehicleMode = true;
      this._sharedService.jcCustomerMode = false;
    }

    this.closeSelectCustomersModal();
    // this._sharedService.jobObj.jcCustomerObj = res.Customers[0];
    // this._sharedService.jobObj.jcVehicleObj = this._sharedService.jobObj.jcVehicleList[0];
  }

  getOldJobCardData() {
    this._jobService
      .getOldJobCardData(this._sharedService.jobObj.JCBasicInfo.OldJobCardID)
      .subscribe(
        (res: any) => {
          this._sharedService.jobObj.JobTasks = res.JobTasks;
          this._sharedService.jobObj.JobParts = res.JobParts;
          this._sharedService.jobObj.JobConcerns = res.JobConcerns;
          this._sharedService.jobObj.JCBasicInfo.OldJobCardID =
            res.JCBasicInfo.OldJobCardID;
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
  }

  addNewCustomer() {
    debugger;
    this.jcIsNew = false;
    this._sharedService.jcCustomerMode = false;
    this._sharedService.jcVehicleMode = false;
    this._sharedService.jobObj.jcCustomerObj = new Customer();
    this._sharedService.jobObj.jcCustomerObj.CityID = 1; // set Amman as default city
    this._sharedService.jobObj.jcVehicleList = new Array<Vehicle>();
    if (this._sharedService.jobObj.AppointmentID == null) {
      this._sharedService.jobObj.jcVehicleObj = new Vehicle();
    }
    if (
      !this._sharedService.customerFilter.match(/[a-z]/i) &&
      this._sharedService.customerFilter.length > 8 &&
      this._sharedService.customerFilter.length < 17
    ) {
      this._sharedService.jobObj.jcCustomerObj.ContactMobile =
        this._sharedService.customerFilter;
    } else if (this._sharedService.customerFilter.length > 17) {
      this._sharedService.jobObj.jcVehicleObj.VIN =
        this._sharedService.customerFilter;
    } else {
      this._sharedService.jobObj.jcVehicleObj.PlateNumber =
        this._sharedService.customerFilter;
    }
    if (this._sharedService.appointmentData != undefined) {
      this._sharedService.jobObj.jcVehicleObj = new Vehicle();
      this._sharedService.jobObj.jcVehicleObj.LicensePlateFront =
        this._sharedService.appointmentData.LicensePlateFront;
      this._sharedService.jobObj.jcVehicleObj.LicensePlateBack =
        this._sharedService.appointmentData.LicensePlateBack;
      this._sharedService.jobObj.jcVehicleObj.PlateNumber =
        this._sharedService.appointmentData.PlateNumber;
      this._sharedService.jobObj.jcCustomerObj.ContactPhone =
        this._sharedService.appointmentData.CustomerMobile;
      this._sharedService.jobObj.JCBasicInfo.FuelTankReading =
        this._sharedService.appointmentData.FuelTankReading;
      this._sharedService.jobObj.JCBasicInfo.MileageImageURL =
        this._sharedService.appointmentData.MileageImageURL;
      this._sharedService.jobObj.JCBasicInfo.Mileage =
        this._sharedService.appointmentData.Mileage;

      this._sharedService.jobObj.JCBasicInfo.MileageUnit =
        this._sharedService.appointmentData.MileageUnit;
      this.imageObj = new Gallery();
      this.imageObj.GalleryID = Math.floor(Math.random() * -10000);
      this.imageObj.ImageURL = this._sharedService.appointmentData.VehicleFront;
      this.imageObj.GalleryTypeID = 107;
      this.imageObj.ObjectID = this.imageObj.GalleryID;
      this.imageObj.IsModified = true;
      this._sharedService.jobObj.Gallery.push(this.imageObj);
      this._sharedService.jobObj.jcVehicleObj.VehicleTypeID =
        this._sharedService.appointmentData.VehicleTypeID;
    }
    this.activatedModalRef.close();
  }

  openAddCustomer(modal: any) {
    this.activatedModalRef = this.modalService.open(modal);
  }

  selectPlateNumber(selectedPlateNum: string) {
    if (selectedPlateNum != "") {
      this._sharedService.jobObj.JCBasicInfo.IsModified = true;
      let index = this._sharedService.jobObj.jcVehicleList.findIndex(
        (item) => item.PlateNumber === selectedPlateNum
      );
      this._sharedService.jobObj.jcVehicleObj =
        this._sharedService.jobObj.jcVehicleList[index];
    }
  }

  checkCardType() {
    if (
      this._sharedService.jobObj.JCBasicInfo.JobCardTypeID == 34 ||
      this._sharedService.jobObj.JCBasicInfo.JobCardTypeID == 35
    ) {
      this._sharedService.jcVehicleMode = true;
      this._sharedService.jcCustomerMode = true;
    } else {
      // if the job card is new then reset the values
      this._sharedService.jobObj.jcCustomerObj = new Customer();
      this._sharedService.jobObj.jcVehicleList = new Array<Vehicle>();
      this._sharedService.jobObj.jcVehicleObj = new Vehicle();
      this._sharedService.jobObj.JobConcerns = new Array<JobConcern>();
      this._sharedService.jobObj.JobTasks = new Array<InspectionResult>();
      this._sharedService.jcVehicleMode = false;
      this._sharedService.jcCustomerMode = false;
    }
  }

  createNewVehicle() {
    if (this._sharedService.jcVehicleMode == true) {
      this._sharedService.selectedPlateNum = "";
      this._sharedService.jobObj.jcVehicleObj = new Vehicle();
    }
    // this._sharedService.isCreatingJob = !this._sharedService.isCreatingJob;
    this._sharedService.jcVehicleMode = !this._sharedService.jcVehicleMode;
  }

  searchVehicleList() {
    if (this._sharedService.jcVehicleMode == false) {
      this._sharedService.selectedPlateNum =
        this._sharedService.jobObj.jcVehicleList[0].PlateNumber;
      this._sharedService.jobObj.jcVehicleObj =
        this._sharedService.jobObj.jcVehicleList[0];
    }
    // this._sharedService.isCreatingJob = !this._sharedService.isCreatingJob;
    this._sharedService.jcVehicleMode = !this._sharedService.jcVehicleMode;
  }

  addNote() {
    this.note = new Note();
    if (this._sharedService.jobObj.Notes == undefined) {
      this._sharedService.jobObj.Notes = new Array<Note>();
    }
    this.note.NoteID = Math.floor(Math.random() * -1000 - 1);
    this.note.ObjectID = this._sharedService.jobObj.JCBasicInfo.JobCardID;
    this.note.IsModified = true;
    this.note.NoteInfo = "";
    this.note.ObjectTypeID = 82;
    this._sharedService.jobObj.Notes.push(this.note);
  }

  removeNote(note: Note) {
    if (note.NoteID > 0) {
      this._jobService.deleteNote(note.NoteID).subscribe(
        (res: any) => {
          this._sharedService.jobObj.Notes.splice(
            this._sharedService.jobObj.Notes.findIndex(
              (item) => item.NoteID == note.NoteID
            ),
            1
          );
          this._sharedService.success("Success", "Note deleted successfully");
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      this._sharedService.jobObj.Notes.splice(
        this._sharedService.jobObj.Notes.findIndex(
          (item) => item.NoteID == note.NoteID
        ),
        1
      );
    }
    this.note = new Note();
  }

  closeModal() {
    this.jcIsNew = true;
    this.activatedModalRef.close();
  }

  // uploadImage(fileInput: any, imageType: number) {
  //   if (this._sharedService.validateFile(fileInput.target.files[0].name)) {
  //     var option: ResizeOptions = new ResizeOptions();
  //     option.Resize_Quality = 80;
  //     option.Resize_Type = 'image/jpg';
  //     ImageCompressService.filesToCompressedImageSourceEx(fileInput.target.files, option).then(observableImages => {
  //       observableImages.subscribe((image) => {
  //         // images.push(image);
  //         this._commonService.saveImage(image.imageDataUrl).subscribe((res: any) => {
  //           this._sharedService.jobObj.JCBasicInfo.MileageImageURL = res;
  //           this._sharedService.jobObj.JCBasicInfo.IsModified = true;
  //         })
  //       }, (error) => {
  //         console.log("Error while converting");
  //       });
  //     });
  //   } else {
  //     this._sharedService.warning("Warning", "Only png and jpeg formats are allowed");
  //   }
  // }

  // documents images
  uploadTaxFile($event: any) {
    if ($event.target.files.length > 0) {
      let theFile = <File>$event.target.files[0];
      let file = new FileToUpload();

      // Set File Information
      this.fileName = theFile.name;
      file.fileName = theFile.name;
      file.fileSize = theFile.size;
      file.fileType = theFile.type;
      file.lastModifiedTime = theFile.lastModified;

      // Use FileReader() object to get file to upload
      // NOTE: FileReader only works with newer browsers
      let reader = new FileReader();

      // Setup onload event for reader
      reader.onload = () => {
        // Store base64 encoded representation of file
        file.fileAsBase64 = reader.result.toString();
        this._sharedService.uploadPercentage = 100;
        // POST to server
        this._commonService.saveFile(file).subscribe(
          (res) => {
            console.log("res", res);

            if (res != undefined) {
              this._sharedService.jobObj.JCBasicInfo.TaxDocumentURL =
                res.toString();
              this._sharedService.jobObj.JCBasicInfo.IsModified = true;
            }
            this._sharedService.success("File Uploaded");
            $event = undefined;
          },
          (error) => {
            this._sharedService.error(error.Message);
          }
        );
      };

      // Read the file
      reader.readAsDataURL(theFile);
    }
  }

  openFile() {
    var url =
      this._sharedService.baseUrl +
      this._sharedService.jobObj.JCBasicInfo.TaxDocumentURL;
    //window.open(url, '_blank');

    var fileURL: any = url;
    var a = document.createElement("a");
    a.href = fileURL;
    a.target = "_blank";
    // Don't set download attribute
    // a.download = "Example.pdf";
    a.click();
  }

  ContractDetailsModal(modal: any) {
    ///get contract consumption data here and map accordingly

    this.vehicleID = this._sharedService.jobObj.jcVehicleObj.VehicleID;

    this.activatedModalRef2 = this.modalService.open(modal, {
      size: "lg",
      windowClass: "modalTop",
    });
  }
  closeContractDetailsModal(event?: any) {
    this.activatedModalRef2.close();
  }

  ContractVerificationModal(modal: any) {
    this.activatedModalRef2 = this.modalService.open(modal, {
      size: "lg",
    });
  }

  closContractVerificationModal() {
    this.activatedModalRef2.close();
  }

  checkContract(serviceTypeID: number) {
    if (
      serviceTypeID == 42 &&
      this._sharedService.jobObj.jcVehicleObj.IsContractVehicle == true
    ) {
      return 1;
    }
  }
  openNewTab(jobCardID: number) {
    var url = "update-job/" + jobCardID + "/basic-info";
    window.open(url, "_blank");
  }

  openSelectCustomersModal(modal: any) {
    if (this.isOpened == false) {
      this.activatedModalRef2 = this.modalService.open(modal, {
        size: "lg",
      });
      this.isOpened = true;
    }
  }

  closeSelectCustomersModal() {
    this.activatedModalRef2.close();
    this.isOpened = false;
  }

  // for creating new contract on new tab
  createContract(VehicleID: number) {
    var url = "/vehicle/create-vehicle?VehicleID=" + VehicleID;
    window.open(url, "_blank");
  }
//   previewImage(modal: any, header: string, url: string){
//     this.modalHeader = header;
// console.log(modal);
// console.log(header);
// console.log(url);
// this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
//   }
}
