import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from 'app/services/part.service';
import { SharedService } from 'app/services/shared.service';
import { PartMeta } from 'app/models/part-meta';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartInfo } from 'app/models/part-info';
import { VendorPartPrice } from 'app/models/vendor-part-price';
import { AutomotivePartVehicle } from 'app/models/automotive-part-vehicle';
import { NgForm } from '@angular/forms';
import { PartFilter } from 'app/models/part-filter';
import { SubstitutePart } from 'app/models/substitute-part';
import { ResizeOptions, ImageCompressService } from 'ng2-image-compress';
import { CommonService } from 'app/services/common.service';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { stringify } from 'querystring';
import { JobService } from 'app/services/job.service';
import { GeneralVehicle } from 'app/models/general-vehicle';
import { Vehicle } from 'app/models/vehicle';
import { VehicleService } from 'app/services/vehicle.service';
import { CreateVehicle } from 'app/models/create-vehicle';
import { GeneralVehicles } from 'app/models/general-vehicles';


@Component({
  selector: 'app-create-part',
  templateUrl: './create-part.component.html',
  styleUrls: ['./create-part.component.scss']
})
export class CreatePartComponent implements OnInit {
  partInfoObj: PartInfo;
  cPage: number = 1;
  PartsData = [];
  vehicleData = [];
  filter: PartFilter;
  partID: number;
  _meta: PartMeta;
  activatedModalRef: NgbModalRef;
  VendorPartPriceObj: VendorPartPrice;
  AutomotivePartVehicleObj: AutomotivePartVehicle;
  SubstitutePartObj: SubstitutePart;
  SeriesID: string;
  SeriesMake: string;
  SeriesModel: string;
  SeriesYear: number;
  generalVehicle: GeneralVehicles;
  createVehicle: CreateVehicle;
  EngineTypeName: string;
  VehicleTypeName: string;
  groupName: string = null;
  MinYear: number;
  MaxYear: number;
  groupnameCount: number;
  ModelName: string;
  modelGroupName: string;
  ShowMoreBodyType: boolean = false;



  
  // VendorVar: boolean;


  constructor(private _vehicleService: VehicleService,private route: ActivatedRoute, private modalService: NgbModal, private _partService: PartService, public _sharedService: SharedService, private _router: Router, private _commonService: CommonService, private _jobService:JobService) { }



  ngOnInit() {
    this.partInfoObj = new PartInfo();
    this.createVehicle = new CreateVehicle();
    this.generalVehicle = new GeneralVehicles();
    this.partInfoObj.AutomotivePart.UnitQuantity = 1;
    this._meta = new PartMeta();
    this.route.queryParams.subscribe(params => {
      this.partID = +params['PartID']; // (+) converts string 'id' to a number   
    });
    this.getMetaData();
    if (this.partID >= 1) {
      this.getSinglePart();
    }
    this.filter = new PartFilter();

    
  }

  @ViewChild('partForm', { static: false })
  form: NgForm;


