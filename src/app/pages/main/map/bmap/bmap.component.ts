import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BMapLoaderService} from '../service/b-map-loader-service';
import {MapComponent} from '../map/map.component';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {EMapType} from '../../../../shared-module/enum/map-enum';

@Component({
  selector: 'app-bmap',
  templateUrl: './bmap.component.html',
  styleUrls: ['./bmap.component.scss'],
  providers: [BMapLoaderService]
})
export class BmapComponent extends MapComponent implements OnInit, AfterViewInit {

  bMap: any;

  constructor(private bMapLoader: BMapLoaderService,
              private modal: NzModalService) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.mapLoadType = this.mapLoadTypeEnum.loading;
    this.bMapLoader.load().then(() => {
      this.bMap = new BMap.Map('bMap'); // 创建Map实例
      this.bMap.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      // this.bMap.addControl(new BMap.GeolocationControl());
      this.ipPosition();
      this.enableSDKLocation();
      const locationControl = new BMap.GeolocationControl();
      // 将控件添加到地图上
      this.bMap.addControl(locationControl);
      locationControl.addEventListener('locationSuccess', (e) => {
        console.log('locationControl', e);
        // var address = '';
        // address += e.addressComponent.province;
        // address += e.addressComponent.city;
        // address += e.addressComponent.district;
        // address += e.addressComponent.street;
        // address += e.addressComponent.streetNumber;
      }, () => {
      });
      locationControl.addEventListener('locationError', (e) => {
        console.log('locationError', e);
      });
      this.mapLoadType = this.mapLoadTypeEnum.done;
      this.mapType = EMapType.bMap;
    }, () => {
      this.mapLoadType = this.mapLoadTypeEnum.error;
      this.createModalRef('提示', '百度地图加载失败，请检查网络！');
    });
  }

  // IP定位
  ipPosition(): void {
    const myFun = (result) => {
      console.log('LocalCity', result);
      const cityName = result.name;
      this.bMap.centerAndZoom(cityName, 12);
    };
    const myCity = new BMap.LocalCity();
    myCity.get(myFun);
  }

  // SDK模糊定位
  enableSDKLocation(): void {
    const geolocation = new BMap.Geolocation();
    geolocation.enableSDKLocation();
    geolocation.getCurrentPosition((r) => {
      if (r) {
        console.log('Geolocation', r);
        this.bMap.panTo(r.point);
        this.bMap.setZoom(12);
      }
    });
  }

  createModalRef(title: string, content: string): NzModalRef {
    if (this.bMap) {
      return this.modal.create({
        nzTitle: title,
        nzContent: content,
        nzCancelText: null
      });
    }
  }
}
