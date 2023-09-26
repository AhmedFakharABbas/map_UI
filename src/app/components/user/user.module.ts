import { NgModule } from "@angular/core";
import { CreateUserComponent } from "./create-user/create-user.component";
import { ViewUserComponent } from "./view-user/view-user.component";
import { SharedModule } from "app/shared/shared.module";
import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [CreateUserComponent, ViewUserComponent, UserListComponent],
  imports: [ SharedModule, UserRoutingModule]
})
export class UserModule {}
