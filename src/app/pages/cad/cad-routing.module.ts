import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CadComponent} from './cad.component';

const routes: Routes = [
  {path: '', component: CadComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadRoutingModule {
}
