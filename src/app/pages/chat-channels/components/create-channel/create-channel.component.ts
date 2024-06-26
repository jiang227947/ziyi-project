import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload/interface';
import {SIZE_10MB} from '../../../../shared-module/const/commou.const';
import {CommonUtil} from '../../../../shared-module/util/commonUtil';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Result} from '../../../../shared-module/interface/result';
import {HttpErrorResponse} from '@angular/common/http';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {User} from '../../../../shared-module/interface/user';
import {ChatRequestService} from '../../../../core-module/api-service/chat';
import {Observable, Observer} from 'rxjs';
import {CreateChannelParamInterface} from '../../../../shared-module/interface/chat-channels';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {FileTypeEnum} from '../../../../shared-module/enum/file.enum';

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
  fileTypeEnum = FileTypeEnum;
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
    announcement: '',
    remark: '',
  };
  // loading
  loading: boolean = false;
  // 标签输入框
  tagsInputValue: string = '';
  // 标签创建的显示
  tagsInputVisible: boolean = false;
  // 加入的频道参数
  joinChannelParam: { channelId: string, password: string } = {
    channelId: '',
    password: ''
  };
  // 公告表单
  form: UntypedFormGroup;

  constructor(private $message: NzMessageService, public $chatRequestService: ChatRequestService,
              private formBuilder: UntypedFormBuilder) {
    this.form = this.formBuilder.group({
      announcement: [null, [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.user = SessionUtil.getUserInfo();
    this.createChannelParam.channelName = `${this.user.userName}的频道`;
  }

  /**
   * 上传的回调结果
   * @param result 回调结果
   */
  uploadCallback(result: any): void {
    // 上传成功赋值路径
    if (result.status === 1) {
      this.createChannelParam.avatar = result.result;
    }
  }

  /**
   * 删除标签
   * @param removedTag
   */
  handleClose(removedTag: {}): void {
    const tags: string[] = this.createChannelParam.tags as string[];
    this.createChannelParam.tags = tags.filter(tag => tag !== removedTag);
  }

  /**
   * 标签长度截取
   * @param tag
   */
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
      this.$message.info('请填写频道密码');
      return;
    }
    this.loading = true;
    // 入参
    const param: CreateChannelParamInterface = {
      ...this.createChannelParam,
      // 公告表单赋值
      announcement: this.form.value.announcement,
      // 布尔值转换为数字
      isPrivacy: this.createChannelParam.isPrivacy ? 1 : 0,
      // 标签转成字符串
      tags: JSON.stringify(this.createChannelParam.tags),
      // 房间管理员
      admins: JSON.stringify([this.user.id])
    };
    this.$chatRequestService.createChannel(param).subscribe((result: Result<void>) => {
      this.loading = false;
      if (result.code === 200) {
        this.$message.success(result.msg);
        // 关闭弹框回调查询
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
    if (this.joinChannelParam.channelId === '') {
      this.$message.error('请输入频道ID');
      return;
    }
    console.log(this.joinChannelParam);
    this.loading = true;
    this.$chatRequestService.joinChannel(this.joinChannelParam).subscribe((result: Result<void>) => {
      this.loading = false;
      if (result.code === 200) {
        this.$message.success(result.msg);
        // 关闭弹框回调查询
        this.onCancel(true);
      } else {
        this.$message.error(result.msg);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
    });
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
   * @param type 0 返回创建 1 加入频道
   */
  stepsStatusChange(type: number): void {
    this.stepsStatus = type;
    this.nzTitle = this.stepsStatus === 0 ? '创建频道' : '加入频道';
  }

}
