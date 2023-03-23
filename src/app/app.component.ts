import {Component} from '@angular/core';
import {AppMenuService} from './shared-module/service/app-menu.service';
import {MenuModel} from './core-module/model/menu.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppMenuService]
})
export class AppComponent {

  isCollapsed = false;
  menuList: MenuModel[];

  constructor() {
  }

  menuitemClick(menuItem: MenuModel): void {
    this.menuList.forEach(item => {
      if (item.menuId !== menuItem.menuId && item.isSelected) {
        // 其他节点关闭选选中
        item.isSelected = false;
      } else if (item.menuId === menuItem.menuId) {
        // 当前节点选中
        item.isSelected = true;
      }
    });
    localStorage.setItem('app_menu', JSON.stringify(this.menuList));
  }
}
