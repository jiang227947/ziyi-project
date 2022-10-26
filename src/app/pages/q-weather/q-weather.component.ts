import {Component, OnInit} from '@angular/core';
import {WeatherRequestService} from "./api";
import {CityInterface, LocationInterface, NowInterface, WeatherNowInterface} from "./interface/interface";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-q-weather',
  templateUrl: './q-weather.component.html',
  styleUrls: ['./q-weather.component.scss']
})
export class QWeatherComponent implements OnInit {

  key: string = '17b72541b5214c85800d1cbe259ce6d2';
  loading: boolean = true;
  cityName: string = ''; // 搜索的城市名称
  city: LocationInterface; // 查询的城市信息
  cityWeather: NowInterface; // 城市天气

  constructor(private weatherRequestService: WeatherRequestService,
              private modal: NzModalService) {
  }

  ngOnInit(): void {
    this.queryCityLookupWeather('武汉').then((result: CityInterface) => {
      if (result) {
        this.city = result.location[0] || undefined;
        this.queryNowWeather(this.city.id);
      } else {
        this.modal.info({
          nzTitle: '提示',
          nzContent: '查询失败！',
          nzCancelText: null
        });
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
            this.queryNowWeather(this.city.id);
            this.loading = false;
          }
          resolve(result);
        } else {
          reject();
        }
      });
    });
  }


  // 热门城市天气
  queryCityTopWeather(): void {
    this.weatherRequestService.queryCityTopWeather({
      number: 5,
      range: 'cn',
      key: this.key
    }).subscribe((result) => {
      console.log(result);
    });
  }
}
