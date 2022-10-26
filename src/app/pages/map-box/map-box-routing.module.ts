import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {MapBoxComponent} from "./map-box.component";

const routes: Routes = [
  {path: '', component: MapBoxComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapBoxRoutingModule {
}
