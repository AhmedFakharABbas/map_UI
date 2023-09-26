import { SharedService } from 'app/services/shared.service';
import { Component, OnInit } from "@angular/core";
import { InvoiceService } from 'app/services/invoice.service';
import { JobService } from 'app/services/job.service';
import { JobCardInfo } from 'app/models/job-card-info';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'app/services/common.service';

@Component({
  selector: "app-invoice-detail",
  templateUrl: "./invoice-detail.component.html",
  styleUrls: ["./invoice-detail.component.scss"]
})
export class InvoiceDetailComponent implements OnInit {
  invoiceObj: JobCardInfo;
  InvoiceID: number;
  activatedModalRef: NgbModalRef;
  dataURL: string;


  constructor(private modalService: NgbModal, private route: ActivatedRoute, public _sharedService: SharedService, private _invoiceService: InvoiceService, private _jobService: JobService, private _router: Router, public _commonService: CommonService) { }

  priceSum: number = 0;
  laborSum: number = 0;
  ngOnInit() {
    this.invoiceObj = new JobCardInfo();
    this.route.queryParams.subscribe(params => {
      this.InvoiceID = +params['JobInvoiceID']; // (+) converts string 'id' to a number   
    });
    // if (this._sharedService.routesArray != undefined && this._sharedService.routesArray.length > 0) {
    //   this._sharedService.currentRouteIndex = this._sharedService.routesArray.findIndex(item => item.name.indexOf("/invoice") > -1);
    // } 
    this.getSingleInvoice();
  }

  getSingleInvoice() {
    this._invoiceService.getSingleInvoice(this.InvoiceID).subscribe((res: any) => {
      this.invoiceObj = res;
      console.log(this.invoiceObj);
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  public downloadInvoice() {
    
    this._sharedService.loading = true;
    var data = document.getElementById('InvoiceToDownload');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(this.invoiceObj.JobInvoice.PlateNumber+'.pdf'); // Generated PDF
      this._sharedService.loading = false;
      window.open("https://api.whatsapp.com/send?phone=" + this.invoiceObj.JobInvoice.ContactMobile + "&text=Message sent successfully")

    }, error => {
      this._sharedService.loading = false;
    });
  }

  //#region  signature Region start
  openModel(model) {
    document.body.classList.add('signature-modal');
    this.activatedModalRef = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
    $.getScript('../../../assets/js/e-signature.js');
  }

  closeSignatureModal() {
    document.body.classList.remove('signature-modal');
  }

  onFetchDataURL() {
    this.dataURL = (<HTMLInputElement>document.getElementById('sig-dataUrl')).value;
  }

  onSubmitSignature() {
    setTimeout(() => {
      this.onFetchDataURL();
      this._commonService.saveImage(this.dataURL)
        .subscribe((res: any) => {
          this.invoiceObj.JobInvoice.CustomerSignatureURL = res;
          this._sharedService.success("Success", "Signature saved successfully");
          this.activatedModalRef.dismiss('dismiss');
          this.closeModal();
        },
          error => {
            this._sharedService.error("Error", "API not working")
          });
    }, 200);

  }

  closeModal() {
    this.activatedModalRef.close();
  }
  //#endregion signature region end
}



