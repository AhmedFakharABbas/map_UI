import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FullLayoutComponent } from "./layouts/full-layout/full-layout.component";
import { SimpleLayoutComponent } from "./layouts/simple-layout/simple-layout.component";
import { AuthGuard } from './guards/auth.guard'


const routes: Routes = [
  { path: "", redirectTo: "auth/login", pathMatch: "full" },
  {
    path: "",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "admin",
        loadChildren: () =>
          import("./components/admin/admin.module").then(
            mod => mod.AdminModule
          ),
        data: {
          breadcrumb: "admin"
        }
      },
      {
        path: "advisor",
        loadChildren: () =>
          import("./components/advisor/advisor.module").then(
            mod => mod.AdvisorModule
          )
      },
      {
        path: "cashier",
        loadChildren: () =>
          import("./components/cashier/cashier.module").then(
            mod => mod.CashierModule
          )
      },
      {
        path: "foreman",
        loadChildren: () =>
          import("./components/foreman/foreman.module").then(
            mod => mod.ForemanModule
          )
      },

      {
        path: "manager",
        loadChildren: () =>
          import("./components/manager/manager.module").then(
            mod => mod.ManagerModule
          )
      },
      {
        path: "qa",
        loadChildren: () =>
          import("./components/qa/qa.module").then(mod => mod.QaModule)
      },
      {
        path: "team-lead",
        loadChildren: () =>
          import("./components/team-lead/team-lead.module").then(
            mod => mod.TeamLeadModule
          )
      },
      {
        path: "technician",
        loadChildren: () =>
          import("./components/technician/technician.module").then(
            mod => mod.TechnicianModule
          )
      },
      {
        path: "vendor",
        loadChildren: () =>
          import("./components/vendor/vendor.module").then(
            mod => mod.VendorModule
          )
      },
      {
        path: "service-center",
        loadChildren: () => import("./components/service-center/service-center.module").then(mod => mod.ServiceCenterModule),
        data: {
          breadcrumb: "service center"
        }
      },
      {
        path: "user",
        loadChildren: () => import("./components/user/user.module").then(mod => mod.UserModule),
        data: {
          breadcrumb: "user"
        }
      },
      {
        path: "customer",
        loadChildren: () => import("./components/customer/customer.module").then(mod => mod.CustomerModule),
        data: {
          breadcrumb: "customer"
        }
      },
      {
        path: "vehicle",
        loadChildren: () => import("./components/vehicle/vehicle.module").then(mod => mod.VehicleModule),
        data: {
          breadcrumb: "vehicle"
        }
      },
      {
        path: "create-job",
        loadChildren: () => import("./components/job/job.module").then(mod => mod.JobModule),
        data: {
          breadcrumb: "create job"
        }
      },
      {
        path: "update-job/:id",
        loadChildren: () => import("./components/job/job.module").then(mod => mod.JobModule),
        data: {
          breadcrumb: "update job"
        }
      },
      // {
      //   path: "update-queue",
      //   loadChildren: () => import("./components/job/job.module").then(mod => mod.JobModule),
      //   data: {
      //     breadcrumb: "update job"
      //   }
      // },
      {
        path: "job",
        loadChildren: () => import("./components/view-jobs/view-jobs.module").then(mod => mod.ViewJobsModule),
        data: {
          breadcrumb: "job"
        }
      },
      {
        path: "invoice",
        loadChildren: () => import("./components/invoice/invoice.module").then(mod => mod.InvoiceModule),
        data: {
          breadcrumb: "invoice"
        }
      },
      {
        path: "vendor",
        loadChildren: () => import("./components/vendor/vendor.module").then(mod => mod.VendorModule),
        data: {
          breadcrumb: "vendor"
        }
      },
      {
        path: "part",
        loadChildren: () => import("./components/part/part.module").then(mod => mod.PartModule),
        data: {
          breadcrumb: "part"
        }
      },
      {
        path: "pricing",
        loadChildren: () => import("./components/pricing/pricing.module").then(mod => mod.PricingModule),
        data: {
          breadcrumb: "pricing"
        }
      },
      {
        path: "notification",
        loadChildren: () =>
          import("./components/notification/notification.module").then(
            mod => mod.NotificationModule
          ),
        data: {
          breadcrumb: "notification"
        }
      },
      {
        path: "service-contract",
        loadChildren: () =>
          import("./components/service-contract/service-contract.module").then(
            mod => mod.ServiceContractModule
          ),
        data: {
          breadcrumb: "service contract"
        }
      },
      {
        path: "queue",
        loadChildren: () => import("./components/queue/queue.module").then(mod => mod.QueueModule),
        data: {
          breadcrumb: "queue"
        }
      },
    ]
  },
  {
    path: "",
    component: SimpleLayoutComponent,
    children: [
      {
        path: "auth",
        loadChildren: () =>
          import("./components/authentication/authentication.module").then(
            mod => mod.AuthenticationModule
          ),

      }
    ]
  }
  // { path: "**", redirectTo: "auth/login", pathMatch: "full" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
