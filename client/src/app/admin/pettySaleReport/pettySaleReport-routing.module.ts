import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PettySaleReportMainComponent} from './pettySaleReportMain.component';

const routes: Routes = [
  {
    path: '',
    component: PettySaleReportMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PettySaleReportRoutingModule {
}
