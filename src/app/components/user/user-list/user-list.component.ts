import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedService } from 'app/services/shared.service';
import { EmployeeService } from 'app/services/employee.service';
import { Employee } from 'app/models/employee';
import { EmployeeFilter } from 'app/models/employee-filter'; 
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  searchQuery: string;
  activatedModalRef: NgbModalRef;
  filter: EmployeeFilter;
  userID: number;
  tabID: number = 27;
  userName: number;
  cPage: number = 1;
  cPage2: number = 1;
  employeeArray: Array<Employee>;
  employee: Employee;
  salaryValue: number = 100;
  highValue: number = 60;
  isSpliced: number = 3;
  salaryRange: Options = {
    floor: 0,
    ceil: 99999
  };
  password: string;
  confirmPassword: string;
  isActive: boolean = true;
  values = '';
  constructor(public modalService: NgbModal, public _sharedService: SharedService, private _employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeArray = new Array<Employee>();
    this.employee = new Employee();
    this.filter = new EmployeeFilter();
    this.getAllEmployeesData();
  }

  getAllEmployeesData() {
    this.filter.WorkshopID = this._sharedService.currentWorkshopID;
    this._employeeService.getAllEmployeesData(this.filter).subscribe((res: any) => {
      this.employeeArray = res.Employees;
      this.employeeArray.forEach(element => {
        element.Roles = res.UserRoles.filter(item => item.UserID == element.UserID)
      });
    }, error => {
      this._sharedService.error('Error', error.Message);
      this.employeeArray = undefined;
    });
    console.log(this.employeeArray)
  }

  deleteEmployee() {
    this._employeeService.deleteEmployee(this.userID).subscribe((res: any) => {
      this.employeeArray.splice(this.employeeArray.findIndex(item => item.UserID === this.userID), 1);
      this._sharedService.success('Success', 'Employee deleted successfully');
      this.activatedModalRef.close();
    }, error => {
      this._sharedService.error('Error', error.Message);
    })
  }

  changeEmployeeStatus() { 
    this._employeeService.changeEmployeeStatus(this.userID).subscribe((res: any) => {
      var idx = this.employeeArray.findIndex(item => item.UserID == this.userID); 
      if (idx > -1) {
        this.employeeArray[idx].IsActive = this.employeeArray[idx].IsActive == true ? false : true;
        this.activatedModalRef.close();
      }
    }, error => {
      this._sharedService.error('Error', error.Message);
    });
  }

  clearFilters() {
    this.filter = new EmployeeFilter();
    this.getAllEmployeesData();
  }

  //#region
  openModal(modal: any, id: number) {
    this.userID = id;
    this.activatedModalRef = this.modalService.open(modal);
  }
  dismissModal() {
    this.activatedModalRef.dismiss();
  }
  closeModal() {
    this.activatedModalRef.close();
  }

  toggleSplice() {
    if (this.isSpliced == 3) {
      this.isSpliced = 100;
    }
    else
      this.isSpliced = 3
  }
  
  //#endregion


  resetEmployeePassword() { 
    this._employeeService.resetEmployeePassword(this.employeeArray.find(item => item.UserID == this.userID).Email, this.password, this.confirmPassword).subscribe((res: any) => {
      this._sharedService.success('Success', 'Password reset successfully');
      this.activatedModalRef.dismiss('dismiss');

      this.password = '';
      this.confirmPassword = '';
    }, error => {
      this._sharedService.error('Error', error.Message);
    });


  }

  // closeStatusModal()
  // {debugger
  //   var idx = this.employeeArray.findIndex(item => item.UserID == this.userID); 
  //   if (idx > -1) {
  //     this.employeeArray[idx].IsActive = true;
  //   }
  //   this.activatedModalRef.close();
  // }

}
