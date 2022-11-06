import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppMenuService} from '../../../shared-module/service/app-menu.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Result} from '../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';
import {User} from '../../../shared-module/interface/user';
import {format} from 'date-fns';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  // 登录的loading
  loginLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private appMenuService: AppMenuService,
              private $http: HttpClient, private $message: NzMessageService) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      loginName: ['test', [Validators.required, Validators.minLength(3)]],
      password: ['000', [Validators.required, Validators.minLength(3)]],
      remember: [true],
    });
  }

  // 登录
  loginSubmit(): void {
    // 验证表单
    this.loginName.markAsDirty();
    this.loginName.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.loginName.invalid || this.password.invalid) {
      return;
    }
    this.loginLoading = true;
    const messageId = this.$message.loading('登陆中..', {nzDuration: 0}).messageId;
    // 判断记住用户
    const rememberMe: boolean = this.loginForm.controls.remember.value;
    if (rememberMe) {
      localStorage.setItem('rememberMe', this.loginName.value);
    } else {
      localStorage.removeItem('rememberMe');
    }
    const loginInfo = {
      name: this.loginName.value,
      password: this.password.value
    };
    // 用户登录
    this.login(loginInfo, messageId).then((user: any) => {
      if (user) {
        // 查询用户接口
        this.$http.get(`${environment.API_URL}/queryUserById/${user.id}`).subscribe((result: Result<User>) => {
          if (result.code === 200) {
            const userInfo: User = result.data;
            // 用户信息保存到浏览器
            localStorage.setItem('user_info', JSON.stringify(userInfo));
            // 菜单
            const menuList = this.appMenuService.getAppMenu();
            localStorage.setItem('app_menu', JSON.stringify(menuList));
            this.$message.remove(messageId);
            // 设置上次登录时间显示
            const lastLoginTime: string = user.lastLoginTime ? format(new Date(user.lastLoginTime), 'yyyy-MM-dd HH:mm:ss') : null;
            // 设置message提示文字
            const messageTitle: string = lastLoginTime ? `欢迎 ${userInfo.userName}，上次登录时间：${lastLoginTime}` : `欢迎 ${userInfo.userName}`;
            this.$message.success(messageTitle, {nzDuration: 3000});
            this.router.navigate(['/main']);
          } else {
            this.$message.error(result.msg);
            this.$message.remove(messageId);
          }
          this.loginLoading = false;
        });
      }
    }).catch(() => {
    });
  }

  // 登录接口
  login(loginInfo, messageId: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.$http.post(`${environment.API_URL}/login`, loginInfo).subscribe((result: Result<User>) => {
        if (result.code === 200) {
          const userInfo: User = result.data;
          localStorage.setItem('token', JSON.stringify(userInfo.saTokenInfo));
          resolve(userInfo);
        } else {
          this.$message.remove(messageId);
          this.$message.error(result.msg);
          this.loginLoading = false;
          reject(null);
        }
      }, () => {
        this.$message.remove(messageId);
        reject(null);
      });
    });
  }

  get loginName(): AbstractControl {
    return this.loginForm.controls.loginName;
  }

  get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

}
