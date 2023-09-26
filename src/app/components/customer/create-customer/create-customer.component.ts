import { Component, OnInit } from "@angular/core";
import { Customer } from "app/models/customer";
import { CustomerService } from "app/services/customer.service";
import { SharedService } from "app/services/shared.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CustomerInfo } from "app/models/customer-info";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-create-customer",
  templateUrl: "./create-customer.component.html",
  styleUrls: ["./create-customer.component.scss"],
})
export class CreateCustomerComponent implements OnInit {
  customerObj: Customer;
  customerID: number;
  customerInfo: CustomerInfo;
  pecPattern = "[A-Za-z]";
  isValid: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private _customerService: CustomerService,
    public _sharedService: SharedService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.customerObj = new Customer();
    this.route.queryParams.subscribe((params) => {
      this.customerID = +params["CustomerID"]; // (+) converts string 'id' to a number
    });
    if (this.customerID >= 1) {
      this.getSingleCustomer();
    }
  }

  getSingleCustomer() {
    this._customerService.getCustomer(this.customerID).subscribe(
      (res: any) => {
        this.customerInfo = res;
        this.customerObj = this.customerInfo.Customer;
        // this.customerObj.Birthday = this._sharedService.simpleDateFormat(this.customerObj.Birthday);
        let temp = this._sharedService.changeDateFormat(
          this.customerObj.Birthday
        );
        this.customerObj.Birthday = temp;
        console.log("single emp", res);
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }

  onSaveCustomer() {
    debugger
    var name = this.customerObj.FirstName.trim();
    if(name == null ||name == ""){
      this.isValid = false;
      this._sharedService.error("Error", "Enter a valid name");
      this.customerObj.FirstName = undefined;

      
    }
    else this.isValid = true;

    if(this.isValid == true){
    let temp = this._sharedService.dateFormat(this.customerObj.Birthday);
    this.customerObj.Birthday = temp;
    if (this.customerObj.PendingAmount == null) {
      this.customerObj.PendingAmount = 0;
    }
    this.customerObj.CreatedBy = this._sharedService.logged_user_id;
    this.customerObj.WorkshopID = this._sharedService.currentWorkshopID;
    this._customerService.saveCustomer(this.customerObj).subscribe(
      (res) => {
        this._sharedService.success("Success", " Customer Save Successfully");
        // if (this._sharedService.isCreatingJob == true) {
        //   this._sharedService.isCreatingJob = false;
        //   this._sharedService.contactMobile = this.customerObj.ContactMobile;
        //   this._router.navigate(['/vehicle/create-vehicle']);
        // }
        // else {
        this._router.navigate(["/", "customer", "list"]);
        // }
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
    }
    // console.log(this.customerObj)
  }

  onUpdateCustomer() {
    let temp = this._sharedService.dateFormat(this.customerObj.Birthday);
    this.customerObj.Birthday = temp;
    this.customerObj.ModifiedBy = this._sharedService.logged_user_id;
    this._customerService.updateCustomer(this.customerObj).subscribe(
      (res) => {
        this._router.navigate(["/", "customer", "list"]);
        this._sharedService.success("Success", "Customer Updated Successfully");
      },
      (error) => {
        this._sharedService.error("Error", error.Message);
      }
    );
  }
  CheckInputCharacters(e) {
   var unicode = e.charCode ? e.charCode : e.keyCode;
    console.log(unicode)
    if (unicode != 8) {
      if ( unicode == 32 ||unicode == 46 ||unicode == 64 ||
        (unicode >= 65 && unicode <= 90) ||
        (unicode >= 97 && unicode <= 122)
      )
        return true;
      else {
        if ( 
          (unicode < 48 || unicode > 57) &&
          (unicode < 0x0600 || unicode > 0x06ff)
        )
          //if not a number or arabic
          return false;
      }
    }
  }

}
