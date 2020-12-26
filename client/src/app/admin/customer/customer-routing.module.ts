import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CostomerComponent} from './customer.component';

const routes: Routes = [
  {
    path: '',
    component: CostomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
