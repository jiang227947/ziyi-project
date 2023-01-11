import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GoogleMapLoaderService} from '../service/google-map-loader.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MarkerClusterer, MarkerClustererOptions} from '@googlemaps/markerclusterer';
import Marker = google.maps.Marker;
import {MapComponent} from '../map/map.component';
import {EMapType} from '../../../../shared-module/enum/map-enum';

@Component({
  selector: 'app-g-map',
  templateUrl: './g-map.component.html',
  styleUrls: ['./g-map.component.scss'],
  providers: [GoogleMapLoaderService]
})
export class GMapComponent extends MapComponent implements OnInit, AfterViewInit {

  googleMap: google.maps.Map; // 谷歌地图实体

  constructor(private googleMapLoader: GoogleMapLoaderService,
              private modal: NzModalService) {
    super();
  }

  ngOnInit(): void {
    const data = [
      [{
        '114.314191,30.596339': {
          address: '汉口江滩——湖北省武汉市江岸区沿江大道',
          areaCode: '001',
          areaId: 'AHCgF3FvTBHFrATY6v0',
          areaInfo: {
            areaId: 'AHCgF3FvTBHFrATY6v0',
            areaCode: '001',
            level: 1,
            areaName: 'defaultArea[YXj2UJJJIJFKTkQbkyr]',
            provinceName: '',
            cityName: '',
            districtName: '',
            address: null,
            accountabilityUnit: null,
            accountabilityUnitCodes: null,
            accountabilityUnitName: '',
            remarks: '',
            createTime: '2022-05-25T07:07:17.000+0000',
            parentId: null,
            createUser: '1',
            updateTime: '2022-05-26T06:30:04.000+0000',
            isDeleted: '0',
            tenantId: null,
            updateUser: '',
            areaAndPrentName: null,
            parentName: null,
            hasChild: false,
            hasPermissions: null
          },
          assetNumbers: 'FiberhomeDP461D(G)65535-2204091353070983',
          businessStatus: null,
          cityName: '',
          company: null,
          createTime: '2022-05-25T09:24:37.000+0000',
          createUser: '1',
          departmentName: null,
          deployStatus: '0',
          deptCode: null,
          deviceCode: null,
          deviceCount: null,
          deviceId: 'uYFIip6l9PJpctterC5',
          deviceIdList: null,
          deviceModel: 'FiberhomeDP461D(G)65535',
          deviceName: '4-16测试',
          deviceStatus: '1',
          deviceType: 'D008',
          districtName: '',
          equipmentQuantity: 0,
          gatewayId: null,
          installationDate: null,
          isDeleted: 0,
          isDepartmentName: null,
          isTrouble: null,
          otherSystemNumber: null,
          portInfos: null,
          positionBase: '114.314191,30.596339',
          positionGps: '114.314191,30.596339',
          productId: null,
          projectId: null,
          projectName: null,
          provinceName: '',
          remarks: '这是备注',
          rowNum: null,
          scrapTime: null,
          selectType: null,
          specificFieldId: null,
          statusPriorityUp: null,
          supplier: null,
          supplierId: null,
          tenantId: null,
          updateTime: '2022-05-25T09:24:37.000+0000',
          updateUser: '1',
          xposition: null,
          yposition: null
        },
        '114.31158155,30.5132667': {
          address: '汉口江滩——湖北省武汉市江岸区沿江大道耶尔夜夜夜夜',
          areaCode: '002',
          areaId: 'AHCgF3FvTBHFrATY6v0',
          areaInfo: {
            accountabilityUnit: null,
            accountabilityUnitCodes: null,
            accountabilityUnitName: '',
            address: null,
            areaAndPrentName: null,
            areaCode: '002',
            areaId: 'AHCgF3FvTBHFrATY6v0',
            areaName: 'defaultArea[YXj2UJJJIJFKTkQbkyr]',
            cityName: '',
            createTime: '2022-05-25T07:07:17.000+0000',
            createUser: '1',
            districtName: '',
            hasChild: false,
            hasPermissions: null,
            isDeleted: '0',
            level: 1,
            parentId: null,
            parentName: null,
            provinceName: '',
            remarks: '',
            tenantId: null,
            updateTime: '2022-05-26T06:30:04.000+0000',
            updateUser: ''
          },
          assetNumbers: 'FiberhomeDP461A(S)65534-2204091353070984',
          businessStatus: null,
          cityName: '',
          company: null,
          createTime: '2022-05-26T05:41:29.000+0000',
          createUser: '1',
          departmentName: null,
          deployStatus: '0',
          deptCode: null,
          deviceCode: null,
          deviceCount: null,
          deviceId: 'PI8lOTUE5EIEvzeoFB2',
          deviceIdList: null,
          deviceModel: 'FiberhomeDP461A(S)65534',
          deviceName: '4-16测试22222',
          deviceStatus: '1',
          deviceType: 'D008',
          districtName: '',
          equipmentQuantity: 0,
          gatewayId: null,
          installationDate: null,
          isDeleted: 0,
          isDepartmentName: null,
          isTrouble: null,
          otherSystemNumber: null,
          portInfos: null,
          positionBase: '114.31158155,30.5132667',
          positionGps: '114.31158155,30.5132667',
          productId: null,
          projectId: null,
          projectName: null,
          provinceName: '',
          remarks: '这是备注555555555555555',
          rowNum: null,
          scrapTime: null,
          selectType: null,
          specificFieldId: null,
          statusPriorityUp: null,
          supplier: null,
          supplierId: null,
          tenantId: null,
          updateTime: '2022-05-26T05:41:39.000+0000',
          updateUser: '1',
          xposition: null,
          yposition: null
        }
      }],
      [{
        '114.41158155,30.6984667': {
          address: '汉口江滩——湖北省武汉市江岸区沿江大道耶尔夜夜夜夜',
          areaCode: '003',
          areaId: 'AHCgF3FvTBHFrATY6v0',
          areaInfo: {
            accountabilityUnit: null,
            accountabilityUnitCodes: null,
            accountabilityUnitName: '',
            address: null,
            areaAndPrentName: null,
            areaCode: '001',
            areaId: 'AHCgF3FvTBHFrATY6v0',
            areaName: 'defaultArea[YXj2UJJJIJFKTkQbkyr]',
            cityName: '',
            createTime: '2022-05-25T07:07:17.000+0000',
            createUser: '1',
            districtName: '',
            hasChild: false,
            hasPermissions: null,
            isDeleted: '0',
            level: 1,
            parentId: null,
            parentName: null,
            provinceName: '',
            remarks: '',
            tenantId: null,
            updateTime: '2022-05-26T06:30:04.000+0000',
            updateUser: ''
          },
          assetNumbers: 'FiberhomeDP461A(S)65534-2204091353070984',
          businessStatus: null,
          cityName: '',
          company: null,
          createTime: '2022-05-26T05:41:29.000+0000',
          createUser: '1',
          departmentName: null,
          deployStatus: '0',
          deptCode: null,
          deviceCode: null,
          deviceCount: null,
          deviceId: 'PI8lOTUE5EIEvzeoFB2',
          deviceIdList: null,
          deviceModel: 'FiberhomeDP461A(S)65534',
          deviceName: '4-16测试22222',
          deviceStatus: '1',
          deviceType: 'D008',
          districtName: '',
          equipmentQuantity: 0,
          gatewayId: null,
          installationDate: null,
          isDeleted: 0,
          isDepartmentName: null,
          isTrouble: null,
          otherSystemNumber: null,
          portInfos: null,
          positionBase: '114.41158155,30.6984667',
          positionGps: '114.41158155,30.6984667',
          productId: null,
          projectId: null,
          projectName: null,
          provinceName: '',
          remarks: '这是备注555555555555555',
          rowNum: null,
          scrapTime: null,
          selectType: null,
          specificFieldId: null,
          statusPriorityUp: null,
          supplier: null,
          supplierId: null,
          tenantId: null,
          updateTime: '2022-05-26T05:41:39.000+0000',
          updateUser: '1',
          xposition: null,
          yposition: null
        }
      }],
      [{
        '114.32258155,30.1384667': {
          address: '汉口江滩——湖北省武汉市江岸区沿江大道耶尔夜夜夜夜',
          areaCode: '004',
          areaId: 'AHCgF3FvTBHFrATY6v0',
          areaInfo: {
            accountabilityUnit: null,
            accountabilityUnitCodes: null,
            accountabilityUnitName: '',
            address: null,
            areaAndPrentName: null,
            areaCode: '001',
            areaId: 'AHCgF3FvTBHFrATY6v0',
            areaName: 'defaultArea[YXj2UJJJIJFKTkQbkyr]',
            cityName: '',
            createTime: '2022-05-25T07:07:17.000+0000',
            createUser: '1',
            districtName: '',
            hasChild: false,
            hasPermissions: null,
            isDeleted: '0',
            level: 1,
            parentId: null,
            parentName: null,
            provinceName: '',
            remarks: '',
            tenantId: null,
            updateTime: '2022-05-26T06:30:04.000+0000',
            updateUser: ''
          },
          assetNumbers: 'FiberhomeDP461A(S)65534-2204091353070984',
          businessStatus: null,
          cityName: '',
          company: null,
          createTime: '2022-05-26T05:41:29.000+0000',
          createUser: '1',
          departmentName: null,
          deployStatus: '0',
          deptCode: null,
          deviceCode: null,
          deviceCount: null,
          deviceId: 'PI8lOTUE5EIEvzeoFB2',
          deviceIdList: null,
          deviceModel: 'FiberhomeDP461A(S)65534',
          deviceName: '4-16测试22222',
          deviceStatus: '1',
          deviceType: 'D008',
          districtName: '',
          equipmentQuantity: 0,
          gatewayId: null,
          installationDate: null,
          isDeleted: 0,
          isDepartmentName: null,
          isTrouble: null,
          otherSystemNumber: null,
          portInfos: null,
          positionBase: '114.32258155,30.1384667',
          positionGps: '114.32258155,30.1384667',
          productId: null,
          projectId: null,
          projectName: null,
          provinceName: '',
          remarks: '这是备注555555555555555',
          rowNum: null,
          scrapTime: null,
          selectType: null,
          specificFieldId: null,
          statusPriorityUp: null,
          supplier: null,
          supplierId: null,
          tenantId: null,
          updateTime: '2022-05-26T05:41:39.000+0000',
          updateUser: '1',
          xposition: null,
          yposition: null
        }
      }],
      [{
        '114.21158155,30.1984667': {
          address: '汉口江滩——湖北省武汉市江岸区沿江大道耶尔夜夜夜夜',
          areaCode: '005',
          areaId: 'AHCgF3FvTBHFrATY6v0',
          areaInfo: {
            accountabilityUnit: null,
            accountabilityUnitCodes: null,
            accountabilityUnitName: '',
            address: null,
            areaAndPrentName: null,
            areaCode: '001',
            areaId: 'AHCgF3FvTBHFrATY6v0',
            areaName: 'defaultArea[YXj2UJJJIJFKTkQbkyr]',
            cityName: '',
            createTime: '2022-05-25T07:07:17.000+0000',
            createUser: '1',
            districtName: '',
            hasChild: false,
            hasPermissions: null,
            isDeleted: '0',
            level: 1,
            parentId: null,
            parentName: null,
            provinceName: '',
            remarks: '',
            tenantId: null,
            updateTime: '2022-05-26T06:30:04.000+0000',
            updateUser: ''
          },
          assetNumbers: 'FiberhomeDP461A(S)65534-2204091353070984',
          businessStatus: null,
          cityName: '',
          company: null,
          createTime: '2022-05-26T05:41:29.000+0000',
          createUser: '1',
          departmentName: null,
          deployStatus: '0',
          deptCode: null,
          deviceCode: null,
          deviceCount: null,
          deviceId: 'PI8lOTUE5EIEvzeoFB2',
          deviceIdList: null,
          deviceModel: 'FiberhomeDP461A(S)65534',
          deviceName: '4-16测试22222',
          deviceStatus: '1',
          deviceType: 'D008',
          districtName: '',
          equipmentQuantity: 0,
          gatewayId: null,
          installationDate: null,
          isDeleted: 0,
          isDepartmentName: null,
          isTrouble: null,
          otherSystemNumber: null,
          portInfos: null,
          positionBase: '114.21158155,30.1984667',
          positionGps: '114.21158155,30.1984667',
          productId: null,
          projectId: null,
          projectName: null,
          provinceName: '',
          remarks: '这是备注555555555555555',
          rowNum: null,
          scrapTime: null,
          selectType: null,
          specificFieldId: null,
          statusPriorityUp: null,
          supplier: null,
          supplierId: null,
          tenantId: null,
          updateTime: '2022-05-26T05:41:39.000+0000',
          updateUser: '1',
          xposition: null,
          yposition: null
        }
      }],
      [{
        '114.12358155,30.8884667': {
          address: '汉口江滩——湖北省武汉市江岸区沿江大道耶尔夜夜夜夜',
          areaCode: '006',
          areaId: 'AHCgF3FvTBHFrATY6v0',
          areaInfo: {
            accountabilityUnit: null,
            accountabilityUnitCodes: null,
            accountabilityUnitName: '',
            address: null,
            areaAndPrentName: null,
            areaCode: '001',
            areaId: 'AHCgF3FvTBHFrATY6v0',
            areaName: 'defaultArea[YXj2UJJJIJFKTkQbkyr]',
            cityName: '',
            createTime: '2022-05-25T07:07:17.000+0000',
            createUser: '1',
            districtName: '',
            hasChild: false,
            hasPermissions: null,
            isDeleted: '0',
            level: 1,
            parentId: null,
            parentName: null,
            provinceName: '',
            remarks: '',
            tenantId: null,
            updateTime: '2022-05-26T06:30:04.000+0000',
            updateUser: ''
          },
          assetNumbers: 'FiberhomeDP461A(S)65534-2204091353070984',
          businessStatus: null,
          cityName: '',
          company: null,
          createTime: '2022-05-26T05:41:29.000+0000',
          createUser: '1',
          departmentName: null,
          deployStatus: '0',
          deptCode: null,
          deviceCode: null,
          deviceCount: null,
          deviceId: 'PI8lOTUE5EIEvzeoFB2',
          deviceIdList: null,
          deviceModel: 'FiberhomeDP461A(S)65534',
          deviceName: '4-16测试22222',
          deviceStatus: '1',
          deviceType: 'D008',
          districtName: '',
          equipmentQuantity: 0,
          gatewayId: null,
          installationDate: null,
          isDeleted: 0,
          isDepartmentName: null,
          isTrouble: null,
          otherSystemNumber: null,
          portInfos: null,
          positionBase: '114.12358155,30.8884667',
          positionGps: '114.12358155,30.8884667',
          productId: null,
          projectId: null,
          projectName: null,
          provinceName: '',
          remarks: '这是备注555555555555555',
          rowNum: null,
          scrapTime: null,
          selectType: null,
          specificFieldId: null,
          statusPriorityUp: null,
          supplier: null,
          supplierId: null,
          tenantId: null,
          updateTime: '2022-05-26T05:41:39.000+0000',
          updateUser: '1',
          xposition: null,
          yposition: null
        }
      }]
    ];
  }

