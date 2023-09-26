import { Component, OnInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Options } from "ng5-slider";
import { SharedService } from "app/services/shared.service";
import { Vehicle } from "app/models/vehicle";
import { VehicleFilter } from "app/models/vehicle-filter";
import { VehicleService } from "app/services/vehicle.service";

@Component({
  selector: "app-view-vehicle-list",
  templateUrl: "./view-vehicle-list.component.html",
  styleUrls: ["./view-vehicle-list.component.scss"],
})
export class ViewVehicleListComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  yearValue: any = 1950;
  yearHighValue: any = 2021;
  year = new Date().getFullYear();
  yearRange: Options = {
    floor: 1950,
    ceil: this.year,
  };
  sliderChange: boolean = false;
  vehicleID: number;
  cPage: number = 1;
  vehicleArray: Array<Vehicle>;
  filter: VehicleFilter;
  closeResult: string;
  modelID: number;
  totalVehicle: number;

  constructor(
    public modalService: NgbModal,
    public _sharedService: SharedService,
    private _vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.vehicleArray = new Array<Vehicle>();
    this.filter = new VehicleFilter();
    this.getAllVehicles();
  }

  getAllVehicles() {
    // this.filter.MinProductionYear = this.yearValue;
    // this.filter.MaxProductionYear = this.yearHighValue;
    debugger
    this.filter.MinProductionYear = null;
    this.filter.MaxProductionYear = null;
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
   //to remove empty key value pair sectopm start
   let filteredObj=Object.entries(this.filter).reduce((a,[k,v]) => (v ? (a[k]=v, a) : a), {})
   this.filter=JSON.parse(JSON.stringify(filteredObj))
   //trim 
   if(this.filter.VIN!=undefined){
     this.filter.VIN=this.filter.VIN.trim();
   }
   if(this.filter.CustomerName!=undefined){
    this.filter.CustomerName=this.filter.VIN.trim();
  }
   //section end
    this._vehicleService.getAllVehicles(this.filter).subscribe(
      (res: any) => {
       
        this.vehicleArray = res.Vehicles;
        if(res.vehicle!=undefined){
          this.totalVehicle = res.vehicle.TotalVehicle;
        }
        else{
          this.totalVehicle=undefined
        }
        
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
        this.vehicleArray = new Array<Vehicle>();
      }
    );
  }

  deleteVehicle() {
    this._vehicleService.deleteVehicle(this.vehicleID).subscribe(
      (res: any) => {
        this.vehicleArray.splice(
          this.vehicleArray.findIndex(
            (item) => item.VehicleID == this.vehicleID
          ),
          1
        );
        this.activatedModalRef.close();
        this._sharedService.success("Success", "vehicle deleted successfully");
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  clearFilters() {
    this.yearValue = 1950;
    this.yearHighValue = 2020;
    this.filter = new VehicleFilter();
    this.getAllVehicles();
  }

  //#region Modal
  openModal(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }
  deleteModal(modal: any, id: number) {
    this.vehicleID = id;
    this.activatedModalRef = this.modalService.open(modal);
  }
  dismissModal() {
    this.activatedModalRef.dismiss();
  }

  closeModal() {
    this.activatedModalRef.close();
  }
  //#endregion
}
