import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PartService } from 'app/services/part.service';
import { PartInfo } from 'app/models/part-info';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-view-part',
  templateUrl: './single-view-part.component.html',
  styleUrls: ['./single-view-part.component.scss']
})
export class SingleViewPartComponent implements OnInit {
  partInfoObj: PartInfo; 
  activatedModalRef: NgbModalRef;
  partID: number;
  constructor(private route: ActivatedRoute, public modalService: NgbModal, public _sharedService: SharedService,private _partService: PartService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.partID = +params['partID']; // (+) converts string 'id' to a number   
    });
      this.getSinglePart();
      this.partInfoObj = new PartInfo();
  }
  getSinglePart() {
    this._partService.getSinglePart(this.partID).subscribe((res: any) => {
      this.partInfoObj = res; 
    }, error => {
      this._sharedService.error('Error', error.Message);
    });
  }

  openModal(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "sm" });
  }

  dismissModal() {
    this.activatedModalRef.dismiss();
  }
  closeModal() {
    this.activatedModalRef.close();
  }
}
