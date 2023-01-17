import {Routes} from '@angular/router';
import {UserManagementComponent} from './user-management.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserFormComponent} from './user-form/user-form.component';
import {ImageListComponent} from './image-list/image-list.component';

export const USER_ROUTER_CONFIG: Routes = [
  {path: '', redirectTo: 'user-list', pathMatch: 'full'},
  {
    path: '',
    component: UserManagementComponent,
    children: [
      // 用户列表
      {
        path: 'user-list',
        component: UserListComponent
      },
      // 用户新增/编辑
      {
        path: 'user-list/:type',
        component: UserFormComponent
      },
      // 图片列表
      {
        path: 'image-list',
        component: ImageListComponent
      },
    ]
  },
];
