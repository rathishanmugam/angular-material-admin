import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SuspenseComponent} from './suspense.component';

const routes: Routes = [
  {
    path: '',
    component: SuspenseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuspenseRoutingModule {}
