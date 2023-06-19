import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreateChannelParamInterface} from '../../../../shared-module/interface/chat-channels';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ChatRequestService} from '../../../../core-module/api-service';
import {Result} from '../../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-setting-channel',
  templateUrl: './setting-channel.component.html',
  styleUrls: ['./setting-channel.component.scss']
})
export class SettingChannelComponent implements OnInit {

  // 接收弹框的显示
  @Input() visible: boolean;
  // 当前频道
  @Input() channel: CreateChannelParamInterface;
  // 关闭弹窗的回调
  @Output() visibleEvent = new EventEmitter<boolean>();

  constructor(private modal: NzModalService,
              private $message: NzMessageService,
              private $chatRequestService: ChatRequestService) {
  }

  ngOnInit(): void {
  }

  /**
   * 删除频道
   */
  deleteChannel(): void {
    const confirmModal = this.modal.confirm({
      nzTitle: '删除频道',
      nzContent: `是否要删除 ${this.channel.channelName}？`,
      nzOnOk: () =>
        new Promise<void>((resolve, reject) => {
          this.$chatRequestService.deleteChannel(this.channel.channelId).subscribe((res: Result<void>) => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.onCancel(true);
              resolve();
            } else {
              this.$message.error(res.msg);
              reject();
            }
          });
        }).catch()
    });
  }

  /**
   * 关闭弹框
   */
  onCancel(isDelete = false): void {
    this.visible = false;
    // 回调关闭
    this.visibleEvent.emit(isDelete);
  }

  /**
   * 标签长度截取
   * @param tag 字符串
   */
  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 10;
    return isLongTag ? `${tag.slice(0, 10)}...` : tag;
  }
}
