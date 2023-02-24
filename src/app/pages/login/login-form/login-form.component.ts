import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppMenuService} from '../../../shared-module/service/app-menu.service';
import {Result} from '../../../shared-module/interface/result';
import {NzMessageService} from 'ng-zorro-antd/message';
import {User} from '../../../shared-module/interface/user';
import {format} from 'date-fns';
import {LoginRequestService} from '../../../core-module/api-service';
import {CommonUtil} from '../../../shared-module/util/commonUtil';
import {SessionUtil} from '../../../shared-module/util/session-util';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [LoginRequestService]
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  // 登录的loading
  loginLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private appMenuService: AppMenuService,
              private loginRequestService: LoginRequestService, private $message: NzMessageService) {
  }

  ngOnInit(): void {
    if (SessionUtil.getTokenOut()) {
      this.router.navigate(['/main/index']);
    } else {
      SessionUtil.clearUserLocal();
      this.router.navigate(['/login']);
    }
    this.buildForm();
  }

  buildForm(): void {
    const rememberMe: string = localStorage.getItem('rememberMe');
    this.loginForm = this.fb.group({
      loginName: [rememberMe ? rememberMe : '', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [!!rememberMe],
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
    this.login(loginInfo).then((user: User) => {
      if (user) {
        // 查询用户接口
        this.loginRequestService.queryUserById(user.id).subscribe((result: Result<User>) => {
          if (result.code === 200) {
            const userInfo: User = result.data;
            // 用户信息保存到浏览器
            localStorage.setItem('user_info', JSON.stringify(userInfo));
            // 设置菜单
            SessionUtil.setMenuList().then(() => {
              // 设置上次登录时间显示
              const lastLoginTime: string = user.lastLoginTime ? format(new Date(user.lastLoginTime), 'yyyy-MM-dd HH:mm:ss') : null;
              this.router.navigate(['/main/index']);
              // 设置message提示文字
              const messageTitle: string = lastLoginTime ? `欢迎 ${userInfo.userName}，上次登录时间：${lastLoginTime}` : `欢迎 ${userInfo.userName}`;
              this.$message.success(messageTitle, {nzDuration: 3000});
            });
          } else {
            this.$message.error(result.msg);
          }
          this.loginLoading = false;
        });
      }
    }).catch(() => {
      this.loginLoading = false;
    });
  }

  // 登录接口
  login(loginInfo): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.loginRequestService.login(loginInfo).subscribe((result: Result<User>) => {
        if (result.code === 200) {
          const userInfo: User = result.data;
          // 设置token
          SessionUtil.setToken(userInfo.saTokenInfo);
          resolve(userInfo);
        } else {
          this.$message.error(result.msg);
          this.loginLoading = false;
          reject(null);
        }
      }, () => {
        reject(null);
      });
    });
  }

  // 使用测试账户
  testUser(): void {
    this.loginForm.patchValue({loginName: 'test', password: '000'});
  }

  get loginName(): AbstractControl {
    return this.loginForm.controls.loginName;
  }

  get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

}
