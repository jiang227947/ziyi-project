import {Pipe, PipeTransform} from '@angular/core';
import {CommonUtil} from '../util/commonUtil';

/**
 * 时间转换
 */
@Pipe({name: 'dateConversion'})
export class DateConversionPipe implements PipeTransform {
  transform(date: string): string {
    let dateVal = '';
    const nowTime = new Date().toDateString();
    const dateStr = new Date(date).toDateString();
    // 时间戳差值
    const days = CommonUtil.getTimeDiff(date);
    // 分补0
    let minutes: number | string = new Date(date).getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (nowTime === dateStr) {
      // 判断是否在同一天
      dateVal = `今天${new Date(date).getHours()}:${minutes}`;
    } else if (days === 1) {
      // 判断是否是昨天
      dateVal = `昨天${new Date(date).getHours()}:${minutes}`;
    } else {
      dateVal = date;
    }
    return dateVal;
  }
}

/**
 * 连续发言时间插槽
 */
@Pipe({name: 'timeConversion'})
export class TimeConversionPipe implements PipeTransform {
  transform(date: string): string {
    let minutes: number | string = new Date(date).getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${new Date(date).getHours()}:${minutes}`;
  }
}
