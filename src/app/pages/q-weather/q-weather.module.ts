import {NgModule} from '@angular/core';
import {SharedModuleModule} from "../../shared-module/shared-module.module";
import {QWeatherRoutingModule} from "./q-weather-routing.module";
import {QWeatherComponent} from "./q-weather.component";
import {WeatherRequestService} from "./api";

@NgModule({
  declarations: [
    QWeatherComponent
  ],
  providers: [WeatherRequestService],
  imports: [
    QWeatherRoutingModule,
    SharedModuleModule,
  ],
})
export class QWeatherModule {
}
