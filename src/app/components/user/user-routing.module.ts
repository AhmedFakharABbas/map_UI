import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { UserListComponent } from './user-list/user-list.component';


const routes: Routes = [
  {
    path: "create-user",
    component: CreateUserComponent,
    data: {
      breadcrumb: "Create User"
    }
  },
  {
    path: "update-user",
    component: CreateUserComponent,
    data: {
      breadcrumb: "Update User"
    }
  },
  {
    path: "list",
    component: UserListComponent,
    data: {
      breadcrumb: "User List"
    }
  },
  {
    path: "view-user",
    component: ViewUserComponent,
    data: {
      breadcrumb: "View User"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
