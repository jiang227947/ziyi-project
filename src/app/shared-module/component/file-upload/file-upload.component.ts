import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload/interface';
import {Observable, Observer} from 'rxjs';
import {CommonUtil} from '../../util/commonUtil';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FileTypeEnum} from '../../enum/file.enum';
import {Result} from '../../interface/result';
import {HttpErrorResponse, HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  // 文件类型
  @Input() requestService: any;
  // 文件类型
  @Input() fileType: FileTypeEnum[];
  // 文件表单name
  @Input() fileName: string;
  // 图片预览的url
  @Input() previewImage: string | undefined = '';
  // 上传的回调
  @Output() uploadCallback = new EventEmitter<any>();
  // 上传的文件
  file: any = null;
  // loading
  fileLoading: boolean = false;
  // 上传的进度
  filePercent: number = 0;

  constructor(private $message: NzMessageService) {
  }

  /**
   * 上传请求
   */
  uploadAvatar = ((item: NzUploadXHRArgs) => {
    const formData = new FormData();
    formData.append(this.fileName, this.file);
    let request: Observable<any>;
    if (this.fileName === 'file') {
      // 上传文件
      request = this.requestService.uploadFile(formData);
    } else {
      // 上传头像
      request = this.requestService.uploadAvatar(formData);
    }
    return request.subscribe((result: HttpEvent<Result<string>>) => {
      // 状态
      let status: number;
      if (result.type === HttpEventType.UploadProgress) {
        // 上传中
        this.filePercent = +((result.loaded / result.total) * 100).toFixed(1);
      } else if (result.type === HttpEventType.Response) {
        // 上传完成
        this.filePercent = 0;
        const res = result.body as Result<string>;
        if (res.code === 200) {
          // 成功
          status = 1;
          this.$message.success(res.msg);
          item.onSuccess(res.msg, item.file, res.msg);
        } else {
          // 失败
          status = 0;
          this.$message.error(res.msg);
          item.onError(res.msg, item.file);
        }
        // 回调结果
        this.uploadCallback.emit({
          status,
          file: this.file,
          result: res.data,
          // previewImage: this.previewImage
        });
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
      item.onError(error.message, item.file);
    });
  });

  ngOnInit(): void {
  }

  /**
   * 文件上传之前处理
   * @param file
   */
  beforeUpload = (file: NzUploadFile): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const {size, msg} = CommonUtil.fileSize(this.fileType);
      // 大小判断
      if (file.size > size) {
        this.$message.error(`文件大小不能超过${msg}！`);
        observer.complete();
        return;
      }
      // 类型判断
      if (CommonUtil.fileType(file.type, this.fileType)) {
        this.$message.error('该类型无法上传！');
        observer.complete();
        return;
      }
      this.file = file;
      observer.next(true);
      observer.complete();
    });

  /**
   * 上传文件的状态监听
   * @param info
   */
  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.fileLoading = true;
        break;
      case 'done':
        this.file = info.file;
        console.log(this.file);
        // 如果是图片则可以预览效果
        if (this.fileType.indexOf(FileTypeEnum.image) !== -1) {
          // tslint:disable-next-line:no-non-null-assertion
          this.getBase64(info.file!.originFileObj!, (img: string) => {
            this.fileLoading = false;
            // this.previewImage = img;
          });
        } else {
          this.fileLoading = false;
        }
        break;
      case 'error':
        this.$message.error('上传失败');
        this.fileLoading = false;
        break;
    }
  }

  /**
   * 图片文件转64
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
