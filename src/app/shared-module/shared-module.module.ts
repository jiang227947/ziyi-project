import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzIconModule} from 'ng-zorro-antd/icon';
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

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule
];
const NZMODULES = [
  NzInputModule,
  NzModalModule,
  NzSpinModule,
  NzNotificationModule,
  NzButtonModule,
  NzSelectModule,
  NzIconModule,
  NzDescriptionsModule,
  NzBadgeModule,
  NzGridModule,
  NzTableModule,
  NzCardModule,
  NzFormModule,
  NzCheckboxModule,
  NzDropDownModule,
  NzAvatarModule,
  NzResultModule
];

@NgModule({
  imports: [
    ...MODULES,
    ...NZMODULES
  ],
  exports: [
    ...MODULES,
    ...NZMODULES
  ],
  providers: [NzMessageService]
})
export class SharedModuleModule {
}
