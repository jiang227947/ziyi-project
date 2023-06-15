import {ElementRef, Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {MessageService} from '../../../shared-module/service/Message.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Router} from '@angular/router';
import {NzContextMenuService} from 'ng-zorro-antd/dropdown';
import {ChatRequestService} from '../../../core-module/api-service';
import {ChatChannelRoomUserInterface, ChatOperateInterface} from '../../../shared-module/interface/chat-channels';
import {Title} from '@angular/platform-browser';

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

  // 提及功能 筛选数组对象的key
  suggestionsValueWith = (data: ChatChannelRoomUserInterface): string => data.userName;

  constructor(@Inject(DOCUMENT) public document: Document, public titleService: Title,
              public messages: MessageService, public $message: NzMessageService, public router: Router,
              public nzContextMenuService: NzContextMenuService,
              public $chatRequestService: ChatRequestService) {
  }

  /**
   * 初始化
   */
  onInit(): void {
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
        this.titleService.setTitle('Cat 团子');
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
   */
  scrollToBottom(scrollerBaseTemp: ElementRef<Element>): void {
    setTimeout(() => {
      scrollerBaseTemp.nativeElement.scrollTo(0, scrollerBaseTemp.nativeElement.scrollHeight);
    }, 30);
  }

  /**
   * 添加反应
   */
  additiveReaction(idx: number): void {
    this.morOperate.selectMsgIdx = idx;
    this.morOperate.reactionEmoji = true;
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
