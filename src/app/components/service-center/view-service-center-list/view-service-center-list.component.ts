import { Component, OnInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from 'app/services/shared.service';
import { ServiceCenterService } from 'app/services/service-center.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceCenter } from 'app/models/service-center';
import { ServiceCenterFilter } from 'app/models/service-center-filter';

@Component({
  selector: "app-view-service-center-list",
  templateUrl: "./view-service-center-list.component.html",
  styleUrls: ["./view-service-center-list.component.scss"]
})
export class ViewServiceCenterListComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  workshopID: number;
  filter: ServiceCenterFilter;
  cPage: number = 1;
  serviceCenterArray: Array<ServiceCenter>;
  constructor( private route: ActivatedRoute, public modalService: NgbModal, public _sharedService: SharedService, private _serviceCenterService: ServiceCenterService) {}

  ngOnInit() {
    this.serviceCenterArray= new Array<ServiceCenter>();
    this.filter = new ServiceCenterFilter();
    this.getAllServiceCenters(); 
  }

  getAllServiceCenters(){
    this._serviceCenterService.getAllServiceCenters(this.filter).subscribe(res=>{
      this.serviceCenterArray=res;       
    }, error=>{
      this._sharedService.error(error.Message);
      this.serviceCenterArray = undefined;
    })
  }

  deleteServiceCenter(){
    this._serviceCenterService.deleteServiceCenter(this.workshopID).subscribe((res:any)=>{
      this.serviceCenterArray.splice(this.serviceCenterArray.findIndex(item=> item.WorkshopID == this.workshopID),1);
      this.activatedModalRef.close();
      this._sharedService.success('Success','Service deleted successfully');

      this._sharedService._commonMeta.Workshops.splice(this.serviceCenterArray.findIndex(item=> item.WorkshopID == this.workshopID),1)
    },error=>{
      this._sharedService.error('Error', error.Message);
    })
  }

  clearFilters(){
    this.filter = new ServiceCenterFilter();
    this.getAllServiceCenters();
  }
  
  //#region 
  openModal(modal: any ,id: number) {
    this.workshopID = id;
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
