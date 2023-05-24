import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SimpleGuardService} from './core-module/service/simple-guard.service';
import {Exception404Component} from './pages/exception/404.component';

const routes: Routes = [
  // 默认路由
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  // 简历
  {
    path: 'resume',
    loadChildren: () => import('./pages/resume/resume.module').then(m => m.ResumeModule)
  },
  // 聊天频道
  {
    path: 'chat-channels',
    loadChildren: () => import('./pages/chat-channels/chat-channels.module').then(m => m.ChatChannelsModule)
  },
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
  {
    path: 'exception', component: Exception404Component,
    loadChildren: () => import('./pages/exception/exception.module').then(m => m.ExceptionModule)
  },
  {
    path: '**', redirectTo: 'exception', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
