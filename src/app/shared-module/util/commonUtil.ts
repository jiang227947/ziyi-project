import {parse, startOfWeek, startOfYear} from 'date-fns';
import {IMAGE_TYPE_CONST, OFFICE_TYPE_CONST, OTHER_TYPE_CONST, TEXT_TYPE_CONST} from '../const/commou.const';

/**
 * 工具类
 */
export class CommonUtil {

  /**
   * 获取uuid
   * param {number} len
   * returns {string}
   */
  static getUUid(len: number = 36): string {
    const uuid = [];
    const str = '0123456789abcdef';
    for (let i = 0; i < len; i++) {
      uuid[i] = str.substr(Math.floor(Math.random() * 0x10), 1);
    }
    if (len === 36) {
      uuid[14] = '4';
      uuid[19] = str.substr((uuid[19] & 0x3 | 0x8), 1);
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    }
    return uuid.join('').replace(/-/g, '');
  }

  /**
   * 时间格式化
   * param fmt
   * param date
   * returns {any}
   */
  static dateFmt(fmt, date): string {
    const o = {
      'M+': date.getMonth() + 1,                 // 月份
      'd+': date.getDate(),                    // 日
      'h+': date.getHours(),                   // 小时
      'm+': date.getMinutes(),                 // 分
      's+': date.getSeconds(),                 // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  }

  /**
   * 返回几天前日期
   * param day
   */
  static funDate(day: number): string {
    const date1 = this.getCurrentTime();
    const time1 = date1.getFullYear() + '/' + (date1.getMonth() + 1) + '/' + date1.getDate();
    const date2 = new Date(time1);
    date2.setDate(date1.getDate() + day);
    return date2.getFullYear() + '/' + (date2.getMonth() + 1) + '/' + date2.getDate();
  }

  /**
   * 获取当前时间戳
   */
  static getCurrentTime(): Date {
    return new Date(new Date().getTime());
  }

  /**
   * 获取当前日期所在的是第几周（以星期天为一周的第一天）
   * param date
   */
  static getWeek(date: Date): number {
    const MILLISECONDS_IN_WEEK = 604800000;
    // @ts-ignore
    const dates = parse(date);
    const diff = startOfWeek(dates).getTime() - startOfYear(dates).getTime();
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
  }

  /**
   * 时间戳毫秒转换成天小时
   */
  static formatDuring(second: number): string {
    const days = Math.floor(second / 1000 / 3600 / 24);
    const hours = Math.floor(second / 1000 / 3600 % 24);
    return `${days}天${hours}小时`;
  }

  /**
   * 获取utc时间戳
   * param {Date} date
   * returns {number}
   */
  static getUTCTime(date: Date): number {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth();
    const d = date.getUTCDate();
    const h = date.getUTCHours();
    const M = date.getUTCMinutes();
    const s = date.getUTCSeconds();
    return Date.UTC(y, m, d, h, M, s);
  }

  /**
   * 对象深拷贝
   * param obj   拷贝对象
   * returns {any[] | {}}   返回拷贝对象
   */
  static deepClone(obj): any {
    const objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = this.deepClone(obj[key]);
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
    return objClone;
  }

  /**
   * 数组深拷贝方法
   */
  static deepCopy(obj): any {
    // 只拷贝对象
    if (typeof obj !== 'object') {
      return;
    }
    // 根据obj的类型判断是新建一个数组还是一个对象
    const newObj = obj instanceof Array ? [] : {};
    for (const key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] = typeof obj[key] === 'object' && obj[key] !== null ? this.deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj;
  }

  /**
   * 支持的文件上传类型
   * @param fileType:文件类型
   */
  static fileType(fileType: string): boolean {
    // 可上传的类型
    const FILE_TYPE_CONST = [
      ...IMAGE_TYPE_CONST,
      ...TEXT_TYPE_CONST,
      ...OFFICE_TYPE_CONST,
      ...OTHER_TYPE_CONST
    ];
    return FILE_TYPE_CONST.indexOf(fileType) === -1;
  }
}