import {Injectable} from '@angular/core';
import {MenuModel} from "../../core-module/model/menu.model";

@Injectable()
export class AppMenuService {

  constructor() {
  }

  /**
   * 返回主菜单
   * todo 后续可配合权限接口查询
   * */
  getAppMenu(): MenuModel[] {
    return [
      {
        menuId: '1',
        menuName: '首页',
        menuLevel: 1,
        menuHref: '/home',
        imageUrl: '',
        icon: 'home',
        isShow: true,
        isSelected: false,
        children: []
      },
      {
        menuId: '2',
        menuName: '地图',
        menuLevel: 1,
        menuHref: '/map',
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
            menuHref: '/map/aMap',
            imageUrl: '../../../assets/icon/amap.ico',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-2',
            parentMenuId: '2',
            menuName: 'MapBox',
            menuLevel: 2,
            menuHref: '/map/mapBox',
            imageUrl: '../../../assets/icon/mapBox.ico',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-3',
            parentMenuId: '2',
            menuName: '谷歌地图',
            menuLevel: 2,
            menuHref: '/map/gMap',
            imageUrl: '../../../assets/icon/gmap.png',
            isShow: true,
            isSelected: false,
            children: []
          }
        ]
      },
      {
        menuId: '3',
        menuName: 'MxDraw CAD',
        menuLevel: 1,
        menuHref: '/cad',
        imageUrl: '../../../assets/icon/mxcad.ico',
        isShow: true,
        isSelected: false,
        children: []
      },
      {
        menuId: '4',
        menuName: '和风天气',
        menuLevel: 1,
        menuHref: '/weather',
        imageUrl: '../../../assets/icon/weather.ico',
        isShow: true,
        isSelected: false,
        children: []
      }
    ];
  }

}
