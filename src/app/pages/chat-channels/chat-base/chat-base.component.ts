import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
  ChatChannelRoomInterface, ChatChannelRoomUserInterface,
  ChatChannelSubscribeInterface,
  ChatMessagesInterface, ChatMessagesModal
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
import {Router} from '@angular/router';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';

// 默认频道为8808
const CHANNEL_ID: string = '8808';

// todo：频道后面改成可以自己创建群组

@Component({
  selector: 'app-chat-base',
  templateUrl: './chat-base.component.html',
  styleUrls: ['./chat-base.component.scss']
})
export class ChatBaseComponent implements OnInit, OnDestroy {

  // Socket长连接
  @Input() socket: Socket;
  // 断开
  @Output() socketDisconnect = new EventEmitter();
  // 输入框
  @ViewChild('textBox') private textBox: ElementRef<Element>;
  // 滚动条
  @ViewChild('scrollerBase') private scrollerBaseTemp: ElementRef<Element>;
  // 输入的文字
  textValue: string = '';
  // 左侧用户展开控制
  isCollapsed: boolean = false;
  // emoji选择器
  emojiSelect: boolean = false;
  // messagesList
  messagesList: ChatMessagesInterface[] | any[] = [];
  // 消息类型枚举
  chatMessagesType = ChatMessagesTypeEnum;
  // 用户信息
  userInfo: User;
  // 当前房间频道信息
  roomChannel: ChatChannelRoomInterface;
  // 在线用户
  onlineUserList: ChatChannelRoomUserInterface[] = [];
  // 消息体
  message: ChatMessagesInterface = new ChatMessagesModal();

  constructor(private messages: MessageService, private router: Router,
              private nzContextMenuService: NzContextMenuService) {
  }

  ngOnInit(): void {
    this.userInfo = SessionUtil.getUserInfo();
    console.log('用户信息', this.userInfo);
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
              this.roomChannel = message.msg as ChatChannelRoomInterface;
              console.log('房间信息', this.roomChannel);
              this.onlineUserList = this.roomChannel.users.map((item) => {
                return item;
              });
              break;
            case SystemMessagesEnum.join:
              console.log('用户进入');
              if ('userName' in message.msg) {
                const join: any = {
                  type: this.chatMessagesType.system,
                  systemStates: SystemMessagesEnum.join,
                  userName: message.msg.userName,
                  id: message.msg.id,
                  socketId: message.msg.socketId,
                  timestamp: message.msg.timestamp
                };
                this.messagesList.push(join);
                // todo 同名处理
                if (this.onlineUserList.indexOf(message.msg.userName) === -1) {
                  console.log('message.msg', message.msg);
                  this.onlineUserList.push({
                    id: message.msg.id,
                    socketId: message.msg.socketId,
                    userName: message.msg.userName,
                    avatar: message.msg.avatar,
                    remarks: message.msg.remarks,
                    role: message.msg.role,
                    roleName: message.msg.roleName
                  });
                }
              }
              break;
            case SystemMessagesEnum.left:
              console.log('用户离开');
              if ('userName' in message.msg) {
                const left: any = {
                  type: this.chatMessagesType.system,
                  systemStates: SystemMessagesEnum.left,
                  userName: message.msg.userName,
                  id: message.msg.id,
                  socketId: message.msg.socketId,
                  timestamp: message.msg.timestamp
                };
                this.messagesList.push(left);
                const findIndex = this.onlineUserList.findIndex(user => user.socketId === message.msg.socketId);
                // 删除用户
                if (findIndex !== 0) {
                  this.onlineUserList.splice(findIndex, 1);
                }
              }
              break;
            default:
              break;
          }
          break;
      }
      setTimeout(() => {
        this.scrollerBaseTemp.nativeElement.scrollTo(0, this.scrollerBaseTemp.nativeElement.scrollHeight);
      }, 10);
      console.log('this.messagesList', this.messagesList);
    });
  }

  /**
   * 发送消息
   */
  send(): void {
    // 判断空字符
    if (this.textValue === '') {
      return;
    }
    // 判断无意义的多段换行
    const split = this.textValue.split(`\n`);
    let count: number = 0;
    for (let i = 0; i < split.length; i++) {
      if (split[i] === '') {
        count += 1;
      }
    }
    /**
     * 如果只有多段换行   并且超过3条只显示3条
     * 注：换行符split之后的length会默认+2 所以判断要大于5
     */
    if (count === split.length && count > 5) {
      this.textValue = `\n\n\n`;
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
      mention_everyone: this.message.mention_everyone || false,
      // 提及的角色
      mention_roles: this.message.mention_roles || [],
      // 提及的人名称信息
      mentions: this.message.mentions || null,
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
        // todo 重发
        console.log('消息发送失败');
        message.states = ChatChannelsMessageStatesEnum.error;
        this.messagesList.push(this.isContinuous(message));
      }
    });
    setTimeout(() => {
      this.textBox.nativeElement.innerHTML = '';
      // this.textBox.nativeElement.innerText = '';
      this.textValue = '';
      this.scrollerBaseTemp.nativeElement.scrollTo(0, this.scrollerBaseTemp.nativeElement.scrollHeight);
    }, 10);
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
    // 如果上一条消息的用户为当前这个人则为连续发言
    if (this.messagesList.length > 0
      && this.messagesList[this.messagesList.length - 1].author
      && message.author.id === this.messagesList[this.messagesList.length - 1].author.id) {
      message.type = this.chatMessagesType.continuous;
    } else {
      // 否则为普通发言
      message.type = this.chatMessagesType.general;
    }
    return message;
  }

  /**
   * 输入框赋值
   * @param innerText Dom元素的innerHTML
   */
  textBoxChange(innerText: string): void {
    this.textValue = innerText;
  }

  /**
   * 在线用户列表隐藏显示
   */
  hiddenOnlineUser(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * 键盘按键
   * https://cloud.tencent.com/developer/ask/sof/896488/answer/1282111
   */
  textBoxKeydown(evt: KeyboardEvent): boolean {
    // 单独回车：发送消息
    if (evt.key === 'Enter' && !evt.shiftKey) {
      // console.log('发送消息');
      evt.preventDefault();
      this.send();
      return false;
    } else if (evt.key === 'Shift' && evt.shiftKey) {
      // ctrl加回车：换行
      // console.log('换行');
      return false;
    }
    return true;
  }

  /**
   * @提及
   */
  mention(user: ChatChannelRoomUserInterface): void {
    console.log(user);
    this.message.mention_everyone = true;
    this.message.mention_roles = [user.role];
    this.message.mentions = user;
    this.textValue = `${this.textValue}@${user.userName}`;
    this.textBox.nativeElement.innerHTML = `${this.textBox.nativeElement.innerHTML}@${user.userName}`;
    console.log(this.message);
  }

  /**
   * 右键
   */
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    // 设置下拉根元素的类名称
    menu.nzOverlayClassName = 'chatDropdownMenu';
    this.nzContextMenuService.create($event, menu);
  }

  /**
   * 退出聊天
   */
  quit(): void {
    // this.socket.connect();
    this.socket.disconnect();
    this.router.navigate(['/main/index']);
  }

  /**
   * 关闭弹框
   */
  publicClose(): void {
    this.emojiSelect = false;
  }

  ngOnDestroy(): void {
    this.quit();
  }

}
