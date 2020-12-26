import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SuspenseComponent} from './suspense.component';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SuspenseRoutingModule} from './suspense-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SuspenseRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports:[
    CommonModule
  ],

  declarations: [SuspenseComponent]
})
export class SuspenseModule {}
