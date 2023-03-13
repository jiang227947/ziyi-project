import {AfterViewInit, Component} from '@angular/core';
import * as luckysheet from 'luckysheet';
import {ExcelFileUploadService} from '../../../../shared-module/service/ExcelFileUpload.service';
import {NzUploadFile} from 'ng-zorro-antd/upload/interface';

/**
 * Luckysheet ，一款纯前端类似excel的在线表格，功能强大、配置简单、完全开源。
 * https://github.com/dream-num/Luckysheet
 * 2023/3/13
 */
@Component({
  selector: 'app-luckysheet',
  templateUrl: './luckysheet.component.html',
  styleUrls: ['./luckysheet.component.scss']
})
export class LuckysheetComponent implements AfterViewInit {

  // 配置项
  sheetOptions: any;
  uploading = false;
  fileList: NzUploadFile[] = [];

  constructor(private fileUploadService: ExcelFileUploadService) {
  }

  /**
   * 上传文件
   */
  beforeUpload = (file: NzUploadFile): boolean => {
    const name = file.name;
    const suffixArr = name.split('.');
    const suffix = suffixArr[suffixArr.length - 1];
    if (suffix !== 'xlsx') {
      alert('只能上传xlsx类型的文件');
      return;
    }
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.fileUploadService.convertExcelToLuckySheet(this.fileList[0]);
    return false;
  };

  ngAfterViewInit(): void {
    this.sheetOptions = {
      container: 'luckysheet', // luckysheet为容器id
      lang: 'zh', // 设定表格语言
      showinfobar: false,
    };
    luckysheet.create(this.sheetOptions);
  }

  /**
   * 下载
   */
  downloadExcel(): void {
    console.log(luckysheet.getLuckysheetfile());
  }


}
