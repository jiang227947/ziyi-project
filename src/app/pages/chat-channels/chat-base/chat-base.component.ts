import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {
  ChatChannelRoomInterface,
  ChatChannelSubscribeInterface, ChatChannelSystemStatesUserInterface,
  ChatMessagesInterface
} from '../../../shared-module/interface/chat-channels';
import {
  ChatChannelsCallbackEnum,
  ChatChannelsMessageStatesEnum,
  ChatChannelsMessageTypeEnum,
  ChatMessagesTypeEnum, SystemMessagesEnum
} from '../../../shared-module/enum/chat-channels.enum';
import {User} from '../../../shared-module/interface/user';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {Socket} from 'socket.io-client/build/esm/socket';
import {MessageService} from '../../../shared-module/service/Message.service';

// 默认频道为8808
const CHANNEL_ID: string = '8808';

// todo：频道后面改成可以自己创建群组

@Component({
  selector: 'app-chat-base',
  templateUrl: './chat-base.component.html',
  styleUrls: ['./chat-base.component.scss']
})
export class ChatBaseComponent implements OnInit {

  @Input() socket: Socket;
  @ViewChild('textBox') private textBox: ElementRef;
  // 滚动条
  @ViewChild('scrollerBase') private scrollerBaseTemp: ElementRef;
  // 输入的文字
  textValue: string = '';
  // messagesList
  messagesList: ChatMessagesInterface[] | any[] = [];
  // 消息类型枚举
  chatMessagesType = ChatMessagesTypeEnum;
  // 用户信息
  userInfo: User;
  // 当前房间频道信息
  roomChannel: ChatChannelSystemStatesUserInterface;
  // 在线用户
  olineUserList = [];

  constructor(private messages: MessageService) {
  }

  ngOnInit(): void {
    this.userInfo = SessionUtil.getUserInfo();
    console.log('this.userInfo', this.userInfo);
    // todo 需要获取当前存在的用户
    this.olineUserList.push({
      userName: this.userInfo.userName
    });
    // this.messages.close();
    this.messages.messages.subscribe((message: ChatChannelSubscribeInterface) => {
      console.log('订阅消息', message);
      switch (message.type) {
        case ChatChannelsMessageTypeEnum.publicMessage:
          this.messagesList.push(this.isContinuous(message.msg));
          break;
        case ChatChannelsMessageTypeEnum.roomMessage:
          this.messagesList.push(this.isContinuous(message.msg));
          break;
        case ChatChannelsMessageTypeEnum.allMessage:
          break;
        case ChatChannelsMessageTypeEnum.systemMessage:
          switch (message.msg.systemStates) {
            case SystemMessagesEnum.roomInfo:
              // 赋值房间信息
              this.roomChannel = message.msg as ChatChannelSystemStatesUserInterface;
              console.log('房间信息', this.roomChannel);
              break;
            case SystemMessagesEnum.join:
              console.log('用户进入');
              if ('userName' in message.msg) {
                const join: any = {
                  type: this.chatMessagesType.system,
                  systemStates: SystemMessagesEnum.join,
                  userName: message.msg.userName
                };
                this.messagesList.push(join);
                // todo 同名处理
                if (this.olineUserList.indexOf(message.msg.userName) === -1) {
                  this.olineUserList.push(
                    {
                      userName: message.msg.userName
                    }
                  );
                }
              }
              break;
            case SystemMessagesEnum.left:
              console.log('用户离开');
              if ('userName' in message.msg) {
                const left: any = {
                  type: this.chatMessagesType.system,
                  systemStates: SystemMessagesEnum.left,
                  userName: message.msg.userName
                };
                this.messagesList.push(left);
              }
              break;
            default:
              break;
          }
          break;
      }
      console.log('this.messagesList', this.messagesList);
    });
  }

  /**
   * 发送消息
   */
  send(): void {
    if (this.textValue === '') {
      return;
    }
    const message: ChatMessagesInterface = {
      // 附件
      attachments: [],
      // 消息发送者
      author: {
        // 头像
        avatar: this.userInfo.avatar,
        // 头像描述
        avatar_decoration: null,
        // 鉴别器
        discriminator: null,
        // 全局名称
        global_name: null,
        // id
        id: this.userInfo.id,
        // 公共标签
        public_flags: 0,
        // 用户名
        username: this.userInfo.userName,
      },
      // 频道id
      channel_id: CHANNEL_ID,
      // 组件
      components: [],
      // 消息内容
      content: this.textValue,
      // 编辑消息的时间
      edited_timestamp: null,
      // 嵌入
      embeds: [],
      // 标志
      flags: 0,
      // id
      id: this.userInfo.id,
      // 提及的人
      mention_everyone: false,
      // 提及的角色
      mention_roles: [],
      // 提及的人名称信息
      mentions: [],
      // 留言参考
      message_reference: [],
      // 参考消息
      referenced_message: [],
      // 固定
      pinned: false,
      // 时间
      timestamp: new Date().toISOString(),
      tts: false,
      // 消息类型 用于前端展示判断
      type: ChatMessagesTypeEnum.general
    };
    this.socket.emit(ChatChannelsMessageTypeEnum.publicMessage, message, (response) => {
      if (response.status === ChatChannelsCallbackEnum.ok) {
        console.log('消息发送成功');
        message.states = ChatChannelsMessageStatesEnum.success;
        this.messagesList.push(this.isContinuous(message));
      } else {
        console.log('消息发送失败');
        message.states = ChatChannelsMessageStatesEnum.error;
        this.messagesList.push(this.isContinuous(message));
      }
    });
    setTimeout(() => {
      this.textBox.nativeElement.innerHTML = '';
      this.textBox.nativeElement.innerText = '';
      this.textValue = '';
      this.scrollerBaseTemp.nativeElement.scrollTo(0, this.scrollerBaseTemp.nativeElement.scrollHeight);
    });
  }

  /**
   * 判断是否为连续发言
   */
  isContinuous(message: ChatMessagesInterface): ChatMessagesInterface {
    if (message.author.avatar && message.author.avatar.indexOf('http' || 'https') !== -1) {
      // message.author.avatar = message.author.avatar;
    } else if (message.author.avatar !== null) {
      message.author.avatar = `https://www.evziyi.top${message.author.avatar}`;
    }
    // 系统消息不判断
    if (message.type === this.chatMessagesType.system) {
      return message;
    }
    if (this.messagesList.length > 0
      && this.messagesList[this.messagesList.length - 1].author
      && message.author.id === this.messagesList[this.messagesList.length - 1].author.id) {
      message.type = this.chatMessagesType.continuous;
    } else {
      message.type = this.chatMessagesType.general;
    }
    return message;
  }

  /**
   * 输入框赋值
   * @param innerHTML Dom元素的innerHTML
   */
  textBoxChange(innerHTML: string): void {
    this.textValue = innerHTML;
  }

  /**
   * 键盘按键
   * https://cloud.tencent.com/developer/ask/sof/896488/answer/1282111
   */
  textBoxKeydown(evt: KeyboardEvent): boolean {
    // 单独回车：发送消息
    if (evt.key === 'Enter' && !evt.shiftKey) {
      // console.log('发送消息');
      this.send();
      return false;
    } else if (evt.key === 'Shift' && evt.shiftKey) {
      // ctrl加回车：换行
      // console.log('换行');
      return false;
    }
    return true;
  }

}
