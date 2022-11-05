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

  isCollapsed = false;
  menuList: MenuModel[];
  userName: string;

  constructor(private router: Router, private $http: HttpClient, private $message: NzMessageService) {
  }

  ngOnInit(): void {
    const menu = localStorage.getItem('app_menu');
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      this.userName = JSON.parse(userInfo).userName;
      this.menuList = JSON.parse(menu);
    } else {
      localStorage.clear();
      this.router.navigate(['/login']);
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
    const userInfo: User = JSON.parse(localStorage.getItem('user_info'));
    this.$http.post(`${environment.LOCAL}/loginOut`, {id: userInfo.id}).subscribe((result: Result<any>) => {
      if (result.code === 200) {
        localStorage.clear();
        this.$message.success(result.msg);
        this.router.navigate(['/login']);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
