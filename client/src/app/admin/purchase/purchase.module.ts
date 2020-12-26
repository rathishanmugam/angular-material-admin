import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchaseRoutingModule} from './purchase-routing.module';
import {PurchaseComponent} from './purchase.component';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],

  declarations: [PurchaseComponent]
})
export class PurchaseModule {
}
