import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatMessagesInterface} from '../../../shared-module/interface/chat-channels';
import {ChatMessagesTypeEnum} from '../../../shared-module/enum/chat-channels.enum';


@Component({
  selector: 'app-chat-base',
  templateUrl: './chat-base.component.html',
  styleUrls: ['./chat-base.component.scss']
})
export class ChatBaseComponent implements OnInit {

  @ViewChild('textBox') private textBox: ElementRef;
  // 输入的文字
  textValue: string = '';
  // messagesList
  messagesList: ChatMessagesInterface[] = [];
  // 消息类型枚举
  chatMessagesType = ChatMessagesTypeEnum;

  constructor() {
  }

  ngOnInit(): void {
    /*const message: RoomChatChannelsInterface = {
      from: {
        userName: SessionUtil.getUserName(),
        id: SessionUtil.getUserId() + ''
      },
      to: this.room,
      content: this.sQuestion,
      type: ChatChannelsMessageTypeEnum.roomMessage,
      time: new Date().getTime()
    };
    this.socket.emit(ChatChannelsMessageTypeEnum.roomMessage, message, (response) => {
      if (response.status === ChatChannelsCallbackEnum.ok) {
        console.log('消息发送成功');
      } else {
        console.log('消息发送失败');
      }
    });
    this.sQuestion = '';
    return;*/
  }

  /**
   * 发送消息
   */
  send(): void {
    if (this.textValue === '') {
      return;
    }
    const message2: ChatMessagesInterface = {
      // 附件
      attachments: [],
      // 作者
      author: {
        // 头像
        avatar: 'https://angular.cn/generated/images/marketing/features/feature-icon.svg',
        // 头像描述
        avatar_decoration: null,
        // 鉴别器
        discriminator: null,
        // 全局名称
        global_name: null,
        // id
        id: '2',
        // 公共标签
        public_flags: 0,
        // 用户名
        username: `用户${(Math.random() * 100).toFixed(0)}`,
      },
      // 频道id
      channel_id: '123',
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
      id: Math.random() * 10 + '',
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
      // 类型
      type: ChatMessagesTypeEnum.general,
    };
    this.messagesList.push(this.isContinuous(message2));
    console.log(this.textBox);
    // collapseToStart
    this.textBox.nativeElement.innerHTML = '';
    this.textValue = '';
  }

  /**
   * 判断是否为连续发言
   */
  isContinuous(message: ChatMessagesInterface): ChatMessagesInterface {
    if (this.messagesList.length > 0 && message.author.id === this.messagesList[this.messagesList.length - 1].author.id) {
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
  textBoxKeydown(evt: KeyboardEvent): void {
    // 单独回车：发送消息
    if (evt.key === 'Enter' && !evt.ctrlKey) {
      console.log('发送消息');
      this.send();
    } else if (evt.key === 'Shift' && evt.ctrlKey) {
      // ctrl加回车：换行
      console.log('换行');
    }
  }

}
