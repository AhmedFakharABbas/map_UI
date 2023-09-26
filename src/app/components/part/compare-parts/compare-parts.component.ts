import { Component, OnInit } from "@angular/core";
import { Options } from "ng5-slider";
import { SharedService } from 'app/services/shared.service';
import { PartService } from 'app/services/part.service';
import { PartFilter } from 'app/models/part-filter';
import { PartInfo } from 'app/models/part-info';
import { PartMeta } from 'app/models/part-meta';
import { JobService } from 'app/services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { JobPartPricing } from 'app/models/job-part-pricing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Model } from 'app/models/model';
import { JobCardInfo } from 'app/models/job-card-info';
import { GeneralVehicles } from "app/models/general-vehicles";
import { GeneralVehicle } from "app/models/general-vehicle";
import { runInThisContext } from "vm";
import { SerialNumber } from "app/models/serial-number";


@Component({
  selector: "app-compare-parts",
  templateUrl: "./compare-parts.component.html",
  styleUrls: ["./compare-parts.component.scss"]
})
export class ComparePartsComponent implements OnInit {
  cPage: number = 1;
  // SeriesYearStart: any = 0;
  // SeriesYearEnd: any = 0;
  // seriesRange: Options = {
  //   floor: 1980,
  //   ceil: 2025
  // };
  MinPrice: any = 0;
  MaxPrice: any = 0;
  netPriceRange: Options = {
    floor: 0,
    ceil: 4000
  }
  partInfoObj: PartInfo;
  filter: PartFilter;
  _meta: PartMeta;
  JobCardID: number;
  parts: Array<any>;
  activatedModalRef: NgbModalRef;
  isSpliced: number = 3;
  JobPartID: number;
  attrName: string;
  filteredModels: Array<Model>;
  totalMainParts:number;
  pageNumber:number =1;
  JobCardNumber: number;
  makeID: any;
  groupnameCount: number = 0;
  generalVehicle: GeneralVehicles;
  MinYear: number;
  MaxYear: number;
  ModelName: string;
  SeriesYear: number;
  SeriesMake: string;
  SeriesModel: string;
  ObjectTypeID: number;
  groupName: string = null;
  modelGroupName: string;


