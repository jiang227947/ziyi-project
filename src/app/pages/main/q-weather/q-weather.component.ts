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
import {BMapLoaderService} from '../map/service/b-map-loader-service';

@Component({
  selector: 'app-q-weather',
  templateUrl: './q-weather.component.html',
  styleUrls: ['./q-weather.component.scss'],
  providers: [BMapLoaderService]
})
export class QWeatherComponent implements OnInit {

  key = '17b72541b5214c85800d1cbe259ce6d2';
  loading = false; // 查询状态
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
  cityTags: string[] = []; // 搜索历史

  constructor(private weatherRequestService: WeatherRequestService,
              private modal: NzModalService, private bMapLoader: BMapLoaderService) {
  }

  ngOnInit(): void {
    const cityRecord: string[] = JSON.parse(localStorage.getItem('city_record'));
    if (cityRecord) {
      // 读取历史记录
      this.cityTags = cityRecord;
    }
    // 使用百度地图ip定位
    this.bMapLoader.load().then(() => {
      const myFun = (city) => {
        const cityName = city.name || '武汉';
        this.queryCityLookupWeather(cityName);
      };
      // 使用百度地图ip定位
      new BMap.LocalCity().get(myFun);
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
        this.loading = false;
      } else {
        this.modal.info({
          nzTitle: result.code,
          nzContent: `查询${this.cityName}实时天气失败！`,
          nzCancelText: null
        });
        this.loading = false;
      }
    });
  }

  // 根据城市名称查询城市信息
  queryCityLookupWeather(city?: string): void {
    if (!city && this.cityName === '') {
      this.modal.info({
        nzTitle: '提示',
        nzContent: '请输入城市名称！',
        nzCancelText: null
      });
      return;
    }
    this.loading = true;
    this.weatherRequestService.queryCityLookupWeather({
      key: this.key,
      location: city || this.cityName
    }).subscribe((result: CityInterface) => {
      if (result.code === '200') {
        this.city = result.location[0] || undefined;
        if (!city) {
          // 如果搜索记录没有，则添加城市名称
          if (!this.cityTags.includes(this.cityName)) {
            // 长度不大于5
            if (this.cityTags.length >= 5) {
              this.cityTags.splice(0, 1);
            }
            this.cityTags.push(this.cityName);
            // 储存记录
            localStorage.setItem('city_record', JSON.stringify(this.cityTags));
          }
        }
        // 查询实时天气
        this.queryNowWeather(this.city.id);
        // 查询未来天气
        this.weatherTitleChange(this.weatherType);
      } else {
        this.modal.info({
          nzTitle: result.code,
          nzContent: `查询${this.cityName}信息失败！`,
          nzCancelText: null
        });
        this.loading = false;
      }
    });
  }

  // 逐小时预报（未来time小时）
  queryHoursHWeather(location: string = this.city.id): void {
    const params = {location, key: this.key};
    this.weatherRequestService.queryHoursHWeather(params, this.hours).subscribe((result: FutureWeatherInterface) => {
      if (result.code === '200') {
        this.futureWeather = result.hourly;
        this.loading = false;
      } else {
        this.modal.info({
          nzTitle: result.code,
          nzContent: `查询未来${this.hours}小时天气失败！`,
          nzCancelText: null
        });
        this.loading = false;
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

  // 历史记录查询
  handleQuery(tag: string): void {
    this.queryCityLookupWeather(tag);
  }

  // 删除搜索历史
  handleClose(idx: number): void {
    this.cityTags.splice(idx, 1);
    localStorage.setItem('city_record', JSON.stringify(this.cityTags));
  }
}
