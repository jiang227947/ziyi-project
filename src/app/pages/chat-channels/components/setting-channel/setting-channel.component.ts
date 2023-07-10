import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreateChannelParamInterface} from '../../../../shared-module/interface/chat-channels';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Result} from '../../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';
import {User} from '../../../../shared-module/interface/user';
import {ChatRequestService} from '../../../../core-module/api-service';
import {FileTypeEnum} from '../../../../shared-module/enum/file.enum';
import {IndexApiService} from '../../../main/index/service/indexApiService';
import {HttpErrorResponse} from '@angular/common/http';
import {CommonUtil} from '../../../../shared-module/util/commonUtil';

@Component({
  selector: 'app-setting-channel',
  templateUrl: './setting-channel.component.html',
  styleUrls: ['./setting-channel.component.scss']
})
export class SettingChannelComponent implements OnInit {

  // 接收弹框的显示
  @Input() visible: boolean;
  // 接收设置的类型
  @Input() settingType: string;
  // 当前频道
  @Input() channel: CreateChannelParamInterface;
  // 用户信息
  @Input() user: User;
  // 关闭弹窗的回调
  @Output() visibleEvent = new EventEmitter<boolean>();
  // 用户信息拷贝
  userInfo: User;
  // 是否可删除
  isDelete: boolean = false;
  // 标题
  nzTitle: string = '';
  // 文件枚举
  fileTypeEnum = FileTypeEnum;
  // 修改loading
  loading: boolean = false;
  // 昵称
  userNameError: boolean = false;
  // 邮箱格式校验
  emailError: boolean = false;

  constructor(private modal: NzModalService,
              private $message: NzMessageService,
              public $chatRequestService: ChatRequestService,
              public $indexApiService: IndexApiService) {
  }

  ngOnInit(): void {
    // 深拷贝
    this.userInfo = CommonUtil.deepClone(this.user);
    if (this.settingType === 'channel') {
      this.isDelete = this.userInfo.id === this.channel.admins[0];
    }
    this.nzTitle = this.settingType === 'channel' ? '频道设置' : '我的设置';
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
   * 校验填写
   * @param txt 内容
   * @param type 类型
   */
  txtChange(txt: string, type: string): void {
    switch (type) {
      case 'name':
        this.userNameError = !txt;
        break;
      case 'email':
        if (txt) {
          const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
          this.emailError = !regEmail.test(txt);
        } else {
          this.emailError = false;
        }
        break;
    }
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

  /**
   * 修改信息
   */
  updateUser(): void {
    if (this.emailError || this.userNameError) {
      return;
    }
    const info = {
      id: this.userInfo.id,
      userName: this.userInfo.userName,
      email: this.userInfo.email,
      avatar: this.userInfo.avatar,
      remarks: this.userInfo.remarks
    };
    this.loading = true;
    this.$indexApiService.updateUser(info).subscribe((result: Result<void>) => {
      this.loading = false;
      if (result.code === 200) {
        this.$message.success(result.msg);
        // 重新保存信息
        localStorage.setItem('user_info', JSON.stringify(this.userInfo));
      } else {
        this.$message.error(result.msg);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
    });
  }

  /**
   * 上传的回调结果
   * @param result 回调结果
   */
  uploadCallback(result: any): void {
    // 上传成功赋值路径
    if (result.status === 1) {
      this.userInfo.avatar = result.result;
      // 重新保存信息
      localStorage.setItem('user_info', JSON.stringify(this.userInfo));
    }
  }
}
