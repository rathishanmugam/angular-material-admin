import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PettySalesComponent} from './pettySales.component';

const routes: Routes = [
  {
    path: '',
    component: PettySalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PettySalesRoutingModule {
}
