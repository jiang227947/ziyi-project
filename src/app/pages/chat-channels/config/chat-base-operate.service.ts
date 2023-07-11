import {ElementRef, Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MessageService} from '../../../shared-module/service/Message.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Router} from '@angular/router';
import {NzContextMenuService} from 'ng-zorro-antd/dropdown';
import {ChatChannelRoomUserInterface, ChatOperateInterface} from '../../../shared-module/interface/chat-channels';
import {Title} from '@angular/platform-browser';
import {FileTypeEnum} from '../../../shared-module/enum/file.enum';

/**
 * 聊天频道组件服务
 * 由于逻辑繁多，把判断显示类的拆分到这个服务
 */
@Injectable()
export class ChatBaseOperateService {

  // 消息提醒
  messageReminder: { count: number, show: boolean } = {
    count: 0,
    show: true,
  };
  // 更多操作
  morOperate: ChatOperateInterface = {
    // 在线用户弹框
    isCollapsed: false,
    // 我的设置弹框
    mySetting: false,
    // 标注消息弹框
    pushpin: false,
    // emoji弹框
    emoji: false,
    // 添加反应emoji弹框
    reactionEmoji: false,
    // 当前选择的消息
    selectMsgIdx: null,
    // 文件弹框
    fileUpload: false
  };
  fileTypeEnum = FileTypeEnum;
  // 判断是否手动滚动
  scrollHeight: { previous: number, now: number, currentScrollPosition: number } = {previous: 0, now: 0, currentScrollPosition: 0};
  // 是否手动置底
  scrollToBottoms: boolean = false;
  // 频道折叠
  channelsUnfold: boolean = false;

  // 提及功能 筛选数组对象的key
  suggestionsValueWith = (data: ChatChannelRoomUserInterface): string => data.userName;

  constructor(@Inject(DOCUMENT) public document: Document, public titleService: Title,
              public messages: MessageService, public $message: NzMessageService, public router: Router,
              public nzContextMenuService: NzContextMenuService) {
  }

  /**
   * 初始化
   */
  onInit(): void {
    // 当前的 2023-06-28T02:01:57.682Z
    // 上一个 2023-06-28T01:16:54.456Z
    // 上上一个 2023-06-27T14:50:22.327Z
    this.document.addEventListener('visibilitychange', () => {
      const isHidden = this.document.hidden;
      if (isHidden) {
        // 页面隐藏
        this.messageReminder.show = true;
      } else {
        // 页面聚焦
        this.messageReminder = {
          count: 0,
          show: false,
        };
        this.titleService.setTitle('EVZIYI');
      }
    });
  }

  /**
   * 机器人事件
   */
  botHandleFunc(type: string): void {
    switch (type) {
      case 'welcome':
        break;
    }
  }


  /**
   * 置顶的操作
   */
  operateTop(type: string): void {
    switch (type) {
      case 'quit':
        // 清除监听页面是否在当前显示
        this.document.removeEventListener('visibilitychange', () => {
        });
        this.router.navigate(['/main/index']);
        break;
      case 'pushpin':
        // 标注消息弹框
        this.morOperate.pushpin = !this.morOperate.pushpin;
        break;
      case 'user':
        // 在线用户列表隐藏显示
        this.morOperate.isCollapsed = !this.morOperate.isCollapsed;
        break;
    }
  }

  /**
   * 置底
   * @param scrollerBaseTemp 置底的DOM
   * @param toBottoms 手动置底
   */
  scrollToBottom(scrollerBaseTemp: ElementRef<Element>, toBottoms?: boolean): void {
    // 判断是否为手动置底
    if (toBottoms) {
      this.scrollToBottoms = false;
    }
    // 如果手动置顶了 则禁止自动置底
    if (this.scrollToBottoms) {
      return;
    }
    setTimeout(() => {
      scrollerBaseTemp.nativeElement.scrollTo(0, scrollerBaseTemp.nativeElement.scrollHeight);
    }, 30);
  }

  /**
   * 添加反应
   */
  additiveReaction(idx: number): void {
    this.morOperate.selectMsgIdx = idx;
    this.morOperate.reactionEmoji = !this.morOperate.reactionEmoji;
  }

  /**
   * 在线用户操作
   * @param online 在线用户
   * @param allUser 所有用户
   */
  onlineUser(online: ChatChannelRoomUserInterface[], allUser: ChatChannelRoomUserInterface[]): ChatChannelRoomUserInterface[] {
    const onlineUser = online.map(item => item.id);
    for (let i = 0; i < allUser.length; i++) {
      // 判断是否在线
      if (onlineUser.indexOf(allUser[i].id) >= 0) {
        allUser[i].color = 'rgb(46, 204, 113)';
        allUser[i].status = 1;
      } else {
        allUser[i].color = 'rgb(56, 58, 64)';
        allUser[i].status = 0;
      }
    }
    // 排序，在线用户置顶
    allUser = allUser.sort((a, b) => b.status - a.status);
    return allUser;
  }

  /**
   * 弹框的折叠
   * @param type 入参
   */
  morOperateChange(type: string): void {
    switch (type) {
      case 'emoji':
        if (!this.morOperate.emoji && this.morOperate.reactionEmoji) {
          this.morOperate.reactionEmoji = false;
          break;
        }
        this.morOperate.emoji = !this.morOperate.emoji;
        break;
      case 'showSetting':
        this.morOperate.mySetting = !this.morOperate.mySetting;
        break;
      case 'fileUpload':
        this.morOperate.fileUpload = !this.morOperate.fileUpload;
        break;
      case 'reactionEmoji':
        this.morOperate.reactionEmoji = !this.morOperate.reactionEmoji;
        break;
    }
  }

  /**
   * 关闭设置
   */
  hiddenSetting(query: boolean): void {
    this.morOperate.mySetting = false;
    if (query) {

    }
  }

  /**
   * 关闭弹框
   */
  publicClose(): void {
    this.morOperate.emoji = false;
    this.morOperate.reactionEmoji = false;
    this.morOperate.fileUpload = false;
  }
}
