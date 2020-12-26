import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import {SignoutRedirectCallbackComponent} from './signout-redirect-callback.component';
import {SigninRedirectCallbackComponent} from './signin-redirect-callback.component';
import {UnauthorizedComponent} from './unauthorized.component';
import {AdminGuard} from './admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
     // canActivate: [AdminGuard],

    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.FormsModule)
      },


      // {
      //   path: 'mat-grid',
      //   loadChildren: () => import('./mat-grid/mat-grid.module').then(m => m.MatGridModule)
      // },
      // {
      //   path: 'mat-components',
      //   loadChildren:
      //     () => import('./mat-components/mat-components.module').then(m => m.MatComponentsModule)
      // },
      // {
      //   path: 'animations',canActivate: [AdminGuard],
      //   loadChildren:
      //     () => import('./animations/animations.module').then(m => m.AnimationsModule)
      // },


      {
        path: 'pettySales', canActivate: [AdminGuard],
        loadChildren:
          () => import('./pettySales/pettySales.module').then(m => m.PettySalesModule)
      },
      {
        path: 'account', canActivate: [AdminGuard],
        loadChildren:
          () => import('./account/account.module').then(m => m.AccountModule)
      },
      {
        path: 'sales', canActivate: [AdminGuard],
        loadChildren:
          () => import('./sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'purchase',
        loadChildren:
          () => import('./purchase/purchase.module').then(m => m.PurchaseModule)
      },
      {
        path: 'suspense', canActivate: [AdminGuard],
        loadChildren:
          () => import('./suspense/suspense.module').then(m => m.SuspenseModule)
      },
      {
        path: 'product', canActivate: [AdminGuard],
        loadChildren:
          () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'customer',
        loadChildren:
          () => import('./customer/customer.module').then(m => m.CustomerModule)
      },
      {
        path: 'creditor', canActivate: [AdminGuard],
        loadChildren:
          () => import('./creditor/creditor.module').then(m => m.CreditorModule)
      },
      {
        path: 'salesReport', canActivate: [AdminGuard],
        loadChildren:
          () => import('./salesReport/salesReport.module').then(m => m.SalesReportModule)
      },
      {
        path: 'pettySaleReport', canActivate: [AdminGuard],
        loadChildren:
          () => import('./pettySaleReport/pettySaleReport.module').then(m => m.PettySaleReportModule)
      },
      {
        path: 'purchaseReport', canActivate: [AdminGuard],
        loadChildren:
          () => import('./purchaseReport/purchaseReport.module').then(m => m.PurchaseReportModule)
      },
      { path: 'signin-callback', component: SigninRedirectCallbackComponent },
      { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
      { path: 'unauthorized', component: UnauthorizedComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
