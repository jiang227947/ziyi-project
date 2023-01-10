/**
 * index请求接口
 * */
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IndexUrl} from '../const/IndexUrl';
import {Injectable} from '@angular/core';

@Injectable()
export class IndexApiService {
  constructor(private $http: HttpClient) {
  }

  // 获取指定日期的节假日信息
  getHolidayInfo(): Observable<any> {
    return this.$http.get<any>(IndexUrl.holidayInfo);
  }

  // 计算下一个假期
  getHolidayNext(): Observable<any> {
    return this.$http.get<any>(IndexUrl.holidayNext);
  }

  // 获取指定日期的下一个工作日（工作日包含正常工作日、调休）不包含当天
  getHolidayWorkdayNext(): Observable<any> {
    return this.$http.get<any>(IndexUrl.holidayWorkdayNext);
  }

  // 返回文字。距离今天最近的一个放假安排。周六周末、调休、节假日都会考虑，比较全面的放假安排。
  getHolidayTts(): Observable<any> {
    return this.$http.get<any>(IndexUrl.holidayTts);
  }

  // 返回文字。回答明天放假吗
  getHolidayTtsTomorrow(): Observable<any> {
    return this.$http.get<any>(IndexUrl.holidayTtsTomorrow);
  }
}
