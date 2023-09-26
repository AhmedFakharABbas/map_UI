import { Component, OnInit } from '@angular/core';
import { Customer } from 'app/models/customer';
import { CustomerService } from 'app/services/customer.service';
import { SharedService } from 'app/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerInfo } from 'app/models/customer-info';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  customerObj: Customer;
  customerID: number;
  customerInfo : CustomerInfo;
  pecPattern = '[A-Za-z]';
  constructor(private route: ActivatedRoute, private _customerService: CustomerService, public _sharedService: SharedService) { }

  ngOnInit() {
    this.customerObj = new Customer();
    this.route.queryParams.subscribe(params => {
      this.customerID = +params['CustomerID']; // (+) converts string 'id' to a number   
    });
    if (this.customerID >= 1) {
      this.getSingleCustomer();
    }
    this.customerInfo = new CustomerInfo();
  }

  getSingleCustomer() {
    this._customerService.getCustomer(this.customerID).subscribe((res: any) => {
      this.customerInfo = res;
      this.customerObj = this.customerInfo.Customer;
      // this.customerObj.Birthday = this._sharedService.simpleDateFormat(this.customerObj.Birthday);   
      let temp = this._sharedService.changeDateFormat(this.customerObj.Birthday);
      this.customerObj.Birthday = temp;
      console.log("single emp", res);
    }, error => {
      this._sharedService.error('Error', error.Message); 
    })
  }

}
