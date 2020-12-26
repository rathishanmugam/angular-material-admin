import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CreditorComponent} from './creditor.component';

const routes: Routes = [
  {
    path: '',
    component: CreditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditorRoutingModule {
}
