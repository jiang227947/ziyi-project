import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class DownloadUtil {
  // 下载进度
  percentDone = 0;

  constructor(private $http: HttpClient) {
  }

  /**
   * 通用文件下载
   * param url
   * param fileName
   */
  downloadFile(url: string, fileName: string): void {
    const strArr = url.split(/\//g);
    fileName = fileName || strArr[strArr.length - 1];
    this.$http.post(url, fileName, {
      responseType: 'blob'
    }).subscribe((event: Blob) => {
      console.log(event);
      const blob = new Blob([event], {type: 'application/octet-stream'});
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
   * 通用文件下载
   * param url
   * param fileName
   */
  getDownloadFile(url: string, fileName: string): void {
    this.$http.get(url, {
      responseType: 'blob'
    }).subscribe((event: Blob) => {
      const blob = new Blob([event], {type: 'application/octet-stream'});
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
   * 下载进度
   * @param url:请求地址
   * @param fileName:文件名称
   * @param fileSize:文件大小
   */
  downloadPercentDone(url: string, fileName: string, fileSize: number): Observable<{ progress: any; response: HttpEvent<Blob>; }> {
    return this.$http.post(url, {filename: fileName}, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(map((event: HttpEvent<any>) => ({
      progress: this.getProgress(event, fileSize),
      response: event
    })));
  }

  /**
   * 下载时监听进度
   * @param url:请求地址
   * @param fileName:文件名
   * @param fileSize:文件大小
   */
  downloadProgressEvent(url: string, fileName: string, fileSize: number): void {
    this.percentDone = 0;
    this.downloadPercentDone(url, fileName, fileSize).subscribe({
      next: ({progress, response}) => {
        this.percentDone = progress;
        if (progress === 100 && response.type === 4) {
          const resBlob = response.body as Blob;
          const time = new Date().getTime();
          const blob = new Blob([resBlob], {type: 'application/octet-stream'});
          const download = document.createElement('a');
          download.id = `download-file${time}`;
          download.href = window.URL.createObjectURL(blob);
          download.download = fileName;
          document.body.appendChild(download);
          const aLink = document.getElementById(`download-file${time}`);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(download.href);
        }
      },
      error: (error: any) => {
      }
    });
  }

  /**
   * 文件元数据下载
   * @param response:请求体
   * @param fileName:文件名
   */
  fileBlobDownload(response: HttpResponse<Blob>, fileName: string): void {
    const resBlob = response.body as Blob;
    const time = new Date().getTime();
    const blob = new Blob([resBlob], {type: 'application/octet-stream'});
    const download = document.createElement('a');
    download.id = `download-file${time}`;
    download.href = window.URL.createObjectURL(blob);
    download.download = fileName;
    document.body.appendChild(download);
    const aLink = document.getElementById(`download-file${time}`);
    aLink.click();
    document.body.removeChild(aLink);
    window.URL.revokeObjectURL(download.href);
  }

  /**
   * 返回进度数字
   * @param httpEvent:请求体
   * @param fileSize:文件大小
   */
  getProgress(httpEvent: HttpEvent<any>, fileSize: number): number {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        if (httpEvent && httpEvent.total) {
          this.percentDone = +((httpEvent.loaded / fileSize) * 100).toFixed(0);
          return this.percentDone;
        } else {
          return 0;
        }
      case HttpEventType.DownloadProgress:
        if (httpEvent && httpEvent.loaded) {
          this.percentDone = +((httpEvent.loaded / fileSize) * 100).toFixed(0);
        }
        return this.percentDone;
      default:
        // Not an httpEvent we care about
        return this.percentDone;
    }
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

