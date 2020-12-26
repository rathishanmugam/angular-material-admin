import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PettySalesComponent} from './pettySales.component';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PettySalesRoutingModule} from './pettySales-routing.module';
import {MAT_DATE_LOCALE} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    PettySalesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  declarations: [PettySalesComponent]
})
export class PettySalesModule {
}
