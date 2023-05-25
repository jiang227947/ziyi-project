import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-base',
  templateUrl: './chat-base.component.html',
  styleUrls: ['./chat-base.component.scss']
})
export class ChatBaseComponent implements OnInit {

  // 输入的文字
  textValue: string = '';

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
   * 输入框赋值
   * @param innerHTML Dom元素的innerHTML
   */
  textBoxChange(innerHTML: string): void {
    this.textValue = innerHTML;
  }

}
