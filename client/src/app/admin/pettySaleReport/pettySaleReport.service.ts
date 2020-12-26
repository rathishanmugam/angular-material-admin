import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap, catchError} from 'rxjs/operators';
import {ICustomer} from '../customer/customer';
import {Observable, of, throwError} from 'rxjs';
import {IPettySales} from './pettySaleReport';
import {BehaviorSubject, from} from 'rxjs';
import {AdminService} from '../admin.service';

@Injectable({providedIn: 'root'})
export class PettySaleReportService {
  purchase: IPettySales[];
  selectedDueArray;

  totalSalesAmt = 0;
  private selectedProductSource = new BehaviorSubject<IPettySales | null>(null);
  selectedProductChanges$ = this.selectedProductSource.asObservable();

  private salesUrl = 'http://localhost:8081/api/purchase';

  constructor(private http: HttpClient, private adminService: AdminService) {
  }

// To Get The List Of Employee
  getPettySale(page, limit, sort, order, filter) {
    // return from(this.adminService.getAccessToken().then(token => {
    //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this
      .http
      .get<IPettySales[]>('http://localhost:8081/api/pettys', {
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
          // console.log('All: ' + JSON.stringify(purchase, null, 5));
          // console.log('iam stored in array: ', this.purchase);
        }),
        catchError(this.handleError));
    // }));
  }

  getProductDetails(element): void {
    this.selectedDueArray = element.products;
    console.log('ARRAY=====>', !!this.selectedDueArray);

    console.log('the selected due=====>', this.selectedDueArray);
    this.selectedProductSource.next(this.selectedDueArray);

  }


  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

