import {
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  ChatChannelRoomInterface,
  ChatChannelRoomUserInterface,
  ChatChannelSubscribeInterface,
  ChatMessagesInterface,
  ChatMessagesModal,
  ChatSendAuthorInterface,
} from '../../../shared-module/interface/chat-channels';
import {
  ChatChannelsCallbackEnum,
  ChatChannelsMessageStatesEnum,
  ChatChannelsMessageTypeEnum,
  ChatMessagesTypeEnum,
  SystemMessagesEnum
} from '../../../shared-module/enum/chat-channels.enum';
import {User} from '../../../shared-module/interface/user';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {Socket} from 'socket.io-client/build/esm/socket';
import {MessageService} from '../../../shared-module/service/Message.service';
import {Router} from '@angular/router';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {CHAT_GPT_BOT} from '../config/config';
import {ChatRequestService} from '../../../core-module/api-service/chat';
import {PageParams} from '../../../shared-module/interface/pageParms';
import {Result} from '../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ChatCommonUtil} from '../utli/common-util';
import {ChatBaseOperateService} from '../config/chat-base-operate.service';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-chat-base',
  templateUrl: './chat-base.component.html',
  styleUrls: ['./chat-base.component.scss']
})
export class ChatBaseComponent extends ChatBaseOperateService implements OnInit, OnDestroy {


  // Socket长连接
  @Input() socket: Socket;
  // 断开
  @Output() socketDisconnect = new EventEmitter<void>();
  // 左侧用户
  @ViewChild('sidebar') private sidebar: ElementRef<Element>;
  // 输入框
  @ViewChild('textBox') private textBox: ElementRef<Element>;
  // 滚动条
  @ViewChild('scrollerBase') private scrollerBaseTemp: ElementRef<Element>;
  // 聊天消息滚动
  @ViewChild('visibleList') private visibleList: ElementRef<Element>;
  // 观察者订阅
  subscription: Subscription;
  // 当前房间频道信息
  roomChannel: ChatChannelRoomInterface;
  // 在线用户
  onlineUserList: ChatChannelRoomUserInterface[] = [];
  // 加载状态
  loadedingStatus: { userLoad: boolean, messageLoad: boolean } = {
    userLoad: true,
    messageLoad: true
  };
  // 消息列
  messagesList: ChatMessagesInterface[] | any[] = [];
  // 分页参数
  pageParams = new PageParams(1, 50);
  // 消息是否查询完毕
  isTop: boolean = false;
  // 置顶后的请求等待毫秒
  throttle = 150;
  scrollDistance = 2;
  scrollUpDistance = 1.5;
  // 消息类型枚举
  chatMessagesType = ChatMessagesTypeEnum;
  // emoji
  emojiList: string[] = [];
  // 输入的文字
  textValue: string = '';
  // 用户信息
  userInfo: User;
  // 消息体
  message: ChatMessagesModal = new ChatMessagesModal();
  // 刷屏监听参数 3秒内连续发言超过5次则算刷屏
  continuousChat: { count: number, time: number, timer: any } = {
    count: 0,
    time: 3,
    timer: null
  };

  constructor(@Inject(DOCUMENT) public document: Document, public titleService: Title,
              public messages: MessageService, public $message: NzMessageService, public router: Router,
              public nzContextMenuService: NzContextMenuService,
              private $chatRequestService: ChatRequestService) {
    super(document, titleService, messages, $message, router, nzContextMenuService);
  }

