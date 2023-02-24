import {Component, OnInit} from '@angular/core';
import {PageParams} from '../../../../shared-module/interface/pageParms';
import {File} from '../../../../shared-module/interface/file';
import {DownloadUtil} from '../../../../shared-module/util/download-util';
import {ResourceManagementRequestService} from '../../../../core-module/api-service';
import {Result} from '../../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';
import {environment} from '../../../../../environments/environment';
import {CommonUtil} from '../../../../shared-module/util/commonUtil';
import {SIZE_30MB} from '../../../../shared-module/const/commou.const';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {NzUploadFile, NzUploadXHRArgs} from 'ng-zorro-antd/upload/interface';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

  // 列表加载状态
  loading = false;
  // 上传文件的弹框
  showUpdate = false;
  // 分页参数
  pageParams = new PageParams(1, 10);
  // 文件列表
  fileList: File[] = [];
  dataTotal = 0;
  // 上传的文件列表
  updateFileList = [];

  // 上传的进度
  filePercent = 0;

  constructor(private $message: NzMessageService,
              private downloadUtil: DownloadUtil,
              private resourceManagementRequestService: ResourceManagementRequestService) {
  }

  uploadFileRequest = ((item: NzUploadXHRArgs) => {
    console.log(item);
    const formData = new FormData();
    this.updateFileList.forEach(file => {
      formData.append('file', file);
    });
    this.resourceManagementRequestService.uploadFile(formData).subscribe((event: HttpEvent<Result<any>>) => {
      console.log(event);
      if (event.type === HttpEventType.UploadProgress) {
        // if (!this.cancelingFiles.hasOwnProperty(item.file.uid)) {
        //   if (event.total > 0) {
        //     (event as any).percent = (event.loaded / event.total) * 100;
        //   }
        //   item.onProgress(event, item.file);
        // }
      } else if (event.type === HttpEventType.Response) {
        const result = event.body as Result<any>;
        console.log(result);
        if (result.code === 200) {
          this.$message.success(result.msg);
          this.cancelModal();
          this.queryImageList();
        } else {
          this.$message.error(result.msg);
        }
        this.updateFileList = [];
        /*if (resp.code === 1) {
          item.onSuccess(event.body, item.file, event);
        } else {
          item.onError(event, item.file);
        }*/
      }
    });
  });

  // 文件上传之前处理
  beforeUpload = (file: NzUploadFile): boolean => {
    if (file.size > SIZE_30MB) {
      this.$message.error('文件大小不能超过30MB！');
      return false;
    }
    if (CommonUtil.fileType(file.type)) {
      this.$message.error('该类型无法上传！');
      return false;
    }
    this.updateFileList = this.updateFileList.concat(file);
    if (this.updateFileList.length > 1) {
      this.updateFileList.splice(0, 1);
    }
    return false;
  };

  ngOnInit(): void {
    this.queryImageList();
  }

  // 查询文件列表
  queryImageList(): void {
    this.loading = true;
    this.resourceManagementRequestService.queryImageList(this.pageParams).subscribe((result: Result<File[]>) => {
      if (result.code === 200) {
        this.fileList = result.data;
        this.dataTotal = result.totalCount;
      } else {
        this.$message.error(result.msg);
      }
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  // 上传文件
  uploadFile(): void {
    const formData = new FormData();
    this.updateFileList.forEach(file => {
      formData.append('file', file);
    });
    this.resourceManagementRequestService.uploadFile(formData).subscribe((event: HttpEvent<Result<any>>) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.filePercent = +((event.loaded / event.total) * 100).toFixed(1);
      } else if (event.type === HttpEventType.Response) {
        this.filePercent = 0;
        const result = event.body as Result<any>;
        if (result.code === 200) {
          this.$message.success(result.msg);
          this.cancelModal();
          this.queryImageList();
        } else {
          this.$message.error(result.msg);
        }
        this.updateFileList = [];
      }
    });
  }

  /**
   * 文件下载
   * @param data:文件
   */
  downloadFile(data: File): void {
    this.downloadUtil.downloadPercentDone(`${environment.API_URL}/download`, data.fileName, data.fileSize).subscribe({
      next: ({progress, response}) => {
        // 进度显示
        data.percent = progress;
        // 下载进度100
        if (progress === 100 && response.type === 4) {
          // 文件元数据下载
          this.downloadUtil.fileBlobDownload(response, data.fileName);
        }
      },
      error: (error: any) => {
        this.$message.error('文件下载失败！');
      }
    });
  }

  // 删除文件
  deleteFile(id: number): void {
    this.resourceManagementRequestService.deleteFile(id).subscribe((result: Result<File[]>) => {
      if (result.code === 200) {
        this.$message.success(result.msg);
        this.queryImageList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  pageIndexChange(pageNum: number): void {
    this.pageParams.pageNum = pageNum;
    this.queryImageList();
  }

  pageSizeChange(pageSize: number): void {
    this.pageParams.pageSize = pageSize;
    this.queryImageList();
  }

  // 关闭弹框
  cancelModal(): void {
    this.showUpdate = false;
    this.updateFileList = [];
  }

}
