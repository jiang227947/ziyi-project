import {NgModule} from '@angular/core';
import {ResumeComponent} from './resume.component';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {RESUME_ROUTER_CONFIG} from './resume-routing.module';


@NgModule({
  declarations: [ResumeComponent],
  imports: [
    SharedModuleModule,
    RouterModule.forChild(RESUME_ROUTER_CONFIG)
  ]
})
export class ResumeModule {
}
