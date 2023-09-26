import { Component, OnInit } from '@angular/core';
import { SharedService } from 'app/services/shared.service';
import { Employee } from 'app/models/employee';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  data;
  employeeObj: Employee;
  // show:boolean = false ;

  constructor(private _authService: AuthService, public _sharedService: SharedService, private _router: Router) { }

  ngOnInit() {
    this.employeeObj = new Employee();
    // this.employeeObj.Password = 'password'
    // // // for dev purpose
    // this.employeeObj.Email = "admin@ui.com";
    // this.employeeObj.Password = "123123"
  }
  // onClick() {
  //   if (this.show) {
  //     this.show = false;
  //     this.employeeObj.Password = 'password';
  //   }
  //   else {
  //     this.show = true;
  //     this.employeeObj.Password = 'text';
  //   }
  // }
  onLogin() {
    this._authService.login(this.employeeObj).subscribe((res: any) => {
      this._sharedService.token = res.access_token;
      this._sharedService.user = res;
      this._sharedService.user.Roles = JSON.parse(res.Roles);
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("employee", JSON.stringify(this._sharedService.user));
      this._sharedService.logged_user_id = this._sharedService.user.UserID;
      this._sharedService.logged_user_role = this._sharedService.user.Roles[0].Icon;
      this._sharedService.logged_user_role_id = this._sharedService.user.Roles[0].RoleID;
      this._sharedService.currentWorkshopID = this._sharedService.user.WorkshopID;
      this._sharedService.currentWorkshopName = this._sharedService.user.WorkshopName;
      this._sharedService.EmployeeID = this._sharedService.user.EmployeeID;
      localStorage.setItem("logged_user_role", this._sharedService.logged_user_role);
      localStorage.setItem("logged_user_role_id", JSON.stringify(this._sharedService.logged_user_role_id));
      localStorage.setItem("workshopID", JSON.stringify(this._sharedService.currentWorkshopID));
      localStorage.setItem("currentWorkshopName", this._sharedService.currentWorkshopName);
      localStorage.setItem("EmployeeID", JSON.stringify(this._sharedService.EmployeeID));
      localStorage.setItem("UserID", JSON.stringify(this._sharedService.logged_user_id));
 
      if(this._sharedService.logged_user_role_id == 5 || this._sharedService.logged_user_role_id == 6 || this._sharedService.logged_user_role_id == 7 || this._sharedService.logged_user_role_id == 8 || this._sharedService.logged_user_role_id == 9){
        this._router.navigate(['/job/job-list']);
      }
      else if (this._sharedService.logged_user_role_id == 10){
        this._router.navigate(['/invoice/list']);
      }
      else {
        this._router.navigate(['/job/list']);
      }
      // else if (this._sharedService.logged_user_role_id == 3) {
      //   this._router.navigate(['/advisor/dashboard']);
      // } else if (this._sharedService.logged_user_role_id == 5) {
      //   this._router.navigate(['/foreman/dashboard']);
      // } else if (this._sharedService.logged_user_role_id == 6) {
      //   this._router.navigate(['/team-lead/dashboard']);
      // } else if (this._sharedService.logged_user_role_id == 7) {
      //   this._router.navigate(['/manager/dashboard']);
      // } else if (this._sharedService.logged_user_role_id == 8) {
      //   this._router.navigate(['/technician/dashboard']);
      // } else if (this._sharedService.logged_user_role_id == 9) {
      //   this._router.navigate(['/qa/dashboard']);
      // } else if (this._sharedService.logged_user_role_id == 10) {
      //   this._router.navigate(['/cashier/dashboard']);
      // }
      // this._sharedService.success('Success', res);
      // console.log(res); 
    }, error => {
      this._sharedService.error('Invalid', 'User ');
    });
  }

}
