import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MapComponent} from '../map/map.component';
import {AMapLoaderService} from '../service/a-map-loader.service';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-amap',
  templateUrl: './amap.component.html',
  styleUrls: ['./amap.component.scss'],
  providers: [AMapLoaderService]
})
export class AmapComponent extends MapComponent implements AfterViewInit, OnDestroy {

  aMap: any; // 地图实体
  geolocation: any; // 地图控件实体

  constructor(private amapLoader: AMapLoaderService,
              private modal: NzModalService) {
    super();
  }

  ngOnDestroy(): void {
    if (this.aMap) {
      this.aMap.destroy();
      this.aMap = null;
    }
  }

  ngAfterViewInit(): void {
    this.loadAMap();
  }

  loadAMap(): void {
    this.amapLoader.load().then(() => {
      this.aMap = new AMap.Map('aMap', {
        resizeEnable: true,
        zoom: this.mapZoom,
        center: [this.mapLng, this.mapLat],
        // features: ['bg', 'road', 'building'],
        // lang: 'zh_en',  // 可选值：en，zh_en, zh_cn
      });
      this.aMap.plugin('AMap.Geolocation', () => {
        this.geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
          GeoLocationFirst: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量
          offset: [10, 20],
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          position: 'RB'
        });
        this.aMap.addControl(this.geolocation);
        this.geolocation.getCurrentPosition((result) => {
          if (result === 'error') {
            this.createModalRef('提示', '获取当前位置失败！');
          } else {
            const pos = new AMap.LngLat(result.coords.longitude, result.coords.latitude);
            this.aMap.setCenter(pos); // 中心点经纬度
          }
        }, () => {
          this.createModalRef('提示', '获取当前位置超时！');
        });
      });
      this.mapLoadType = this.mapLoadTypeEnum.done;
    }, () => {
      this.mapLoadType = this.mapLoadTypeEnum.error;
      this.createModalRef('提示', '高德地图加载失败，请检查网络！');
    });
  }

  createModalRef(title: string, content: string): NzModalRef {
    if (this.aMap) {
      return this.modal.create({
        nzTitle: title,
        nzContent: content,
        nzCancelText: null
      });
    }
  }
}