  getMetaData() {
    this._partService.getMetaData().subscribe((res: any) => {
      this._meta = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }
  setTaskTime() {
    var hours = 0;
    if (this.partInfoObj.AutomotivePart.Hours != undefined && this.partInfoObj.AutomotivePart.Hours != null) {
      hours = +this.partInfoObj.AutomotivePart.Hours * 60;
    }
    if (this.partInfoObj.AutomotivePart.Minutes == undefined) {
      this.partInfoObj.AutomotivePart.Minutes = 0;
    }
    if (this.partInfoObj.AutomotivePart.Minutes != undefined && this.partInfoObj.AutomotivePart.Minutes != null) {
      this.partInfoObj.AutomotivePart.LaborTime = hours + +this.partInfoObj.AutomotivePart.Minutes;
    }
  }
  getSinglePart() {
    this._partService.getSinglePart(this.partID).subscribe((res: any) => {
    
      this.partInfoObj = res;
      if (this.partInfoObj.AutomotivePart.LaborTime != undefined) {
        this.partInfoObj.AutomotivePart.Hours = Math.floor(this.partInfoObj.AutomotivePart.LaborTime / 60);
        this.partInfoObj.AutomotivePart.Minutes = this.partInfoObj.AutomotivePart.LaborTime % 60;
      }
      if (this._meta.AutomotivePart != undefined) {
        this._meta.AutomotivePart.splice(this._meta.AutomotivePart.findIndex(item => item.AutomotivePartID == this.partInfoObj.AutomotivePart.AutomotivePartID), 1)
      }

    }, error => {
      this._sharedService.error('Error', error.Message);
    });
  }



  onUpdatePart() {
    if (this.form.dirty) {
      this.partInfoObj.AutomotivePart.IsModified = true;
    }
    var sub: any;
    var main: any;
    var subSub: any;
    this.setTaskTime();
    main = this.partInfoObj.AutomotivePart.MainCategoryID;
    sub = this.partInfoObj.AutomotivePart.SubCategoryID;
    subSub = this.partInfoObj.AutomotivePart.SubSubCategoryID;
    if (main.label != undefined) {
      this.partInfoObj.AutomotivePart.MainCategoryID = -1;
      this.partInfoObj.AutomotivePart.MainCategoryNameArabic = main.label;
    }
    if (sub.label != undefined) {
      this.partInfoObj.AutomotivePart.SubCategoryID = -1;
      this.partInfoObj.AutomotivePart.SubCategoryNameArabic = sub.label;
    }
    if (subSub != undefined) {
      if (subSub.label != undefined) {
        this.partInfoObj.AutomotivePart.SubSubCategoryID = -1;
        this.partInfoObj.AutomotivePart.SubSubCategoryNameArabic = subSub.label;
      }
    }
    this.partInfoObj.AutomotivePart.ModifiedBy = this._sharedService.logged_user_id;
    this._partService.updatePart(this.partInfoObj).subscribe(res => {
      this._sharedService.success('Success', 'Part updated successfully');
      this._router.navigate(['/', 'part', 'list']);
    }, error => {
      this._sharedService.error('Error', error.Message);
    });
  }

  block_special_char(event) {
    var temp;
    temp = event.charCode;  //         temp = event.keyCode;  (Both can be used)
    return ((temp > 64 && temp < 91) || (temp > 96 && temp < 123) || temp == 45 || temp == 32 || (temp >= 48 && temp <= 57));
  }

  //calculate netPrice
  calcNetPrice() {
    // console.log(this.partInfoObj.AutomotivePart.PurchasePrice);
    // console.log(this.partInfoObj.AutomotivePart.Tax);
    debugger
    if(this.partInfoObj.AutomotivePart.PurchasePrice != undefined && this.partInfoObj.AutomotivePart.SellingPrice != undefined && this.partInfoObj.AutomotivePart.Tax != undefined)
    this.partInfoObj.AutomotivePart.NetPrice = +this.partInfoObj.AutomotivePart.SellingPrice + (+this.partInfoObj.AutomotivePart.SellingPrice * (+this.partInfoObj.AutomotivePart.Tax / 100));
  }

  //#region  Add Vendor Part price  

  openAddVendorModel(modal: any) {
    this.VendorPartPriceObj = new VendorPartPrice();
    this.activatedModalRef = this.modalService.open(modal, { size: 'lg' });
  }
  dismissModal() {
    this.activatedModalRef.dismiss();
  }

  closeModal() {
    this.activatedModalRef.close();
  }

  onSaveVendorPart() {
    debugger
    if (this.partInfoObj.VendorPartPrice == undefined) {
      this.partInfoObj.VendorPartPrice = new Array<VendorPartPrice>();
    }
    this.VendorPartPriceObj.IsModified = true;
    this.VendorPartPriceObj.VendorPartPriceID = Math.floor((Math.random() * -1000) - 1);
    this.VendorPartPriceObj.VendorName = this._meta.PartsVendors.find(item => item.VendorID == this.VendorPartPriceObj.VendorID).VendorName;
    this.partInfoObj.VendorPartPrice.push(this.VendorPartPriceObj);
    this.activatedModalRef.close();
  }

  editVendorModel(modal: any, vpp: VendorPartPrice) {
    debugger
    // this.VendorVar = true;
    this.VendorPartPriceObj = vpp;
    this.activatedModalRef = this.modalService.open(modal, { size: 'lg' });
  }

  onEditVendorPart() {
    this.VendorPartPriceObj.IsModified = true;
    this.VendorPartPriceObj.VendorName = this._meta.PartsVendors.find(item => item.VendorID == this.VendorPartPriceObj.VendorID).VendorName;
    // this.partInfoObj.VendorPartPrice.find(item => item.VendorPartPriceID == this.VendorPartPriceObj.VendorPartPriceID);
    // this.VendorVar = false;
    this.activatedModalRef.close()
  }

  deleteVendorPartPrice() {
    var index = this.partInfoObj.VendorPartPrice.findIndex(item => item.VendorPartPriceID == this.VendorPartPriceObj.VendorPartPriceID)
    if (this.VendorPartPriceObj.VendorPartPriceID < 0) {
      this.partInfoObj.VendorPartPrice.splice(index, 1)
      this.activatedModalRef.close()
    }
    else {
      this._partService.deleteVendorPartPrice(this.VendorPartPriceObj).subscribe(res => {
        this.partInfoObj.VendorPartPrice.splice(index, 1)
        this.activatedModalRef.close();
        this._sharedService.success('success', 'Part vendor deleted successfully')
      }), error => {
        this._sharedService.error('Error', error.Message);
      };
      this.activatedModalRef.close();
    }
  }

  openDeleteVendorModel(modal: any, vpp: VendorPartPrice) {
    this.VendorPartPriceObj = vpp;
    this.activatedModalRef = this.modalService.open(modal);
  }
  //#endregion

  //#region  code for vehicle Save

  openAddVehicleModel(modal: any) {
    this.createVehicle = new CreateVehicle;
    this.AutomotivePartVehicleObj = new AutomotivePartVehicle();
    this.generalVehicle = new GeneralVehicles();
    this.activatedModalRef = this.modalService.open(modal, { size: 'lg' , backdrop: 'static' });
  }

  editVehicleModel(modal: any, apv: AutomotivePartVehicle) {
    this.AutomotivePartVehicleObj = apv;
    this.activatedModalRef = this.modalService.open(modal, { size: 'lg' });
  }

  onSaveVehiclePart() {
    this.createVehicle = new CreateVehicle;
    if (this.partInfoObj.AutomotivePartVehicle == undefined) {
      this.partInfoObj.AutomotivePartVehicle = new Array<AutomotivePartVehicle>();
    }
    this.AutomotivePartVehicleObj.IsModified = true;
    this.AutomotivePartVehicleObj.AutomotivePartVehicleID = Math.floor((Math.random() * -1000) - 1);
    this.AutomotivePartVehicleObj.EnglishMakeName = this._sharedService._commonMeta.Makes.find(item => item.MakeID == this.AutomotivePartVehicleObj.MakeID).EnglishMakeName;
    this.AutomotivePartVehicleObj.EnglishModelName = this._sharedService._commonMeta.Models.find(item => item.ModelID == this.AutomotivePartVehicleObj.ModelID).EnglishModelName;
    
    
    this.partInfoObj.AutomotivePartVehicle.push(this.AutomotivePartVehicleObj);
  
    this.createVehicle.vehicleObj.EnglishMakeName = this.AutomotivePartVehicleObj.EnglishMakeName;
    this.createVehicle.vehicleObj.EnglishModelName = this.AutomotivePartVehicleObj.EnglishModelName;
    this.createVehicle.vehicleObj.ProductionYear =  this.AutomotivePartVehicleObj.ProductionYear;
    this.createVehicle.vehicleObj.EngineTypeName = this._sharedService._commonMeta.objectTypes.find( (item) => item.ObjectNameEnglish == "Engine" && item.ObjectTypeID ==this.AutomotivePartVehicleObj.EngineTypeID).TypeNameEnglish;
    this.createVehicle.vehicleObj.VehicleTypeName = this._sharedService._commonMeta.objectTypes.find( (item) => item.ObjectNameEnglish == "Body" && item.ObjectTypeID ==this.AutomotivePartVehicleObj.VehicleTypeID).TypeNameEnglish;
    this.createVehicle.vehicleObj.EngineCapacity = this.AutomotivePartVehicleObj.EngineCapacity;
    this.createVehicle.vehicleObj.EngineCode = this.AutomotivePartVehicleObj.EngineCode;
    this.createVehicle.vehicleObj.ArabicMakeName =     this.createVehicle.vehicleObj.EnglishMakeName;
    this.createVehicle.vehicleObj.ArabicModelName = this.createVehicle.vehicleObj.EnglishModelName;

    
    this._partService.PartVehicleSeries(this.createVehicle).subscribe(
      (res) => {

        this.SeriesID = res;
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }

    );

    this.activatedModalRef.close();
  }

  onEditVehiclePart() {


    this.AutomotivePartVehicleObj.IsModified = true;
    this.AutomotivePartVehicleObj.EnglishMakeName = this._sharedService._commonMeta.Makes.find(item => item.MakeID == this.AutomotivePartVehicleObj.MakeID).EnglishMakeName;

    this.AutomotivePartVehicleObj.EnglishModelName = this._sharedService._commonMeta.Models.find(item => item.ModelID == this.AutomotivePartVehicleObj.ModelID).EnglishModelName;
    // this.partInfoObj.AutomotivePartVehicle.find(item => item.AutomotivePartVehicleID == this.AutomotivePartVehicleObj.AutomotivePartVehicleID);
    this.activatedModalRef.close()
  }

  openDeleteVehicleModel(modal: any, apv: AutomotivePartVehicle) {
    this.AutomotivePartVehicleObj = apv;
    this.activatedModalRef = this.modalService.open(modal);
  }

  deletePartVehicle() {
    var index = this.partInfoObj.AutomotivePartVehicle.findIndex(item => item.AutomotivePartVehicleID == this.AutomotivePartVehicleObj.AutomotivePartVehicleID)
    if (this.AutomotivePartVehicleObj.AutomotivePartVehicleID < 0) {
      this.partInfoObj.AutomotivePartVehicle.splice(index, 1);
      this.activatedModalRef.close();
    }
    else {
      this._partService.deleteAutomotivePartVehicle(this.AutomotivePartVehicleObj).subscribe(res => {
        this.partInfoObj.AutomotivePartVehicle.splice(index, 1)
        this.activatedModalRef.close();
        this._sharedService.success('success', 'Part vendor deleted successfully')
      }), error => {
        this._sharedService.error('Error', error.Message);
      };
      this.activatedModalRef.close();
    }

  }

  //#endregion

  // #region substitute part

  openSubstitutePartModel(modal: any) {

    this.SubstitutePartObj = new SubstitutePart();
    this.activatedModalRef = this.modalService.open(modal);
  }
  onSaveSubstitutePart() {
    if (this.partInfoObj.SubstitutePart == undefined) {
      this.partInfoObj.SubstitutePart = new Array<SubstitutePart>();
    }
    this.SubstitutePartObj.IsModified = true;
    this.SubstitutePartObj.AutomotivePartID = this.SubstitutePartObj.SubstituteID;
    // this.SubstitutePartObj.SubstituteID = this.SubstitutePartObj.AutomotivePartID; 
    this.SubstitutePartObj.SubstitutePartID = Math.floor((Math.random() * -1000) - 1);
    var partInfo = this._meta.AutomotivePart.find(item => item.AutomotivePartID == this.SubstitutePartObj.SubstituteID);
    this.SubstitutePartObj.PartNameEnglish = partInfo.PartNameEnglish;
    this.SubstitutePartObj.ItemCode = partInfo.ItemCode;
    this.SubstitutePartObj.PurchasePrice = partInfo.PurchasePrice;
    this.SubstitutePartObj.SellingPrice = partInfo.SellingPrice;
    this.SubstitutePartObj.Vendors = 'Update and refresh to get vendors';
    this.partInfoObj.SubstitutePart.push(this.SubstitutePartObj);
    this.activatedModalRef.close();
  }
  editSubstituteModel(modal: any, sp: SubstitutePart) {
    this.SubstitutePartObj = sp;
    this.activatedModalRef = this.modalService.open(modal)
  }
  onEditSubstitutePart() {
    this.SubstitutePartObj.IsModified = true;
    // this.partInfoObj.SubstitutePart.find(item => item.SubstitutePartID == this.SubstitutePartObj.SubstitutePartID);
    this.SubstitutePartObj.PartNameEnglish = this._meta.AutomotivePart.find(item => item.AutomotivePartID == this.SubstitutePartObj.SubstituteID).PartNameEnglish;

    this.activatedModalRef.close();
  }
  openDeleteSubstitutePartModel(modal: any, dsp: SubstitutePart) {
    this.SubstitutePartObj = dsp;
    this.activatedModalRef = this.modalService.open(modal, {})
  }

  deleteSubstitutePart() {
    var index = this.partInfoObj.SubstitutePart.findIndex(item => item.SubstitutePartID == this.SubstitutePartObj.SubstitutePartID)
    if (this.SubstitutePartObj.SubstitutePartID < 0) {
      this.partInfoObj.SubstitutePart.splice(index, 1)
      this.activatedModalRef.close();
    }

    else {
      this._partService.deleteSubstitutePart(this.SubstitutePartObj).subscribe(res => {
        this.partInfoObj.SubstitutePart.splice(index, 1)
        this.activatedModalRef.close();
        this._sharedService.success('success', 'Substitute Part Deleted Successfully')
      }), error => {
        this._sharedService.error('Error', error.Message);
      };
      this.activatedModalRef.close()
    }
  }
  //#endregion substitute part


  //#region  Upload and delete image
  uploadImage(fileInput: any) {
    if (this._sharedService.validateFile(fileInput.target.files[0].name)) {
      var option: ResizeOptions = new ResizeOptions();
      option.Resize_Quality = 80;
      option.Resize_Type = 'image/jpg';
      ImageCompressService.filesToCompressedImageSourceEx(fileInput.target.files, option).then(observableImages => {
        observableImages.subscribe((image) => {
          // images.push(image);
          console.log(image);
          this._commonService.saveImage(image.imageDataUrl).subscribe((res: any) => {
            this.partInfoObj.AutomotivePart.LogoImageURL = res;
            this.partInfoObj.AutomotivePart.IsModified = true;
          })
          this._sharedService.success("Success", "Image Uploaded Successfully");
        }, (error) => {
          console.log("Error while converting");
          this._sharedService.error("Error", "Error while converting");
        });
      });
    } else {
      this._sharedService.warning("Warning", "Only png and jpeg formats are allowed");
    }

  }


  public delete() {
    this.partInfoObj.AutomotivePart.LogoImageURL = undefined;
    //Note: send api call to delete image from server and also soft delete from db 
  }

  open(model) {
    this.modalService.open(model);
  }
  //#endregion


  //day hour picker
  onValueChanged($event) {
    console.log($event);
    this.partInfoObj.AutomotivePart.LaborTime = $event;
  }

  resetFieldsMain() {
    // partsFormData.reset();
    this.partInfoObj.AutomotivePart.SubCategoryID = undefined;
    this.partInfoObj.AutomotivePart.SubSubCategoryID = undefined;
  }

  resetModel() {
    this.AutomotivePartVehicleObj.ModelID = undefined;
    this.AutomotivePartVehicleObj.GroupName = undefined;
    this.AutomotivePartVehicleObj.ProductionYear=undefined;
    this.AutomotivePartVehicleObj.EngineTypeID=undefined;
    this.AutomotivePartVehicleObj.VehicleTypeID=undefined;
    this.AutomotivePartVehicleObj.FaceLiftTypeID = undefined;
  }

  // addSeriesNumber(){
  //   this._partService.addSeriesID(this.AutomotivePartVehicleObj.MakeID, this.AutomotivePartVehicleObj.ModelID, this.SeriesID).subscribe(res => {
  //   }, error => {
  //     this._sharedService.error('Error', error.Message);
  //   })
  // }

  getSeries(){
    debugger
        this.SeriesMake = this._sharedService._commonMeta.Makes.find(item => item.MakeID == this.AutomotivePartVehicleObj.MakeID).EnglishMakeName;
        this.SeriesModel = this._sharedService._commonMeta.Models.find(item => item.ModelID == this.AutomotivePartVehicleObj.ModelID).EnglishModelName;
        this.SeriesYear = this.AutomotivePartVehicleObj.ProductionYear;

        if(this.AutomotivePartVehicleObj.MakeID == 4 || this.AutomotivePartVehicleObj.MakeID == 5){
          this.groupName = this.AutomotivePartVehicleObj.GroupName;
        }
        else
        {
            this.groupName = null;
        } 
        
        if(this.AutomotivePartVehicleObj.MakeID != undefined 
          && this.AutomotivePartVehicleObj.ModelID
          && this.AutomotivePartVehicleObj.ProductionYear){
          
            this._jobService.getVehicleSeries(this.SeriesMake, 
          this.SeriesModel, this.SeriesYear, this.groupName).subscribe((res:any) =>{
            debugger
            this.generalVehicle = res;
            if(this.generalVehicle == null){
              this.generalVehicle = new GeneralVehicles;
            }
            else{
            this.AutomotivePartVehicleObj.VehicleTypeID =  this._sharedService._commonMeta.objectTypes.find(item => item.ObjectNameEnglish == "Body" && item.TypeNameEnglish.toLowerCase() == this.generalVehicle.GeneralVehicles[0].BodyType.toLowerCase()).ObjectTypeID;
            this.AutomotivePartVehicleObj.EngineTypeID  = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectNameEnglish == "Engine" && item.TypeNameEnglish.toLowerCase() == this.generalVehicle.GeneralVehicles[0].FuelType1.toLowerCase()).ObjectTypeID;
            var test = this.generalVehicle.GeneralVehicles[0].face_lift.toString();
            this.AutomotivePartVehicleObj.FaceLiftTypeID  = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectNameEnglish == "FaceLift" && item.TypeNameEnglish == test).ObjectTypeID;
            this.AutomotivePartVehicleObj.EngineTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.AutomotivePartVehicleObj.EngineTypeID).TypeNameEnglish;
            this.AutomotivePartVehicleObj.VehicleTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.AutomotivePartVehicleObj.VehicleTypeID).TypeNameEnglish;
            this.AutomotivePartVehicleObj.SeriesID = this.generalVehicle.GeneralVehicles[0].SerialNumber;
            this.AutomotivePartVehicleObj.MinYear = this.generalVehicle.MinYear;
            this.AutomotivePartVehicleObj.MaxYear = this.generalVehicle.MaxYear;



            }
           
    
        }, error => {
    
        } ) 
        }
    
    
    
    
      }

      saveVehicle(){
        debugger



        this._vehicleService.saveVehicle(this.createVehicle).subscribe(res => {
          debugger
          this._sharedService.success('Success', 'Vehicle saved successfully');
  
          this.AutomotivePartVehicleObj = res;
          this._sharedService.jobObj.JCBasicInfo.VehicleID = this.AutomotivePartVehicleObj.VehicleID;
          this._sharedService.jcVehicleMode = true;
          if (this._sharedService.jobObj.jcVehicleList == undefined) {
            this._sharedService.jobObj.jcVehicleList = new Array<Vehicle>();
          }
          
        }, error => {
          this._sharedService.error('Error', error.Message);
        })
      }

      onSavePartInfo() {
        debugger
        this.AutomotivePartVehicleObj.EngineTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.AutomotivePartVehicleObj.EngineTypeID).TypeNameEnglish;
        this.AutomotivePartVehicleObj.VehicleTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.AutomotivePartVehicleObj.VehicleTypeID).TypeNameEnglish;
        this.AutomotivePartVehicleObj.EnglishMakeName = this._sharedService._commonMeta.Makes.find(item=> item.MakeID == this.AutomotivePartVehicleObj.MakeID).EnglishMakeName;
        this.AutomotivePartVehicleObj.EnglishModelName = this._sharedService._commonMeta.Models.find(item=> item.ModelID == this.AutomotivePartVehicleObj.ModelID).EnglishModelName;
        this.partInfoObj.vehicleObj.EnglishMakeName = this.AutomotivePartVehicleObj.EnglishMakeName;
        this.partInfoObj.vehicleObj.ArabicMakeName = this.partInfoObj.vehicleObj.EnglishMakeName;
        this.partInfoObj.vehicleObj.EnglishModelName = this.AutomotivePartVehicleObj.EnglishModelName;
        this.partInfoObj.vehicleObj.ArabicModelName = this.partInfoObj.vehicleObj.EnglishModelName
        this.partInfoObj.vehicleObj.ProductionYear = this.AutomotivePartVehicleObj.ProductionYear;
        this.partInfoObj.vehicleObj.EngineTypeName = this.AutomotivePartVehicleObj.EngineTypeName;
        this.partInfoObj.vehicleObj.VehicleTypeName = this.AutomotivePartVehicleObj.VehicleTypeName;
        this.partInfoObj.vehicleObj.EngineCapacity = this.AutomotivePartVehicleObj.EngineCapacity;


        if (this.partInfoObj.AutomotivePart.PartNameEnglish != undefined && this.partInfoObj.AutomotivePart.ItemCode != undefined && this.partInfoObj.AutomotivePart.MainCategoryID != undefined && this.partInfoObj.AutomotivePart.ManufacturerID != undefined && this.partInfoObj.AutomotivePart.OrigionID != undefined && this.partInfoObj.AutomotivePart.PurchasePrice != undefined && this.partInfoObj.AutomotivePart.Tax != undefined) {
          this.partInfoObj.AutomotivePart.WorkshopID = this._sharedService.currentWorkshopID;
          this.partInfoObj.AutomotivePart.CreatedBy = this._sharedService.logged_user_id;
          this.setTaskTime();
          this._partService.savePart(this.partInfoObj).subscribe(res => {
            debugger
            this._sharedService.success('Success', 'Part saved successfully');;
            this._router.navigate(['/', 'part', 'list']);
          }, error => {
            this._sharedService.error('Error', error.Message);
          })
        }
        else {
          this._sharedService.error('Input All Required Fields');
        }
    
      }

      addvehicleTable(){
        debugger
        this.EngineTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.AutomotivePartVehicleObj.EngineTypeID).TypeNameEnglish;
        this.VehicleTypeName = this._sharedService._commonMeta.objectTypes.find(item => item.ObjectTypeID == this.AutomotivePartVehicleObj.VehicleTypeID).TypeNameEnglish;
        this.MinYear = this.generalVehicle.MinYear;
        this.MaxYear = this.generalVehicle.MaxYear;



        // this.EngineTypeNametest =this.partInfoObj.AutomotivePartVehicle.find(item => item.EngineTypeID == this.AutomotivePartVehicleObj.EngineTypeID).EngineTypeName
      }

      onRemoveYear()
      {
        this.MinYear = null;
        this.MaxYear = null;
    
        this.AutomotivePartVehicleObj.ProductionYear = undefined;
      }

      getProductionYears(){
        debugger
        this.SeriesMake = this._sharedService._commonMeta.Makes.find(item => item.MakeID == this.AutomotivePartVehicleObj.MakeID).EnglishMakeName;
        this.SeriesModel = this._sharedService._commonMeta.Models.find(item => item.ModelID == this.AutomotivePartVehicleObj.ModelID).EnglishModelName;
        this.SeriesYear = null;
        
        if(this.groupnameCount > 0){
          this.groupName = this.AutomotivePartVehicleObj.GroupName;
        }
        else
        {
            this.groupName = null;
        }  
            
        if  (this.AutomotivePartVehicleObj.MakeID != undefined 
              && this.AutomotivePartVehicleObj.ModelID ){
              debugger
                this._jobService.getVehicleSeries(this.SeriesMake, 
              this.SeriesModel, this.SeriesYear, this.groupName).subscribe((res:any) =>{
                debugger
                this.generalVehicle = res;
                let filteredGenralVehicle;

                if(this.generalVehicle == null){
                this.generalVehicle = new GeneralVehicles;
        
                }
                else{
                this.MinYear = this.generalVehicle.MinYear;
                this.MaxYear = this.generalVehicle.MaxYear;
                filteredGenralVehicle =
                this.generalVehicle.GeneralVehicles.filter(
                  (item) => item.FuelType1 != null && item.BodyType != null
                );
                if (filteredGenralVehicle.length > 0) {
                this.AutomotivePartVehicleObj.VehicleTypeID =
                  this._sharedService._commonMeta.objectTypes.find(
                    (item) =>
                      item.ObjectNameEnglish == "Body" &&
                      item.TypeNameEnglish.toLocaleLowerCase() ==
                        filteredGenralVehicle[0].BodyType.toLowerCase()
                  ).ObjectTypeID;
                }
              }
               
        
        
            }, error => {
        
        
            } )
        
            }
        
        
        
        
          }
          changeModel(){
            debugger;
           this.ModelName = this._sharedService._commonMeta.Models.find(item=> item.ModelID == this.AutomotivePartVehicleObj.ModelID).EnglishModelName;
           this.modelGroupName = this._sharedService._commonMeta.Models.find(item => item.ModelID == this.AutomotivePartVehicleObj.ModelID).GroupName;
   
           if(this.AutomotivePartVehicleObj.GroupName == undefined && this.modelGroupName != undefined){
           this.AutomotivePartVehicleObj.GroupName = this.modelGroupName;
           }
         }

         changeMake(){
          debugger
          var index = this._sharedService._commonMeta.Models.findIndex(item=> item.MakeID == this.AutomotivePartVehicleObj.MakeID && item.GroupName != undefined);
          if(index > -1){
           var make = this._sharedService._commonMeta.Models.filter(item => item.MakeID == this.AutomotivePartVehicleObj.MakeID && item.GroupName != undefined);
           this.groupnameCount = make.length;}
    
           
          if(index == -1){
            this.groupnameCount = undefined;
          }
        }

        checkItemCode(itemCode: any) {
          debugger
          this._partService
            .checkItemCode(itemCode, this._sharedService.currentWorkshopID)
            .subscribe(
              (res) => {},
              (error) => {
                this._sharedService.warning("Error", error.Message);
                if (error.Message == "Same ItemCode already registered.") {
                  this.partInfoObj.AutomotivePart.ItemCode = undefined;
                } 
              }
            );
        }


}


    



