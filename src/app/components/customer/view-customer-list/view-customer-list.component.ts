import { Component, OnInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Options } from "ng5-slider";
import { SharedService } from 'app/services/shared.service';
import { CustomerService } from 'app/services/customer.service';
import { Customer } from 'app/models/customer';
import { CustomerFilter } from 'app/models/customer-filter';

@Component({
  selector: "app-view-customer-list",
  templateUrl: "./view-customer-list.component.html",
  styleUrls: ["./view-customer-list.component.scss"]
})
export class ViewCustomerListComponent implements OnInit {
  activatedModalRef: NgbModalRef; 
  balanceRange: Options = {
    floor: 0,
    ceil: 1000
  };
  balanceValue: any = 0;
  highValue: any = 0;
  cPage: number = 1;
  customerArray: Array<Customer>;
  customerID: number;
  filter: CustomerFilter;
  totalCustomers: number;
  constructor( public modalService: NgbModal, public _sharedService: SharedService, private _customerService: CustomerService) {}

  ngOnInit() {
    this.customerArray = new Array<Customer>();
    this.filter = new CustomerFilter();
    this.getAllCustomers(); 
  }

  getAllCustomers(){ 
    debugger
    this.filter.MinPendingAmount = this.balanceValue;
    this.filter.MaxPendingAmount = this.highValue; 
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this._customerService.getAllCustomers(this.filter).subscribe( (res:any) =>{
      this.customerArray = res.Customers;
      if(res.customer != undefined){
        this.totalCustomers = res.customer.TotalCustomer;   
      }
      else{
        this.totalCustomers = 0;
      }
     
    },error =>{
      //this._sharedService.error('Error', error.Message);
      this.customerArray = new Array<Customer>(); 
    })
  }

  deleteCustomer(){ 
    this._customerService.deleteCustomer(this.customerID).subscribe(res => {
      this.customerArray.splice(this.customerArray.findIndex(item => item.CustomerID == this.customerID),1 );
      this.activatedModalRef.close(); 
      this._sharedService.success('Success', 'Customer deleted successfully');
    }, error => {
      this.activatedModalRef.close();
      this._sharedService.error('Error', error.Message);
    })
  }

  clearFilters(){
    this.balanceValue = 0;
    this.highValue = 0;
    this.filter = new CustomerFilter();
    this.getAllCustomers();
  }

  //#region Modal
  openModal(modal: any, id: number) {
    this.customerID= id;
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

