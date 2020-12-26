import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchaseReportRoutingModule} from './purchaseReport-routing.module';
import {PurchaseReportComponent} from './purchaseReport.component';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    PurchaseReportRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],

  declarations: [PurchaseReportComponent]
})
export class PurchaseReportModule {
}
