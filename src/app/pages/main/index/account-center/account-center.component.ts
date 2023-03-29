import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload/interface';
import {SIZE_2MB} from '../../../../shared-module/const/commou.const';
import {CommonUtil} from '../../../../shared-module/util/commonUtil';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Observable, Observer} from 'rxjs';
import {User} from '../../../../shared-module/interface/user';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {IndexApiService} from '../service/indexApiService';
import {HttpErrorResponse} from '@angular/common/http';
import {Result} from '../../../../shared-module/interface/result';

@Component({
  selector: 'app-account-center',
  templateUrl: './account-center.component.html',
  styleUrls: ['./account-center.component.scss']
})
export class AccountCenterComponent implements OnInit {

  constructor(private $message: NzMessageService, private $IndexApiService: IndexApiService) {
  }

  // 头像
  @ViewChild('AvatarTemp') private avatarTemp: TemplateRef<HTMLDocument>;
  // 个人中心表单项
  formColumn: FormItem[];
  // 表单状态
  formInstance: FormOperate;
  // 用户信息
  user: User;
  // 上传的头像文件
  avatarFile: any = null;
  // 头像url
  avatarUrl: string;
  // loading
  loading: boolean = false;

  uploadAvatar = ((item: NzUploadXHRArgs) => {
    const formData = new FormData();
    formData.append('id', `${this.user.id}`);
    formData.append('avatar', this.avatarFile);
    return this.$IndexApiService.uploadAvatar(formData).subscribe((result: Result<any>) => {
      if (result.code === 200) {
        this.$message.success(result.msg);
        this.user.avatar = result.data;
        // 重新保存信息
        localStorage.setItem('user_info', JSON.stringify(this.user));
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
    this.avatarUrl = `https://www.evziyi.top${this.user.avatar}`;
    this.formInit();
  }

  // 文件上传之前处理
  beforeUpload = (file: NzUploadFile): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      if (file.size > SIZE_2MB) {
        this.$message.error('文件大小不能超过2MB！');
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
        this.loading = true;
        break;
      case 'done':
        this.avatarFile = info.file;
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.$message.error('Network error');
        this.loading = false;
        break;
    }
  }

  formInit(): void {
    // 初始化表单
    this.formColumn = [
      {
        // 角色
        label: '角色',
        key: 'roleName',
        type: 'input',
        disabled: true,
        col: 24,
        rule: [],
      },
      {
        // 密码
        label: '密码',
        key: 'password',
        type: 'input',
        inputType: 'password',
        col: 24,
        require: true,
        rule: [{required: true}, {minLength: 3, msg: '长度最小为3'}],
      },
      {
        // 备注
        label: '备注',
        key: 'remarks',
        type: 'textarea',
        col: 24,
        rule: [{maxLength: 100, msg: '最多输入100个字'}],
      },
    ];
  }

  /**
   * 保存
   */
  submit(): void {
    const data: { id: number, avatar: string, userName: string, remarks: string, password: string } = {
      id: this.user.id,
      avatar: this.avatarUrl,
      userName: this.user.userName,
      remarks: this.formInstance.getData().remarks,
      password: this.formInstance.getData().password
    };
    this.$IndexApiService.updateUser(data).subscribe((result: Result<void>) => {
      if (result.code === 200) {
        this.$message.success(result.msg);
        this.user.avatar = data.avatar;
        this.user.userName = data.userName;
        this.user.remarks = data.remarks;
        this.user.password = data.password;
        // 重新保存信息
        localStorage.setItem('user_info', JSON.stringify(this.user));
      } else {
        this.$message.error(result.msg);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
    });
  }

  /**
   * 表单实例校验
   * @param event
   */
  public codingFormInstance(event: { instance: FormOperate }): void {
    this.formInstance = event.instance;
    this.formInstance.group.patchValue(this.user);
    // 获取用户输入的值
    // this.formInstance.group.valueChanges.subscribe((e) => {
    // });
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
}