  ngAfterViewInit(): void {
    this.loadGoogleMap();
  }

  /**
   * 加载地图
   * */
  loadGoogleMap(): void {
    this.mapLoadType = this.mapLoadTypeEnum.loading;
    this.googleMapLoader.load().then(() => {
      this.googleMap = new google.maps.Map(this.googleMapElement.nativeElement, {
        center: {lat: +this.mapLat, lng: +this.mapLng},
        zoom: this.mapZoom,
        mapTypeControl: true, // 地图类型控件
        panControl: true, // 平移控件
        rotateControl: true, // 旋转控件
        scaleControl: true, // 渲染比例控件
        streetViewControl: true, // 街景控件
        fullscreenControl: true // 全屏控件
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.mapZoom = 12;
            console.log('定位经纬度：', pos);
            this.googleMap.setCenter({lat: -31.56391, lng: 149.154312}); // 定位位置
            this.googleMap.setZoom(this.mapZoom); // 修改缩放等级
            this.markerClustererFunc();
          },
          () => {
            this.modal.create({
              nzTitle: '提示',
              nzContent: '获取当前位置失败',
              nzCancelText: null
            });
          }
        );
      } else {
        // Browser doesn't support Geolocation
        this.modal.create({
          nzTitle: '提示',
          nzContent: '当前浏览器不支持定位，请更换浏览器',
          nzCancelText: null
        });
      }
      this.mapLoadType = this.mapLoadTypeEnum.done;
      this.mapType = EMapType.google;
    }, () => {
      this.mapLoadType = this.mapLoadTypeEnum.error;
      this.modal.create({
        nzTitle: '提示',
        nzContent: '谷歌地图加载失败，请检查网络',
        nzCancelText: null
      });
    });
  }

  /**
   * 使用MarkerClusterer实现点聚合
   * https://developers.google.com/maps/documentation/javascript/marker-clustering
   * */
  markerClustererFunc(): void {
    const locations = [
      {lat: -31.56391, lng: 147.154312},
      {lat: -33.718234, lng: 150.363181},
      {lat: -33.727111, lng: 150.371124},
      {lat: -33.848588, lng: 151.209834},
      {lat: -33.851702, lng: 151.216968},
      {lat: -34.671264, lng: 150.863657},
      {lat: -35.304724, lng: 148.662905},
      {lat: -36.817685, lng: 175.699196},
      {lat: -36.828611, lng: 175.790222},
      {lat: -37.75, lng: 145.116667},
      {lat: -37.759859, lng: 145.128708},
      {lat: -37.765015, lng: 145.133858},
      {lat: -37.770104, lng: 145.143299},
      {lat: -37.7737, lng: 145.145187},
      {lat: -37.774785, lng: 145.137978},
      {lat: -37.819616, lng: 144.968119},
      {lat: -38.330766, lng: 144.695692},
      {lat: -39.927193, lng: 175.053218},
      {lat: -41.330162, lng: 174.865694},
      {lat: -42.734358, lng: 147.439506},
      {lat: -42.734358, lng: 147.501315},
      {lat: -42.735258, lng: 147.438},
      {lat: -43.999792, lng: 170.463352},
    ];
    // 创建Marker点集合
    this.markers = locations.map((position, i) => {
      // 创建Marker点
      const marker: Marker = new google.maps.Marker({
        draggable: true, // 是否允许拖动
        label: {
          text: i + '',
          fontSize: '20px'
        },
        position
      });
      // 给标记点添加事件，点击标记点打开信息窗口
      marker.addListener('click', () => {
        infoWindow.open(this.googleMap, marker);
        this.googleMap.panTo(marker.getPosition());
      });
      // 给标记点添加拖拽事件，拖拽结束定位到位置并删除拖拽事件
      const dragend = marker.addListener('dragend', () => {
        this.googleMap.panTo(marker.getPosition());
        // 删除拖拽事件
        google.maps.event.removeListener(dragend);
      });
      return marker;
    });
    // 创建一个信息窗口
    const infoWindow = new google.maps.InfoWindow({
      content: 'contentTxt'
    });
    // 给地图添加点击事件
    this.googleMap.addListener('click', () => {
      // 如果信息窗口打开 则关闭信息窗口
      if (infoWindow) {
        infoWindow.close();
      }
    });
    // 给地图添加拖拽事件
    this.googleMap.addListener('dragstart', () => {
      // 如果信息窗口打开 则关闭信息窗口
      if (infoWindow) {
        infoWindow.close();
      }
    });
    /*
    styles: [{
        url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
        height: 50,
        width: 50,
        fontStyle: '#FFFFFF',
        anchorText: [20, 1]
      }]
    * */
    const mcOptions: MarkerClustererOptions = {
      map: this.googleMap,
      markers: this.markers
    };
    this.markerClusterer = new MarkerClusterer(mcOptions);
  }

  /**
   * 绘图库
   * https://developers.google.com/maps/documentation/javascript/drawinglayer?hl=en
   * */
  DrawingManager(): void {
    /**
     * 绘图库
     * https://developers.google.com/maps/documentation/javascript/drawinglayer
     */
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true, // 是否显示工具
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER, // 工具位置
        drawingModes: [ // 工具类型
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      markerOptions: {draggable: true}, // 点属性
      circleOptions: {
        fillColor: '#abcdef',
        editable: true
      }, // 圆属性
      polygonOptions: {
        fillColor: '#abcdef',
        editable: true
      }, // 多边形属性
      polylineOptions: {editable: true}, // 折线属性
      rectangleOptions: {
        fillColor: '#abcdef',
        editable: true
      } // 矩形属性
    });
    drawingManager.setMap(this.googleMap); // 渲染
  }

  /**
   * 自定义控件
   * https://developers.google.com/maps/documentation/javascript/examples/control-custom
   */
  AddControl(): void {
    // Set CSS for the control interior.
    const controlText = document.createElement('div');
    const controlDiv = document.createElement('div');
    // Set CSS for the control border.
    const controlUI = document.createElement('div');

    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '自定义控件按钮';

    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '8px';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = '自定义控件按钮';
    controlUI.appendChild(controlText);
    controlDiv.appendChild(controlUI);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', () => {
      alert('自定义控件Click触发');
    });
    this.googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
  }

  /**
   * 地面覆盖
   * https://developers.google.com/maps/documentation/javascript/examples/groundoverlay-simple
   */
  GroundOverlay(): void {
    const imageBounds = {
      north: 40.773941,
      south: 40.712216,
      east: -74.12544,
      west: -74.22655,
    };

    const historicalOverlay = new google.maps.GroundOverlay(
      '../../assets/baoman.jpg', // 图片地址
      imageBounds // 图片位置
    );
    historicalOverlay.setMap(this.googleMap);
  }

  /**
   * SVG矢量图形符号标记
   */
  SVGOverlay(): void {
    const svgMarker = {
      path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
      fillColor: 'blue',
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };

    new google.maps.Marker({
      position: this.googleMap.getCenter(),
      icon: svgMarker,
      map: this.googleMap
    });
  }

  /**
   * 数据层
   */
  Geometry(): void {
    // 定义外部路径的LatLng坐标
    const outerCoords = [
      {lat: -32.364, lng: 153.207}, // north west
      {lat: -35.364, lng: 153.207}, // south west
      {lat: -35.364, lng: 158.207}, // south east
      {lat: -32.364, lng: 158.207} // north east
    ];

    // 定义内部路径的LatLng坐标
    const innerCoords1 = [
      {lat: -33.364, lng: 154.207},
      {lat: -34.364, lng: 154.207},
      {lat: -34.364, lng: 155.207},
      {lat: -33.364, lng: 155.207}
    ];

    // 为另一个内部路径定义LatLng坐标
    const innerCoords2 = [
      {lat: -33.364, lng: 156.207},
      {lat: -34.364, lng: 156.207},
      {lat: -34.364, lng: 157.207},
      {lat: -33.364, lng: 157.207}
    ];
    // 使用GeoJson渲染Google文字
    this.googleMap.data.loadGeoJson(
      'https://storage.googleapis.com/mapsdevsite/json/google.json'
    );
    // 添加多边形数据层
    this.googleMap.data.add({
      geometry: new google.maps.Data.Polygon([
        outerCoords,
        innerCoords1,
        innerCoords2,
      ]),
    });
  }

  /**
   * 距离服务 需要收费 暂时搁置
   */
  distanceMatrixService(): void {
    const origin1 = new google.maps.LatLng(55.930385, -3.118425);
    const origin2 = 'Greenwich, England';
    const destinationA = 'Stockholm, Sweden';
    const destinationB = new google.maps.LatLng(50.087692, 14.421150);

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING
      }, (response, status) => {
        // See Parsing the Results for
        // the basics of a callback function.
        console.log(response);
      });

  }

  /**
   * Google Drive 获取KML文件链接
   * 上传完文件之后，右键获取链接，条件设置为知道链接的任何人，复制链接地址并修改格式
   * 例如：
   * https://drive.google.com/file/d/1FF1Vbm5N4V4T5al52Qi1RTaY6wG9NxOP/view?usp=sharing
   * https://drive.google.com/file/d/1BPXji6CS3ekbTv5ycQikRlE9dsudiQpb/view?usp=sharing
   * 变成：
   * https://drive.google.com/uc?export=download&id=1FF1Vbm5N4V4T5al52Qi1RTaY6wG9NxOP
   * https://drive.google.com/uc?export=download&id=1BPXji6CS3ekbTv5ycQikRlE9dsudiQpb
   */
  KmlLyer(): void {
    const kmlLayer = new google.maps.KmlLayer({
      url: 'https://drive.google.com/uc?export=download&id=1BPXji6CS3ekbTv5ycQikRlE9dsudiQpb',
      map: this.googleMap
    });
    // 给图层添加点击事件
    kmlLayer.addListener('click', (kmlEvent) => {
      console.log('kmlEvent is :', kmlEvent);
    });
  }

  /**
   * 清除覆盖物
   * API V3只能使用循环清除
   */
  clearOverlays(): void {
    // 清除点聚合
    this.markerClusterer.clearMarkers();
    // 循环清除Marker点
    while (this.markers.length) {
      this.markers.pop().setMap(null);
    }
  }
}
