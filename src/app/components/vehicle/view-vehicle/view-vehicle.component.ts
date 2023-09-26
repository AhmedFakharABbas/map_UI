import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'app/services/vehicle.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'app/services/shared.service';
import { JobCardInfo } from 'app/models/job-card-info';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.scss']
})
export class ViewVehicleComponent implements OnInit {

  cPage: number = 1;
  vehicleID: number;
  vehicleObj: JobCardInfo;
  activatedModalRef2: NgbModalRef;

  
  constructor(private route: ActivatedRoute, private _vehicleService: VehicleService, public _sharedService: SharedService, private modalService: NgbModal) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.vehicleID = +params['VehicleID']; // (+) converts string 'id' to a number   
    });
    this.vehicleObj = new JobCardInfo();
    this.getVehicleProfile();
  }

  getVehicleProfile() {
    this._vehicleService.getVehicleProfile(this.vehicleID).subscribe((res: any) => {
      this.vehicleObj = res;
      this._sharedService.jobObj.jcVehicleObj.ContractFullName = this.vehicleObj.jcVehicleObj.ContractFullName;
      
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  ContractDetailsModal(modal: any) {

    this.vehicleID = this._sharedService.jobObj.jcVehicleObj.VehicleID;

    this.activatedModalRef2 = this.modalService.open(modal, {
      size: "lg",
      windowClass: 'modalTop'
    });
  }
  closeContractDetailsModal() {
    this.activatedModalRef2.close();
  }


}
