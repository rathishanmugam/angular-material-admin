import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CostomerComponent} from './customer.component';
import {CustomerRoutingModule} from './customer-routing.module';
import {DialogBoxComponent} from './dialog-boxx/dialog-boxx.component';

@NgModule({

  imports: [
    CommonModule,
    CustomerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],
  declarations: [CostomerComponent, DialogBoxComponent],
  entryComponents: [
    DialogBoxComponent
  ]
})
export class CustomerModule {
}
