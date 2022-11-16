import {NgModule} from '@angular/core';
import {SharedModuleModule} from '../../../shared-module/shared-module.module';
import {QWEATHER_ROUTER_CONFIG} from './q-weather-routing.module';
import {QWeatherComponent} from './q-weather.component';
import {WeatherRequestService} from './api';
import {RouterModule} from '@angular/router';
import {GlobalModule} from '../map/global.module';

@NgModule({
  declarations: [
    QWeatherComponent
  ],
  providers: [WeatherRequestService],
  imports: [
    RouterModule.forChild(QWEATHER_ROUTER_CONFIG),
    SharedModuleModule,
    GlobalModule.forBrowser()
  ],
})
export class QWeatherModule {
}
