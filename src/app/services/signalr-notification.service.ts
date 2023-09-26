import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRNotificationService {

  constructor(private _customHttp: CustomHttpService) { }

  notify(notificationID : string){
    let url ='api/JobCard/NotificationSent';
    return this._customHttp.get(url, { notificationID: notificationID });
  }

  getJobProcess(jobCardID : number){
    let url ='api/JobCard/GetJobProcess';
    return this._customHttp.get(url, { jobCardID });
  }
}
