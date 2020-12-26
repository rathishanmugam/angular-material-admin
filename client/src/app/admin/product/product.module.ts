import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProductComponent} from './product.component';
import {ProductRoutingModule} from './product-routing.module';
import {DataService} from './data.service';
import {DialogComponent} from './dialog/dialog.component';

@NgModule({

  imports: [
    CommonModule,
    ProductRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],
  declarations: [ProductComponent, DialogComponent],
  providers: [DataService],
  entryComponents: [
    DialogComponent
  ]
})
export class ProductModule {
}
