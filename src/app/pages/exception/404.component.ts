import {Component} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {SessionUtil} from '../../shared-module/util/session-util';

@Component({
  template: `
    <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
      <nz-result nzStatus="404" nzTitle="404" nzSubTitle="您访问的页面不存在">
        <div nz-result-extra>
          <button nz-button nzType="default" routerLink="/home" (click)="clearUserLocal()">返回登录</button>
        </div>
      </nz-result>
    </div>
  `,
})
export class Exception404Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }

  clearUserLocal(): void {
    SessionUtil.clearUserLocal();
  }
}
