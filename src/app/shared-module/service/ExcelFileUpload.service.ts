import {Injectable} from '@angular/core';
import * as luckyexcel from 'luckyexcel';
import * as luckysheet from 'luckysheet';

@Injectable({providedIn: 'root'})
export class ExcelFileUploadService {
  constructor() {
  }

  convertExcelToLuckySheet(file: any): void {
    // reference: https://github.com/mengshukeji/Luckyexcel/blob/master/src/index.html

    luckyexcel.transformExcelToLucky(file, (exportJson: any, luckysheetFile: any) => {
      luckysheet.destroy();

      // the exportJson does include the sheet data

      const options = {
        container: 'luckysheet', // luckysheet is the container id
        lang: 'zh',
        showinfobar: false,
        data: exportJson.sheets,
        title: 'ExampleSheet',
        userInfo: exportJson.info.name.creator
      };

      luckysheet.create(options);
    });
  }
}
