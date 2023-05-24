import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OpenaiRequestService} from '../../../../core-module/api-service/openai';
import {GPTMessageInterface} from '../../../../shared-module/interface';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {SocketIoService} from '../../../../core-module/service/websocket/socket-io.service';
import {Socket} from 'socket.io-client/build/esm/socket';
import {
  ChatChannelsCallbackEnum,
  ChatChannelsMessageTypeEnum
} from '../../../../shared-module/enum/chat-channels.enum';
import {
  PrivateChatChannelsInterface,
  RoomChatChannelsInterface
} from '../../../../shared-module/interface/chat-channels';
import {MessageService} from '../../../../shared-module/service/MessageService';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.scss']
})
export class ChatGPTComponent implements OnInit, AfterViewInit {

  @ViewChild('chatGPT') chatGPT: ElementRef<Element>;

  // 支持的对话模型
  // gpt-3.5-turbo-0301
  // gpt-3.5-turbo
  // gpt-4
  // text-embedding-ada-002
  sendModel = 'gpt-3.5-turbo-0301';
  // 输入的问题文字
  sQuestion = '';
  // 对话loading
  dialogLogin = false;
  // 对话数据
  dialogBoxMessageList: { create: string, time: number, value: string, speak: boolean }[] = [];
  // 对话上下文记录
  messagesList: { role: string, content: string }[] = [];
  // 浏览器是否有朗读功能
  isShowSynth = false;
  // 朗读功能
  synth: SpeechSynthesis;
  // 朗读语言
  synthModel = 'zh-CN';
  // 朗读功能的入参
  synthUtt: SpeechSynthesisUtterance;
  // 展示openAiAlert
  showOpenAiAlert = false;
  // socket
  socket: Socket;
  // 房间
  room: any;

  constructor(private $http: HttpClient, private $openaiRequestService: OpenaiRequestService,
              private $message: NzMessageService, private messages: MessageService,
              private $socketIoService: SocketIoService) {
  }

  ngOnInit(): void {
    // this.$socketIoService.connect();
    // 展示openAiAlert
    this.showOpenAiAlert = sessionStorage.getItem('openAiAlert') !== '1';
    try {
      // 读取本地记录
      const dialogBoxMessage = localStorage.getItem('dialogBoxMessage');
      if (dialogBoxMessage) {
        this.dialogBoxMessageList = JSON.parse(dialogBoxMessage);
        setTimeout(() => this.chatGPT.nativeElement.scrollTo(0, this.chatGPT.nativeElement.scrollHeight));
      }
      // 读取上下文记录
      const messagesList = localStorage.getItem('messagesList');
      if (messagesList) {
        this.messagesList = JSON.parse(messagesList);
      }
      /*获取浏览器是否有朗读功能*/
      this.synth = window.speechSynthesis;
      let count = 0;
      const getVoices = setInterval(() => {
        this.isShowSynth = this.synth.getVoices().length > 0;
        if (count === 3 || this.isShowSynth) {
          clearInterval(getVoices);
        }
        count += 1;
      }, 500);
    } catch (e) {
      console.error('浏览器无朗读功能');
    }
  }

  ngAfterViewInit(): void {
    /*if (!this.socket) {
      this.socket = this.$socketIoService.socketIo;
    }
    this.messages.close();
    this.messages.messages.subscribe((msg) => {
      if (msg.type === 'roomInfo') {
        this.room = msg;
      }
      console.log('订阅消息', msg);
    });*/
  }

