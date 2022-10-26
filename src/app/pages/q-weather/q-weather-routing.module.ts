import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {QWeatherComponent} from "./q-weather.component";


const routes: Routes = [
  {path: '', component: QWeatherComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QWeatherRoutingModule {
}
