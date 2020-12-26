import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CreditorComponent} from './creditor.component';
import {CreditorRoutingModule} from './creditor-routing.module';
import {DialogBoxxComponent} from './dialog-boxx/dialog-boxx.component';

@NgModule({

  imports: [
    CommonModule,
    CreditorRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],
  declarations: [CreditorComponent, DialogBoxxComponent],
  entryComponents: [
    DialogBoxxComponent
  ]
})
export class CreditorModule {
}
