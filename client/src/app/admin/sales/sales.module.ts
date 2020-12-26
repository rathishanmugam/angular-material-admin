import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SalesRoutingModule} from './sales-routing.module';
import {MAT_DATE_LOCALE} from '@angular/material';
import {SalesTabComponent} from './salesTab.component';
import {SalesComponent} from './sales.component';
import {PettySalesComponent} from './pettySales.component';
import {PettySaleReportMainComponent} from './pettySaleReport/pettySaleReportMain.component';
import {PettySaleReportComponent} from './pettySaleReport/pettySaleReport.component';
import {SalesReportCreditTabComponent} from './salesReport/salesReport-creditTab.component';
import {SalesReportSalesComponent} from './salesReport/salesReport-sales.component';
import {SalesReportDueComponent} from './salesReport/salesReport-due.component';
import {SalesReportTabComponent} from './salesReport/salesReportTab.component';
import {SalesReportProductTabComponent} from './salesReport/salesReport-productTab.component';
import {BarChartComponent} from './charts/bar-chart/bar-chart.component';
import {ChartsModule as Ng2Charts} from 'ng2-charts';
import {ChartTabComponent} from './charts/chartTab.component';
import {PieChartComponent} from './charts/pie-chart/pie-chart.component';
import {PolarChartComponent} from './charts/polar-chart/polar-chart.component';
import {DonutChartComponent} from './charts/donut-chart/donut-chart.component';
import {DialogOverviewExampleDialog1} from './salesReport/salesReport-creditTab.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import {DialogBoxComponent} from './dialog-boxx/dialog-boxx.component';
import {SalesBillingComponent} from './salesBilling.component';
import {MatTableModule} from '@angular/material';

@NgModule({
  entryComponents: [DialogOverviewExampleDialog1 , DialogBoxComponent],

  imports: [
    CommonModule,
    SharedModule,
    SalesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    Ng2Charts,
    MatTabsModule,
    MatTableModule
  ],
  exports: [
    CommonModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  declarations: [SalesTabComponent, SalesComponent, PettySalesComponent, PettySaleReportMainComponent, PettySaleReportComponent, SalesReportProductTabComponent,
    SalesReportTabComponent, SalesReportCreditTabComponent, SalesReportDueComponent, SalesReportSalesComponent, BarChartComponent, ChartTabComponent,
    DonutChartComponent, SalesBillingComponent, PieChartComponent, PolarChartComponent, DialogOverviewExampleDialog1 , DialogBoxComponent]
})
export class SalesModule {
}
