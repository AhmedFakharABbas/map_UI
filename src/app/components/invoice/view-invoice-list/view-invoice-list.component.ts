import { Component, OnInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from 'app/services/shared.service';
import { InvoiceFilter } from 'app/models/invoice-filter';
import { InvoiceService } from 'app/services/invoice.service';
import { JobCardInfo } from 'app/models/job-card-info'; 

@Component({
  selector: "app-view-invoice-list",
  templateUrl: "./view-invoice-list.component.html",
  styleUrls: ["./view-invoice-list.component.scss"]
})
export class ViewInvoiceListComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  filter: InvoiceFilter;
  invoiceArray: JobCardInfo;
  
  radioTab: boolean;
  totalAmt: number;
  cPage = 1;
  arrayLenght :number;
  listShow = true;

  ipPage:number;
  pendingPage:number;
  paidPage:number;
  pPaidPage:number;


  constructor(public modalService: NgbModal, public _sharedService: SharedService, private _invoiceService: InvoiceService) { }

  ngOnInit() {
    this.invoiceArray = new JobCardInfo();
    this.filter = new InvoiceFilter();
    if(this._sharedService.invoiceTab != 5){
      this.filter.IPPageNumber = undefined;
  }
  else if(this._sharedService.invoiceTab == 5){
    this.filter.PageNumber = undefined;
  }
    this.getAllInvoice();
  }

  getAllInvoice() {
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this.filter.TabID = this._sharedService.invoiceTab;
    this._invoiceService.getAllInvoice(this.filter).subscribe((res: any) => { 
      this.invoiceArray = res;
      this.ipPage = res.JobInvoiceTotal.TotalIPPages;
      this.pendingPage = res.JobInvoiceTotal.PendingPages;
      this.paidPage = res.JobInvoiceTotal.PaidPages;
      this.pPaidPage = res.JobInvoiceTotal.PartiallyPaidPages;
      // this.arrayLenght = this.invoiceArray.JobInvoiceList2.length;

    this.calcTotal();

    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  calcTotal() {
    var cashAmt = 0;
    var cardAmt = 0;

    this.invoiceArray.InvoiceTotal.forEach(element => {
      if (element.PaymentMethodID == 36) {
        cashAmt = cashAmt + +element.TotalNetAmount;
      }
       if (element.PaymentMethodID == 37) {
        cardAmt = cardAmt + +element.TotalNetAmount;
      }
    }); 

    return this.totalAmt = cashAmt + cardAmt;
  }

  clearFilters() {
    this.filter = new InvoiceFilter();
    this.getAllInvoice();
  }

  //#region Modal
  openModal(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "sm" });
  }

  dismissModal() {
    this.activatedModalRef.dismiss();
  }
  closeModal() {
    this.activatedModalRef.close();
  }
  //#endregion
  tabCustom(){
    this._sharedService.invoiceTab = 5;
    this.listShow = true;
    console.log(this._sharedService.invoiceTab);
  }

}
