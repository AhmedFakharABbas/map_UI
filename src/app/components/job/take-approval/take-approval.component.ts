import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Checklist } from 'app/models/checklist';
import { JobProcess } from 'app/models/job-process';
import { CommonService } from 'app/services/common.service';
import { JobService } from 'app/services/job.service';
import { SharedService } from 'app/services/shared.service';
import { Location } from '@angular/common';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-take-approval',
  templateUrl: './take-approval.component.html',
  styleUrls: ['./take-approval.component.scss']
})
export class TakeApprovalComponent implements OnInit {

  activatedModalRef: NgbModalRef;
  dataURL: string;
  JobCardID: number;
  signature: any;

  constructor(private modalService: NgbModal, private _sanitizer: DomSanitizer, private route: ActivatedRoute, public _sharedService: SharedService, public _commonService: CommonService, private _jobService: JobService, private _location: Location, public _router: Router) { }

  ngOnInit() {
    console.log('17',this._sharedService.jobObj.JCBasicInfo.ApprovalStatusID)
    this.route.params.subscribe(params => {
      this.JobCardID = +params['id'];
    });
    this.getApprovalPreview();
  }

  getApprovalPreview() {
    this.JobCardID = this.JobCardID == undefined || isNaN(this.JobCardID) ? this._sharedService.jobObj.JCBasicInfo.JobCardID : this.JobCardID;
    this._jobService.getApprovalPreview(this.JobCardID).subscribe((res: any) => {
      this._sharedService.jobObj = res;
      this.signature = 'data:image/jpg;base64,' + this._sharedService.jobObj.JCBasicInfo.SignatureBase64;
      this._sharedService.jobObj.JobCardCheckList = new Array<Checklist>();
      this._sharedService.jobObj.JobProcess = new Array<JobProcess>();
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  onUpdateJob() {
    debugger
    this._jobService.aprroval(this._sharedService.jobObj).subscribe(res => {
      this._sharedService.success('Success', 'Approval Completed');
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }


  //#region  Signature Modal
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
    debugger
    setTimeout(() => {
      this.onFetchDataURL();
      this._commonService.saveImage(this.dataURL)
        .subscribe((res: any) => {
          debugger
          var base64adress = this.dataURL;

          this._sharedService.jobObj.JCBasicInfo.ApprovalSignatureURL = res;
          this._sharedService.jobObj.JCBasicInfo.IsModified = true;
          //this._sharedService.jobObj.JCBasicInfo.SignatureBase64 = undefined;
          this._sharedService.jobObj.JCBasicInfo.SignatureBase64 = base64adress;
          this.signature = base64adress;
          this.onUpdateJob();
          this._sharedService.success("Success", "Signature saved successfully");
          this.activatedModalRef.dismiss('dismiss');
          this.closeSignatureModal();
          this._router.navigate(['/job/list']);
        },
          error => {
            this._sharedService.error("Error", "API not working")
          });
    }, 200);
  
  }

  getBase64(img: any) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

    //var base64 = getBase64Image(document.getElementById("imageid"));
  }
  //#endregion

  backClick() {
    this._location.back();
  }

  //download
  public downloadInvoice() {
    this._sharedService.loading = true;
    var data = document.getElementById('InvoiceToDownload');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      // var imgWidth = 208;
      // var imgHeight = canvas.height * imgWidth / canvas.width;
      // const contentDataURL = canvas.toDataURL('image/png')
      // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      // var position = 0;
      // pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      // if(imgHeight > 356){
      //   pdf.addPage();
      //   pdf.addImage(contentDataURL, 'PNG', 0, -356, imgWidth, imgHeight);
      // }
      // window.open(pdf) // this is just a test that opens the image in a new tab and it displays nicely, the entire image
      var imgData = canvas.toDataURL('image/png');
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jspdf('p', 'mm', 'a4');
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save(this._sharedService.jobObj.jcVehicleObj.PlateNumber + '.pdf'); // Generated PDF
      this._sharedService.loading = false;
    }, error => {
      this._sharedService.loading = false;
    });
  }

}
