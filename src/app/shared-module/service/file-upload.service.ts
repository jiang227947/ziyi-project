import {Injectable} from '@angular/core';
import {NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload/interface';
import {Observable, Observer} from 'rxjs';
import {SIZE_10MB} from '../const/commou.const';
import {CommonUtil} from '../util/commonUtil';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Result} from '../interface/result';
import {HttpErrorResponse} from '@angular/common/http';
import {ChatRequestService} from '../../core-module/api-service';
import {FileTypeEnum} from '../enum/file.enum';

/**
 * 文件上传公共服务
 */
@Injectable({providedIn: 'root'})
export class FileUploadService {

  // 上传的头像文件
  file: any = null;
  // 上传的头像文件
  loading: boolean = false;
  // 上传的头像文件
  preview: any = null;

  constructor(private $message: NzMessageService,
              private requestService: ChatRequestService) {
  }

  // 文件上传之前处理
  beforeUpload = (file: NzUploadFile): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      if (file.size > SIZE_10MB) {
        this.$message.error('文件大小不能超过10MB！');
        observer.complete();
        return;
      }
      if (CommonUtil.fileType(file.type, [FileTypeEnum.image])) {
        this.$message.error('该类型无法上传！');
        observer.complete();
        return;
      }
      this.file = file;
      observer.next(true);
      observer.complete();
    });

  uploadAvatar = ((item: NzUploadXHRArgs) => {
    const formData = new FormData();
    formData.append('avatar', this.file);
    return this.requestService.uploadAvatar(formData).subscribe((result: Result<string>) => {
      if (result.code === 200) {
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

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.file = info.file;
        // tslint:disable-next-line:no-non-null-assertion
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.preview = img;
        });
        break;
      case 'error':
        this.$message.error('上传失败');
        this.loading = false;
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
    // tslint:disable-next-line:no-non-null-assertion
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }
}
