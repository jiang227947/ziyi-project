import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss']
})
export class CreateChannelComponent implements OnInit {

  // 接收弹框的显示
  @Input() visible: boolean;
  // 关闭弹窗的回调
  @Output() visibleEvent = new EventEmitter();
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
  // 加入的频道参数
  createChannelParam = {
    name: '',
    tags: '',
    isPrivacy: 0,
    password: '',
    remark: '',
  };
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
        this.previewImage = result.data;
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
    this.createChannelParam.name = `${this.user.userName}的频道`;
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
   * 创建频道
   */
  createChannel(): void {
    console.log(this.createChannelParam);
    this.$message.info('功能正在开发中');
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
  onCancel(): void {
    this.visible = false;
    this.visibleEvent.emit();
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
