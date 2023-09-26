import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'app/services/shared.service';
import { CustomerService } from 'app/services/customer.service';
import { CustomerFeedback } from 'app/models/customer-feedback';

@Component({
  selector: 'app-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.scss']
})
export class CustomerFeedbackComponent implements OnInit {

  JobCardID: number;
  CustomerID: number;
  feedbackObj: CustomerFeedback; 
  constructor(private route: ActivatedRoute, public _sharedService: SharedService, public _customerService: CustomerService, private _router: Router ) { }

  ngOnInit() { 

    this.feedbackObj = new CustomerFeedback();
    this.route.queryParams.subscribe(params => {
      this.JobCardID = +params['JobCardID']; 
      this.CustomerID = +params['CustomerID'];
    });
    this.getFeedback();
  }
  
  getFeedback(){ 
    this._customerService.getFeedback( this.CustomerID, this.JobCardID).subscribe((res: any)=>{
      this.feedbackObj = res;
      console.log(this.feedbackObj);
      
    }, error=>{
      this._sharedService.error('Error', error.Message);
    })
  }

  updateFeedback(){ 
    debugger
    console.log("update",this.feedbackObj); 
    var answer = this.feedbackObj.CustomerFeedback.find(item => item.InputTypeID == 52).Answer;
    if(answer != undefined){
      this._customerService.updateFeedback(this.feedbackObj.CustomerFeedback).subscribe((res: any)=>{
        this._sharedService.success('Success', 'Customer feedback saved successfully'); 
        this._router.navigate(['/', 'job', 'list']);
      }, error=>{
        this._sharedService.error('Error', error.Message);
      })
    }
    else {
      this._sharedService.error(
        "Error",
        "Cannot save feedback without answer!"
      );
    }

    
  } 
}
