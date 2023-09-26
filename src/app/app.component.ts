import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SharedService } from './services/shared.service';
import { SignalrService } from './services/signalr.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from './services/job.service';
import { Router } from '@angular/router';
import { TaskTechnician } from './models/task-technician';
import { TasksAction } from './models/tasks-action';
import { interval } from 'rxjs';
import { Appointment } from './models/appointment';
import { UserNotification } from './models/user-notification';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    activatedModalRef0: NgbModalRef;
    activatedModalRef1: NgbModalRef;
    activatedModalRef2: NgbModalRef;
    QueueReminderModalRef: NgbModalRef;
    processStatusID: number;
    taskStatusID: number;
    subscription: Subscription;
    isQueueModalOpened: boolean = false;
    appointments: Array<Appointment> = [];

    //emit value in sequence every 2 minutes
    source = interval(120000);

    @ViewChild('queueReminderModal', { static: false }) queueReminderModal: ElementRef;

    @ViewChild(NavbarComponent, { static: true }) navbar: NavbarComponent;
    public options = {
        position: ['top', 'right'],
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        clickIconToClose: true,
    };

    constructor(private modalService: NgbModal, private element: ElementRef, private _jobService: JobService, public location: Location, public _sharedService: SharedService, private signalRService: SignalrService, private _router: Router) {
        if (this._sharedService.logged_user_role_id == 3) {
            this.subscription = this.source.subscribe(val => this.NotifyQueue());
        }
    }
    // constructor( private renderer : Renderer, private router: Router, @Inject(DOCUMENT,) private document: any, private element : ElementRef, public location: Location, public _sharedService: SharedService) {}
    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
    }



    //#region valet modal
    openValetModal(modal: any) {
        debugger
        this.activatedModalRef0 = this.modalService.open(modal, { backdrop: 'static' });
        var x = <HTMLVideoElement>document.getElementById("alertAudio");
        x.play();
    }
    closeValetModal() {
        debugger
        this.activatedModalRef0.close();
        var x = <HTMLVideoElement>document.getElementById("alertAudio")
    }
    //#endregion


    //#region process modal
    // this method is called for showing popup modal notifications for processes 
    openProcessModal(modal: any) {
        debugger
        if (this._sharedService.logged_user_id != undefined) {
            this._sharedService.isProcessModalOpened = true;
            this.activatedModalRef1 = this.modalService.open(modal, { backdrop: 'static', size: 'lg' });
            var x = <HTMLVideoElement>document.getElementById("alertAudioSup");
            x.volume = 0.2;
            x.play();

        }
    }

    closeProcessModal() {
        if (this._sharedService.notifications.length == 1) {
            this.activatedModalRef1.close();
            this._sharedService.isProcessModalOpened = false;
        }
        if (this._router.url.includes('/job/list') || this._router.url.includes('/job/job-list')) {
            this._sharedService.getAllJobCards.next(true);
        }
        if (this._router.url.includes('/job/job-list')) {
            this._sharedService.getTechJobCards.next(true);
        }
        // else {
        this.activatedModalRef1.close();
        this._sharedService.isProcessModalOpened = false;
        this._sharedService.notifications = new Array<UserNotification>();

        // 
        // }
        // var x = <HTMLVideoElement>document.getElementById("alertAudioSup");
        //  x.pause();
    }

    acceptJP(processStatusID: number, jp: any, IsNew?: boolean, notificationID?: number) {

        var process: any;
        if (IsNew != undefined) {
            var data = this._sharedService._commonMeta.PendingNotifications.find(item => item.NotificationID == notificationID)
            process = { ProcessStatusID: processStatusID, ProcessTypeID: data.ProcessTypeID, JobCardID: data.JobCardID }
        }
        else {
            //job process id job card id  emp id is accepted 
            var rp = this._sharedService.recentProcesses.find(item => item.JobCardID == jp.JobCardID);
            process = { ProcessStatusID: processStatusID, ProcessTypeID: rp.ProcessTypeID, JobCardID: rp.JobCardID }
        }
        this._jobService.acceptJobProcess(process).subscribe(res => {
            ////splice notification after action (needs to manage modal should open or close)
            var index = this._sharedService.notifications.findIndex(item => item.JobCardID == jp.JobCardID);
            if (index > -1) {
                this._sharedService.notifications.splice(index, 1)
            }
            if (processStatusID == 18) {
                if (this._sharedService.notifications.length == 0) {
                    this.activatedModalRef1.close();
                }
                if (this._router.url.includes('/job-list')) {
                    this._sharedService.getTechJobCards;
                    // document.getElementById("getTechJobListBtn").click();
                }
                if (this._router.url.includes('update-job/' + jp.JobCardID + '/basic-info')) {
                    this._router.navigate(['/job/list']);
                    // var process = this._sharedService.jobObj.JobProcess.find(i => i.ProcessTypeID == 8);
                    // if (process != undefined) {
                    //     process.EmployeeID = undefined;
                    // }

                }
                this._sharedService.changeTabID.next(true);
                this._sharedService.warning('Process Rejected');
            }
            else {
                if (this._sharedService.notifications.length == 0) {
                    this.activatedModalRef1.close();
                }
                if (this._router.url.includes('/job-list')) {
                    this._sharedService.getTechJobCards.next(true);
                    // document.getElementById("getTechJobListBtn").click();
                    //window.location.reload();
                }
                this._sharedService.changeTabID.next(false);
                this._sharedService.success('Success', 'Job card accepted successfully');
            }

        }, error => {
            this._sharedService.error('Error', error.Message);
        })
    }

    refreshJobList() {
        this._sharedService.getAllJobCards;
        // if (this._router.url.includes('/job/list')) {
        //     document.getElementById("getJobListBtn").click();
        // }
    }

    //#endregion


    //#region task modal
    // this method is called for showing popup modal notifications for tasks
    openTaskModal(modal: any) {
        if (this._sharedService.isTaskModalOpened == false) {

            this._sharedService.isTaskModalOpened = true;
            this.activatedModalRef2 = this.modalService.open(modal, { backdrop: 'static', size: 'lg' });
            var x = <HTMLVideoElement>document.getElementById("alertAudioTask");
            console.log("x",x);
            x.volume = 0.2;
            x.play();

        }
    }
    closeTaskModal() {
        this._sharedService.isTaskModalOpened = false;
        this.activatedModalRef2.close();
    }

    // technician accept all tasks
    acceptAllTasks(taskStatusID: number, JobCardID?: number) {
        var taskAction = new TasksAction();
        taskAction.EmployeeID = this._sharedService.logged_user_id;
        if (this._sharedService.recentTasks != undefined && JobCardID == undefined) {
            taskAction.JobCardID = this._sharedService.recentTasks[0].JobCardID;
        }
        else {
            taskAction.JobCardID = JobCardID;
        }
        taskAction.TaskStatusID = taskStatusID;
        //var temp: any = this.jobCardArray.JobTasks.find(item => item.JobCardID == jobCardID);
        //this.taskAction.RepairTypeID = temp.RepairTypeID;
        taskAction.ModifiedBy = this._sharedService.logged_user_id;
        this._jobService.acceptAllTasks(taskAction).subscribe((res: any) => {
            ////splice notification after action (needs to manage modal should open or close)
            var index = this._sharedService.notifications.findIndex(item => item.JobCardID == taskAction.JobCardID);
            if (index > -1) {
                this._sharedService.notifications.splice(index, 1)
            }
            if (taskAction.TaskStatusID == 18) {
                if (this._sharedService.notifications.length == 0) {
                    this.activatedModalRef2.close();
                }
                this._sharedService.warning('Task Rejected');
                //this.jobCardArray.JCBasicInfoList.find(item => item.JobCardID == jobCardID).JobTaskStatusID = 4;
            }
            else {
                if (this._sharedService.notifications.length == 0) {
                    if (this._router.url.includes('/job-list')) {
                        this._router.navigate(['/', 'job', 'view-tasks'], { queryParams: { JobCardID: taskAction.JobCardID } });
                    }
                    this.activatedModalRef2.close();
                }
                this._sharedService.success('Task Accepted');
                this._sharedService.changeTabID.next(false);

                // this.jobCardArray.JCBasicInfoList.find(item => item.JobCardID == jobCardID).JobTaskStatusID = 2;
            }
            // this.jobCardArray.JobTasks.forEach(element => {
            //     this.jobCardArray.JobTasks.splice(this.jobCardArray.JobTasks.findIndex(item => item.JobCardID == jobCardID), 1);
            //});
            // res.forEach(element => {
            //     this.jobCardArray.JobTasks.push(element);
            // });
            if (this._sharedService.notifications.length == 0) {

                this.activatedModalRef2.close();
                this._sharedService.isTaskModalOpened = false;

            }
        }, error => {
            this._sharedService.error('Error', error.Message);
        })
    }

    //#endregion

    //// this method is for showing notifications to valet on every refresh
    openProcessReminderModal(modal: any) {
        this._sharedService.isProcessModalOpened = true;
        this.activatedModalRef1 = this.modalService.open(modal, { backdrop: 'static', size: 'lg' });
    }

    closeProcessReminderModal() {
        if (this._sharedService.notifications.length == 1) {
            this._sharedService.isProcessModalOpened = false;
        }
        if (this._router.url.includes('/job/list') || this._router.url.includes('/job/job-list')) {
            this._sharedService.getAllJobCards.next(true);
        }
        this.activatedModalRef1.close();

    }


    // for notify to advisor for cars pending for job card creation. which shows after every 10 minutes of queue creation
    NotifyQueue() {
        if (this.isQueueModalOpened == false && this._sharedService.logged_user_role_id == 3) {
            let dateTime = new Date();
            this.appointments = new Array<Appointment>();
            // this.appointments = this._sharedService.appointments.filter(i => i.CreatedOn.setMinutes(i.CreatedOn.getMinutes() + dateTime.getMinutes()) % 2);
            this._sharedService.appointments.forEach(el => {
                var date = new Date(el.CreatedOn);
                date.setMinutes(date.getMinutes() + dateTime.getMinutes());
                if (date.getMinutes() % 10 == 0) {
                    this.appointments.push(el);
                }
            });

            if (this.appointments.length > 0) {
                this.openQueueReminderModal(this.queueReminderModal);
            }

        }
    }

    openQueueReminderModal(modal: any) {
        this.isQueueModalOpened = true;
        this.QueueReminderModalRef = this.modalService.open(modal, { backdrop: 'static', size: 'lg' });
    }
    closeQueueReminderModal() {
        this.isQueueModalOpened = false;
        this.QueueReminderModalRef.close();
    }



}
