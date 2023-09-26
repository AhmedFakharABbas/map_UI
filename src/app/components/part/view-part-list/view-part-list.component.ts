import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from 'app/services/shared.service';
import { Part } from 'app/models/part';
import { PartFilter } from 'app/models/part-filter';
import { PartMeta } from 'app/models/part-meta';
import { PartService } from 'app/services/part.service';
import { PartInfo } from 'app/models/part-info';
@Component({
  selector: 'app-view-part-list',
  templateUrl: './view-part-list.component.html',
  styleUrls: ['./view-part-list.component.scss']
})
export class ViewPartListComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  cPage: number = 1;
  SeriesYearStart: any = 0;
  SeriesYearEnd: any = 0;
  partArray: Array<Part>;
  partObj: Part;
  partID: number;
  filter: PartFilter;
  _meta: PartMeta;
  partInfoObj: PartInfo;
  lowNetPrice: any = 0;
  highNetPrice: any = 0;
  TotalAutomotivePart: number;
  TotalPages:number;
  constructor(public modalService: NgbModal, public _sharedService: SharedService, private _partService: PartService) { }

  ngOnInit() {
    this.partArray = new Array<Part>();
    this.partObj = new Part();
    this.filter = new PartFilter();
    this.partInfoObj = new PartInfo();
    this.getAllCompareParts();
    
    this.getAllParts();
    this._meta = new PartMeta();
    this.getMetaData();
  }
  getMetaData() {
    this._partService.getMetaData().subscribe((res: any) => {
      this._meta = res;
      //  console.log(this._meta);
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  getAllCompareParts() {
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    // if (this.SeriesYearEnd > 1980) {
    //   this.filter.SeriesYearStart = this.SeriesYearStart;
    //   this.filter.SeriesYearEnd = this.SeriesYearEnd;
    // }
    this.filter.MinNetPrice = this.lowNetPrice;
    this.filter.MaxNetPrice = this.highNetPrice;
    this._partService.getAllCompareParts(this.filter).subscribe((res: any) => {
      this.partInfoObj = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
      this.partInfoObj = undefined;
    })
  }

  getAllParts() {
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this.filter.RowsPerPage = this._sharedService.pageSize;
    this.filter.StartRow = this.cPage;
    if (this.filter.AutomotivePartNameEng != undefined || this.filter.OEMNumber != undefined) {
      this.filter.RowsPerPage = 15;
      this.filter.StartRow = 1;
    }
    this._partService.getAllParts(this.filter).subscribe((res:any) => {
      this.partArray = res.AutomotiveParts;
      this.TotalPages = res.totalPages;
    }, error => {
      this.partArray = undefined;
    })
  }
  getAllPartsCount() {
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this.filter.RowsPerPage = this._sharedService.pageSize;
    
    this._partService.getAllPartsCount(this.filter).subscribe((res: any) => {
      this.TotalAutomotivePart = res.TotalPages;
      console.log()
    }, error => {
      this.partArray = undefined;
    })
  }

  deletePart() {
    this._partService.deletePart(this.partID).subscribe(res => {
      this.partArray.splice(this.partArray.findIndex(item => item.AutomotivePartID == this.partID), 1);
      this.activatedModalRef.close();
      this._sharedService.success('Successful', 'Part Saved successfully');
    }, error => {
      this.activatedModalRef.close();
      this._sharedService.error('Error', error.Message);
    })
  }

  clearFilters() {
    this.filter = new PartFilter();
    this.getAllParts();
  }

  //#region 
  openModal(modal: any, id: number) {
    this.partID = id;
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
