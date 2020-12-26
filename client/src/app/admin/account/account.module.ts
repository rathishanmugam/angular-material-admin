import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AccountComponent} from './account.component';
import {AccountRoutingModule} from './account-routing.module';
import {DialogBoxComponent} from './dialog-boxx/dialog-boxx.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AdminInterceptorService} from '../admin-interceptor.service';
import {HttpErrorInterceptor} from '../http-error.interceptor';

@NgModule({

  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    CommonModule
  ],
  declarations: [AccountComponent, DialogBoxComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminInterceptorService,
      multi: true

    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true

    }


  ],
  entryComponents: [
    DialogBoxComponent
  ]
})
export class AccountModule {
}
