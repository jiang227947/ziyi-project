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
    this.aMap.removeControl(this.geolocation);
    this.aMap = null;
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
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,          // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           // 定位结果缓存0毫秒，默认：0
          convert: true,           // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        // 显示定位按钮，默认：true
          buttonPosition: 'LB',    // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
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
          this.createModalRef('提示', '获取当前位置失败！');
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
