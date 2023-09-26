import { Component, OnInit } from '@angular/core'; 
import { SharedService } from 'app/services/shared.service'; 

@Component({
  selector: 'app-jc-view-customer',
  templateUrl: './jc-view-customer.component.html',
  styleUrls: ['./jc-view-customer.component.scss']
})
export class JcViewCustomerComponent implements OnInit {
 
  constructor(public _sharedService: SharedService) { }

  ngOnInit() {
  }

  
}
