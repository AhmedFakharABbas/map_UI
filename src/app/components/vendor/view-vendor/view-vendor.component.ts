import { Component, OnInit } from '@angular/core';
import { VendorService } from 'app/services/vendor.service';
import { SharedService } from 'app/services/shared.service';
import { VendorModel } from 'app/models/vendor';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
export class ViewVendorComponent implements OnInit {
  array = [1]
  vendorObj: VendorModel;
  VendorID: number
  constructor(private route: ActivatedRoute, private _vendorService: VendorService, public _sharedService: SharedService) { }

  ngOnInit() {
    this.vendorObj = new VendorModel();
    this.route.queryParams.subscribe(params => {
      this.VendorID = +params['VendorID']; // (+) converts string 'id' to a number
    });
    console.log(this.VendorID);
    this.getSingleVendor();
  }
  getSingleVendor() {
    this._vendorService.getSingleVendor(this.VendorID).subscribe((res: any) => {
      this.vendorObj = res;
      console.log("Single Vendor Meta", this.vendorObj);
      console.log("All Meta", res);

    }, error => {
      console.log("error", error.Message);
    });

  }
}