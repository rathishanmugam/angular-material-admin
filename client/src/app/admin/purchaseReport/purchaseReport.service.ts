import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap, catchError} from 'rxjs/operators';
import {ICustomer} from '../customer/customer';
import {Observable, of, throwError} from 'rxjs';
import {IPurchase} from './purchaseReport';
import {BehaviorSubject, from} from 'rxjs';
import {AdminService} from '../admin.service';

@Injectable({providedIn: 'root'})
export class PurchaseReportService {
  purchase: IPurchase[];
  totalSalesAmt = 0;
  private selectedProductSource = new BehaviorSubject<IPurchase | null>(null);
  selectedProductChanges$ = this.selectedProductSource.asObservable();

  private salesUrl = 'http://localhost:8081/api/purchase';

  constructor(private http: HttpClient, private adminService: AdminService) {
  }

// To Get The List Of Employee
  getPurchase(page, limit, sort, order, filter) {
    // url: `https://${auth0.domain}/api/v2/users/${user.user_id}/roles`,
    // return from(this.adminService.getAccessToken().then(token => {
    //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this
      .http
      .get<IPurchase[]>('http://localhost:8081/api/purchase', {
        // headers: headers,
        params: new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString())
          .set('sort', sort.toString())
          .set('order', order.toString())
          .set('filter', filter)

      })
      // .toPromise();
      .pipe(tap(purchase => {
        this.purchase = purchase;
        this.selectedProductSource.next(purchase[0]);
        console.log('All: ' + JSON.stringify(purchase, null, 5));
        console.log('iam stored in array: ', this.purchase);
      }));

    // }));
  }

  // private handleError(err: HttpErrorResponse) {
  //   let errorMessage = '';
  //   errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  //   console.error(errorMessage);
  //   return throwError(errorMessage);
  // }
}

