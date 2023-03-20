import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppMenuService} from '../../../shared-module/service/app-menu.service';
import {LoginRequestService, UserManagementRequestService} from '../../../core-module/api-service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {User} from '../../../shared-module/interface/user';
import {Result} from '../../../shared-module/interface/result';
import {format} from 'date-fns';
import {UserRoleEnum} from '../../../shared-module/enum/user.enum';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [LoginRequestService]
})
export class AuthComponent implements OnInit {

  @ViewChild('active') activeTemp: ElementRef;
  // 模式
  signStats = 'signUp';
  // 标题
  title = '登录';
  // 登录表单
  loginForm: FormGroup;
  // 登录的loading
  loginLoading = false;
  // 注册表单
  registerForm: FormGroup;
  // 注册的loading
  registerLoading = false;
  // 注册成功模板
  registerSuccess = false;

  constructor(private fb: FormBuilder, private router: Router, private appMenuService: AppMenuService,
              private loginRequestService: LoginRequestService, private $message: NzMessageService,
              private userManagementRequestService: UserManagementRequestService, private renderer: Renderer2) {
  }

  // 密码一致校验
  confirmationValidator = (control): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.registerForm.controls.registerPassword.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

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
    this.registerForm = this.fb.group({
      registerName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.minLength(1)]],
      registerPassword: ['', [Validators.required, Validators.minLength(3)]],
      registerPassword2: ['', [Validators.required, Validators.minLength(3), this.confirmationValidator]]
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

  /**
   * 注册
   */
  registerSubmit(): void {
    this.registerLoading = true;
    if (this.registerForm.valid) {
      const registerInfo = {
        name: this.registerForm.value.registerName,
        userName: this.registerForm.value.userName,
        password: this.registerForm.value.registerPassword,
        role: UserRoleEnum.general,
        roleName: '普通用户',
      };
      this.userManagementRequestService.addUser(registerInfo).subscribe((registerResult: Result<void>) => {
        if (registerResult.code === 200) {
          setTimeout(() => {
            const loginInfo = {
              name: registerInfo.name,
              password: registerInfo.password
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
          }, 2000);
          this.registerSuccess = true;
        } else {
          this.$message.error(registerResult.msg);
        }
        this.registerLoading = false;
      });
    } else {
      this.registerLoading = false;
    }
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

  // 按钮点击事件
  signChange(value: string): void {
    switch (value) {
      case 'signIn':
        this.signStats = value;
        this.title = '注册';
        this.renderer.removeClass(this.activeTemp.nativeElement, 'right-panel-active');
        break;
      case 'signUp':
        this.signStats = value;
        this.title = '登录';
        this.renderer.addClass(this.activeTemp.nativeElement, 'right-panel-active');
        break;
      default:
        this.router.navigate(['/resume']);
        break;
    }
  }

  get loginName(): AbstractControl {
    return this.loginForm.controls.loginName;
  }

  get password(): AbstractControl {
    return this.loginForm.controls.password;
  }
}
