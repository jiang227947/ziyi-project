import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../shared-module/interface/user';
import {LoginRequestService} from '../../../../core-module/api-service/login';
import {Result} from '../../../../shared-module/interface/result';
import {ChatChannelRoomUserInterface} from '../../../../shared-module/interface/chat-channels';

@Component({
  selector: 'app-user-infobox',
  templateUrl: './user-infobox.component.html',
  styleUrls: ['./user-infobox.component.scss'],
  providers: [LoginRequestService]
})
export class UserInfoboxComponent implements OnInit {

  // 用户ID
  @Input() userId: number;
  // 私聊的回调
  @Output() privateMessageEvent = new EventEmitter<string>();
  // 用户信息
  userInfo: User = null;
  // loading
  loading: boolean = false;

  constructor(private loginRequestService: LoginRequestService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.loginRequestService.queryUserById(this.userId).subscribe((result: Result<User>) => {
      this.loading = false;
      if (result.code === 200) {
        this.userInfo = result.data;
      }
    });
  }

  /**
   * 私聊回调
   */
  privateMessageCallBack(): void {
    this.privateMessageEvent.emit(this.userInfo.id);
  }
}
