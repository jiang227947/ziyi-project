import {NgModule} from '@angular/core';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {LoginComponent} from './login.component';
import {LoginFormComponent} from './login-form/login-form.component';
import {LOGIN_ROUTER_CONFIG,} from './login-routing.module';
import {AuthComponent} from './auth/auth.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [LoginComponent, LoginFormComponent, AuthComponent],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(LOGIN_ROUTER_CONFIG)
  ],
})
export class LoginModule {
}
