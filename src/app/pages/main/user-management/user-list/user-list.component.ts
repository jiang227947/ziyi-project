import {Component, OnInit} from '@angular/core';
import {User} from '../../../../shared-module/interface/user';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment.prod';
import {Result} from '../../../../shared-module/interface/result';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  // 列表加载状态
  loading = false;
  // 用户列表
  userList: User[] = [];

  constructor(private $http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.$http.get(`${environment.API_URL}/listUser`).subscribe((result: Result<User[]>) => {
      if (result.code === 200) {
        this.userList = result.data;
      } else {

      }
      this.loading = false;
    });
  }

  // 新增用户
  addUser(): void {
    this.router.navigate(['/main/user-management/user-list/add']);
  }
}
