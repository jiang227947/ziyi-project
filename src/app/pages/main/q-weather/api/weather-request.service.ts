import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {weatherURl} from './weather-request-url';
import {environment} from '../../../../../environments/environment';
import {WeatherNowInterface} from '../interface/interface';

/**
 * 和风天气API
 */
@Injectable()
export class WeatherRequestService {

  constructor(private http: HttpClient) {
  }

  // 实时天气
  queryNowWeather(params): Observable<any> {
    return this.http.get<WeatherNowInterface>(`${environment.weather + weatherURl.now}`, {
      params
    });
  }

  // 逐小时预报（未来time小时）
  queryHoursHWeather(params, time: string): Observable<any> {
    return this.http.get<WeatherNowInterface>(`${environment.weather}${weatherURl.weather}/${time}h`, {
      params
    });
  }

  // 每日天气预报（未来day天）
  queryDaysWeather(params, day: string): Observable<any> {
    return this.http.get<WeatherNowInterface>(`${environment.weather}${weatherURl.weather}/${day}d`, {
      params
    });
  }

  // 城市搜索
  queryCityLookupWeather(params): Observable<any> {
    return this.http.get(`${environment.city + weatherURl.cityLookup}`, {
      params
    });
  }

  // 热门城市实时天气
  queryCityTopWeather(params): Observable<any> {
    return this.http.get(`${environment.city + weatherURl.cityTop}`, {
      params
    });
  }
}
