import {Component, OnInit} from '@angular/core';
import {User} from '../../../../shared-module/interface/user';
import {Result} from '../../../../shared-module/interface/result';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UserManagementRequestService} from '../../../../core-module/api-service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {PageParams} from '../../../../shared-module/interface/pageParms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  // 列表加载状态
  loading = false;
  // 分页参数
  pageParams = new PageParams();
  // 用户列表
  userList: User[] = [];
  role: string;

  constructor(private router: Router, private $message: NzMessageService,
              private userManagementRequestService: UserManagementRequestService) {
  }

  ngOnInit(): void {
    this.role = SessionUtil.getRoleId();
    this.loading = true;
    this.userManagementRequestService.getUserList(this.pageParams).subscribe((result: Result<User[]>) => {
      if (result.code === 200) {
        this.userList = result.data;
      } else {
        this.$message.error(result.msg);
      }
      this.loading = false;
    });
  }

  // 新增用户
  addUser(): void {
    this.router.navigate(['/main/user-management/user-list/add']);
  }
}
