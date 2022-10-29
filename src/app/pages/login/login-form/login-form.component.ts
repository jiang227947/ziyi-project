import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppMenuService} from '../../../shared-module/service/app-menu.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  // 登录的loading
  loginLoading = false;

  constructor(private fb: FormBuilder, private router: Router, private appMenuService: AppMenuService) {
  }

  ngOnInit(): void {

    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      loginName: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(3)]],
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
    // 判断记住用户
    const rememberMe: boolean = this.loginForm.controls.remember.value;
    if (rememberMe) {
      localStorage.setItem('rememberMe', this.loginName.value);
    } else {
      localStorage.removeItem('rememberMe');
    }
    const userInfo = {
      name: this.loginName.value,
      password: this.password.value
    };
    setTimeout(() => {
      const menuList = this.appMenuService.getAppMenu();
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      localStorage.setItem('app_menu', JSON.stringify(menuList));
      this.loginLoading = false;
      this.router.navigate(['/main']);
    }, 1000);
  }

  get loginName(): AbstractControl {
    return this.loginForm.controls.loginName;
  }

  get password(): AbstractControl {
    return this.loginForm.controls.password;
  }

}
