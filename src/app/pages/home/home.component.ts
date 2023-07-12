import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {LoginRequestService} from '../../core-module/api-service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Result} from '../../shared-module/interface/result';
import {User} from '../../shared-module/interface/user';
import {SessionUtil} from '../../shared-module/util/session-util';
import {format} from 'date-fns';
import {Oauth2Enum} from '../../shared-module/enum/user.enum';
import {decipher} from '../../shared-module/util/encipher';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [LoginRequestService]
})
export class HomeComponent implements OnInit, AfterViewInit {

  // iframe
  @ViewChild('htmliFrameElement', {static: false}) private iframe: ElementRef<HTMLIFrameElement>;
  @ViewChild('active') activeTemp: ElementRef;
  // 地址
  urlSafe: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer,
              private loginRequestService: LoginRequestService, private $message: NzMessageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl('assets/home/evziyi-home/index.html');
  }

  ngAfterViewInit(): void {
    window.addEventListener('message', (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        const formData: {
          type: string,
          msg?: string,
          name?: string,
          email?: string,
          password?: string,
          signupName?: string,
          signupEmail?: string,
          signupPassword?: string,
          signupCode?: number
        } = JSON.parse(event.data);
        // console.log(formData);
        switch (formData.type) {
          // 提醒
          case 'msg':
            this.$message.error(formData.msg);
            break;
          // 发送验证码
          case 'emailCode':
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (!regEmail.test(formData.email)) {
              this.$message.error('邮箱格式错误');
              return;
            }
            this.loginRequestService.sendEmail(formData.email).subscribe((result: Result<void>) => {
              if (result.code === 200) {
                this.$message.success(result.msg);
              } else {
                this.$message.error(result.msg);
                this.iframe.nativeElement.contentWindow.postMessage('email', '*');
              }
            });
            break;
          // 注册
          case 'signIn':
            if (!formData.signupName || !formData.signupEmail || !formData.signupPassword || !formData.signupCode) {
              this.$message.info('请检查表单填写');
              this.iframe.nativeElement.contentWindow.postMessage('signIn', '*');
              return;
            }
            const registerInfo = {
              name: formData.signupName,
              userName: formData.signupName,
              password: formData.signupPassword,
              email: formData.signupEmail,
              code: formData.signupCode
            };
            this.loginRequestService.register(registerInfo).subscribe((registerResult: Result<void>) => {
              if (registerResult.code === 200) {
                setTimeout(() => {
                  const login = {
                    userName: registerInfo.name,
                    password: registerInfo.password
                  };
                  // 用户登录
                  this.login(login).then((user: User) => {
                    if (user) {
                      this.setInfoOperate(user);
                    }
                  }).catch(() => {
                  });
                }, 2000);
              } else {
                this.iframe.nativeElement.contentWindow.postMessage('signIn', '*');
                this.$message.error(registerResult.msg);
              }
            }, () => {
              this.iframe.nativeElement.contentWindow.postMessage('signIn', '*');
            });
            break;
          // 登录
          case 'login':
            if (!formData.name || !formData.password) {
              this.$message.info('请检查表单填写');
              this.iframe.nativeElement.contentWindow.postMessage('login', '*');
              return;
            }
            const loginInfo = {
              userName: formData.name,
              password: formData.password
            };
            // 用户登录
            this.login(loginInfo).then((user: User) => {
              if (user) {
                this.setInfoOperate(user);
              }
              this.iframe.nativeElement.contentWindow.postMessage('login', '*');
            }).catch(() => {
              this.iframe.nativeElement.contentWindow.postMessage('login', '*');
            });
            break;
          // github
          case Oauth2Enum.github:
            window.open(this.loginRequestService.githubLogin(), '_self');
            break;
          // qq
          case Oauth2Enum.qq:
            // 获取uuid
            this.gitUuidState().then((result: string) => {
              const decrypted = decipher(result).split('/');
              const params = {
                aesString: result,
                client_id: +decrypted[3]
              };
              window.open(this.loginRequestService.qqLogin(params), '_self');
            });
            break;
        }
      }
    });
    if (SessionUtil.getTokenOut()) {
      SessionUtil.clearUserLocal();
      this.router.navigate(['/home']);
    } else {
      if (window.history.length === 1) {
        this.router.navigate(['/chat-channels']);
      }
    }
  }


  /**
   * 第三方登录跳转
   */
  oauthLogin(param: Oauth2Enum): void {
    switch (param) {
      case Oauth2Enum.github:
        window.open(this.loginRequestService.githubLogin(), '_self');
        break;
      case Oauth2Enum.qq:
        // 获取uuid
        this.gitUuidState().then((result: string) => {
          const decrypted = decipher(result).split('/');
          const params = {
            aesString: result,
            client_id: +decrypted[3]
          };
          window.open(this.loginRequestService.qqLogin(params), '_self');
        });
        break;
    }
  }

  // 登录接口
  login(loginInfo): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.loginRequestService.login(loginInfo).subscribe((result: Result<User>) => {
        this.iframe.nativeElement.contentWindow.postMessage('login', '*');
        if (result.code === 200) {
          const userInfo: User = result.data;
          console.log(userInfo);
          // 设置token
          SessionUtil.setToken(userInfo.token);
          resolve(userInfo);
        } else {
          this.$message.error(result.msg);
          reject(null);
        }
      }, () => {
        this.iframe.nativeElement.contentWindow.postMessage('login', '*');
        reject(null);
      });
    });
  }


  /**
   * 保存数据等操作
   */
  setInfoOperate(user: User): void {
    // 用户信息保存到浏览器
    localStorage.setItem('user_info', JSON.stringify(user));
    // 设置菜单
    SessionUtil.setMenuList().then(() => {
      // 设置上次登录时间显示
      const lastLoginTime: string = user.lastLoginTime ? format(new Date(user.lastLoginTime), 'yyyy-MM-dd HH:mm:ss') : null;
      this.router.navigate(['/chat-channels']);
      // this.router.navigate(['/main/index']);
      // 设置message提示文字
      const messageTitle: string = lastLoginTime ? `欢迎 ${user.userName}，上次登录时间：${lastLoginTime}` : `欢迎 ${user.userName}`;
      this.$message.success(messageTitle, {nzDuration: 3000});
    });
  }


  /**
   * 后台获取uuid
   */
  gitUuidState(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const random = (Math.random() * 10000).toFixed(0);
      this.loginRequestService.gitUuidState(random).subscribe((result: Result<string>) => {
        if (result.code === 200) {
          localStorage.setItem('UuidState', result.data);
          resolve(result.data);
        } else {
          this.$message.error(result.msg);
          reject(result.msg);
        }
      }, () => {
        reject(undefined);
      });
    });
  }
}
