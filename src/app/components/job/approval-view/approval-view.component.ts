import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'app/services/shared.service';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { Location } from '@angular/common';
import { JobService } from 'app/services/job.service';
import { Checklist } from 'app/models/checklist';
import { JobProcess } from 'app/models/job-process';
import { JobCardInfo } from 'app/models/job-card-info';

@Component({
  selector: 'app-approval-view',
  templateUrl: './approval-view.component.html',
  styleUrls: ['./approval-view.component.scss']
})
export class ApprovalViewComponent implements OnInit {

  JobCardID: number;

  constructor(private route: ActivatedRoute, public _sharedService: SharedService, private _jobService: JobService, private _location: Location, public _router: Router) { }

  ngOnInit() {

    // this.route.queryParams.subscribe(params => {
    //   this.JobCardID = +params['JobInvoiceID']; // (+) converts string 'id' to a number   
    // });
    this.route.params.subscribe(params => {
      this.JobCardID = +params['id'];
    });
    this.getApprovalPreview();
  }

  getApprovalPreview() {
    this.JobCardID = this.JobCardID == undefined || isNaN(this.JobCardID) ? this._sharedService.jobObj.JCBasicInfo.JobCardID : this.JobCardID;
    this._jobService.getApprovalPreview(this.JobCardID).subscribe((res: any) => {
      this._sharedService.jobObj = res;
      this._sharedService.jobObj.JobCardCheckList = new Array<Checklist>();
      this._sharedService.jobObj.JobProcess = new Array<JobProcess>();
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
      pdf.save(this._sharedService.jobObj.jcVehicleObj.PlateNumber + '.pdf'); // Generated PDF
      this._sharedService.loading = false;
    }, error => {
      this._sharedService.loading = false;
    });
  }

  backClick() {
    this._location.back();
  }
}
