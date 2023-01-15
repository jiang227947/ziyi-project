import {NgModule} from '@angular/core';
import {UserManagementComponent} from './user-management.component';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {UserListComponent} from './user-list/user-list.component';
import {UserFormComponent} from './user-form/user-form.component';
import {RouterModule} from '@angular/router';
import {USER_ROUTER_CONFIG} from './user-management-routing.module';
import {UserManagementRequestService} from '../../../core-module/api-service';

const COMPONENTS = [
  UserManagementComponent,
  UserListComponent,
  UserFormComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [UserManagementRequestService],
  imports: [
    RouterModule.forChild(USER_ROUTER_CONFIG),
    SharedModuleModule
  ]
})
export class UserManagementModule {
}
