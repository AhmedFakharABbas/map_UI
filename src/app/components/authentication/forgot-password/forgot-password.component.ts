import { Component, OnInit } from '@angular/core';
import { Employee } from 'app/models/employee';
import { AuthService } from 'app/services/auth.service';
import { SharedService } from 'app/services/shared.service';
import { Router } from '@angular/router';
// import { Cognito } from './aws.cognito';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  employeeObj: Employee;
  data;
  constructor(private _authService: AuthService, public _sharedService: SharedService, private _router: Router) { }

  ngOnInit() {
    this.employeeObj = new Employee()
  }
  onForgotPassword(){
    this._authService.forgotPassword(this.employeeObj).subscribe(res => {
      this._sharedService.success("Success", "Reset link sent successfully on your email");
    }), error => {
      this._sharedService.error("Error", error.message);
    };
  }

}
