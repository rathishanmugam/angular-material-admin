import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {SignoutRedirectCallbackComponent} from './signout-redirect-callback.component';
import {SigninRedirectCallbackComponent} from './signin-redirect-callback.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { SideNavComponent } from './layout/side-nav/side-nav.component';
import {UnauthorizedComponent} from './unauthorized.component';
import {AdminInterceptorService} from './admin-interceptor.service';
import {AuthService} from './auth.service';
import {HttpErrorInterceptor} from './http-error.interceptor';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule
  ],
  providers: [
{ provide: HTTP_INTERCEPTORS, useClass: AdminInterceptorService, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true

    }

  ],

declarations: [LayoutComponent, TopNavComponent, SideNavComponent, SigninRedirectCallbackComponent,
  UnauthorizedComponent , SignoutRedirectCallbackComponent]
})
export class AdminModule {}
