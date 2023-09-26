import { Customer } from './../../../models/customer';
import { CustomerService } from 'app/services/customer.service';
import { Colors } from "./../../../models/colors";
import { Component, OnInit } from "@angular/core";
import { VehicleService } from "app/services/vehicle.service";
import { SharedService } from "app/services/shared.service";
import { Vehicle } from "app/models/vehicle";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonMeta } from "app/models/common-meta";
import { ImageCompressService, ResizeOptions } from "ng2-image-compress";
import { CommonService } from "app/services/common.service";
import { VehicleContract } from "app/models/vehicle-contract";
import { CreateVehicle } from "app/models/create-vehicle";
import { DatePipe } from "@angular/common";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { GeneralVehicles } from "app/models/general-vehicles";
import { JobService } from "app/services/job.service";
import { debug } from "console";
import { concat, Observable, of, Subject } from "rxjs";
import { catchError, distinctUntilChanged, switchMap, take, tap, debounceTime, filter } from 'rxjs/operators';




@Component({
  selector: "app-create-vehicle",
  templateUrl: "./create-vehicle.component.html",
  styleUrls: ["./create-vehicle.component.scss"],
})
export class CreateVehicleComponent implements OnInit {
  //vehicleObj: Vehicle;
  //vehicleContractObj : VehicleContract;
  createVehicle: CreateVehicle;
  colorObj: Colors;
  _vehicleMeta: CommonMeta;
  vehicleID: number;
  modalHeader: string;
  imageURL: string;
  activatedModalRef: NgbModalRef;
  SeriesMake: string;
  SeriesModel: string;
  SeriesYear: number;
  generalVehicle: GeneralVehicles;
  groupName: string = null;
  MinYear: number;
  MaxYear: number;
  groupnameCount: number;
  ModelName: string;
  modelGroupName: string;
  ShowMoreBodyType: boolean = false;
  customerName : Customer;

  CustomerSuggessions$: Observable<Customer[]>;
  itemCodeInput = new Subject<string>();
  loading: boolean;
  Customer:string;
  isValid: boolean = true;
localCustomerID:number;




