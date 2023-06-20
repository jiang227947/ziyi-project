import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreateChannelParamInterface} from '../../../../shared-module/interface/chat-channels';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ChatRequestService} from '../../../../core-module/api-service';
import {Result} from '../../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';
import {User} from '../../../../shared-module/interface/user';

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
  // 用户信息
  @Input() user: User;
  // 关闭弹窗的回调
  @Output() visibleEvent = new EventEmitter<boolean>();
  // 是否可删除
  isDelete: boolean = false;

  constructor(private modal: NzModalService,
              private $message: NzMessageService,
              private $chatRequestService: ChatRequestService) {
  }

  ngOnInit(): void {
    this.isDelete = this.user.id === this.channel.admins[0];
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
        }).catch(),
      nzOnCancel: () => confirmModal.destroy()
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
   * 一键复制
   */
  copy(value: string): void {
    const input = document.createElement('input'); // 创建input对象
    input.value = value; // 设置复制内容
    document.body.appendChild(input); // 添加临时实例
    input.select(); // 选择实例内容
    document.execCommand('Copy'); // 执行复制
    document.body.removeChild(input); // 删除临时实例
    this.$message.success('复制成功！', {nzDuration: 1000});
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
