import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jc-view-vehicle',
  templateUrl: './jc-view-vehicle.component.html',
  styleUrls: ['./jc-view-vehicle.component.scss']
})
export class JcViewVehicleComponent implements OnInit {

  currentImg: string;
  activatedModalRef: NgbModalRef;
  vehicleID: number;
  title: string;

  constructor(private modalService: NgbModal, public _sharedService: SharedService) { }

  ngOnInit() {
    console.log('ServiceID', this._sharedService.jobObj.jcVehicleObj)
  }

  galleryPreviewModal(modal: any, image: string, title: string) {

    this.currentImg = image;
    this.title = title;
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
  }

  ContractDetailsModal(modal: any) {
    ///get contract consumption data here and map accordingly

    this.vehicleID = this._sharedService.jobObj.jcVehicleObj.VehicleID;

    this.activatedModalRef = this.modalService.open(modal, {
      size: "lg",
      windowClass: 'modalTop'
    });
  }
  closeContractDetailsModal(event?: any) {
    this.activatedModalRef.close();
  }

  createContract(VehicleID: number) {
    var url = "/vehicle/create-vehicle?VehicleID=" + VehicleID
    window.open(url, '_blank');
  }

}
