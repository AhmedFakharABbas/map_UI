import { Component, OnInit } from '@angular/core';
import { Customer } from 'app/models/customer';
import { CustomerService } from 'app/services/customer.service';
import { SharedService } from 'app/services/shared.service';

@Component({
  selector: 'app-jc-create-customer',
  templateUrl: './jc-create-customer.component.html',
  styleUrls: ['./jc-create-customer.component.scss']
})
export class JcCreateCustomerComponent implements OnInit {

  constructor(private _customerService: CustomerService, public _sharedService: SharedService) { }
  isValid: boolean = true;


  ngOnInit() {
    
    // if (this._sharedService.jobObj.jcCustomerObj == undefined)
    // {
    //   this._sharedService.jobObj.jcCustomerObj = new Customer();
    // }debugger;
    

   }

  onSaveCustomer() {
    debugger
    if(this._sharedService.jobObj.jcCustomerObj.FirstName!=undefined){
      var name = this._sharedService.jobObj.jcCustomerObj.FirstName.trim();
    }
    else if(this._sharedService.jobObj.jcCustomerObj.CompanyName){
      var name = this._sharedService.jobObj.jcCustomerObj.CompanyName.trim();
    }
   
    if(name == null ||name == ""){
      this.isValid = false;
      this._sharedService.error("Error", "Enter a valid name");
      this._sharedService.jobObj.jcCustomerObj.FirstName = undefined;

      
      
    }
    else
    { this.isValid = true;
    }

    if(this.isValid == true){

    // let temp = this._sharedService.dateFormat(this._sharedService.jobObj.jcCustomerObj.Birthday);
    // this._sharedService.jobObj.jcCustomerObj.Birthday = temp;
    if (this._sharedService.jobObj.jcCustomerObj.PendingAmount == null) {
      this._sharedService.jobObj.jcCustomerObj.PendingAmount = 0;
    }
    this._sharedService.jobObj.jcCustomerObj.CreatedBy = this._sharedService.logged_user_id;
    this._sharedService.jobObj.jcCustomerObj.WorkshopID = this._sharedService.currentWorkshopID;
    this._customerService.saveCustomer(this._sharedService.jobObj.jcCustomerObj).subscribe(res => {
      
      this._sharedService.success('Success', ' Customer Save successfully');
      this._sharedService.jobObj.jcCustomerObj = res;
      this._sharedService.jobObj.jcVehicleObj.CustomerID = res.CustomerID;
      this._sharedService.jcCustomerMode = true;
      this._sharedService.createdCustomer = true;
      this._sharedService.jobObj.jcVehicleObj.CustomerID = this._sharedService.jobObj.jcCustomerObj.CustomerID;
      this._sharedService.jobObj.JCBasicInfo.CustomerID = this._sharedService.jobObj.jcCustomerObj.CustomerID;
    }, error => {
      this._sharedService.error('Error', error.Message);
    });
  }

  }

  onUpdateCustomer() {
    // let temp = this._sharedService.dateFormat(this._sharedService.jobObj.jcCustomerObj.Birthday);
    // this._sharedService.jobObj.jcCustomerObj.Birthday = temp;
    this._sharedService.jobObj.jcCustomerObj.ModifiedBy = this._sharedService.logged_user_id;
    this._customerService.updateCustomer(this._sharedService.jobObj.jcCustomerObj).subscribe(res => {
      this._sharedService.success('Success', 'customer updated successfully');
      this._sharedService.jobObj.jcCustomerObj = res;
      this._sharedService.jcCustomerMode = true;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

}
