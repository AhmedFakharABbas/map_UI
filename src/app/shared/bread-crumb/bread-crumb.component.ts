import { Component, HostListener, OnInit } from "@angular/core";
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  PRIMARY_OUTLET,
} from "@angular/router";
import { filter, take } from "rxjs/operators";
import { map } from "rxjs/internal/operators";
import { SharedService } from "app/services/shared.service";
import { JobService } from "app/services/job.service";
import { JobCardFilter } from "app/models/job-card-filter";
import { Subscription } from "rxjs";

@Component({
  selector: "app-bread-crumb",
  templateUrl: "./bread-crumb.component.html",
  styleUrls: ["./bread-crumb.component.scss"],
})
export class BreadCrumbComponent implements OnInit {
  selected: boolean = false;
  breadcrumbs: Array<BreadCrumb>;
  filter: JobCardFilter;
  changeSubscription: Subscription;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _router: Router,
    private _jobService: JobService
  ) {}

  bntStyle: any;
  ngOnInit() {
    this.filter = new JobCardFilter();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter((route) => route.outlet === PRIMARY_OUTLET))
      .subscribe((route: any) => {
        let snapshot = this.router.routerState.snapshot;
        this.breadcrumbs = [];
        let url = snapshot.url;
        let routeData = route.snapshot.data;
        let label = routeData["breadcrumb"];
        let params = snapshot.root.params;
        this.breadcrumbs.push({
          url: url,
          label: label,
          params: params,
        });
      });
  }

  @HostListener("document:click", ["$event"])
  documentClick(event: MouseEvent) {
    var visible = $("#notificationView").is(":visible");
    if (visible == true) {
      document.getElementById("toggleNotifications").click();
    }
  }

  onChangeRole() {
    localStorage.setItem(
      "logged_user_role",
      this._sharedService.logged_user_role
    );
    this._sharedService.logged_user_role_id =
      this._sharedService.user.Roles.find(
        (item) => item.RoleName == this._sharedService.logged_user_role
      ).RoleID;
    localStorage.setItem(
      "logged_user_role_id",
      JSON.stringify(this._sharedService.logged_user_role_id)
    );
    if (this._sharedService.logged_user_id != 9) {
      this._router.navigate(["/job/list"]);
    } else if (this._sharedService.logged_user_id == 9) {
      this._router.navigate(["/invoice/list"]);
    }
    // window.location.reload();
  }

  getAllNotifications() {
    var x = document
      .getElementById("toggleNotifications")
      .getAttribute("aria-expanded");
    if (x == "false") {
      this._jobService
        .viewAllNotifications(
          this._sharedService.logged_user_id,
          this._sharedService.notePage
        )
        .subscribe(
          (res: any) => {
            this._sharedService._commonMeta.Notifications = res;
          },
          (error) => {}
        );
    }
  }

  getAllJobCardChange() {
    if (
      this._sharedService._commonMeta.Notification.UnReadNotifications >
      this._sharedService.previousNotificationCount
    ) {
      this._sharedService.previousNotificationCount =
        this._sharedService._commonMeta.Notification.UnReadNotifications;
      this._sharedService.getAllJobCards.next(true);
    }
  }

  clearQueueFields() {
    this._sharedService.resetAllFields.next(true);
  }

  // onClick(){
  //  var x = document.getElementById("toggleNotifications").getAttribute("aria-expanded");
  //  if(x == "true")
  //  {
  //   x = "false"
  //   }
  //   else {
  //   x = "true"
  //   }
  //   document.getElementById("toggleNotifications").setAttribute("aria-expanded", x);
  //   }
}

export class BreadCrumb {
  label: string;
  url: string;
  params: any;
}