  ngOnInit(): void {
    // 初始化
    this.onInit();
    this.userInfo = SessionUtil.getUserInfo();
    // console.log('用户信息', this.userInfo);
    this.subscription = this.messages.messages.subscribe((message: ChatChannelSubscribeInterface) => {
      console.log('订阅消息', message);
      const findIndex: number | undefined = this.onlineUserList.findIndex(item => item.id === message.msg.id);
      switch (message.type) {
        case ChatChannelsMessageTypeEnum.publicMessage:
          this.messagesList.push(this.isContinuous(message.msg));
          // 如果页面切到后台，则累加新消息数量
          if (this.messageReminder.show) {
            this.messageReminder.count += 1;
            this.titleService.setTitle(`[新消息${this.messageReminder.count}] Cat 团子`);
          }
          // 置底
          this.scrollToBottom(this.scrollerBaseTemp);
          break;
        case ChatChannelsMessageTypeEnum.roomMessage:
          this.messagesList.push(this.isContinuous(message.msg));
          // 如果页面切到后台，则累加新消息数量
          if (this.messageReminder.show) {
            this.messageReminder.count += 1;
            this.titleService.setTitle(`[新消息${this.messageReminder.count}] Cat 团子`);
          }
          // 置底
          this.scrollToBottom(this.scrollerBaseTemp);
          break;
        case ChatChannelsMessageTypeEnum.allMessage:
          break;
        case ChatChannelsMessageTypeEnum.systemMessage:
          switch (message.msg.systemStates) {
            // 房间信息
            case SystemMessagesEnum.roomInfo:
              // 赋值房间信息
              this.roomChannel = message.msg as ChatChannelRoomInterface;
              const roomUsers = this.roomChannel.users.map((item) => {
                return item;
              });
              // console.log('房间信息', roomUsers);
              const personnel = this.onlineUser(roomUsers, this.roomChannel.personnel as ChatChannelRoomUserInterface[]);
              // console.log('personnel', personnel);
              // 房间用户
              this.onlineUserList = [CHAT_GPT_BOT, ...personnel];
              this.loadedingStatus.userLoad = false;
              // 分页查询聊天记录
              this.queryChatMessage().then((msg: ChatMessagesInterface[]) => {
                // console.log('msg', msg);
                // 合并消息
                this.messagesList = msg;
                // 置底
                this.scrollToBottom(this.scrollerBaseTemp);
              });
              break;
            // 信息更新
            case SystemMessagesEnum.update:
              // 更新房间内的用户信息
              const idx = this.onlineUserList.findIndex(item => item.id === +message.msg.id);
              this.onlineUserList[idx].avatar = message.msg.avatar;
              if (message.msg.userName && message.msg.remarks) {
                this.onlineUserList[idx].userName = message.msg.userName;
                this.onlineUserList[idx].remarks = message.msg.remarks;
              }
              break;
            // 用户加入
            case SystemMessagesEnum.join:
              // console.log('用户进入', message);
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
              if (findIndex) {
                this.onlineUserList[findIndex].color = 'rgb(46, 204, 113)';
                this.onlineUserList[findIndex].status = 1;
                this.onlineUserList[findIndex].socketId = message.msg.socketId;
              }
              // 置底
              this.scrollToBottom(this.scrollerBaseTemp);
              break;
            // 用户离开
            case SystemMessagesEnum.left:
              // console.log('用户离开');
              const left: any = {
                type: this.chatMessagesType.system,
                systemStates: SystemMessagesEnum.left,
                userName: message.msg.userName,
                id: message.msg.id,
                socketId: message.msg.socketId,
                timestamp: message.msg.timestamp
              };
              this.messagesList.push(left);
              if (findIndex) {
                this.onlineUserList[findIndex].color = 'rgb(56, 58, 64)';
                this.onlineUserList[findIndex].status = 0;
                this.onlineUserList[findIndex].socketId = null;
              }
              // 删除用户
              // if (findIndex >= 0) {
              //   this.onlineUserList.splice(findIndex, 1);
              // }
              // 置底
              this.scrollToBottom(this.scrollerBaseTemp);
              break;
            default:
              this.$message.error(message.msg);
              break;
          }
          break;
      }
      // console.log('this.messagesList', this.messagesList);
    });
    // emoji
    const json = require('../../../../assets/emoji.json');
    const key = Object.keys(json);
    this.emojiList = key.splice(0, 200);
  }

