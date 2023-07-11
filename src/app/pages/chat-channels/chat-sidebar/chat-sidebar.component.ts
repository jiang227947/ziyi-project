import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Result} from '../../../shared-module/interface/result';
import {CreateChannelParamInterface} from '../../../shared-module/interface/chat-channels';
import {HttpErrorResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ChatRequestService} from '../../../core-module/api-service/chat';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {User} from '../../../shared-module/interface/user';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent implements OnInit {

  // 当前选择的频道
  @Input() selectActiveChannel: string;
  // 频道折叠
  @Input() channelsUnfold: boolean = false;
  // 当前选择的频道
  @Output() selectActiveChannelEmit = new EventEmitter<string>();
  // 创建频道模板显示变量
  createChannelVisible: boolean = false;
  // 设置频道模板显示变量
  showSettingVisible: boolean = false;
  // 用户信息
  user: User;
  // 频道列表
  channelList: CreateChannelParamInterface[] = [];
  // 当前频道
  channel: CreateChannelParamInterface;

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
      } else {
        this.$message.error(result.msg);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
    });
  }

  /**
   * 切换频道
   * @param channelID 频道ID
   */
  selectActiveChannelChange(channelID: string): void {
    if (this.selectActiveChannel === channelID) {
      return;
    }
    this.selectActiveChannel = channelID;
    this.channel = this.channelList.find(item => item.channelId === this.selectActiveChannel);
    if (this.channel && this.channel.tags) {
      this.channel.tags = JSON.parse(this.channel.tags as string);
    }
    this.selectActiveChannelEmit.emit(this.selectActiveChannel);
  }

  /**
   * 打开弹框
   * @param type 弹框类型
   */
  showVisible(type: string): void {
    switch (type) {
      case 'createChannel':
        this.createChannelVisible = true;
        break;
      case 'showSetting':
        this.showSettingVisible = true;
        break;
    }
  }

  /**
   * 关闭弹框
   * @param type 弹框类型
   * @param param 入参
   */
  hiddenVisible(type: string, param?: boolean): void {
    switch (type) {
      case 'createChannel':
        this.createChannelVisible = false;
        if (param) {
          this.queryChannel();
        }
        break;
      case 'showSetting':
        this.showSettingVisible = false;
        if (param) {
          this.selectActiveChannelChange('8808');
          this.queryChannel();
        }
        break;
    }
  }

  /**
   * 前往github
   */
  github(): void {
    window.open('https://github.com/jiang227947/ziyi-project', '_blank');
  }
}
