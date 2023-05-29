import {Component, OnInit, Renderer2} from '@angular/core';
import L from 'leaflet';
import {LoadScriptService} from '../../../../shared-module/service/load-script.service';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent implements OnInit {

  // 地图实体
  leafletMap: any;
  // marker集合
  markers = [];

  constructor(private loadScriptService: LoadScriptService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.loadScriptService.loadJsScript(this.renderer, 'leaflet', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css', 'text/css').then(() => {
      const options = {
        center: [30.596339, 114.314191], // 地图中心
        minZoom: 0,
        maxZoom: 18,
        zoom: 10,
        zoomControl: true, // 禁用 + - 按钮
        doubleClickZoom: true, // 禁用双击放大
        // attributionControl: true, // 移除右下角leaflet标识
        dragging: true, // 禁止鼠标拖动滚动
        boxZoom: true, // 决定地图是否可被缩放到鼠标拖拽出的矩形的视图，鼠标拖拽时需要同时按住shift键.
        scrollWheelZoom: true, // 禁止鼠标滚动缩放
        zoomSnap: 0.5, // 地图能放缩的zoom的最小刻度尺度，默认值1
        fullscreenControl: true, // 全屏控件，不显示
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      };
      this.leafletMap = L.map('leaflet', options);
      // 添加创建地图的函数
      const createTileLayer = (map, url, option) => {
        const tileLayer = L.tileLayer(url, option);
        tileLayer.addTo(map);
        return tileLayer;
      };
      // 添加地图瓦片
      createTileLayer(this.leafletMap, 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', options);
      // 点击地图添加marker
      this.leafletMap.on('click', (ev) => {
        const marker = L.marker([ev.latlng.lat, ev.latlng.lng]).addTo(this.leafletMap);
        this.markers.push(marker);
      });
      // 地图拖拽清空marker
      this.leafletMap.on('dragstart', (ev) => {
        this.markers.forEach((marker) => {
          marker.remove();
        });
      });
    });
  }

}
