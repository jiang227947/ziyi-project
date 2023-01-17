import {Component, OnInit} from '@angular/core';
import {PageParams} from '../../../../shared-module/interface/pageParms';
import {File} from '../../../../shared-module/interface/file';
import {DownloadUtil} from '../../../../shared-module/util/download-util';
import {UserManagementRequestService} from '../../../../core-module/api-service';
import {Result} from '../../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit {

  // 列表加载状态
  loading = false;
  // 上传文件的弹框
  showUpdate = false;
  // 分页参数
  pageParams = new PageParams(0, 10);
  // 文件列表
  fileList: File[] = [];
  // 上传的文件列表
  updateFileList = [];

  constructor(private $message: NzMessageService,
              private downloadUtil: DownloadUtil,
              private userManagementRequestService: UserManagementRequestService) {
  }

  ngOnInit(): void {
    this.queryImageList();
  }

  // 查询文件列表
  queryImageList(): void {
    this.loading = true;
    this.userManagementRequestService.queryImageList(this.pageParams).subscribe((result: Result<File[]>) => {
      if (result.code === 200) {
        this.fileList = result.data;
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
    this.userManagementRequestService.uploadFile(formData).subscribe((result: Result<any>) => {
      if (result.code === 200) {
        this.$message.success(result.msg);
        this.cancelModal();
        this.queryImageList();
      } else {
        this.$message.error(result.msg);
      }
      this.updateFileList = [];
    });
  }

  // 下载文件
  downloadFile(fileName: string): void {
    this.downloadUtil.downloadFile(`${environment.API_URL}/download`, fileName);
  }

  // 删除文件
  deleteFile(id: number): void {
    this.userManagementRequestService.deleteFile(id).subscribe((result: Result<File[]>) => {
      if (result.code === 200) {
        this.$message.success(result.msg);
        this.queryImageList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  // 文件上传之前处理
  beforeUpload = (file): boolean => {
    this.updateFileList = this.updateFileList.concat(file);
    if (this.updateFileList.length > 1) {
      this.updateFileList.splice(0, 1);
    }
    return false;
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
