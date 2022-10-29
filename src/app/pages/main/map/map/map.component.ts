import {Component, ElementRef, ViewChild} from '@angular/core';
import Marker = google.maps.Marker;
import {EMapLoadTypeStatus, EMapType} from "../../../../shared-module/enum/map-enum";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

/**
 * 封装地图的公共方法
 * jzy
 * */
@Component({
  templateUrl: './map.component.html'
})
export class MapComponent {

  @ViewChild('googleMap', {static: true}) googleMapElement: ElementRef; // 谷歌地图
  @ViewChild('aMap', {static: true}) aMapElement: ElementRef; // 高德地图
  map: any; // 地图实体
  mapLat: number = 30.596339; // 经度
  mapLng: number = 114.314191; // 纬度
  mapZoom: number = 12; // 缩放等级
  markers: Marker[] = []; // 标记点集合
  markerClusterer: MarkerClusterer; // 点聚合
  mapType: string = EMapType.google; // 地图类型
  mapLoadTypeEnum = EMapLoadTypeStatus; // 地图加载状态枚举
  mapLoadType: string = this.mapLoadTypeEnum.loading; // 地图加载状态
  drawStatus = { // 绘制的状态
    marker: false,
    line: false,
    polygon: false,
    rectangle: false,
    circle: false
  }

  constructor() {
  }




}
