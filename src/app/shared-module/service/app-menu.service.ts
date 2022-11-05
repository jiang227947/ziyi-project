import {Injectable} from '@angular/core';
import {MenuModel} from '../../core-module/model/menu.model';

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
        menuHref: '/main/index',
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
            menuName: 'MapBox',
            menuLevel: 2,
            menuHref: '/main/map/mapBox',
            imageUrl: '../../../assets/icon/ico/mapBox.ico',
            isShow: true,
            isSelected: false,
            children: []
          },
          {
            menuId: '2-3',
            parentMenuId: '2',
            menuName: '谷歌地图',
            menuLevel: 2,
            menuHref: '/main/map/gMap',
            imageUrl: '../../../assets/icon/ico/gmap.png',
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
        menuHref: '/main/cad',
        imageUrl: '../../../assets/icon/ico/mxcad.ico',
        isShow: true,
        isSelected: false,
        children: []
      },
      {
        menuId: '4',
        menuName: '和风天气',
        menuLevel: 1,
        menuHref: '/main/weather',
        imageUrl: '../../../assets/icon/ico/weather.ico',
        isShow: true,
        isSelected: false,
        children: []
      }
    ];
  }

}
