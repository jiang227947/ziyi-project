import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OpenAIApi, Configuration} from 'openai';
import {OpenaiRequestService} from '../../../../core-module/api-service/openai';
import {GTPMessageInterface} from '../../../../shared-module/interface';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.scss']
})
export class ChatGPTComponent implements OnInit {

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
  configuration: any;
  openai: any;

  constructor(private $http: HttpClient, private $openaiRequestService: OpenaiRequestService,
              private $message: NzMessageService) {
  }

  ngOnInit(): void {
    const key = '/s/k/-/mEF/tX/c49/dd/Na//ao/FV/E/V5F/T3B/lbkF/J/zpIFm/hb/J0u/igX/IuZ/F/J/OR/';
    let openAI = '';
    key.split('/').forEach((v) => {
      if (v !== '') {
        openAI = openAI + v;
      }
    });
    this.configuration = new Configuration({
      apiKey: openAI,
    });
    this.openai = new OpenAIApi(this.configuration);
    // 展示openAiAlert
    this.showOpenAiAlert = sessionStorage.getItem('openAiAlert') !== '1';
    try {
      // 读取本地记录
      const dialogBoxMessage = localStorage.getItem('dialogBoxMessage');
      if (dialogBoxMessage) {
        this.dialogBoxMessageList = JSON.parse(dialogBoxMessage);
        setTimeout(() => {
          this.chatGPT.nativeElement.scrollTop = this.chatGPT.nativeElement.scrollHeight;
        }, 0);
      }
      this.synth = window.speechSynthesis;
      let count = 0;
      /*获取浏览器是否有朗读功能*/
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

  /*发送问题*/
  async send(): Promise<void> {
    if (this.sQuestion === '' || this.dialogLogin) {
      return;
    }
    this.dialogBoxMessageList.push({
      create: 'user',
      time: new Date().getTime(),
      value: this.sQuestion,
      speak: false
    });
    this.dialogLogin = true;
    setTimeout(() => {
      this.chatGPT.nativeElement.scrollTop = this.chatGPT.nativeElement.scrollHeight;
    }, 0);
    // 保存记录
    if (this.dialogBoxMessageList.length > 0) {
      localStorage.setItem('dialogBoxMessage', JSON.stringify(this.dialogBoxMessageList));
    }
    /*由于无效输入或其他问题，API请求可能会返回错误*/
    await this.$openaiRequestService.completions({
      model: this.sendModel,
      messages: [
        {
          role: 'user',
          content: this.sQuestion
        }
      ]
    }).subscribe((result: GTPMessageInterface) => {
      const choices = result.choices;
      const content = choices[choices.length - 1].message.content;
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
      setTimeout(() => {
        this.chatGPT.nativeElement.scrollTop = this.chatGPT.nativeElement.scrollHeight;
      }, 0);
      // 保存记录
      if (this.dialogBoxMessageList.length > 0) {
        localStorage.setItem('dialogBoxMessage', JSON.stringify(this.dialogBoxMessageList));
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

  /*关闭顶部公告*/
  nzOnClose(): void {
    sessionStorage.setItem('openAiAlert', '1');
  }

}
