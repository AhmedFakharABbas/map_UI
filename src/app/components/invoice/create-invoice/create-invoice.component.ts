import { Component, OnInit } from "@angular/core";
import { SharedService } from "app/services/shared.service";
import { ActivatedRoute, Router } from "@angular/router";
import { JobCardInfo } from "app/models/job-card-info";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { InvoiceService } from "app/services/invoice.service";
import { Invoice } from "app/models/invoice";
import * as $ from "jquery";
import { CommonService } from "app/services/common.service";
import { ReturnInvoice } from "app/models/return-invoice";

@Component({
  selector: "app-create-invoice",
  templateUrl: "./create-invoice.component.html",
  styleUrls: ["./create-invoice.component.scss"],
})
export class CreateInvoiceComponent implements OnInit {
  JobCardID: number;
  invoiceObj: Invoice;
  jobObj: JobCardInfo;
  activatedModalRef: NgbModalRef;
  InvoiceID: number;
  dataURL: string;
  returnInvoiceObj: ReturnInvoice;

  constructor(
    private modalService: NgbModal,
    public _sharedService: SharedService,
    private route: ActivatedRoute,
    private _invoiceService: InvoiceService,
    private _router: Router,
    public _commonService: CommonService
  ) {}

  ngOnInit() {
    this.jobObj = new JobCardInfo();
    this.returnInvoiceObj = new ReturnInvoice();
    this.invoiceObj = new Invoice();
    this.route.queryParams.subscribe((params) => {
      this.InvoiceID = +params["JobInvoiceID"]; // (+) converts string 'id' to a number
    });
    this.getSingleInvoice();
  }

  getSingleInvoice() {
    this._invoiceService.getSingleInvoice(this.InvoiceID).subscribe(
      (res: any) => {
        debugger
        this.jobObj = res;
        // if(this.jobObj.JobInvoice!=undefined){
        //   this.jobObj.JobInvoice.TotalPartsNetAmount=Math.round((this.jobObj.JobInvoice.TotalPartsNetAmount + Number.EPSILON) * 100) / 100

        // }
        
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  updateInvoice() {
    debugger
    let netAmountToBepaid=+this.jobObj.JobInvoice.TotalCost.toFixed(2);
  if (netAmountToBepaid >= this.invoiceObj.AmountPaid) {
      this.invoiceObj.TotalCost = this.jobObj.JobInvoice.TotalCost;
      this.invoiceObj.JobInvoiceID = this.jobObj.JobInvoice.JobInvoiceID;
      this.invoiceObj.WorkshopID = this._sharedService.currentWorkshopID;
      this.invoiceObj.JobCardID = this.jobObj.JobInvoice.JobCardID;
      this.invoiceObj.CustomerSignatureURL =
        this.jobObj.JobInvoice.CustomerSignatureURL;
      this.invoiceObj.ChargeToName =
        this.jobObj.JobInvoice.ContactPersonFirstName +
        " " +
        this.jobObj.JobInvoice.ContactPersonLastName;
      this.invoiceObj.AmountPaid =
        (+this.invoiceObj.AmountPaid) + (+this.jobObj.JobInvoice.AmountPaid);
      this.invoiceObj.ModifiedBy = this._sharedService.logged_user_id;
      this._invoiceService.updateInvoice(this.invoiceObj).subscribe(
        (res) => {
          this._sharedService.success("Success", " Invoice Paid Successfully");
          this._router.navigate(["/", "invoice", "list"]);
        },
        (error) => {
          this._sharedService.error("Error", error.Message);
        }
      );
    } else {
      this._sharedService.error(
        "Paid Amount and Discount cant be greater than Net Amount"
      );
    }
  }

  returnJobInvoice() {
    this.returnInvoiceObj.WorkshopID = this._sharedService.currentWorkshopID;
    this.returnInvoiceObj.JobInvoiceID = this.jobObj.JobInvoice.JobInvoiceID;
    this._invoiceService.returnInvoice(this.returnInvoiceObj).subscribe(
      (res) => {
        this._sharedService.success(
          "Success",
          " Invoice Returned Successfully"
        );
        this._router.navigate(["/", "invoice", "list"]);
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  //#region modal

  open(modal: any) {
    this.activatedModalRef = this.modalService.open(modal);
  }
  dismissModal() {
    this.activatedModalRef.dismiss();
  }
  closeModal() {
    this.activatedModalRef.close();
  }
  //#endregion

  //#region  signature Region start
  openModel(model) {
    document.body.classList.add("signature-modal");
    this.activatedModalRef = this.modalService.open(model, {
      size: "lg",
      backdrop: "static",
    });
    $.getScript("../../../assets/js/e-signature.js");
  }

  closeSignatureModal() {
    document.body.classList.remove("signature-modal");
  }

  onFetchDataURL() {
    this.dataURL = (<HTMLInputElement>(
      document.getElementById("sig-dataUrl")
    )).value;
  }

  onSubmitSignature() {
    setTimeout(() => {
      this.onFetchDataURL();
      this._commonService.saveImage(this.dataURL).subscribe(
        (res: any) => {
          this.jobObj.JobInvoice.CustomerSignatureURL = res;
          this._sharedService.success(
            "Success",
            "Signature saved successfully"
          );
          this.activatedModalRef.dismiss("dismiss");
          this.closeModal();
        },
        (error) => {
          this._sharedService.error("Error", "API not working");
        }
      );
    }, 200);
  }
  onAmountEnter(event){
console.log(event.charCode)
    if(event.charCode>=48 && event.charCode<=57 && this.invoiceObj.AmountPaid!=undefined){
      var max_chars = 10;
      let number=this.invoiceObj.AmountPaid.toString();
  
      if(this.invoiceObj.AmountPaid > max_chars) {
        this.invoiceObj.AmountPaid = +number.substring(0, max_chars);
      }
    }
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 46 && event.charCode != 47 && event.charCode <= 57
   

  

  }
  //#endregion signature region end
}
