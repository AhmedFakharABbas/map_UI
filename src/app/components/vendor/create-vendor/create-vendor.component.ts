import { Component, OnInit } from '@angular/core';
import { VendorModel } from 'app/models/vendor';
import { VendorService } from 'app/services/vendor.service';
import { SharedService } from 'app/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResizeOptions, ImageCompressService } from 'ng2-image-compress';
import { CommonService } from 'app/services/common.service';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.scss']
})
export class CreateVendorComponent implements OnInit {

  vendorObj: VendorModel;
  vendorID: number;
  isValid: boolean = true;

  constructor(private route: ActivatedRoute, private _vendorService: VendorService, private _sharedService: SharedService,
    private _router: Router, private modalService: NgbModal, private _commonService: CommonService) { }

  ngOnInit() {
    this.vendorObj = new VendorModel();
    this.route.queryParams.subscribe(params => {
      this.vendorID = +params['VendorID'];
    });
    if (this.vendorID >= 1) {
      this.getSingleVendor();
    }
  }

  getSingleVendor() {
    this._vendorService.getSingleVendor(this.vendorID).subscribe((res: any) => {
      this.vendorObj = res;
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  onSaveVendor() {
    debugger
    var CPFirstNamename = this.vendorObj.CPFirstName.trim();
    var VendorFirstName = this.vendorObj.VendorName.trim();
    if((CPFirstNamename == null ||CPFirstNamename == "") && (VendorFirstName == null ||VendorFirstName == "")){
      this.isValid = false;
      this._sharedService.error("Error", "Enter a valid name");
      this.vendorObj.CPFirstName = undefined;
      this.vendorObj.VendorName = undefined;


      
      
    }
    else
    { this.isValid = true;
    }

    if(this.isValid == true){
    this.vendorObj.CreatedBy = this._sharedService.logged_user_id;
    this.vendorObj.WorkshopID = this._sharedService.currentWorkshopID;
    this._vendorService.saveVendor(this.vendorObj).subscribe(res => {
      this._sharedService.success('Success', 'vendor saved successfully');
      this._router.navigate(['/', 'vendor', 'list']);
    }, error => {
      this._sharedService.error('Error', error.Message);

    })
  }
}

  onUpdateVendor() {
    this.vendorObj.ModifiedBy = this._sharedService.logged_user_id;
    this._vendorService.updateVendor(this.vendorObj).subscribe(res => {
      this._router.navigate(['/', 'vendor', 'list']);
      this._sharedService.success('Success', 'Vendor updated successfully');
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }
  //#region  Upload and delete image
  uploadImage(fileInput: any) {
    if (this._sharedService.validateFile(fileInput.target.files[0].name)) {
      var option: ResizeOptions = new ResizeOptions();
      option.Resize_Quality = 80;
      option.Resize_Type = 'image/jpg';
      ImageCompressService.filesToCompressedImageSourceEx(fileInput.target.files, option).then(observableImages => {
        observableImages.subscribe((image) => {
          // images.push(image);
          this._commonService.saveImage(image.imageDataUrl).subscribe((res: any) => {
            this.vendorObj.LogoURL = res;
          })

        }, (error) => {
          this._sharedService.error('Error', error);
        });
      });
    } else {
      this._sharedService.warning("Warning", "Only png and jpeg formats are allowed");
    }
  }
  public delete() {
    this.vendorObj.LogoURL = undefined;
    //Note: send api call to delete image from server and also soft delete from db 
  }
  open(model) {
    this.modalService.open(model);
  }
}