  /*发送问题*/
  async send(): Promise<void> {
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
    if (this.sQuestion === '' || this.dialogLogin) {
      return;
    }
    // 记录对话
    this.dialogBoxMessageList.push({
      create: 'user',
      time: new Date().getTime(),
      value: this.sQuestion,
      speak: false
    });
    // 记录上下文
    this.messagesList.push({
      role: 'user',
      content: this.sQuestion
    });
    this.dialogLogin = true;
    setTimeout(() => this.chatGPT.nativeElement.scrollTo(0, this.chatGPT.nativeElement.scrollHeight));
    // 保存记录
    if (this.dialogBoxMessageList.length > 0) {
      localStorage.setItem('dialogBoxMessage', JSON.stringify(this.dialogBoxMessageList));
    }
    // 发送的参数
    const messagesParam: { model: string, messages: { role: string, content: string }[], max_tokens?: number } = {
      model: this.sendModel,
      messages: this.messagesList
    };
    // 设置gpt-4的最大回复数 因消耗的token较多，回答有字数限制
    if (this.sendModel === 'gpt-4') {
      messagesParam.max_tokens = 100;
    }
    await this.$openaiRequestService.completions(messagesParam).subscribe((result: GPTMessageInterface) => {
      const choices = result.choices;
      const content: string = choices[choices.length - 1].message.content;
      // 设置javascript代码块样式
      const sp = content.split('```javascript');
      const value = sp.join(`<pre style="
          background: #2d2d2d;
          color: rgb(201, 209, 217);
          font-family: Consolas;
          text-align: left;
          padding: 1em;
          padding-left: 0.8em;
          margin: 1em;
          border-radius: 5px;
          counter-reset: line;
          white-space: pre;
          word-spacing: normal;
          word-break: normal;
          word-wrap: normal;
          line-height: 1.5;">`).split('```').join(`</pre>`);
      this.dialogBoxMessageList.push({
        value,
        create: 'ai',
        time: new Date().getTime(),
        speak: false
      });
      // 保存参数
      this.messagesList.push({
        role: choices[choices.length - 1].message.role,
        content
      });
      setTimeout(() => this.chatGPT.nativeElement.scrollTo(0, this.chatGPT.nativeElement.scrollHeight));
      // 保存对话记录
      if (this.dialogBoxMessageList.length > 0) {
        localStorage.setItem('dialogBoxMessage', JSON.stringify(this.dialogBoxMessageList));
      }
      // 保存上下文记录
      if (this.messagesList.length > 0) {
        localStorage.setItem('messagesList', JSON.stringify(this.messagesList));
      }
      this.dialogLogin = false;
    }, () => {
      this.dialogLogin = false;
    });
    /*await this.$http.post(, {
      model: this.sendModel, // 对话模型
      prompt: this.sQuestion, // user entered input text will store here.
      max_tokens: 2048,
      user: 'jzy19981211@gmail.com',
      temperature: 0,
    }).subscribe((result: any) => {
      console.log('result: ', result);
      this.dialogBoxMessageList.push({
        create: 'ai',
        time: new Date().getTime(),
        value: result.choices[0].text,
        speak: false
      });
      setTimeout(() => {
        this.chatGPT.nativeElement.scrollTop = this.chatGPT.nativeElement.scrollHeight;
      }, 0);
      // 保存记录
      if (this.dialogBoxMessageList.length > 0) {
        localStorage.setItem('dialogBoxMessage', JSON.stringify(this.dialogBoxMessageList));
      }
      this.dialogLogin = false;
    });*/
    this.sQuestion = '';
  }

  /*朗读文字*/
  speak(idx: number, message: any): void {
    if (message.speak) {
      // 结束朗读
      this.synth.cancel();
      this.dialogBoxMessageList[idx].speak = false;
      return;
    }
    // 结束朗读
    this.synth.cancel();
    for (let i = 0; i < this.dialogBoxMessageList.length; i++) {
      // 朗读变量初始化
      this.dialogBoxMessageList[i].speak = false;
    }
    this.synthUtt = new SpeechSynthesisUtterance();
    // 监听朗读结束
    this.synthUtt.addEventListener('end', (e) => {
      // 朗读变量赋值
      this.dialogBoxMessageList[idx].speak = false;
    });
    // 朗读语言
    this.synthUtt.lang = this.synthModel;
    this.synthUtt.rate = 1;
    // 文字
    this.synthUtt.text = message.value;
    // 开始朗读
    this.synth.speak(this.synthUtt);
    // 朗读变量赋值
    this.dialogBoxMessageList[idx].speak = true;
  }

  /**
   * 查询对话余额
   */
  getBalance(): void {
    this.$openaiRequestService.getBalance().subscribe((result: any) => {
      if (result.code === 0) {
        this.$message.success(`剩余次数为${result.data.profile.point}，每次对话至少消耗1点次数`);
      } else {
        this.$message.error('查询失败');
      }
    });
  }

  /**
   * 一键复制
   */
  copy(value: string): void {
    const input = document.createElement('input'); // 创建input对象
    input.value = value; // 设置复制内容
    document.body.appendChild(input); // 添加临时实例
    input.select(); // 选择实例内容
    document.execCommand('Copy'); // 执行复制
    document.body.removeChild(input); // 删除临时实例
    this.$message.success('复制成功！');
  }

  /*关闭顶部公告*/
  nzOnClose(): void {
    sessionStorage.setItem('openAiAlert', '1');
  }

}
