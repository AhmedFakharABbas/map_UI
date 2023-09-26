import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { CustomerFilter } from 'app/models/customer-filter';
import { SignalRNotificationService } from './signalr-notification.service';
import { UserNotification } from 'app/models/user-notification';
import { JobCardFilter } from 'app/models/job-card-filter';
import { JobProcess } from 'app/models/job-process';
import { TaskTechnician } from 'app/models/task-technician';
import { Router } from '@angular/router';
import { ViewTasksComponent } from 'app/components/view-jobs/view-tasks/view-tasks.component';

declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private connection: any;
  private proxy: any;
  filter: CustomerFilter;
  filterJob: JobCardFilter;

  constructor(public _sharedService: SharedService, private _notificationService: SignalRNotificationService, private _router: Router) { }

  public initializeSignalRConnection(): void {

    // let signalRServerEndPoint = 'https://mapapi.autoscore.com/';
    // let signalRServerEndPoint = 'http://localhost:4200/';
    let signalRServerEndPoint = this._sharedService.baseUrl;
    this.connection = $.hubConnection(signalRServerEndPoint);

    this.proxy = this.connection.createHubProxy('ServerHub');

    // these are hub methods from api side 
    this.proxy.on('messageReceived', (serverMessage) => this.onMessageReceived(serverMessage));
    this.proxy.on('clientNotified', (data) => this.clientNotification(data));
    this.proxy.on('ProcessNotified', (data, JobProcess) => this.processNotified(data, JobProcess));
    this.proxy.on('TaskNotified', (data, tasks) => this.taskNotified(data, tasks));
    this.proxy.on('NotificationTotal', (data) => this.notificationTotal(data));


    this.connection.start().done((data: any) => {

      var parentRef = this;
      setTimeout(function () {
        console.log('Connected to Server Hub');
        parentRef.broadcastMessage();
      },
        1000
      );
    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });

    // this.connection.client.getCus = function () {
    //   this.getCustomers();
    // };

  }

  public disconnect(): void {
    if (this.proxy == null) {
      return;
    }
    this.connection.stop(true, true);
    console.log('disconnected');
    this.proxy = null;
  }



  // public NotifyUsers(){
  //   debugger
  //   this._sharedService.success('Customer Modified.');
  //   console.log('data changed'); 
  // }

  // for sending notification to clients
  public clientNotification(data: UserNotification) {
    
    //101 for rejected
    if (data.NotificationTypeID == 101) {
      //get all job cards 
      // this._notificationService.getJobProcess(data.JobCardID).subscribe((res: any) => {
      //   res.forEach(element => {
      //     this._sharedService.jobObj.JobProcess.splice(this._sharedService.jobObj.JobProcess.findIndex(item => item.JobCardID == data.JobCardID), 1);
      //   })
      //   res.forEach(element => {
      //     this._sharedService.jobObj.JobProcess.push(element);
      //   })
      // }, error => {
      //   this._sharedService.error('Error', error.Message);
      // })
      // refresh job list after getting new assignment 
      if (this._router.url.includes('/job/job-list')) {
        this._sharedService.getTechJobCards.next(true);
      }
      if (this._router.url.includes('/job/list')) {
        this._sharedService.getAllJobCards.next(true);
      }
    }
    ////notify to advisor for Q&A
    if (data.NotificationTypeID == 100 && data.TextData.indexOf('Please do Quotation & Approval') > -1) {
      // all pop-up notifications are pushed into notifications array.
      this._sharedService.notifications.unshift(data);
      document.getElementById("processReminderBtn").click();

    }
    // if (data.NotificationTypeID == 98 && this._sharedService.logged_user_role_id != 2) {
    //   this._sharedService.notification = data;
    //   document.getElementById("processNotificationBtn").click();
    // }
    if (this._sharedService._commonMeta.Notifications.find(item => item.NotificationID == data.NotificationID) == undefined) {
      this._sharedService._commonMeta.Notifications.unshift(data);
    }


    this._sharedService.success('Notification', data.TextData);
    ////set notification is sent to true after receiving
    // this._notificationService.notify(data.NotificationID.toString()).subscribe((res: any) => {
    //   // this._sharedService.success('Notify Success');
    // }, error => {
    //   this._sharedService.error('Error', error.Message);
    // })

  }

  // for pop-up process notifications
  // all pop-up notifications are pushed into notifications array.
  public processNotified(data: UserNotification, jp: JobProcess) {
    
    if (data.NotificationTypeID == 98 && this._sharedService.logged_user_role_id != 2) {
      // this._notificationService.getVIProcess()
      ////if notification already in array then we'll remove old and add new notification

      var rn = this._sharedService.notifications.findIndex(item => item.JobCardID == data.JobCardID);
      if (rn > -1) {
        this._sharedService.notifications.splice(rn, 1)
      }
      this._sharedService.recentProcesses.push(jp);
      this._sharedService.notifications.unshift(data);
      if (this._sharedService.isProcessModalOpened == false) {
        // open process modal after inserting notifications in  _sharedService.notifications  array 
        document.getElementById("processNotificationBtn").click();
      }
    }
    if (this._sharedService._commonMeta.Notifications.find(item => item.NotificationID == data.NotificationID) == undefined) {
      this._sharedService._commonMeta.Notifications.unshift(data);
    }

    this._sharedService.success('Notification', data.TextData);

    // this._notificationService.notify(data.NotificationID.toString()).subscribe((res: any) => {
    //   // this._sharedService.success('Notify Success');
    // }, error => {
    //   this._sharedService.error('Error', error.Message);
    // })

  }

  // for pop-u task notifications
  public taskNotified(data: UserNotification, tasks: Array<TaskTechnician>) {
    
    if (data.NotificationTypeID == 103 && this._sharedService.logged_user_role_id != 2) {
      ////if notification already in array then we'll remove old and add new notiifcation
      var rn = this._sharedService.notifications.findIndex(item => item.JobCardID == data.JobCardID);
      if (rn > -1) {
        this._sharedService.notifications.splice(rn, 1)
      }
      this._sharedService.recentTasks = tasks;
      this._sharedService.notifications.unshift(data);
      if (this._sharedService._commonMeta.Notifications.find(item => item.NotificationID == data.NotificationID) == undefined) {
        this._sharedService._commonMeta.Notifications.unshift(data);
      }
      if (this._sharedService.isTaskModalOpened == false) {
        document.getElementById("taskNotificationBtn").click();
      }

      // // this._notificationService.getVIProcess()
      // this._sharedService.recentTasks = tasks;
      // this._sharedService.notifications.push(data);
      // if(this._sharedService.isTaskModalOpened == true){
      //   document.getElementById("taskNotificationBtn").click();
      // }
    }
    if (this._sharedService._commonMeta.Notifications.find(item => item.NotificationID == data.NotificationID) == undefined) {
      this._sharedService._commonMeta.Notifications.unshift(data);
    }
    this._sharedService.success('Notification', data.TextData);

    // this._notificationService.notify(data.NotificationID.toString()).subscribe((res: any) => {
    //   // this._sharedService.success('Notify Success');
    // }, error => {
    //   this._sharedService.error('Error', error.Message);
    // })
    // get all recent assinged notification 
    if (this._router.url.includes('/view-tasks?JobCardID')) {
      this._sharedService.getTasks.next(true);
    }
    // refresh list of all job cards to get newly assigned card.
    if (this._router.url.includes('/job/job-list')) {
      this._sharedService.getTechJobCards.next(true);
    }
  }
  public notificationTotal(data: any) {
    
    this._sharedService._commonMeta.Notification.UnReadNotifications += data;
    console.log("data",data);
    console.log("this._sharedService._commonMeta.Notification.UnReadNotifications",this._sharedService._commonMeta.Notification.UnReadNotifications)
    
  }
  // for registering user for notifications
  private broadcastMessage(): void {
    this.proxy.invoke('RegisterForNotification', this._sharedService.logged_user_id)
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }
  private onMessageReceived(serverMessage: string) {
    console.log('New message received from Server: ' + serverMessage);
  }


}
