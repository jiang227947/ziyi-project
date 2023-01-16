import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class DownloadUtil {
  constructor(private $http: HttpClient) {
  }

  /**
   * 通用文件下载
   * param url
   * param fileName
   */
  downloadFile(url: string, fileName?): void {
    const strArr = url.split(/\//g);
    fileName = fileName || strArr[strArr.length - 1];
    this.$http.get(url, {responseType: 'blob'}).subscribe(data => {
      const blob = new Blob([data], {type: 'application/octet-stream'});
      const download = document.createElement('a');
      download.id = 'download-file';
      download.href = window.URL.createObjectURL(blob);
      download.download = fileName;
      document.body.appendChild(download);
      const aLink = document.getElementById('download-file');
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(download.href);
    });
  }

  /**
   * 下载文件后台返回文件名
   */
  downloadFileNew(url: string): void {
    this.$http.get(url, {responseType: 'blob', observe: 'response'}).subscribe((response: HttpResponse<Blob>) => {
      const blob = new Blob([response.body], {type: 'application/octet-stream'});
      // 从响应头中获取文件名称
      let fileName = response.headers.get('content-disposition').split('fileName=')[1];
      if (fileName) {
        fileName = decodeURIComponent(fileName);
      } else {
        const strArr = url.split(/\//g);
        fileName = fileName || strArr[strArr.length - 1];
      }
      const download = document.createElement('a');
      download.id = 'download-file';
      download.href = window.URL.createObjectURL(blob);
      download.download = fileName;
      document.body.appendChild(download);
      const aLink = document.getElementById('download-file');
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(download.href);
    });
  }
}

