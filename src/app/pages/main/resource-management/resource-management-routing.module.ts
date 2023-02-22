import {Routes} from '@angular/router';
import {FileListComponent} from './file-list/file-list.component';
import {ResourceManagementComponent} from './resource-management.component';

export const RESOURCE_ROUTER_CONFIG: Routes = [
  {path: '', redirectTo: 'resource-management', pathMatch: 'full'},
  {
    path: '',
    component: ResourceManagementComponent,
    children: [
      // 文件列表
      {
        path: 'file-list',
        component: FileListComponent
      },
    ]
  },
];
