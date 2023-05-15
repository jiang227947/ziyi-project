import {Injectable} from '@angular/core';
import {MenuModel} from '../../core-module/model/menu.model';
import {UserRoleEnum} from '../enum/user.enum';

@Injectable()
export class AppMenuService {

  constructor() {
  }

  /**
   * 返回主菜单
   * todo 后续可配合权限接口查询
   */
  static getAppMenu(): MenuModel[] {
    return [
      // 首页
      {
        menuId: '1',
        menuName: '首页',
        menuLevel: 1,
        menuHref: '/main/index',
        imageUrl: '',
        icon: 'home',
        isShow: true,
        isSelected: false,
        children: []
      },
      // 地图
      {
        menuId: '2',
        menuName: '地图',
        menuLevel: 1,
        menuHref: '/main/map',
        imageUrl: '',
        icon: 'send',
        isShow: true,
        isSelected: false,
        children: [
          {
            menuId: '2-1',
            parentMenuId: '2',
            menuName: '高德地图',
            menuLevel: 2,
            menuHref: '/main/map/aMap',
            imageUrl: '../../../assets/icon/ico/amap.ico',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-2',
            parentMenuId: '2',
            menuName: '百度地图',
            menuLevel: 2,
            menuHref: '/main/map/bMap',
            imageUrl: '../../../assets/icon/ico/bmap.ico',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-3',
            parentMenuId: '2',
            menuName: 'MapBox',
            menuLevel: 2,
            menuHref: '/main/map/mapBox',
            imageUrl: '../../../assets/icon/ico/mapBox.ico',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-4',
            parentMenuId: '2',
            menuName: '谷歌地图',
            menuLevel: 2,
            menuHref: '/main/map/gMap',
            imageUrl: '../../../assets/icon/ico/gmap.png',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-5',
            parentMenuId: '2',
            menuName: 'leaflet地图',
            menuLevel: 2,
            menuHref: '/main/map/leafletMap',
            imageUrl: '../../../assets/icon/ico/leaflet.ico',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-6',
            parentMenuId: '2',
            menuName: 'bing地图',
            menuLevel: 2,
            menuHref: '/main/map/bingMap',
            imageUrl: '../../../assets/icon/ico/bing.ico',
            isShow: true,
            isSelected: false,
            children: []
          }
        ]
      },
      // MxDraw CAD
      // {
      //   menuId: '3',
      //   menuName: 'MxDraw CAD',
      //   menuLevel: 1,
      //   menuHref: '/main/cad',
      //   imageUrl: '../../../assets/icon/ico/mxcad.ico',
      //   isShow: true,
      //   isSelected: false,
      //   children: []
      // },
      // 和风天气
      {
        menuId: '4',
        menuName: '和风天气',
        menuLevel: 1,
        menuHref: '/main/weather',
        imageUrl: '../../../assets/icon/ico/weather.ico',
        isShow: true,
        isSelected: false,
        children: []
      },
      // WebGl学习
      {
        menuId: '5',
        menuName: 'Webgl学习',
        menuLevel: 1,
        menuHref: '/main/webgl',
        icon: 'codepen',
        isShow: true,
        isSelected: false,
        children: [
          {
            menuId: '5-1',
            parentMenuId: '5',
            menuName: 'Webgl',
            menuLevel: 2,
            menuHref: '/main/webgl/webgl',
            imageUrl: '../../../assets/icon/ico/webgl.png',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '5-2',
            parentMenuId: '5',
            menuName: 'Qunee',
            menuLevel: 2,
            menuHref: '/main/webgl/qunee',
            icon: 'apartment',
            isShow: true,
            isSelected: false,
            children: []
          },
        ]
      },
      // Tool快捷工具
      {
        menuId: '6',
        menuName: '快捷工具',
        menuLevel: 1,
        menuHref: '/main/tool',
        icon: 'tool',
        isShow: true,
        isSelected: false,
        children: [
          {
            menuId: '6-1',
            parentMenuId: '6',
            menuName: '数据转换',
            menuLevel: 2,
            menuHref: '/main/tool/conversion',
            icon: 'percentage',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '6-2',
            parentMenuId: '6',
            menuName: '在线Excel',
            menuLevel: 2,
            menuHref: '/main/tool/luckysheet',
            icon: 'file-excel',
            isShow: true,
            isSelected: false,
            children: []
          },
        ]
      },
      // 用户管理
      {
        menuId: '7',
        menuName: '用户管理',
        menuLevel: 1,
        menuHref: '/main/user-management',
        menuRole: [UserRoleEnum.admin],
        icon: 'solution',
        isShow: true,
        isSelected: false,
        children: [
          {
            menuId: '7-1',
            parentMenuId: '7',
            menuName: '用户列表',
            menuLevel: 2,
            menuHref: '/main/user-management/user-list',
            icon: 'team',
            isShow: true,
            isSelected: false,
            children: []
          }
        ]
      },
      // 资源管理
      {
        menuId: '8',
        menuName: '资源管理',
        menuLevel: 1,
        menuHref: '/main/resource-management',
        icon: 'database',
        isShow: true,
        isSelected: false,
        children: [
          {
            menuId: '8-1',
            parentMenuId: '8',
            menuName: '文件列表',
            menuLevel: 2,
            menuHref: '/main/resource-management/file-list',
            icon: 'file-image',
            isShow: true,
            isSelected: false,
            children: []
          }
        ]
      }
    ];
  }

  /**
   * 隐藏路由
   * todo 后续可配合权限接口查询
   */
  static hiddenMenu(): MenuModel[] {
    return [
      {
        menuId: '0',
        menuName: '个人中心',
        menuLevel: 1,
        menuHref: '/main/account-center',
        imageUrl: '',
        icon: 'user',
        isShow: false,
        isSelected: false,
        children: []
      }
    ];
  }
}
