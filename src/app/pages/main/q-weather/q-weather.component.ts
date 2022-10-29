import {Component, OnInit} from '@angular/core';
import {WeatherRequestService} from './api';
import {
  CityInterface,
  DailyInterface, FutureWeatherInterface,
  LocationInterface,
  NowInterface,
  WeatherNowInterface
} from './interface/interface';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-q-weather',
  templateUrl: './q-weather.component.html',
  styleUrls: ['./q-weather.component.scss']
})
export class QWeatherComponent implements OnInit {

  key = '17b72541b5214c85800d1cbe259ce6d2';
  loading = true; // 查询状态
  cityName = ''; // 搜索的城市名称
  city: LocationInterface; // 查询的城市信息
  cityWeather: NowInterface; // 城市天气
  weatherTitle = [
    {
      label: '逐小时预报',
      value: 'hour'
    },
    {
      label: '逐天预报',
      value: 'day'
    }
  ]; // 未来时间分类
  weatherType = 'hour'; // 默认未来时间类型
  hoursList = [
    {
      label: '24小时',
      value: '24'
    },
    {
      label: '72小时',
      value: '72'
    },
    {
      label: '168小时',
      value: '168'
    }
  ]; // 未来N小时分类
  hours = '24'; // 默认小时
  daysList = [
    {
      label: '3天',
      value: '3'
    },
    {
      label: '7天',
      value: '7'
    },
    {
      label: '10天',
      value: '10'
    },
    {
      label: '15天',
      value: '15'
    }
  ]; // 未来N天分类
  days = '3'; // 默认天
  futureWeather: DailyInterface[]; // 未来N天城市天气

  constructor(private weatherRequestService: WeatherRequestService,
              private modal: NzModalService) {
  }

  ngOnInit(): void {
    this.queryCityLookupWeather('武汉').then((result: CityInterface) => {
      if (result) {
        this.city = result.location[0] || undefined;
        // 查询实时天气
        this.queryNowWeather(this.city.id);
        // 查询未来小时天气
        this.queryHoursHWeather(this.city.id);
      } else {
        this.loading = false;
      }
    });
  }

  // 根据城市id查询实时天气
  queryNowWeather(cityId: string): void {
    this.weatherRequestService.queryNowWeather({
      key: this.key,
      location: cityId
    }).subscribe((result: WeatherNowInterface) => {
      if (result.code === '200') {
        this.cityWeather = result.now;
      } else {
        this.modal.info({
          nzTitle: result.code,
          nzContent: `查询${this.cityName}实时天气失败！`,
          nzCancelText: null
        });
      }
      this.loading = false;
    });
  }

  // 根据城市名称查询城市信息
  queryCityLookupWeather(city?: string): Promise<CityInterface> {
    if (!city && this.cityName === '') {
      this.modal.info({
        nzTitle: '提示',
        nzContent: '请输入城市名称！',
        nzCancelText: null
      });
      return;
    }
    this.loading = true;
    return new Promise<CityInterface>((resolve, reject) => {
      this.weatherRequestService.queryCityLookupWeather({
        key: this.key,
        location: city || this.cityName
      }).subscribe((result: CityInterface) => {
        if (result.code === '200') {
          if (!city) {
            this.city = result.location[0] || undefined;
            // 查询未来天气
            this.weatherTitleChange(this.weatherType);
            this.loading = false;
          }
          resolve(result);
        } else {
          this.modal.info({
            nzTitle: result.code,
            nzContent: `查询${this.cityName}信息失败！`,
            nzCancelText: null
          });
          reject();
        }
      });
    });
  }

  // 逐小时预报（未来time小时）
  queryHoursHWeather(location: string = this.city.id): void {
    const params = {location, key: this.key};
    this.weatherRequestService.queryHoursHWeather(params, this.hours).subscribe((result: FutureWeatherInterface) => {
      if (result.code === '200') {
        this.futureWeather = result.hourly;
      } else {
        this.modal.info({
          nzTitle: result.code,
          nzContent: `查询未来${this.hours}小时天气失败！`,
          nzCancelText: null
        });
      }
    });
  }

  // 逐天预报（未来time天）
  queryDaysWeather(location: string = this.city.id): void {
    const params = {location, key: this.key};
    this.weatherRequestService.queryDaysWeather(params, this.days).subscribe((result: FutureWeatherInterface) => {
      if (result.code === '200') {
        this.futureWeather = result.daily;
      } else {
        this.modal.info({
          nzTitle: result.code,
          nzContent: `查询未来${this.days}天天气失败！`,
          nzCancelText: null
        });
      }
    });
  }

  // 卡片标题类型切换
  weatherTitleChange(weatherType: string): void {
    switch (weatherType) {
      case 'hour':
        // 查询逐小时预报
        this.queryHoursHWeather();
        break;
      case 'day':
        // 查询逐天预报
        this.queryDaysWeather();
        break;
    }
  }
}
