import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PettySaleReportRoutingModule} from './pettySaleReport-routing.module';
import {PettySaleReportComponent} from './pettySaleReport.component';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PettySaleReportMainComponent} from './pettySaleReportMain.component';

@NgModule({
  imports: [
    CommonModule,
    PettySaleReportRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],

  declarations: [PettySaleReportComponent, PettySaleReportMainComponent]
})
export class PettySaleReportModule {
}
