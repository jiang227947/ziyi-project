import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {ChatAttachmentsInterface} from '../../../../shared-module/interface/chat-channels';
import {
  IMAGE_TYPE_CONST,
  MEDIA_TYPE_CONST,
  TEXT_TYPE_CONST
} from '../../../../shared-module/const/commou.const';
import {ChatRequestService} from '../../../../core-module/api-service/chat';

@Component({
  selector: 'app-chat-attachments',
  templateUrl: './chat-attachments.component.html',
  styleUrls: ['./chat-attachments.component.scss']
})
export class ChatAttachmentsComponent implements OnInit {

  // 附件信息
  @Input() attachments: string | ChatAttachmentsInterface;
  // 附件信息
  fileInfo: ChatAttachmentsInterface = null;
  // 文本数据
  fileText: string = '';

  constructor(private $renderer: Renderer2,
              private $chatRequestService: ChatRequestService) {
  }

  ngOnInit(): void {
    if (typeof this.attachments === 'string') {
      // 转换对象
      const attachments: ChatAttachmentsInterface = JSON.parse(this.attachments);
      // 赋值
      this.fileInfo = attachments;
      this.fileInfo.fileType = this.find(attachments.type);
    } else {
      // 赋值
      this.fileInfo = this.attachments;
      this.fileInfo.fileType = this.find(this.attachments.type);
    }
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
      // 获取文本内容
      this.$chatRequestService.getFileData(this.fileInfo.path).subscribe((result: Blob) => {
        const blob = result;
        // 读取文件
        const read = new FileReader();
        read.readAsText(blob, 'gb2312');
        // read.readAsBinaryString(blob);
        // 加载内容
        read.onload = (res: ProgressEvent<FileReader>) => {
          // 赋值内容
          this.fileText = res.target.result as string;
        };
      });
      return 'text';
    }
    // if (OFFICE_TYPE_CONST.indexOf(type) !== -1) {
    //   return 'office';
    // }
    // if (OTHER_TYPE_CONST.indexOf(type) !== -1) {
    // }
  }

  downloadAudio(url: string, name: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  }
}
