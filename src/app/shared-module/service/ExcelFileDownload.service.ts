import {Injectable} from '@angular/core';
import * as excel from 'exceljs';
import * as filesaver from 'file-saver';


@Injectable({providedIn: 'root'})
export class ExcelFileDownloadService {
  constructor() {
  }

  // reference: https://blog.csdn.net/csdn_lsy/article/details/107179708
  async exportExcelData(luckysheetFile: any[]): Promise<void> {
    // initialize a workbook
    const workbook = new excel.Workbook();
    // initialize a table
    luckysheetFile.every((table: any) => {
      if (table.data.length === 0) {
        return true;
      }
      const worksheet = workbook.addWorksheet(table.name);
      // set style and value
      this.setStyleAndValue(table.data, worksheet);
      // set cell merging
      this.setMerge(table.config.merge, worksheet);
      // set border
      this.setBorder(table.config.borderInfo, worksheet);
      return true;
    });

    // FIXME: the file is able to be downloaded, but needs to be fixed by Microsoft 365, style error
    // FIXME: uploaded file is not able to be downloaded, empty file
    // reference: https://github.com/exceljs/exceljs/issues/354
    await workbook.xlsx.writeBuffer().then(function(data: any) {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      filesaver.saveAs(blob, 'test.xlsx');
    });
  }

  // setStyleAndValue block

  setStyleAndValue(cellArr: any[], worksheet: any): void {
    if (!Array.isArray(cellArr)) {
      return;
    }
    cellArr.forEach((row, rowid) => {
      row.every((cell: any, columnid: any) => {
        if (!cell) {
          return true;
        }
        let fill = this.fillConvert(cell.bg);
        let font = this.fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.ul);
        let alignment = this.alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr);
        let value;
        if (cell.f) {
          value = {formula: cell.f, result: cell.v};
        } else {
          value = cell.v;
        }
        let target = worksheet.getCell(rowid + 1, columnid + 1);
        target.fill = fill;
        target.font = font;
        target.alignment = alignment;
        target.value = value;
        return true;
      });
    });
  }

  fillConvert(bg: string): object {
    if (!bg) {
      return {};
    }
    let fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: bg.replace('#', '')
      }
    };
    return fill;
  }

  fontConvert(ff = 0, fc = '#000000', bl = 0, it = 0, fs = 12, cl = 0, ul = 0): object {

    function isfontStyled(fontIdx: number): boolean {
      return fontIdx === 0 ? false : true;
    }

    // type declaration: font
    const luckyToExcelFont: { [key: number]: any } = {};
    luckyToExcelFont[0] = '標楷體';
    luckyToExcelFont[1] = '微軟正黑體';
    luckyToExcelFont[2] = 'Microsoft YaHei';
    luckyToExcelFont[3] = 'Microsoft YaHei Light';
    luckyToExcelFont[4] = '細明體';
    luckyToExcelFont[5] = 'Microsoft YaHei UI';
    luckyToExcelFont[6] = 'Microsoft YaHei UI Light';
    luckyToExcelFont[7] = 'Microsoft JhengHei UI';
    luckyToExcelFont[8] = 'Microsoft JhengHei UI Light';
    luckyToExcelFont[9] = 'Arial';
    luckyToExcelFont[10] = 'Times New Roman';
    luckyToExcelFont[11] = 'Tahoma';
    luckyToExcelFont[12] = 'Verdana';

    let font = {
      name: luckyToExcelFont[ff],
      family: 1,
      size: fs,
      color: {
        argb: fc.replace('#', '')
      },
      bold: isfontStyled(bl),
      italic: isfontStyled(it),
      underline: isfontStyled(ul),
      strike: isfontStyled(cl)
    };

    return font;
  }

  alignmentConvert(vt = 'default', ht = 'default', tb = 'default', tr = 'default'): object {
    // type declaration: vertical
    const vertical: { [key: number | string]: string } = {};
    vertical[0] = 'middle';
    vertical[1] = 'top';
    vertical[2] = 'bottom';
    vertical['default'] = 'top';

    // type declaration: horizontal
    const horizontal: { [key: number | string]: string } = {};
    horizontal[0] = 'center';
    horizontal[1] = 'left';
    horizontal[2] = 'right';
    horizontal['default'] = 'left';

    // type declaration: text-wrap
    const textWrap: { [key: number | string]: boolean } = {};
    textWrap[0] = false;
    textWrap[1] = false;
    textWrap[2] = true;
    textWrap['default'] = false;

    // type declaration: text-rotation
    const textRotation: { [key: number | string]: number | string } = {};
    textRotation[0] = 0;
    textRotation[1] = 45;
    textRotation[2] = -45;
    textRotation[3] = 'vertical';
    textRotation[4] = 90;
    textRotation[5] = -90;
    textRotation['default'] = 0;

    const luckyToExcelAlignment = {
      vertical: vertical,
      horizontal: horizontal,
      wrapText: textWrap,
      textRotation: textRotation
    };

    let alignment = {
      vertical: luckyToExcelAlignment.vertical[vt],
      horizontal: luckyToExcelAlignment.horizontal[ht],
      wrapText: luckyToExcelAlignment.wrapText[tb],
      textRotation: luckyToExcelAlignment.textRotation[tr]
    };

    return alignment;
  }

  // setStyleAndValue block end

  // setMerge block

  setMerge(luckyMerge = {}, worksheet: any): void {
    const mergeArr = Object.values(luckyMerge);
    mergeArr.forEach((elem: any) => { // element format: {r:0, c:0, r:1, c:2}
      worksheet.mergeCells(elem.r + 1, elem.c + 1, elem.r + elem.rs, elem.c + elem.cs);
    });
  }

  // setMerge block end

  // setBorder block

  setBorder(luckyBorderInfo: any[], worksheet: any): void {
    if (!Array.isArray(luckyBorderInfo)) {
      return;
    }
    luckyBorderInfo.forEach((elem: any) => {
      let border = this.borderConvert(elem.borderType, elem.style, elem.color);
      let rang = elem.value;
      worksheet.getCell(rang.row_index + 1, rang.col_index + 1).border = border;
    });
  }

  borderConvert(borderType: string, styleType = 1, color = '#000'): object {
    // corresponding to the luckysheet's borderInfo config
    if (!borderType) {
      return {};
    }

    // typescript declaration: type
    const type: { [key: string]: string } = {};
    type['border-all'] = 'all';
    type['border-left'] = 'left';
    type['border-right'] = 'right';
    type['border-top'] = 'top';

    // typescript declaration: style
    const style: { [key: number]: string } = {};
    style[0] = 'none';
    style[1] = 'thin';
    style[2] = 'hair';
    style[3] = 'dotted';
    style[4] = 'dashDot';
    style[5] = 'dashDot';
    style[6] = 'DashDotDot';
    style[7] = 'double';
    style[8] = 'medium';
    style[9] = 'mediumDashed';
    style[10] = 'mediumDashDot';
    style[11] = 'slantDashDot';
    style[12] = 'thick';

    const luckyToExcel = {
      type: type,
      style: style,
    };

    let template = {
      style: luckyToExcel.style[styleType],
      color: {
        argb: color.replace('#', '')
      }
    };

    // typescript declaration: border
    const border: { [key: string]: { style: string, color: any } } = {};

    if (luckyToExcel.type[borderType] === 'all') {
      border['top'] = template;
      border['right'] = template;
      border['bottom'] = template;
      border['left'] = template;
    } else {
      border[luckyToExcel.type[borderType]] = template;
    }
    return border;
  }

  // setBorder block end
}
