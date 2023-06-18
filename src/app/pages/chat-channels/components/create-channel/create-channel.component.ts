import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload/interface';
import {SIZE_10MB} from '../../../../shared-module/const/commou.const';
import {CommonUtil} from '../../../../shared-module/util/commonUtil';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Result} from '../../../../shared-module/interface/result';
import {HttpErrorResponse} from '@angular/common/http';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {User} from '../../../../shared-module/interface/user';
import {ChatRequestService} from '../../../../core-module/api-service';
import {Observable, Observer} from 'rxjs';
import {CreateChannelParamInterface} from '../../../../shared-module/interface/chat-channels';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit {

  // 接收弹框的显示
  @Input() visible: boolean;
  // 关闭弹窗的回调
  @Output() visibleEvent = new EventEmitter<boolean>();
  // 标签Dom
  @ViewChild('inputElement', {static: false}) inputElement?: ElementRef;
  // 弹框标题
  nzTitle: string = '创建频道';
  // 用户信息
  user: User;
  // 上传的进度
  filePercent = 0;
  imageLoading: boolean = false;
  // 上传的头像文件
  avatarFile: any = null;
  // 预览的头像
  previewImage: string | undefined = '';
  // 流程状态
  stepsStatus: number = 0;
  // 创建频道的参数
  createChannelParam: CreateChannelParamInterface = {
    avatar: '',
    channelName: '',
    tags: [],
    admins: [],
    isPrivacy: 0,
    password: '',
    remark: '',
  };
  // 标签输入框
  tagsInputValue: string = '';
  // 标签创建的显示
  tagsInputVisible: boolean = false;
  // 加入的频道参数
  joinChannelParam: { id: string, password: string } = {
    id: '',
    password: ''
  };

  constructor(private $message: NzMessageService, public $chatRequestService: ChatRequestService) {
  }

  uploadAvatar = ((item: NzUploadXHRArgs) => {
    const formData = new FormData();
    formData.append('avatar', this.avatarFile);
    return this.$chatRequestService.uploadChannelAvatar(formData).subscribe((result: Result<string>) => {
      if (result.code === 200) {
        this.createChannelParam.avatar = result.data;
        this.$message.success(result.msg);
        item.onSuccess(result.msg, item.file, result.msg);
      } else {
        this.$message.error(result.msg);
        item.onError(result.msg, item.file);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
      item.onError(error.message, item.file);
    });
  });

  ngOnInit(): void {
    this.user = SessionUtil.getUserInfo();
    this.createChannelParam.channelName = `${this.user.userName}的频道`;
  }

  // 文件上传之前处理
  beforeUpload = (file: NzUploadFile): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      if (file.size > SIZE_10MB) {
        this.$message.error('文件大小不能超过10MB！');
        observer.complete();
        return;
      }
      if (CommonUtil.fileType(file.type, 'image')) {
        this.$message.error('该类型无法上传！');
        observer.complete();
        return;
      }
      this.avatarFile = file;
      observer.next(true);
      observer.complete();
    });

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.imageLoading = true;
        break;
      case 'done':
        this.avatarFile = info.file;
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.imageLoading = false;
          this.previewImage = img;
        });
        break;
      case 'error':
        this.$message.error('上传失败');
        this.imageLoading = false;
        break;
    }
  }

  /**
   * file文件转64
   * @param img
   * @param callback
   * @private
   */
  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  /**
   * 删除标签
   * @param removedTag
   */
  handleClose(removedTag: {}): void {
    const tags: string[] = this.createChannelParam.tags as string[];
    this.createChannelParam.tags = tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 10;
    return isLongTag ? `${tag.slice(0, 10)}...` : tag;
  }

  /**
   * 标签输入状态
   */
  showInput(): void {
    this.tagsInputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  /**
   * 保存标签
   */
  handleInputConfirm(): void {
    // 判断标签是否存在
    if (this.tagsInputValue && this.createChannelParam.tags.indexOf(this.tagsInputValue) === -1) {
      this.createChannelParam.tags = [...this.createChannelParam.tags, this.tagsInputValue];
    }
    this.tagsInputValue = '';
    this.tagsInputVisible = false;
  }

  /**
   * 创建频道
   */
  createChannel(): void {
    if (this.createChannelParam.channelName === '') {
      this.$message.info('请填写频道名称');
      return;
    }
    if (this.createChannelParam.avatar === '') {
      this.$message.info('请上传头像');
      return;
    }
    // 判断私密房间的密码
    if (this.createChannelParam.isPrivacy && this.createChannelParam.password === '') {
      this.$message.info('请填写房间密码');
      return;
    }
    // 入参
    const param: CreateChannelParamInterface = {
      ...this.createChannelParam,
      // 布尔值转换为数字
      isPrivacy: this.createChannelParam.isPrivacy ? 1 : 0,
      // 标签转成字符串
      tags: JSON.stringify(this.createChannelParam.tags),
      // 房间管理员
      admins: JSON.stringify([this.user.id])
    };
    this.$chatRequestService.createChannel(param).subscribe((result: Result<void>) => {
      if (result.code === 200) {
        this.$message.success(result.msg);
        this.onCancel(true);
      } else {
        this.$message.error(result.msg);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
    });
  }


  /**
   * 加入频道
   */
  joinChannel(): void {
    console.log(this.joinChannelParam);
    this.$message.info('功能正在开发中');
  }

  /**
   * 关闭弹框
   */
  onCancel(query?: boolean): void {
    this.visible = false;
    // 如果是新增频道则回调查询
    this.visibleEvent.emit(query);
  }

  /**
   * 步骤切换
   * @param type 参数
   */
  stepsStatusChange(type: number): void {
    switch (type) {
      case 0:
        // 返回创建
        this.stepsStatus = 0;
        break;
      case 1:
        // 加入频道
        this.stepsStatus = 1;
        break;
    }
    this.nzTitle = this.stepsStatus === 0 ? '创建频道' : '加入频道';
  }

}