  /**
   * 分页查询聊天记录
   */
  queryChatMessage(): Promise<ChatMessagesInterface[]> {
    return new Promise<ChatMessagesInterface[]>(resolve => {
      this.$chatRequestService.queryChatMessage(
        {channelId: this.roomChannel.roomId, ...this.pageParams}
      ).subscribe((result: Result<ChatMessagesInterface[]>) => {
        this.loadedingStatus.messageLoad = false;
        if (result.code === 200) {
          // 聊天记录到顶判断
          if (result.data.length < this.pageParams.pageSize) {
            this.isTop = true;
            this.pageParams = new PageParams(this.pageParams.pageNum - 1, 50);
            // this.$message.info('聊天记录已经到顶了');
          }
          resolve(result.data);
        } else {
          this.$message.error('聊天记录查询失败');
          resolve([]);
        }
      });
    });
  }

  /**
   * 添加反应表情
   */
  addReaction(param: { emoji: string, id: number, userId: number }): void {
    this.$chatRequestService.addReaction(param).subscribe((result: Result<void>) => {
      if (result.code === 200) {
      } else {
        this.$message.error('添加反应表情失败');
      }
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
    // 判断未进入房间禁止发消息
    if (!this.roomChannel) {
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
    // 每次发消息 数量累加，3秒内达到上限则停止发送
    this.continuousChat.count += 1;
    // 如果没有定时器则开始定时
    if (!this.continuousChat.timer) {
      this.continuousChat.timer = setInterval(() => {
        // 判断3秒时间到，则重置消息次数
        if (this.continuousChat.time <= 0) {
          // 清除定时器
          clearInterval(this.continuousChat.timer);
          // 重置消息次数
          this.continuousChat.count = 0;
        }
        // 每秒钟-1
        this.continuousChat.time -= 1;
      }, 1000);
    }
    // 判断是否刷屏
    if (this.continuousChat.count > 5 && this.continuousChat.time > 0) {
      this.$message.info(`您的消息太频繁，请稍后${this.continuousChat.time}秒`);
      return;
    }
    // 消息体
    const message: ChatMessagesInterface = this.isContinuous({
      // 附件
      attachments: null,
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
        userName: this.userInfo.userName,
      },
      // 频道id
      channelId: this.roomChannel.roomId,
      // 组件
      components: null,
      // 消息内容
      content: this.textValue,
      // 编辑消息的时间
      edited_timestamp: null,
      // 反应
      reaction: null,
      // 标志
      flags: 0,
      // 提及的人
      mention_everyone: this.message.mention_everyone || false,
      // 提及的人名称信息
      mentions: this.message.mentions || null,
      // 留言参考
      message_reference: null,
      // 参考消息
      referenced_message: null,
      // 固定
      pinned: false,
      // 时间
      timestamp: new Date().toISOString(),
      tts: false,
      // 消息类型 用于前端展示判断
      type: ChatMessagesTypeEnum.general
    });
    this.socket.emit(ChatChannelsMessageTypeEnum.publicMessage, message, (response) => {
      if (response.status === ChatChannelsCallbackEnum.ok) {
        // console.log('消息发送成功');
        message.states = ChatChannelsMessageStatesEnum.success;
        this.messagesList.push(message);
        this.scrollToBottom(this.scrollerBaseTemp);
      } else {
        // todo 重发
        this.$message.info('消息发送失败');
        message.states = ChatChannelsMessageStatesEnum.error;
        this.messagesList.push(message);
        this.scrollToBottom(this.scrollerBaseTemp);
      }
    });
    setTimeout(() => {
      this.textBox.nativeElement.innerHTML = '';
      // this.textBox.nativeElement.innerText = '';
      this.textValue = '';
    }, 30);
  }

  /**
   * 滚动到顶时加载数据
   */
  onUp(): void {
    if (this.loadedingStatus.messageLoad || this.isTop) {
      return;
    }
    this.loadedingStatus.messageLoad = true;
    this.pageParams = new PageParams(this.pageParams.pageNum + 1, 50);
    // 分页查询聊天记录
    this.queryChatMessage().then((msg: ChatMessagesInterface[]) => {
      // 合并消息
      this.messagesList = [...msg, ...this.messagesList];
    });
  }

  /**
   * 输入框赋值
   */
  textBoxChange(event: any): void {
    let text: string = event.target.innerText;
    // 替换内容中间的全角空格为普通空格
    text = text.replace(/　+/, ' ');
    // 移除开头回车空格
    text = text.replace(/^\s+/, '');
    // 将内容中间换行空格替换成换行
    text = text.replace(/\n\s+/, `\n`);
    this.textValue = text;
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
      evt.preventDefault();
    } else if (evt.key === 'Shift' && evt.shiftKey) {
      // ctrl加回车：换行
      // console.log('换行');
    }
    return true;
  }

  /**
   * 粘贴事件 去掉样式
   */
  paste(evt: ClipboardEvent): void {
    evt.preventDefault();
    let text = evt.clipboardData.getData('text/plain') || '';
    if (text !== '') {
      // 替换内容中间的全角空格为普通空格
      text = text.replace(/　+/, ' ');
      // 移除开头回车空格
      text = text.replace(/^\s+/, '');
      // 将内容中间换行空格替换成换行
      text = text.replace(/\n\s+/, `\n`);
      this.textValue = `${this.textValue}${text}`;
      this.textBox.nativeElement.innerHTML = `${this.textBox.nativeElement.innerHTML}${text}`;
    }
  }

  /**
   * 判断是否为连续发言
   */
  isContinuous(message: ChatMessagesInterface): ChatMessagesInterface {
    // 类型断言
    const author: ChatSendAuthorInterface = message.author;
    if (author.avatar && author.avatar.indexOf('http' || 'https') !== -1) {
      // message.author.avatar = message.author.avatar;
    } else if (author.avatar !== null) {
      author.avatar = `https://www.evziyi.top${author.avatar}`;
    }
    // 系统消息不判断
    if (message.type === this.chatMessagesType.system) {
      return message;
    }
    // 如果上一条消息的用户为当前这个人则为连续发言
    if (this.messagesList.length > 0
      && this.messagesList[this.messagesList.length - 1].author
      && author.id === this.messagesList[this.messagesList.length - 1].author.id) {
      message.type = this.chatMessagesType.continuous;
    } else {
      // 否则为普通发言
      message.type = this.chatMessagesType.general;
    }
    return message;
  }

  /**
   * @提及
   */
  mention(info: ChatChannelRoomUserInterface): void {
    this.message.mention_everyone = true;
    this.message.mentions = info;
    this.textValue = `${this.textValue}@${info.userName}`;
    this.textBox.nativeElement.innerHTML = `${this.textBox.nativeElement.innerHTML}@${info.userName}`;
    // console.log(this.message);
  }

  /**
   * emoji表情
   */
  emojiClick(emoji: string, idx?: number): void {
    if (idx !== undefined) {
      const param = {
        emoji,
        id: this.messagesList[idx].id,
        userId: this.userInfo.id
      };
      this.addReaction(param);
      // 添加反应表情
      const reaction = this.messagesList[idx].reaction || [];
      this.messagesList[idx].reaction = ChatCommonUtil.addReaction(reaction, emoji, this.userInfo.id);
    } else if (this.morOperate.reactionEmoji) {
      const param = {
        emoji,
        id: this.messagesList[this.morOperate.selectMsgIdx].id,
        userId: this.userInfo.id
      };
      this.addReaction(param);
      // 添加反应表情
      const reaction = this.messagesList[this.morOperate.selectMsgIdx].reaction || [];
      this.messagesList[this.morOperate.selectMsgIdx].reaction = ChatCommonUtil.addReaction(reaction, emoji, this.userInfo.id);
    } else if (this.morOperate.emoji) {
      // 添加聊天表情
      this.textValue = `${this.textValue}${emoji}`;
      this.textBox.nativeElement.innerHTML = `${this.textBox.nativeElement.innerHTML}${emoji}`;
    }
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
   * 页面销毁
   */
  ngOnDestroy(): void {
    this.operateTop('quit');
    // 清除订阅
    this.subscription.unsubscribe();
    // socket断开
    this.socket.disconnect();
    this.socketDisconnect.emit();
  }

}
