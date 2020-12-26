import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SalesReportRoutingModule} from './salesReport-routing.module';
import {SalesReportSalesComponent} from './salesReport-sales.component';
import {SalesReportDueComponent} from './salesReport-due.component';
import {SalesReportTabComponent} from './salesReportTab.component';
import {SalesReportProductTabComponent} from './salesReport-productTab.component';
import {SalesReportCreditTabComponent} from './salesReport-creditTab.component';
import {PizzaPartyComponent} from '../mat-components/dialogs/snack-bar/snack-bar.component';
import {DialogOverviewExampleDialog1} from './salesReport-creditTab.component';
// import {DialogComponent} from '../product/dialog/dialog.component';
// import {DialogComponent} from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SalesReportRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],

  declarations: [SalesReportProductTabComponent, SalesReportCreditTabComponent,
    SalesReportTabComponent, SalesReportSalesComponent, SalesReportDueComponent, DialogOverviewExampleDialog1],
  entryComponents: [DialogOverviewExampleDialog1]

})
export class SalesReportModule {
}
