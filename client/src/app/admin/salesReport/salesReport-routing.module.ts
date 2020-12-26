import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SalesReportTabComponent} from './salesReportTab.component';
// import {SalesReportCreditTabComponent} from './salesReport-creditTab.component';

const routes: Routes = [
  {
    path: '',
    component: SalesReportTabComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReportRoutingModule {
}
