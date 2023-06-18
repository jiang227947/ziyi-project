import {Component, OnInit} from '@angular/core';
import {Result} from '../../../shared-module/interface/result';
import {CreateChannelParamInterface} from '../../../shared-module/interface/chat-channels';
import {HttpErrorResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ChatRequestService} from '../../../core-module/api-service';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {User} from '../../../shared-module/interface/user';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent implements OnInit {

  // 创建频道模板
  visible: boolean = false;
  // 用户信息
  user: User;
  // 频道列表
  channelList: CreateChannelParamInterface[] = [];
  // 当前选择的频道
  selectActiveChannel: number = 8088;

  constructor(private $message: NzMessageService, public $chatRequestService: ChatRequestService) {
  }

  ngOnInit(): void {
    this.user = SessionUtil.getUserInfo();
    // 查询频道
    this.queryChannel();
  }

  /**
   * 查询频道
   */
  queryChannel(): void {
    this.$chatRequestService.queryChannel(this.user.id).subscribe((result: Result<CreateChannelParamInterface[]>) => {
      if (result.code === 200) {
        this.channelList = result.data;
        console.log(this.channelList);
      } else {
        this.$message.error(result.msg);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
    });
  }

  /**
   * 创建频道
   */
  createChannel(): void {
    this.visible = true;
  }

  onCancel(query?: boolean): void {
    this.visible = false;
    if (query) {
      this.queryChannel();
    }
  }
}
