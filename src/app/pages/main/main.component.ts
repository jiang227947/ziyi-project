import {Component, OnInit} from '@angular/core';
import {MenuModel} from '../../core-module/model/menu.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isCollapsed = false;
  menuList: MenuModel[];
  userName: string;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const menu = localStorage.getItem('app_menu');
    const userInfo = localStorage.getItem('user_info');
    if (userInfo && menu) {
      this.userName = JSON.parse(userInfo).name;
      this.menuList = JSON.parse(menu);
    } else {
      this.logout();
    }
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

  // 退出
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
