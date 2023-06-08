import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// ng-zorro-antd
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzResultModule} from 'ng-zorro-antd/result';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzCommentModule} from 'ng-zorro-antd/comment';
import {IconsProviderModule} from '../icons-provider.module';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzProgressModule} from 'ng-zorro-antd/progress';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
// component
import {EchartColumnComponent} from './component/echart-column/echart-column.component';
import {FormComponent} from './component/form/form.component';
// service
import {SocketIoService} from '../core-module/service/websocket/socket-io.service';
import {MessageService} from './service/Message.service';
import {LoadScriptService} from './service/load-script.service';
import {AvatarPipe} from './pipe/avatar.pipe';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
];
const NZMODULES = [
  IconsProviderModule,
  NzInputModule,
  NzModalModule,
  NzSpinModule,
  NzNotificationModule,
  NzButtonModule,
  NzSelectModule,
  NzDescriptionsModule,
  NzBadgeModule,
  NzGridModule,
  NzTableModule,
  NzCardModule,
  NzFormModule,
  NzCheckboxModule,
  NzDropDownModule,
  NzAvatarModule,
  NzResultModule,
  NzBreadCrumbModule,
  NzTagModule,
  NzAutocompleteModule,
  NzCommentModule,
  NzAlertModule,
  NzUploadModule,
  NzPopconfirmModule,
  NzProgressModule,
  NzToolTipModule,
  NzSkeletonModule
];

const COMPONENT = [EchartColumnComponent, FormComponent];

const SERVICES = [NzMessageService, LoadScriptService, SocketIoService, MessageService];

const PIPES = [AvatarPipe];

@NgModule({
  imports: [
    ...MODULES,
    ...NZMODULES
  ],
  exports: [
    ...MODULES,
    ...NZMODULES,
    ...COMPONENT,
    ...PIPES
  ],
  providers: [...SERVICES],
  declarations: [...COMPONENT, ...PIPES]
})
export class SharedModuleModule {
}