  // selectedValue:string = " ";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _vehicleService: VehicleService,
    public _sharedService: SharedService,
    private _router: Router,
    private _commonService: CommonService,
    public datePipe: DatePipe,
    private modalService: NgbModal,
    public _jobService: JobService,
    public _customerService: CustomerService
  ) {}

  ngOnInit() {
    this.createVehicle = new CreateVehicle();
    this.generalVehicle = new GeneralVehicles();

    if (this._sharedService.CustomerID_CP != undefined) {
      this.createVehicle.vehicleObj.CustomerID =
        this._sharedService.CustomerID_CP;
    }

    //this.vehicleObj = new Vehicle();
    //this.vehicleContractObj = new VehicleContract();
    this._vehicleMeta = new CommonMeta();
    this.route.queryParams.subscribe((params) => {
      this.vehicleID = +params["VehicleID"];
    });
    this.getMetaData();
    if (this.vehicleID >= 1) {
      this.getSingleVehicle();
    }
  }

  searchfn() {
    this.CustomerSuggessions$ = concat(
      of([]), // default items
      this.itemCodeInput.pipe(
        filter(res => {
          return res !== null && res.length >= 2;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.loading = true),
        switchMap(term => {
          return this._customerService.searchCustomer(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.loading = false)
          );
        })
      )
    );
    if (this.CustomerSuggessions$ != null) {
      this.CustomerSuggessions$.subscribe((res: any) => {
        this.customerName = res;
        
        
      });
    }
  }

  // searchfn() {
  //   debugger
  //   this.CustomerSuggessions$ = concat(
  //     of([]), // default items
  //     this.itemCodeInput.pipe(
  //       distinctUntilChanged(),
  //       // tap(() => this.loading = true),
  //       switchMap(term => this._customerService.searchCustomer(
  //         term == '' ? undefined : term).pipe(
  //         catchError(() => of([])), // empty list on error
  //         tap(() => this.loading = false)
  //       ))
  //     )
  //   );
  // }
  onClickCustomerDropdown(){
    this.searchfn();
    
    this.itemCodeInput.next('');
  }

  getMetaData() {
    this._vehicleService.getVehicleMetaData().subscribe(
      (res: any) => {
        this._vehicleMeta = res;
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }
  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
  getSingleVehicle() {
    this._vehicleService.getSingleVehicle(this.vehicleID).subscribe(
      (res: any) => {
        this.createVehicle = res;
       if (this.createVehicle.vehicleContractObj == undefined) {
          this.createVehicle.vehicleContractObj = new VehicleContract();
        }
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  onSaveVehicle() {
    var name = this.createVehicle.vehicleObj.PlateNumber.trim();
    if(name == null ||name == ""){
      this.isValid = false;
      this.createVehicle.vehicleObj.PlateNumber = undefined;
      this._sharedService.error("Error", "Enter a valid Plate Number");
      
    }
    else this.isValid = true;

    if(this.isValid == true){
    debugger;
    this.createVehicle.vehicleObj.WorkshopID =
      this._sharedService.currentWorkshopID;
    this.createVehicle.vehicleObj.CreatedBy =
      this._sharedService.logged_user_id;
    this.createVehicle.vehicleObj.EngineTypeName =
      this._sharedService._commonMeta.objectTypes.find(
        (item) =>
          item.ObjectNameEnglish == "Engine" &&
          item.ObjectTypeID == this.createVehicle.vehicleObj.EngineTypeID
      ).TypeNameEnglish;
    this.createVehicle.vehicleObj.VehicleTypeName =
      this._sharedService._commonMeta.objectTypes.find(
        (item) =>
          item.ObjectNameEnglish == "Body" &&
          item.ObjectTypeID == this.createVehicle.vehicleObj.VehicleTypeID
      ).TypeNameEnglish;
    this.createVehicle.vehicleObj.SeriesID =
      this.generalVehicle.GeneralVehicles.find(
        (item) => item.EngineCode == this.createVehicle.vehicleObj.EngineCode
      ).SerialNumber;
    this.createVehicle.vehicleObj.ArabicMakeName =
      this.generalVehicle.GeneralVehicles.find(
        (item) => item.EngineCode == this.createVehicle.vehicleObj.EngineCode
      ).EnglishMakeName;
    this.createVehicle.vehicleObj.ArabicModelName =
      this.generalVehicle.GeneralVehicles.find(
        (item) => item.EngineCode == this.createVehicle.vehicleObj.EngineCode
      ).EnglishModelName;

    console.log(this.createVehicle);
    let faceliftobj = this._sharedService._commonMeta.objectTypes.filter(
      (item) => item.ObjectTypeID == 148
    );

    this._vehicleService.saveVehicle(this.createVehicle).subscribe(
      (res) => {
        this._sharedService.success("Success", "Vehicle saved successfully");
        this._router.navigate(["/", "vehicle", "list"]);
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }
}

  onUpdateVehicle() {
    debugger;
    this.createVehicle.vehicleObj.ModifiedBy =
      this._sharedService.logged_user_id;
   
      // if(this.localCustomerID!=undefined){
      //   this.createVehicle.vehicleObj.CustomerID=this.localCustomerID;
      // }
      // console.log(this.createVehicle.vehicleObj);
      // console.log(this.createVehicle.vehicleObj.CustomerID);

    this._vehicleService.updateVehicle(this.createVehicle).subscribe(
      (res) => {
        this._sharedService.success("Success", "Vehicle updated successfully");
        this._router.navigate(["/", "vehicle", "list"]);
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
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
                if (imageType == 1) {
                  this.createVehicle.vehicleObj.LicensePlateFront = res;
                } else {
                  this.createVehicle.vehicleObj.LicensePlateBack = res;
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
    this.createVehicle.vehicleObj.VehicleRegionID =
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
        this.vehicleID
      )
      .subscribe(
        (res) => {
          debugger;
        console.log()
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
  }

  setDates() {
    var myDate = new Date();
    var date = this.datePipe.transform(myDate, "yyyy-MM-dd");
    this.createVehicle.vehicleContractObj.SubscriptionDate =
      this.parseDate(date);

    this.createVehicle.vehicleContractObj.ExpiryDate = this.parseDate(
      this.datePipe.transform(
        myDate.setFullYear(myDate.getFullYear() + 1),
        "yyyy-MM-dd"
      )
    );
  }

  createCustomer(event: any) {
    if(event==undefined){
      return
    }
    
   if (event.CustomerID == undefined) {
      var abc = event.CustomerFullName;
      this._router.navigate(["/", "customer", "create-customer"]);
    }else{
      this.createVehicle.vehicleObj.CustomerID=event.CustomerID;
   
    }
  }

  getSeries() {
    debugger;
    this.SeriesMake = this._sharedService._commonMeta.Makes.find(
      (item) => item.MakeID == this.createVehicle.vehicleObj.MakeID
    ).EnglishMakeName;
    this.SeriesModel = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this.createVehicle.vehicleObj.ModelID
    ).EnglishModelName;
    this.SeriesYear = this.createVehicle.vehicleObj.ProductionYear;

    if (
      this.createVehicle.vehicleObj.MakeID == 4 ||
      this.createVehicle.vehicleObj.MakeID == 5
    ) {
      this.groupName = this.createVehicle.vehicleObj.GroupName;
    } else {
      this.groupName = null;
    }

    if (
      this.createVehicle.vehicleObj.MakeID != undefined &&
      this.createVehicle.vehicleObj.ModelID &&
      this.createVehicle.vehicleObj.ProductionYear
    ) {
      debugger;
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
            } else {     this. createVehicle.vehicleObj.VehicleTypeID=
              this._sharedService._commonMeta.objectTypes.find(
                (item) =>
                  item.ObjectNameEnglish == "Body" &&
                  item.TypeNameEnglish.toLowerCase() ==
                    this.generalVehicle.GeneralVehicles[0].BodyType.toLowerCase()
              ).ObjectTypeID;
              let EngineTypeID=
             // this.createVehicle.vehicleObj.EngineTypeID =
                this._sharedService._commonMeta.objectTypes.find(
                  (item) =>
                    item.ObjectNameEnglish == "Engine" &&
                    item.TypeNameEnglish.toLowerCase()==
                      this.generalVehicle.GeneralVehicles[0].FuelType1.toLowerCase()
                );

                if(EngineTypeID!=undefined){
                  this.createVehicle.vehicleObj.EngineTypeID =EngineTypeID.ObjectTypeID;
                }
              

          
              this.createVehicle.vehicleObj.FaceLiftTypeID;
              if (
                this.generalVehicle.GeneralVehicles[0].face_lift != undefined
              ) {
                if (this.generalVehicle.GeneralVehicles[0].face_lift == true) {
                  this.createVehicle.vehicleObj.FaceLiftTypeID = 148;
                } else if (
                  this.generalVehicle.GeneralVehicles[0].face_lift == false
                ) {
                  this.createVehicle.vehicleObj.FaceLiftTypeID = 149;
                }
              }
              // var test = this.generalVehicle.GeneralVehicles[0].face_lift.toString();
              // this.createVehicle.vehicleObj.FaceLiftTypeID  = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectNameEnglish == "FaceLift" && item.TypeNameEnglish == test).ObjectTypeID;
            }
          },
          (error) => {}
        );
    }
  }

  selectCylinderType(ObjectTypeID: any) {
    debugger;
    if (this.createVehicle.vehicleObj.EngineCapacity != undefined) {
      if (this.createVehicle.vehicleObj.EngineCapacity < 1400) {
        var cylinderType = this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "CylinderCount" &&
            item.TypeNameEnglish == "3 Cylinder"
        );
        this.createVehicle.vehicleObj.CylinderTypeID =
          cylinderType.ObjectTypeID;
      } else if (
        this.createVehicle.vehicleObj.EngineCapacity >= 1400 &&
        this.createVehicle.vehicleObj.EngineCapacity < 2500
      ) {
        var cylinderType = this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "CylinderCount" &&
            item.TypeNameEnglish == "4 Cylinder"
        );
        this.createVehicle.vehicleObj.CylinderTypeID =
          cylinderType.ObjectTypeID;
      } else if (
        this.createVehicle.vehicleObj.EngineCapacity >= 2500 &&
        this.createVehicle.vehicleObj.EngineCapacity <= 3500
      ) {
        var cylinderType = this._sharedService._commonMeta.objectTypes.find(
          (item) =>
            item.ObjectNameEnglish == "CylinderCount" &&
            item.TypeNameEnglish == "6 Cylinder"
        );
        this.createVehicle.vehicleObj.CylinderTypeID =
          cylinderType.ObjectTypeID;
      } else if (this.createVehicle.vehicleObj.EngineCapacity >= 4200) {
        if (ObjectTypeID == undefined) {
          var cylinderType = this._sharedService._commonMeta.objectTypes.find(
            (item) =>
              item.ObjectNameEnglish == "CylinderCount" &&
              item.TypeNameEnglish == "8 Cylinder"
          );
          this.createVehicle.vehicleObj.CylinderTypeID =
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
  onRemoveYear() {
    this.MinYear = null;
    this.MaxYear = null;

    this.createVehicle.vehicleObj.ProductionYear = undefined;
  }

  getVehicleSeries() {
    debugger;
    let modelObject = this._sharedService._commonMeta.Models.filter(
      (item) => item.ModelID == this.createVehicle.vehicleObj.ModelID
    );
    if (modelObject.length > 0) {
      this.createVehicle.vehicleObj.EnglishModelName =
        modelObject[0].EnglishModelName;
    } else {
      this.createVehicle.vehicleObj.EnglishModelName = undefined;
    }

    this.SeriesMake = this._sharedService._commonMeta.Makes.find(
      (item) => item.MakeID == this.createVehicle.vehicleObj.MakeID
    ).EnglishMakeName;
    this.SeriesModel = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this.createVehicle.vehicleObj.ModelID
    ).EnglishModelName;
    this.SeriesYear = null;

    // if(this.createVehicle.vehicleObj.MakeID == 4 || this.createVehicle.vehicleObj.MakeID == 5){
    this.groupName = this.createVehicle.vehicleObj.GroupName;
    // }
    // else
    // {
    //     this.groupName = null;
    // }

    if (
      this.createVehicle.vehicleObj.MakeID != undefined &&
      this.createVehicle.vehicleObj.ModelID
    ) {
      debugger;
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
                this.createVehicle.vehicleObj.VehicleTypeID =
                  this._sharedService._commonMeta.objectTypes.find(
                    (item) =>
                      item.ObjectNameEnglish == "Body" &&
                      item.TypeNameEnglish.toLowerCase() ==
                        filteredGenralVehicle[0].BodyType.toLowerCase()
                  ).ObjectTypeID;
                this.createVehicle.vehicleObj.EngineTypeID =
                  this._sharedService._commonMeta.objectTypes.find(
                    (item) =>
                      item.ObjectNameEnglish == "Engine" &&
                      item.TypeNameEnglish.toLowerCase() ==
                        filteredGenralVehicle[0].FuelType1.toLowerCase()
                  ).ObjectTypeID;
              }

              // var test = this.generalVehicle.GeneralVehicles[0].face_lift.toString();
              // this.createVehicle.vehicleObj.FaceLiftTypeID  = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectNameEnglish == "FaceLift" && item.TypeNameEnglish == test).ObjectTypeID;
              this.MinYear = this.generalVehicle.MinYear;
              this.MaxYear = this.generalVehicle.MaxYear;
              console.log(this.generalVehicle);
            }
          },
          (error) => {}
        );
    }
  }

  changeMake() {
    let makeobj = this._sharedService._commonMeta.Makes.filter(
      (item) => item.MakeID == this.createVehicle.vehicleObj.MakeID
    );
    if (makeobj.length > 0) {
      this.createVehicle.vehicleObj.EnglishMakeName =
        makeobj[0].EnglishMakeName;
    } else {
      this.createVehicle.vehicleObj.EnglishMakeName = undefined;
    }
    var index = this._sharedService._commonMeta.Models.findIndex(
      (item) =>
        item.MakeID == this.createVehicle.vehicleObj.MakeID &&
        item.GroupName != undefined
    );
    if (index > -1) {
      var make = this._sharedService._commonMeta.Models.filter(
        (item) =>
          item.MakeID == this.createVehicle.vehicleObj.MakeID &&
          item.GroupName != undefined
      );
      this.groupnameCount = make.length;
    }

    if (index == -1) {
      this.groupnameCount = undefined;
    }
  }

  //   changeModel(){
  //     debugger;
  //    this.ModelName = this._sharedService._commonMeta.Models.find(item=> item.ModelID == this.createVehicle.vehicleObj.ModelID).EnglishModelName;
  //    this.modelGroupName = this._sharedService._commonMeta.Models.find(item => item.ModelID == this.createVehicle.vehicleObj.ModelID).GroupName;

  //    if(this._sharedService.jobObj.jcVehicleObj.GroupName == undefined && this.modelGroupName != undefined){
  //    this.createVehicle.vehicleObj.GroupName = this.modelGroupName;
  //    }
  //  }

  trackByFn(item: Customer) {
    return item.CustomerID;
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
