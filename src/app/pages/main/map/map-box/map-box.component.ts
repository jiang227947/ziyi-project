import {AfterViewInit, Component, OnInit} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import {MapBoxLoaderService} from '../service/map-box-loader.service';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
  providers: [MapBoxLoaderService]
})
export class MapBoxComponent implements OnInit, AfterViewInit {

  private map: any;
  private draw: any; // 绘制多边形函数
  private measureDistancesFunc: any; // 测距函数

  constructor(private $mapBoxLoaderService: MapBoxLoaderService) {
    /*** 本地化语言包 https://github.com/mapbox/mapbox-gl-language/* */
  }

  ngAfterViewInit(): void {
    /*** 中文文档地址：http://www.mapbox.cn/mapbox-gl-js/api/#map* */
    mapboxgl.accessToken = 'pk.eyJ1Ijoienp5aSIsImEiOiJjbDU4dzZ4d28xbzJoM2lvNTZtOTlxOHFhIn0.CKo_wchkEXfJ1YE9rC1Ckw';
    this.map = new mapboxgl.Map({
      container: 'mapBox', // 地图ID
      style: 'mapbox://styles/mapbox/streets-v11', // 样式类型
      center: [114.314191, 30.596339], // [lng, lat]
      zoom: 12, // 缩放大小
      projection: 'globe', // display the map as a 3D globe
      attributionControl: false, // 控制展示地图的属性信息。
    });

    this.map.on('style.load', () => {
      // 监听样式加载完毕
      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));
      this.addControl();
      // this.addMarker();
    });
    this.map.on('dragend', (event) => {
      // 监听拖拽
      // const center = event.target.getCenter();
      // console.log('center', center);
    });
    this.map.on('click', (e) => {
      /*new mapboxgl.Popup({className: 'my-class'})
        .setLngLat(e.lngLat)
        .setHTML("<h1>Hello World!</h1>")
        .setMaxWidth("300px")
        .addTo(this.map);*/
    });
  }

  ngOnInit(): void {
  }

  /*** 添加控制组件* */
  addControl(): void {
    // 全屏控件
    this.map.addControl(new mapboxgl.FullscreenControl());
    // 放大缩小控件
    this.map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-right');
    // 多边形控件
    this.draw = new MapboxDraw({
      displayControlsDefault: true,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: 'draw_polygon'
    });
    this.map.addControl(this.draw);
  }

  /*** 添加标记点* */
  addMarker(): void {
    const options = {
      color: '#efabab', // 标记点颜色
      draggable: true // 可拖动
    };
    // 创建一个marker点
    const marker1 = new mapboxgl.Marker(options)
      .setLngLat([114.314191, 30.596339])
      .addTo(this.map);

    // 添加一个倾斜45度的marker
    const marker2 = new mapboxgl.Marker({color: 'red', rotation: 45})
      .setLngLat([114.314191, 30.610339])
      .addTo(this.map);
  }

  /**
   * 定位位置
   * 不用动态转换的情况下改变中心点、 缩放级别、方位角和倾斜度的任意组合。地图将保留 options 没有指定的当前值。
   * */
  jumpTo(event: string): void {
    switch (event) {
      case '武汉':
        this.map.jumpTo({center: [114.314191, 30.596339]});
        break;
      case '纽约':
        this.map.jumpTo({center: [-74.00297886644239, 40.70443743974067]});
        break;
    }
  }

  /**
   * 测量距离 https://docs.mapbox.com/mapbox-gl-js/example/measure/
   * */
  measureDistances(): void {
    this.$mapBoxLoaderService.loadDistances().then(() => {
      const distanceContainer = document.getElementById('distance');
      const geojson = {
        type: 'FeatureCollection',
        features: []
      };

      // Used to draw a line between points
      const linestring = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      };
      this.map.addSource('geojson', {
        type: 'geojson',
        data: geojson
      });

      // Add styles to the map
      this.map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        paint: {
          'circle-radius': 5,
          'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point']
      });
      this.map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'geojson',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#000',
          'line-width': 2.5
        },
        filter: ['in', '$type', 'LineString']
      });
      // 给测距函数添加事件
      this.measureDistancesFunc = (e) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['measure-points']
        });

        // Remove the linestring from the group
        // so we can redraw it based on the points collection.
        if (geojson.features.length > 1) {
          geojson.features.pop();
        }

        // Clear the distance container to populate it with a new value.
        distanceContainer.innerHTML = '';

        // If a feature was clicked, remove it from the map.
        if (features.length) {
          const id = features[0].properties.id;
          geojson.features = geojson.features.filter(
            (point) => point.properties.id !== id
          );
        } else {
          const point = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.lngLat.lng, e.lngLat.lat]
            },
            properties: {
              id: String(new Date().getTime())
            }
          };
          geojson.features.push(point);
        }

        if (geojson.features.length > 1) {
          linestring.geometry.coordinates = geojson.features.map(
            (point) => point.geometry.coordinates
          );
          geojson.features.push(linestring);
          // Populate the distanceContainer with total distance
          const value = document.createElement('pre');
          const distance = turf.length(linestring);
          value.textContent = `距离: ${distance.toLocaleString()}km`;
          distanceContainer.appendChild(value);
        }
        this.map.getSource('geojson').setData(geojson);
      };
      this.map.on('click', this.measureDistancesFunc);
    });
  }

  removeDistances(): void {
    // 移除测距函数的事件
    this.map.off('click', this.measureDistancesFunc);
    this.map.removeLayer('measure-points'); // 删除图层
    this.map.removeLayer('measure-lines'); // 删除图层
    this.map.removeSource('geojson'); // 从地图样式中移除数据源
  }

  /**
   * 绘制多边形
   * */
  mapboxDraw(): void {
    const updateArea = (e) => {
      const data = this.draw.getAll();
      const answer = document.getElementById('calculated-area');
      if (data.features.length > 0) {
        const area = turf.area(data);
        // Restrict the area to 2 decimal points.
        const roundedArea = Math.round(area * 100) / 100;
        answer.innerHTML = `<p><strong>${roundedArea}</strong></p><p>square meters</p>`;
      } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete') {
          alert('Click the map to draw a polygon.');
        }
      }
    };
    this.map.on('draw.create', updateArea);
    this.map.on('draw.delete', updateArea);
    this.map.on('draw.update', updateArea);
  }
}
