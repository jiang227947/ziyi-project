import {Component, OnInit} from '@angular/core';
import {MenuModel} from '../../core-module/model/menu.model';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Result} from '../../shared-module/interface/result';
import {User} from '../../shared-module/interface/user';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  // 菜单展开变量
  isCollapsed = false;
  // 菜单List
  menuList: MenuModel[];
  // 用户名称
  userName: string;
  // 搜索路由值
  searchMenuValue: string;
  // 搜索结果option
  menuOption: { url: string; text: string }[] = [];

  constructor(private router: Router, private $http: HttpClient, private $message: NzMessageService) {
  }

  ngOnInit(): void {
    const menu = localStorage.getItem('app_menu');
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      this.userName = JSON.parse(userInfo).userName;
      this.menuList = JSON.parse(menu);
    } else {
      localStorage.removeItem('app_menu');
      localStorage.removeItem('user_info');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  menuitemClick(menuItem: MenuModel): void {
    this.menuList.forEach((item: MenuModel) => {
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

  /**
   * 搜索路由
   * */
  searchMenuValueChange(value: string): void {
    if (value === '') {
      this.menuOption = [];
      return;
    }
    this.menuOption = [];
    this.menuList.forEach((item: MenuModel) => {
      if (item.menuName.includes(value)) {
        this.menuOption.push({url: item.menuHref, text: item.menuName});
      }
      if (item.children.length > 0) {
        item.children.forEach((itemChildren: MenuModel) => {
          if (itemChildren.menuName.includes(value)) {
            this.menuOption.push({url: itemChildren.menuHref, text: itemChildren.menuName});
          }
        });
      }
    });
  }

  /**
   * 选择路由
   * */
  optionChange(url: string): void {
    this.menuOption = [];
    this.router.navigate([url]);
  }

  // 退出登录
  logout(): void {
    const userInfo: User = JSON.parse(localStorage.getItem('user_info'));
    this.$http.post(`${environment.API_URL}/loginOut`, {id: userInfo.id}).subscribe((result: Result<any>) => {
      if (result.code === 200) {
        this.$message.success(result.msg, {nzDuration: 1000});
        localStorage.removeItem('app_menu');
        localStorage.removeItem('user_info');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /*前往github*/
  githubLink(): void {
    window.open('https://github.com/jiang227947/Angular-Project', '_blank');
  }
}
