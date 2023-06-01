import {Pipe, PipeTransform} from '@angular/core';

/**
 * 头像地址转换
 */
@Pipe({name: 'avatarConversion'})
export class AvatarPipe implements PipeTransform {
  transform(url: string): string {
    if (url && url.indexOf('http' || 'https') !== -1) {
      return url;
    } else if (url !== null && url !== undefined) {
      return `https://www.evziyi.top${url}`;
    } else {

    }
  }
}
