import {Component, OnInit} from '@angular/core';
import {User} from '../../../../shared-module/interface/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment.prod';
import {Result} from '../../../../shared-module/interface/result';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  // 表单
  userForm: FormGroup;
  // loading
  loading = false;
  // 角色集合
  roleNameOption = [
    {
      label: '管理员',
      value: '1001'
    },
    {
      label: '普通用户',
      value: '1002'
    }
  ];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
              private $http: HttpClient, private $message: NzMessageService) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      name: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      password2: [null, [Validators.required, this.confirmationValidator]],
      role: [null, [Validators.required]],
      roleName: [null, [Validators.required]]
      // mobile: [null, [Validators.maxLength(15), Validators.pattern(/^\d+$/)]],
      // email: [null, [Validators.maxLength(45), Validators.email]],
    });
  }

  // 角色选择切换
  roleChange(roleName: string): void {
    const role = this.roleNameOption.find(item => item.label === roleName);
    this.userForm.patchValue({role: role.value});
  }

  // 密码一致校验
  confirmationValidator = (control): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.userForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  // 提交
  submit(): void {
    for (const i in this.userForm.controls) {
      this.userForm.controls[i].markAsDirty();
      this.userForm.controls[i].updateValueAndValidity();
    }
    this.loading = true;
    if (this.userForm.valid) {
      delete this.userForm.value.password2;
      this.$http.post(`${environment.API_URL}/addUser`, this.userForm.value).subscribe((result: Result<void>) => {
        if (result.code === 200) {
          this.$message.success(result.msg);
          this.cancel();
        } else {
          this.$message.error(result.msg);
        }
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  /*取消*/
  cancel(): void {
    this.router.navigate(['main/user-management/user-list']);
  }
}
