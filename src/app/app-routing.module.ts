import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SimpleGuardService} from './core-module/service/simple-guard.service';
import {Exception404Component} from './pages/exception/404.component';

const routes: Routes = [
  // 默认路由
  {path: '', pathMatch: 'full', redirectTo: 'main/index'},
  // 首页
  {
    path: 'main',
    // 路由守卫
    // todo 后续添加状态管理器 @ngxs/store
    canActivate: [SimpleGuardService],
    loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule)
  },
  // 登录
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  // 404页面
  {path: 'exception', component: Exception404Component},
  {
    path: '**', redirectTo: 'exception',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
