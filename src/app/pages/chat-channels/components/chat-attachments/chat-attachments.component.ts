import {Component, Input, OnInit} from '@angular/core';
import {ChatAttachmentsInterface} from '../../../../shared-module/interface/chat-channels';
import {
  IMAGE_TYPE_CONST,
  MEDIA_TYPE_CONST,
  OFFICE_TYPE_CONST, OTHER_TYPE_CONST,
  TEXT_TYPE_CONST
} from '../../../../shared-module/const/commou.const';

@Component({
  selector: 'app-chat-attachments',
  templateUrl: './chat-attachments.component.html',
  styleUrls: ['./chat-attachments.component.scss']
})
export class ChatAttachmentsComponent implements OnInit {

  // 附件信息
  @Input() attachments: string;
  // 附件信息
  fileInfo: ChatAttachmentsInterface = null;

  constructor() {
  }

  ngOnInit(): void {
    // 转换对象
    const attachments: ChatAttachmentsInterface = JSON.parse(this.attachments);
    // 赋值
    this.fileInfo = {
      ...attachments,
      fileType: this.find(attachments.type)
    };
  }

  /**
   * 获取文件展示类型
   * @param type 类型
   */
  find(type: string): string {
    if (IMAGE_TYPE_CONST.indexOf(type) !== -1) {
      return 'image';
    }
    if (MEDIA_TYPE_CONST.indexOf(type) !== -1) {
      return 'audio';
    }
    if (TEXT_TYPE_CONST.indexOf(type) !== -1) {
      return 'text';
    }
    // if (OFFICE_TYPE_CONST.indexOf(type) !== -1) {
    //   return 'office';
    // }
    // if (OTHER_TYPE_CONST.indexOf(type) !== -1) {
    // }
  }

}
