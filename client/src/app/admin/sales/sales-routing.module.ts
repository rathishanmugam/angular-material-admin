import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SalesTabComponent} from './salesTab.component';
import {SalesReportProductTabComponent} from './salesReport/salesReport-productTab.component';
import {PettySaleReportMainComponent} from './pettySaleReport/pettySaleReportMain.component';
import {ChartTabComponent} from './charts/chartTab.component';
import {PettySalesComponent} from './pettySales.component';
import {SalesComponent} from './sales.component';
import {SalesBillingComponent} from './salesBilling.component';

const routes: Routes = [
  {
    path: '',
    component: SalesTabComponent,
    children: [
      {
        path: '',
        redirectTo: 'salesEntryTab'
      },
      {
        path: 'salesEntryTab',
        component: SalesComponent,
      },
      {
        path: 'pettySalesEntryTab',
        component: PettySalesComponent,
      },
      {
        path: 'salesReportTab',
        component: SalesReportProductTabComponent,
      },
      {
        path: 'pettySalesReportTab',
        component: PettySaleReportMainComponent,
      },
      {
        path: 'salesReportChartTab',
        component: ChartTabComponent,
      },
      {
        path: 'salesBillingTab',
        component: SalesBillingComponent,
      }
    ]
  }
];
// const routes: Routes = [
//      { path: '', redirectTo: '/sales', pathMatch: 'full' },
//   { path: '', component: SaleComponent },
//   { path: 'first', component: SalesComponent },
//   { path: 'second', component: PettySalesComponent },
//   { path: 'third', component: SalesReportProductTabComponent },
//   { path: 'fourth', component:  PettySaleReportMainComponent},
//   { path: 'fifth', component:  ChartTabComponent},
//
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {
}
