import {Component, OnInit} from '@angular/core';
import {User} from '../../../../shared-module/interface/user';
import {Result} from '../../../../shared-module/interface/result';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UserManagementRequestService} from '../../../../core-module/api-service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {PageParams} from '../../../../shared-module/interface/pageParms';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  // 列表加载状态
  loading: boolean = false;
  // 分页参数
  pageParams = new PageParams();
  // 用户列表
  userList: User[] = [];
  dataTotal: number = 0;
  role: string;

  constructor(private router: Router, private $message: NzMessageService,
              private userManagementRequestService: UserManagementRequestService) {
  }

  ngOnInit(): void {
    this.role = SessionUtil.getRoleId();
    this.queryUserList();
  }

  // 查询用户列表
  queryUserList(): void {
    this.loading = true;
    this.userManagementRequestService.getUserList(this.pageParams).subscribe((result: Result<User[]>) => {
      if (result.code === 200) {
        this.userList = result.data;
        this.dataTotal = result.totalCount;
      } else {
        this.$message.error(result.msg);
      }
      this.loading = false;
    }, (error: HttpErrorResponse) => {
      this.loading = false;
      this.$message.error(error.message);
    });
  }

  // 删除用户
  deleteUser(id: number): void {
    if (id === SessionUtil.getUserId()) {
      this.$message.error('无法删除自己');
      return;
    }
    this.userManagementRequestService.deleteUser(id).subscribe((result: Result<void>) => {
      if (result.code === 200) {
        this.$message.success(result.msg);
        this.queryUserList();
      } else {
        this.$message.error(result.msg);
      }
    }, (error: HttpErrorResponse) => {
      this.$message.error(error.message);
    });
  }

  pageIndexChange(pageNum: number): void {
    this.pageParams.pageNum = pageNum;
    this.queryUserList();
  }

  pageSizeChange(pageSize: number): void {
    this.pageParams.pageSize = pageSize;
    this.queryUserList();
  }

  // 新增用户
  addUser(): void {
    this.router.navigate(['/main/user-management/user-list/add']);
  }
}
