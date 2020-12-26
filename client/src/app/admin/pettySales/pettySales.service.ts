import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap, catchError} from 'rxjs/operators';
import {ICustomer} from '../customer/customer';
import {Observable, of, throwError} from 'rxjs';
import {IProduct} from '../product/product';
import {IPettySales} from './pettySales';
import {IAccount} from '../account/account';

@Injectable({providedIn: 'root'})
export class PettySalesService {
  events: IPettySales[];
  totalSalesAmt = 0;
  private salesUrl = 'http://localhost:8081/api/sales';
  private customersUrl = 'http://localhost:8081/api/customers';
  private productUrl = 'http://localhost:8081/api/product/serial';
  private productsUrl = 'http://localhost:8081/api/products';
  private productsPettyUrl = 'http://localhost:8081/api/products/petty';
  private accountsUrl = 'http://localhost:8081/api/accounts';
  private accountUrl = 'http://localhost:8081/api/account';

  private productUrls = 'http://localhost:8081/api/products';
  private pettySaleUrl = 'http://localhost:8081/api/petty';
  private creditDueUrl = 'http://localhost:8081/api/creditDue';
  private creditDueUrls = 'http://localhost:8081/api/creditDues';
  private creditUrl = 'http://localhost:8081/api/credit';

  constructor(private http: HttpClient) {
  }

  fetchEvent() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.get<IPettySales[]>(
      this.salesUrl, {headers: headers}
    ).pipe(tap(events => {
        this.events = events;
        // console.log('All: ' + JSON.stringify(events, null, 5));
        // console.log('iam stored in array: ', this.events);


      }),
      catchError(this.handleError));
  }

  getCustomers(): Observable<ICustomer[]> {
    console.log('iam in petty product');
    return this.http.get<ICustomer[]>(`${this.customersUrl}`);

  }

  getMaxAccountNo(): Observable<IAccount[]> {
    console.log('account url===>', `${this.accountsUrl}`);
    return this.http.get<IAccount[]>(`${this.accountsUrl}`);
  }

  getPettyProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.productsPettyUrl}`);

  }

  getProduct(code): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.productUrl}/${code}`);

  }

  getMaxBillNo(): Observable<IPettySales[]> {
    return this.http.get<IPettySales[]>(`${this.pettySaleUrl}`);
  }

  // updateSale( body) {
  //   console.log('i pass sale');
  //    // return this.http.post(`${this.salesUrl}`, body);
  //   return this.http.put(`${this.creditDueUrls}`, body);
  //
  // }
  addPettySale(body) {
    console.log('i pass sale');
    return this.http.post(`${this.pettySaleUrl}`, body);

  }

  addAccount(body) {
    console.log('i pass', body);

    return this.http.post(`${this.accountUrl}`, body);
  }

// creditSale(body) {
//     console.log('iam in service');
//     return this.http.post(`${this.creditUrl}`, body);
// }
//   addCreditDue( body) {
//     console.log('i pass credit due');
//     return this.http.post(`${this.creditDueUrl}`, body);
//   }

// To Updated Specific Employee
//   updateSession( body) {
//     console.log('i pass ', body);
//
//     return this.http.put(`${this.salesUrl}`, body);
//   }
//
// // To Create/Add New Employee
//   addSession(body) {
//     console.log('i pass', body);
//
//     return this.http.post(`${this.salesUrl}`, body);
//   }

// To Delete Any Employee
  updateQuantity(quantity, serial, action) {
    console.log('i delete', serial);
    return this.http.put(`${this.productUrls}/${serial}`, {quantity, action});
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

