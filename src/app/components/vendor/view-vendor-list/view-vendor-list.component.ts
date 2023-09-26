import { Component, OnInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from 'app/services/shared.service';
import { VendorFilter } from 'app/models/vendor-filter';
import { VendorModel } from 'app/models/vendor';
import { VendorService } from 'app/services/vendor.service';

@Component({
  selector: "app-view-vendor-list",
  templateUrl: "./view-vendor-list.component.html",
  styleUrls: ["./view-vendor-list.component.scss"]
})
export class ViewVendorListComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  vendorID: number;
  filter: VendorFilter;
  cPage: number = 1;
  vendorArray: Array<VendorModel>;
  totalVendors : number;
  // Array=[1]

  constructor(public modalService: NgbModal, public _sharedService: SharedService, private _vendorService: VendorService) {}

  ngOnInit() {
    this.vendorArray = new Array<VendorModel>();
    this.filter = new VendorFilter();
    this.getAllVendors();
  }

  getAllVendors(){
    debugger
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this._vendorService.getAllVendors(this.filter).subscribe((res:any) =>{
      this.vendorArray = res.partsVendor;   
      this.totalVendors = res.TotalVendors;   
   
    }, error =>{
      this._sharedService.error('Error', error.Message);
      this.vendorArray = undefined;  
    })
  }

  deleteVendor(){
    this._vendorService.deleteVendor(this.vendorID).subscribe((res:any) => {
      this.vendorArray.splice(this.vendorArray.findIndex(item=> item.VendorID == this.vendorID),1);
      this.activatedModalRef.close();
      this._sharedService.success('success','Vendor deleted successfully')
    }, error =>{
      this._sharedService.error('Error', error.Message);
    })
  }

  clearFilters(){
    this.filter = new VendorFilter();
    this.getAllVendors();
  }

  //#region 
  openModal(modal: any, id: number) {
    this.vendorID = id;
    this.activatedModalRef = this.modalService.open(modal);
  }

  dismissModal() {
    this.activatedModalRef.dismiss();
  }
  closeModal() {
    this.activatedModalRef.close();
  }
  //#endregion
  onKeypressEvent(event: any) {
    this.cPage = 1;
  }
}
