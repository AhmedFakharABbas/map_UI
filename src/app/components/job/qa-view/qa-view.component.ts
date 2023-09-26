import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InspectionResult } from 'app/models/inspection-result';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-qa-view',
  templateUrl: './qa-view.component.html',
  styleUrls: ['./qa-view.component.scss']
})
export class QaViewComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  task : InspectionResult;
  constructor(private modalService: NgbModal, public _sharedService: SharedService) { }

  ngOnInit() {
    if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
      this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/qa-view") > -1); 
    } 
  }

  viewNote(modal: any, t: InspectionResult) {
    this.activatedModalRef = this.modalService.open(modal, { size: "lg" });
    this.task = new InspectionResult();
    this.task = t;
  }
}
