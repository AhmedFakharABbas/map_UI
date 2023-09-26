import { Component, OnInit } from "@angular/core";
import { Employee } from 'app/models/employee';
import { EmployeeService } from 'app/services/employee.service';
import { SharedService } from 'app/services/shared.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonMeta } from 'app/models/common-meta';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageCompressService, ResizeOptions } from 'ng2-image-compress';
import { CommonService } from 'app/services/common.service';
import { runInThisContext } from 'vm';

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"]
})
export class CreateUserComponent implements OnInit {

  default_img: string = "/assets/img/no-image.png";
  employeeObj: Employee;
  _meta: CommonMeta;
  userID: number; 

  constructor(private route: ActivatedRoute, private modalService: NgbModal, private _employeeService: EmployeeService, public _sharedService: SharedService,
    private _router: Router, private _commonService: CommonService) {

    // this._router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };

  }

  ngOnInit() {
    debugger
    this.employeeObj = new Employee();
    this._meta = new CommonMeta();
    this.route.queryParams.subscribe(params => {
      this.userID = +params['UserID']; // (+) converts string 'id' to a number   
    });
    this.getMetaData();
    if (this.userID >= 1) {
      this.getSingleEmployee();
    }else{
      this.employeeObj.WorkshopID = this._sharedService.currentWorkshopID;
      this.employeeObj.WorkshopName = this._sharedService.currentWorkshopName;
    }
  }
  onSelectFile(fileInput: any) {

  }
  getMetaData() {
    this._employeeService.getMetaData(this._sharedService.logged_user_id).subscribe((res: any) => {
      this._meta = res; 
    }, error => {
      this._sharedService.error('Error', error.Message);
    });
  }

  getSingleEmployee() {
    this._employeeService.getSingleEmployee(this.userID).subscribe((res: any) => {
      if (this.employeeObj != undefined) {
        this.employeeObj = res.Employee;
        this.employeeObj.Roles = res.UserRoles.filter(item => item.IsChecked == 1)
        this._meta.Roles = res.UserRoles;
      }

    }, error => {
      this._sharedService.error('Error', error.Message);
    });
  }

  //#region save employee
  onSaveEmployee() { 
    
    this.employeeObj.Roles = this._meta.Roles.filter(status => status.IsChecked == true);
    if(this._sharedService.logged_user_role_id != 1){
      this.employeeObj.WorkshopID = this._sharedService.currentWorkshopID;
    } 
    this.employeeObj.CreatedBy = this._sharedService.logged_user_id;
    if (this.employeeObj.Roles != undefined && this.employeeObj.Roles.length > 0) {
      this._employeeService.saveEmployee(this.employeeObj).subscribe(res => {
        this._sharedService.success('Success', 'Employee saved successfully');
        this._router.navigate(['/', 'user', 'list']);
      }, error => {
        if (error.ModelState != undefined) {
          this._sharedService.error('Error', this.employeeObj.Email + ' already exists');
        }
        else {
          this._sharedService.error('Error', error.Message);
        }

      });
    } else {
      this._sharedService.warning('Warning', 'Please select at least one user role');
    }

  }
  //#endregion

  onUpdateEmployee() {
    this.employeeObj.ModifiedBy = this._sharedService.logged_user_id;
    this.employeeObj.Roles = this._meta.Roles.filter(status => status.IsChecked == true);
    if (this.employeeObj.Roles != undefined && this.employeeObj.Roles.length > 0) {
      this._employeeService.updateEmployee(this.employeeObj).subscribe(res => {
        this._sharedService.success('Success', 'Employee updated successfully');
        this._router.navigate(['/', 'user', 'list']);
      }, error => {
        this._sharedService.error('Error', error.Message);
      });
    } else {
      this._sharedService.warning('Warning', 'Please select at least one user role');
    }
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
            this.employeeObj.ImageURL = res;
              console.log(this.employeeObj.ImageURL);
                       
          })
        }, (error) => {
          console.log("Error while converting");
        });
      });
    } else {
      this._sharedService.warning("Warning", "Only png and jpeg formats are allowed");
    }
  }


  public delete() {
    this.employeeObj.ImageURL = undefined;
    //Note: send api call to delete image from server and also soft delete from db 
  }

  open(model) {
    this.modalService.open(model);
  }
  //#endregion

}
