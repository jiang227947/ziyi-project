import {NgModule} from '@angular/core';
import {FileListComponent} from './file-list/file-list.component';
import {FileSizePipe} from '../../../shared-module/pipe/file-size.pipe';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {ResourceManagementComponent} from './resource-management.component';
import {RouterModule} from '@angular/router';
import {RESOURCE_ROUTER_CONFIG} from './resource-management-routing.module';
import {DownloadUtil} from '../../../shared-module/util/download-util';
import {ResourceManagementRequestService} from '../../../core-module/api-service';


const COMPONENTS = [ResourceManagementComponent, FileListComponent];
const PIPES = [FileSizePipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  providers: [ResourceManagementRequestService, DownloadUtil],
  imports: [
    RouterModule.forChild(RESOURCE_ROUTER_CONFIG),
    SharedModuleModule
  ]
})
export class ResourceManagementModule {
}
