import {NgModule} from '@angular/core';
import {UserManagementComponent} from './user-management.component';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {UserListComponent} from './user-list/user-list.component';
import {UserFormComponent} from './user-form/user-form.component';
import {RouterModule} from '@angular/router';
import {USER_ROUTER_CONFIG} from './user-management-routing.module';
import {UserManagementRequestService} from '../../../core-module/api-service';
import {FileListComponent} from './file-list/file-list.component';
import {DownloadUtil} from '../../../shared-module/util/download-util';
import {FileSizePipe} from '../../../shared-module/pipe/file-size.pipe';

const COMPONENTS = [
  UserManagementComponent,
  UserListComponent,
  UserFormComponent,
  FileListComponent
];
const PIPES = [FileSizePipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  providers: [UserManagementRequestService, DownloadUtil],
  imports: [
    RouterModule.forChild(USER_ROUTER_CONFIG),
    SharedModuleModule
  ]
})
export class UserManagementModule {
}
