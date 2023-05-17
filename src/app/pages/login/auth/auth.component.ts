import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppMenuService} from '../../../shared-module/service/app-menu.service';
import {LoginRequestService} from '../../../core-module/api-service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {User} from '../../../shared-module/interface/user';
import {Result} from '../../../shared-module/interface/result';
import {format} from 'date-fns';
import {Oauth2Enum, UserRoleEnum} from '../../../shared-module/enum/user.enum';
import {CommonUtil} from '../../../shared-module/util/commonUtil';
import {getJSONLocalStorage, setLocalStorage} from '../../../shared-module/util/localStorage';
import {LeaveMessage} from '../../../shared-module/interface/leaveMessage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  @ViewChild('active') activeTemp: ElementRef;
  @ViewChild('leaveMessageBox') leaveMessageBoxTemp: ElementRef;
  @ViewChild('messageContent') messageContentTemp: ElementRef<Element>;
  // 模式
  public signStats = 'signUp';
  // 标题
  public title = '登录';
  // 登录表单
  public loginForm: FormGroup;
  // 登录的loading
  public loginLoading = false;
  // 注册表单
  public registerForm: FormGroup;
  // 注册的loading
  public registerLoading = false;
  // 注册成功模板
  public registerSuccess = false;
  // 所有留言
  messageList: LeaveMessage[] = [];
  // 留言
  public leaveMessage: LeaveMessage = {
    name: getJSONLocalStorage('leave') || '匿名',
    message: '',
    browser: null
  };
  // 留言弹框
  public showLeaveMessage: boolean = false;
  // 留言load
  public leaveMessageLoading: boolean = false;
  // 第三方登录枚举
  public oauth2Enum = Oauth2Enum;

  constructor(private fb: FormBuilder, private router: Router, private appMenuService: AppMenuService,
              private loginRequestService: LoginRequestService, private $message: NzMessageService,
              private renderer: Renderer2) {
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


  /**
   * 初始化表单
   */
  buildForm(): void {
    const rememberMe: string = localStorage.getItem('rememberMe');
    this.loginForm = this.fb.group({
      loginName: [rememberMe ? rememberMe : '', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [!!rememberMe],
    });
    this.registerForm = this.fb.group({
      registerName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required]],
      registerPassword: ['', [Validators.required, Validators.minLength(3)]],
      registerPassword2: ['', [Validators.required, Validators.minLength(3), this.confirmationValidator]]
    });
  }

  /**
   * 登录
   */
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
      username: this.loginName.value,
      password: this.password.value
    };
    // 用户登录
    this.login(loginInfo).then((user: User) => {
      if (user) {
        // 用户信息保存到浏览器
        localStorage.setItem('user_info', JSON.stringify(user));
        // 设置菜单
        SessionUtil.setMenuList().then(() => {
          // 设置上次登录时间显示
          const lastLoginTime: string = user.lastLoginTime ? format(new Date(user.lastLoginTime), 'yyyy-MM-dd HH:mm:ss') : null;
          this.router.navigate(['/main/index']);
          // 设置message提示文字
          const messageTitle: string = lastLoginTime ? `欢迎 ${user.userName}，上次登录时间：${lastLoginTime}` : `欢迎 ${user.userName}`;
          this.$message.success(messageTitle, {nzDuration: 3000});
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
    // 验证表单
    this.registerName.markAsDirty();
    this.registerName.updateValueAndValidity();
    this.userName.markAsDirty();
    this.userName.updateValueAndValidity();
    this.registerPassword.markAsDirty();
    this.registerPassword.updateValueAndValidity();
    this.registerPassword2.markAsDirty();
    this.registerPassword2.updateValueAndValidity();
    this.registerLoading = true;
    if (this.registerForm.valid) {
      const registerInfo = {
        name: this.registerForm.value.registerName,
        username: this.registerForm.value.userName,
        password: this.registerForm.value.registerPassword,
        role: UserRoleEnum.general,
        roleName: '普通用户',
      };
      this.loginRequestService.register(registerInfo).subscribe((registerResult: Result<void>) => {
        if (registerResult.code === 200) {
          setTimeout(() => {
            const loginInfo = {
              username: registerInfo.name,
              password: registerInfo.password
            };
            // 用户登录
            this.login(loginInfo).then((user: User) => {
              if (user) {
                // 用户信息保存到浏览器
                localStorage.setItem('user_info', JSON.stringify(user));
                // 设置菜单
                SessionUtil.setMenuList().then(() => {
                  // 设置上次登录时间显示
                  const lastLoginTime: string = user.lastLoginTime ? format(new Date(user.lastLoginTime), 'yyyy-MM-dd HH:mm:ss') : null;
                  this.router.navigate(['/main/index']);
                  // 设置message提示文字
                  const messageTitle: string = lastLoginTime ? `欢迎 ${user.userName}，上次登录时间：${lastLoginTime}` : `欢迎 ${user.userName}`;
                  this.$message.success(messageTitle, {nzDuration: 3000});
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
      }, () => {
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
          SessionUtil.setToken(userInfo.token);
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

  /**
   * 第三方登录
   */
  oauthLogin(param: Oauth2Enum): void {
    switch (param) {
      case Oauth2Enum.github:
        this.loginRequestService.githubLogin().subscribe((result: any) => {
          console.log(result);
        });
        break;
    }
  }

  /**
   * 查询留言
   */
  getLeaveMessage(): void {
    this.leaveMessageLoading = true;
    this.loginRequestService.getLeaveMessage().subscribe((result: Result<LeaveMessage[]>) => {
      if (result.code === 200) {
        // 留言列表
        this.messageList = result.data.map(item => {
          // 系统标识转换
          const browser = JSON.parse(item.browser);
          item.browser = `${browser.system}`;
          return item;
        });
        this.leaveMessageLoading = false;
        setTimeout(() => this.messageContentTemp.nativeElement.scrollTo(0, this.messageContentTemp.nativeElement.scrollHeight));
      } else {
        this.leaveMessageLoading = false;
        this.$message.success(result.msg);
      }
    });
  }

  /**
   * 添加留言
   */
  addLeaveMessage(): void {
    this.leaveMessage.browser = JSON.stringify(CommonUtil.getBrowserIdentity());
    // 保存留言昵称
    setLocalStorage('leaveName', this.leaveMessage.name);
    this.loginRequestService.addLeaveMessage(this.leaveMessage).subscribe((result: Result<void>) => {
      if (result.code === 200) {
        this.getLeaveMessage();
        this.$message.success(result.msg, {nzDuration: 1000});
        this.leaveMessage.message = '';
        setTimeout(() => this.messageContentTemp.nativeElement.scrollTo(0, this.messageContentTemp.nativeElement.scrollHeight));
      } else {
        this.$message.success(result.msg);
      }
    });
  }

  /**
   * 浏览弹框
   */
  showLeaveMessageModal(): void {
    if (!this.showLeaveMessage) {
      this.getLeaveMessage();
      this.renderer.addClass(this.leaveMessageBoxTemp.nativeElement, 'show-active');
      this.leaveMessage = {
        name: '',
        message: '',
        browser: null
      };
    } else {
      this.renderer.removeClass(this.leaveMessageBoxTemp.nativeElement, 'show-active');
    }
    this.showLeaveMessage = !this.showLeaveMessage;
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

  get registerName(): AbstractControl {
    return this.registerForm.controls.registerName;
  }

  get userName(): AbstractControl {
    return this.registerForm.controls.userName;
  }

  get registerPassword(): AbstractControl {
    return this.registerForm.controls.registerPassword;
  }

  get registerPassword2(): AbstractControl {
    return this.registerForm.controls.registerPassword2;
  }
}
