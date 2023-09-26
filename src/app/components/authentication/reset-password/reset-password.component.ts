import { Component, OnInit } from '@angular/core';
import { Employee } from 'app/models/employee';
import { AuthService } from 'app/services/auth.service';
import { SharedService } from 'app/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  employeeObj: Employee; 
  data;
  constructor(private route: ActivatedRoute, private _authService:AuthService , public _sharedService:SharedService) { }

  ngOnInit() {
    this.employeeObj = new Employee();
    this.route.queryParams.subscribe(params => {
      this.employeeObj.Id = params['Id']; // (+) converts string 'id' to a number  
      this.employeeObj.Token = params['token']
    });
    
  }

  onResetPassword(){
    this._authService.resetPassword(this.employeeObj).subscribe(res =>{
      this._sharedService.success("Success", "Password reset successfully"); 
    }), error => {
      this._sharedService.error("Error", error.message);
    };
  }
}