  constructor(private route: ActivatedRoute, public _sharedService: SharedService, private _partService: PartService, private _jobService: JobService, private _router: Router, private modalService: NgbModal,) {
    this.generalVehicle = new GeneralVehicles();

   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.JobCardID = +params['JobCardID'];
      this.JobPartID = +params['JobPartID'];
    });

    if (isNaN(this.JobCardID) || isNaN(this.JobPartID)) {
      this._sharedService.jobObj = new JobCardInfo();
      
    }
    this._sharedService.jobObj.JobPartPricing = new Array<JobPartPricing>();
    this.filter = new PartFilter();
    this.partInfoObj = new PartInfo();
    this._meta = new PartMeta();
    // if (this._sharedService.jobObj.JobParts.length > 0 && !isNaN(this.JobPartID)) {
    //   var partName = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.JobPartID).PartNameEnglish;
    //   var mainCategory = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.JobPartID).MainCategoryID;
    //   var subCategory = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.JobPartID).SubCategoryID;
    //   this.filter.AutomotivePartID - this.JobPartID;
    //   this.filter.MainCategoryID = mainCategory;
    //   this.filter.SubCategoryID = subCategory;
    //   this.filter.AutomotivePartNameEng = partName;
    // }
    this.getMetaData();
    if (this.JobCardID > 0) {
      this.getSingleJob();
    }

  }

  // getJobPartID() {
  //   this.JobPartID = this._sharedService.jobObj.JobParts.find(item => item.PartNameEnglish == this.filter.AutomotivePartNameEng).JobPartID;
  // }

  getSingleJob() {
    debugger
    this._jobService.getSingleJob(this.JobCardID).subscribe((res: any) => {
      debugger
      this._sharedService.jobObj.JobParts = res.JobParts;
      this.JobCardNumber = res.JCBasicInfo.JobCardNumber;

      this._sharedService.jobObj.jcVehicleObj.MakeID = this._sharedService._commonMeta.Makes.find(item => item.EnglishMakeName == res.JCBasicInfo.EnglishMakeName).MakeID;
      this._sharedService.jobObj.jcVehicleObj.ModelID = this._sharedService._commonMeta.Models.find(item => item.EnglishModelName == res.JCBasicInfo.EnglishModelName).ModelID;
      this._sharedService.jobObj.jcVehicleObj.ProductionYear = res.JCBasicInfo.ProductionYear;


      if(this._sharedService.jobObj.JobParts.length > 0 && this._sharedService.jobObj.JobParts.length != undefined){
      var partName = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.JobPartID).PartNameEnglish;
      var mainCategory = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.JobPartID).MainCategoryID;
      var subCategory = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.JobPartID).SubCategoryID;
      this.filter.AutomotivePartID = this._sharedService.jobObj.JobParts.find(item => item.JobPartID == this.JobPartID).AutomotivePartID;
      this.filter.MainCategoryID = mainCategory;
      this.filter.SubCategoryID = subCategory;
      this.filter.AutomotivePartNameEng = partName;
      this.filter.JobPartID = this.JobPartID;
      }
      
      this._sharedService.jobObj.JobPartPricing.map(el => {
        var temp = el.IsModified;
        if (temp == true) {
          el.IsModified = false;
        }
      });
      if(this._sharedService.jobObj.jcVehicleObj.MakeID != undefined &&
        this._sharedService.jobObj.jcVehicleObj.ModelID != undefined){
          this.getAllCompareParts();
        }


    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  getMetaData() {
    this._partService.getMetaData().subscribe((res: any) => {
      this._meta = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  

  getAllCompareParts() {
    debugger

    // if(this.JobCardNumber != undefined){
    //   this.filter.JobCardNumber = this.JobCardNumber;
    // }


      var makeName = this._sharedService._commonMeta.Makes.find(item => item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID).EnglishMakeName;
      var modelName = this._sharedService._commonMeta.Models.find(item => item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID).EnglishModelName;
      var ProductionYear = this._sharedService.jobObj.jcVehicleObj.ProductionYear;
      var EngineType = this._sharedService.jobObj.jcVehicleObj.EngineTypeName;
      var BodyType = this._sharedService.jobObj.jcVehicleObj.VehicleTypeName;

      // this.filter.EnglishMakeName = makeName;
      // this.filter.ArabicMakeName = makeName;
      // this.filter.EnglishModelName = modelName;
      // this.filter.ArabicModelName = modelName;
      // this.filter.ProductionYear = this._sharedService.jobObj.jcVehicleObj.ProductionYear;
      // this.filter.EngineType = this._sharedService.jobObj.jcVehicleObj.EngineTypeName;
      // this.filter.BodyType  = this._sharedService.jobObj.jcVehicleObj.VehicleTypeName;
      // this.filter.EngineCapacity = this._sharedService.jobObj.jcVehicleObj.EngineCapacity;
      // this.filter.EngineCode = this._sharedService.jobObj.jcVehicleObj.EngineCode;
      // this.filter.SeriesID = this._sharedService.jobObj.jcVehicleObj.SeriesID;
    
      
      
      if(EngineType == undefined){
        this.getSeries();
      debugger;

      var filterSeriesModel = [];
      // this.testGeneralVehicle = new Array<GeneralVehicle>();
      //  this.generalVehicle.GeneralVehicles.filter(item => {
      //    debugger
      //    if(item.EnglishMakeName == makeName && 
      //     item.EnglishModelName == modelName){
      //       filterSeriesModel.push(item.SerialNumber);
      //     }
      //  });
  
       for (let index = 0; index <  this.generalVehicle.GeneralVehicles.length; index++) {
        if(this.generalVehicle.GeneralVehicles[index].EnglishMakeName == makeName && 
          this.generalVehicle.GeneralVehicles[index].EnglishModelName == modelName){
           filterSeriesModel[index] = this.generalVehicle.GeneralVehicles[index].SerialNumber;

           

          }
       }
       this.filter.SerialNumbers = new Array<SerialNumber>();
       filterSeriesModel = filterSeriesModel.map((str) => ({ SeriesID: str}));
       filterSeriesModel.forEach(el => {
        this.filter.SerialNumbers.push(el);
       })
      }

      if(EngineType != undefined &&  BodyType == undefined){
        this.getSeries();
        debugger;
  
        var filterSeriesModel = [];
        // this.testGeneralVehicle = new Array<GeneralVehicle>();
        //  this.generalVehicle.GeneralVehicles.filter(item => {
        //    debugger
        //    if(item.EnglishMakeName == makeName && 
        //     item.EnglishModelName == modelName){
        //       filterSeriesModel.push(item.SerialNumber);
        //     }
        //  });
    
         for (let index = 0; index <  this.generalVehicle.GeneralVehicles.length; index++) {
          if(this.generalVehicle.GeneralVehicles[index].EnglishMakeName == makeName && 
            this.generalVehicle.GeneralVehicles[index].EnglishModelName == modelName &&
            this.generalVehicle.GeneralVehicles[index].FuelType1 == EngineType){
             filterSeriesModel[index] = this.generalVehicle.GeneralVehicles[index].SerialNumber;
  
             
  
            }
         }
         this.filter.SerialNumbers = new Array<SerialNumber>();
         filterSeriesModel = filterSeriesModel.map((str) => ({ SeriesID: str}));
         filterSeriesModel.forEach(el => {
          this.filter.SerialNumbers.push(el);
         })


    }

    if ( BodyType != undefined){
      this.getSeries();
      debugger;

      var filterSeriesModel = [];
      // this.testGeneralVehicle = new Array<GeneralVehicle>();
      //  this.generalVehicle.GeneralVehicles.filter(item => {
      //    debugger
      //    if(item.EnglishMakeName == makeName && 
      //     item.EnglishModelName == modelName){
      //       filterSeriesModel.push(item.SerialNumber);
      //     }
      //  });
  
       for (let index = 0; index <  this.generalVehicle.GeneralVehicles.length; index++) {
        if(this.generalVehicle.GeneralVehicles[index].EnglishMakeName == makeName && 
          this.generalVehicle.GeneralVehicles[index].EnglishModelName == modelName){
           filterSeriesModel[index] = this.generalVehicle.GeneralVehicles[index].SerialNumber;

           

          }
       }
       this.filter.SerialNumbers = new Array<SerialNumber>();
       filterSeriesModel = filterSeriesModel.map((str) => ({ SeriesID: str}));
       filterSeriesModel.forEach(el => {
        this.filter.SerialNumbers.push(el);
       })
      }

      



       

console.log( this.filter.SerialNumbers);
  

    



    // if (isNaN(this.JobCardID)) {
    //   this.JobCardID = undefined;
    //   if (this.filter.MainCategoryID == undefined) {
    //     this.filter.MainCategoryID = 1;
    //   }
    //   if (this.filter.SubCategoryID == undefined) {
    //     this.filter.SubCategoryID = 1;
    //   }
    // }
    this.filter.PageNumber = this.pageNumber;
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    // this.filter.MinNetPrice = this.MinPrice;
    // if (this.MaxPrice > 0) {
    //   this.filter.MaxNetPrice = this.MaxPrice;
    // }
    // if (this.SeriesYearEnd > 1980) {
    //   this.filter.SeriesYearStart = this.SeriesYearStart;
    //   this.filter.SeriesYearEnd = this.SeriesYearEnd;
    // }



    this._partService.getAllCompareParts(this.filter).subscribe((res: any) => {
      debugger
      this.partInfoObj = res;
      this.totalMainParts = res.TotalMainParts;
      this.partInfoObj.mainPart = res.MainPart;
      // this.makeID = res.vehicleobj.MakeID;
    }, error => {
      this._sharedService.error('Error', error.Message);
      this.partInfoObj = undefined;
    })
  }

  onAddPart() {
    
    this.parts = this.partInfoObj.AutomotivePartsList.filter(item => item.IsModified == true);
    this.parts.forEach((element: any) => {
      var partPriceObj: JobPartPricing = new JobPartPricing();
      partPriceObj.JobCardID = this.JobCardID;
      partPriceObj.VendorID = element.VendorID;
      partPriceObj.JobPartID = this.filter.JobPartID;
      partPriceObj.IsNew = element.IsNew;
      partPriceObj.SellingPrice = element.VendorPrice;
      partPriceObj.Quantity = element.Quantity;
      partPriceObj.JobPartPricingID = element.JobPartPricingID;
      partPriceObj.IsChecked = element.IsChecked;
      partPriceObj.IsModified = true;
      this._sharedService.jobObj.JobPartPricing.push(partPriceObj);
    }) 
    this._jobService.updateJob(this._sharedService.jobObj).subscribe(res => {
      // if ((this._sharedService.user.Roles.filter(item => item.RoleID == 7)).length > 0) {
      //   this._router.navigate(['/', 'update-job', this.JobCardID, 'part-price']);
      // }
      // else {
        this._router.navigate(['/', 'update-job', this.JobCardID, 'part-price']);
      // }
      this._sharedService.success('Success', 'Parts price updated');
    }, error => {
      this._sharedService.error('Error', error.Message);
    })

  }

  clearFilters() {
    debugger
    // this.SeriesYearStart = 0;
    // this.SeriesYearEnd = 0;
    this.MinPrice = 0;
    this.MaxPrice = 0;
    this.pageNumber = 1;
    this.JobCardID = undefined;
    this.JobCardNumber = undefined;
    this._sharedService.jobObj.jcVehicleObj.MakeID = undefined;
    this._sharedService.jobObj.jcVehicleObj.ModelID = undefined;
    this._sharedService.jobObj.jcVehicleObj.ProductionYear = undefined;
    this._sharedService.jobObj.jcVehicleObj.VehicleTypeName = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineTypeName = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineCapacity = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineCode = undefined;
    this.partInfoObj = new PartInfo();


    // this._sharedService._commonMeta.Makes.map(el => {
    //   var temp = el.IsChecked;
    //   if (temp == true) {
    //     el.IsChecked = false;
    //   }
    // });
    // this._sharedService._commonMeta.Models.map(el => {
    //   var temp = el.IsChecked;
    //   if (temp == true) {
    //     el.IsChecked = false;
    //   }
    // });
    // this._meta.PartManufacturer.map(el => {
    //   var temp = el.IsChecked;
    //   if (temp == true) {
    //     el.IsChecked = false;
    //   }
    // });
    this.filter = new PartFilter();
    // this.getAllCompareParts();
  }

  partChange() {
    this.filter.MainCategoryID = this._sharedService.jobObj.JobParts.find(item => item.AutomotivePartID == this.filter.AutomotivePartID).MainCategoryID;
    this.filter.SubCategoryID = this._sharedService.jobObj.JobParts.find(item => item.AutomotivePartID == this.filter.AutomotivePartID).SubCategoryID;
    this.filter.JobPartID = this._sharedService.jobObj.JobParts.find(item => item.AutomotivePartID == this.filter.AutomotivePartID).JobPartID;
    this.filter.AutomotivePartNameEng = '';
    this.getAllCompareParts();
  }

  filterCar() {
    this.filter.Makes = this._sharedService._commonMeta.Makes.filter(item => item.IsChecked == true);
    if (this.filter.Makes != undefined && this.filter.Makes.length > 0) {
      this.filteredModels = this._sharedService._commonMeta.Models.filter(item => item.MakeID == this._sharedService._commonMeta.Makes.find(item => item.IsChecked == true).MakeID);
      this.filter.Models = this.filteredModels.filter(item => item.IsChecked == true);
    }
    this.filter.Manufacturers = this._meta.PartManufacturer.filter(item => item.IsChecked == true);
    // this.filter.Makes = this._sharedService._commonMeta.Makes.map(x => Object.assign({}, x));
    this.activatedModalRef.close();
  }

  openModel(modal: any, attrName: string) {

    this.attrName = attrName;
    this.activatedModalRef = this.modalService.open(modal, { size: 'xl', backdrop: 'static' });
  }
  closeModal() {
    this.activatedModalRef.close();
  }
  //////////////////////////

  changeMake() {
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
  mapRegion(MakeID: number) {
    if (this._sharedService.jobObj.jcVehicleObj.MakeID != undefined)
      this._sharedService.jobObj.jcVehicleObj.VehicleRegionID =
        this._sharedService._commonMeta.Makes.find(
          (item) => item.MakeID == MakeID
        ).RegionTypeID;
  }

  onChangeMake() {
    this.groupnameCount = null;
    this._sharedService.jobObj.jcVehicleObj.MakeID = undefined;
    this._sharedService.jobObj.jcVehicleObj.ModelID = undefined;
    console.log(this.groupnameCount)
  }

  getProductionYears() {
    this.SeriesMake = this._sharedService._commonMeta.Makes.find(
      (item) => item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID
    ).EnglishMakeName;
    this.SeriesModel = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
    ).EnglishModelName;
    this.SeriesYear = null;


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
            this.MinYear = this.generalVehicle.MinYear;
            this.MaxYear = this.generalVehicle.MaxYear;
            this.generalVehicle.BodyTypes = res.BodyTypes;
            
          },
          (error) => {}
        );
    }
  }
  changeModel() {
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

  getSeries() {
    debugger
    this.SeriesMake = this._sharedService._commonMeta.Makes.find(
      (item) => item.MakeID == this._sharedService.jobObj.jcVehicleObj.MakeID
    ).EnglishMakeName;
    this.SeriesModel = this._sharedService._commonMeta.Models.find(
      (item) => item.ModelID == this._sharedService.jobObj.jcVehicleObj.ModelID
    ).EnglishModelName;
    this.SeriesYear = this._sharedService.jobObj.jcVehicleObj.ProductionYear;

    if (this.groupnameCount > 0
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
      debugger
      this._jobService
        .getVehicleSeries(
          this.SeriesMake,
          this.SeriesModel,
          this.SeriesYear,
          this.groupName
        )
        .subscribe(
          (res: any) => {
            debugger
            this.generalVehicle = new GeneralVehicles();

            this.generalVehicle = res;

            if (this.generalVehicle == null) {
              this.generalVehicle = new GeneralVehicles();
            } 
            // else {
              //  this._sharedService.jobObj.jcVehicleObj.EngineTypeName = this.generalVehicle.GeneralVehicles[0].FuelType1;


              //   this._sharedService.jobObj.jcVehicleObj.VehicleTypeName = this.generalVehicle.GeneralVehicles[0].BodyType;
              //   this._sharedService.jobObj.jcVehicleObj.SeriesID = this.generalVehicle.GeneralVehicles[0].SerialNumber;
              //  }
            
            
          },
          (error) => {}
        );

  }
  }

  onRemoveYear() {
    this.MinYear = null;
    this.MaxYear = null;

    this._sharedService.jobObj.jcVehicleObj.ProductionYear = undefined;
  }



  onClickJobCard(){
    this._sharedService.jobObj.jcVehicleObj.MakeID = undefined;
    this._sharedService.jobObj.jcVehicleObj.ModelID = undefined;
    this._sharedService.jobObj.jcVehicleObj.ProductionYear = undefined;
    this._sharedService.jobObj.jcVehicleObj.VehicleTypeName = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineTypeName = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineCapacity = undefined;
    this._sharedService.jobObj.jcVehicleObj.EngineCode = undefined;

  }





}
