import {Component, OnInit} from '@angular/core';
import {MenuModel} from '../../core-module/model/menu.model';
import {Router} from '@angular/router';
import {User} from '../../shared-module/interface/user';
import {NzMessageService} from 'ng-zorro-antd/message';
import {LoginRequestService} from '../../core-module/api-service';
import {SessionUtil} from '../../shared-module/util/session-util';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [LoginRequestService]
})
export class MainComponent implements OnInit {

  // 菜单展开变量
  isCollapsed = false;
  // 菜单List
  menuList: MenuModel[];
  // 用户名称
  userName: string;
  // 头像
  avatar: string;
  // 搜索路由值
  searchMenuValue: string;
  // 搜索结果option
  menuOption: { url: string; text: string }[] = [];

  constructor(private router: Router, private $message: NzMessageService,
              private loginRequestService: LoginRequestService) {
  }

  ngOnInit(): void {
    /*document.addEventListener('visibilitychange', () => {
      const isHidden = document.hidden;
      console.log(isHidden);
      if (isHidden) {
        // 页面隐藏
      } else {
        // 页面聚焦
      }
    });*/
    const userInfo: User = SessionUtil.getUserInfo();
    if (userInfo) {
      this.userName = userInfo.userName;
      this.avatar = `https://www.evziyi.top${userInfo.avatar}`;
      this.menuList = SessionUtil.getMenuList();
    } else {
      SessionUtil.clearUserLocal();
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
      if (item.menuName.includes(value.toUpperCase() || value.toLowerCase())) {
        this.menuOption.push({url: item.menuHref, text: item.menuName});
      }
      if (item.children.length > 0) {
        item.children.forEach((itemChildren: MenuModel) => {
          if (itemChildren.menuName.includes(value.toUpperCase() || value.toLowerCase())) {
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

  /**
   * 个人中心
   */
  updateUser(): void {
    this.router.navigate(['/main/account-center']);
  }

  // 退出登录
  logout(): void {
    this.$message.success('退出成功', {nzDuration: 1000});
    SessionUtil.clearUserLocal();
    this.router.navigate(['/login']);
    // const userInfo: User = SessionUtil.getUserInfo();
    // this.loginRequestService.logout(userInfo.id).subscribe((result: Result<any>) => {
    //   if (result.code === 200) {
    //     this.$message.success(result.msg, {nzDuration: 1000});
    //     SessionUtil.clearUserLocal();
    //     this.router.navigate(['/login']);
    //   } else {
    //     this.$message.error(result.msg);
    //   }
    // });
  }
}
