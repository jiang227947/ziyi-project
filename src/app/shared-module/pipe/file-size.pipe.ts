import {Pipe, PipeTransform} from '@angular/core';

/**
 * 字节格式转换
 */
@Pipe({name: 'fileSize'})
export class FileSizePipe implements PipeTransform {
  transform(size: number): string {
    if (size > 1024) {
      const mb = (size / 1024 / 1024).toFixed(2);
      return `${mb}MB`;
    } else if (size <= 1024) {
      const kb = (size / 1024).toFixed(2);
      return `${kb}KB`;
    }
  }
}
