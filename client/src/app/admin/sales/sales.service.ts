import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap, catchError} from 'rxjs/operators';
import {ICustomer} from '../customer/customer';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {IProduct} from '../product/product';
import {ISales, ICredit} from './sales';
import {IAccount} from '../account/account';

@Injectable({providedIn: 'root'})
export class SalesService {
  events: ISales[];
  totalSalesAmt = 0;
  billNo = 32;
  private salesUrl = 'http://localhost:8081/api/sales';
  private customersUrl = 'http://localhost:8081/api/customers';
  private productUrl = 'http://localhost:8081/api/product/serial';
  private productsUrl = 'http://localhost:8081/api/products';
  private productUrls = 'http://localhost:8081/api/products';
  private saleUrl = 'http://localhost:8081/api/sale';
  private creditDueUrl = 'http://localhost:8081/api/creditDue';
  private creditDueUrls = 'http://localhost:8081/api/creditDues';
  private creditUrl = 'http://localhost:8081/api/credit';
  private accountsUrl = 'http://localhost:8081/api/accounts';
  private accountUrl = 'http://localhost:8081/api/account';
 customer: ISales;
  selectedBillArray;
  private selectedProductSource = new BehaviorSubject<ISales | null>(null);
  selectedProductChanges$ = this.selectedProductSource.asObservable();
  constructor(private http: HttpClient) {
  }

  fetchEvent() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.get<ISales[]>(
      this.salesUrl, {headers: headers}
    ).pipe(tap(events => {
      this.events = events;
      // console.log('All: ' + JSON.stringify(events, null, 5));
      // console.log('iam stored in array: ', this.events);


    }));
  }

  getMaxAccountNo(): Observable<IAccount[]> {
    console.log('account url===>', `${this.accountsUrl}`);
    return this.http.get<IAccount[]>(`${this.accountsUrl}`);
  }

  getCustomers(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(`${this.customersUrl}`);

  }
  getCustomer(billNo): Observable<ISales> {
    return this.http.get<ISales>(`${this.saleUrl}/${billNo}`).pipe(tap(sale => {
      this.customer = sale;
      this.selectedBillArray = this.customer.products;
      this.selectedProductSource.next(this.selectedBillArray);
    }));

  }
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.productsUrl}`);

  }

  getProduct(code): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.productUrl}/${code}`);

  }

  getMaxBillNo(): Observable<ISales[]> {
    console.log('url', `${this.saleUrl}`);
    return this.http.get<ISales[]>(`${this.saleUrl}`);
  }

  getMaxCreditNo(): Observable<ICredit[]> {
    return this.http.get<ICredit[]>(`${this.creditUrl}`);
  }

  updateSale(body) {
    console.log('i pass sale');
    // return this.http.post(`${this.salesUrl}`, body);
    return this.http.put(`${this.creditDueUrls}`, body);

  }

  addSale(body) {
    console.log('i pass sale');
    return this.http.post(`${this.salesUrl}`, body);

  }

  addAccount(body) {
    console.log('i pass', body);

    return this.http.post(`${this.accountUrl}`, body);
  }

  creditSale(body) {
    console.log('iam in service');
    return this.http.post(`${this.creditUrl}`, body);
  }

  addCreditDue(body) {
    console.log('i pass credit due');
    return this.http.post(`${this.creditDueUrl}`, body);
  }

// To Updated Specific Employee
  updateSession(body) {
    console.log('i pass ', body);

    return this.http.put(`${this.salesUrl}`, body);
  }

// To Create/Add New Employee
  addSession(body) {
    console.log('i pass', body);

    return this.http.post(`${this.salesUrl}`, body);
  }

// To Delete Any Employee
  updateQuantity(quantity, serial, action) {
    console.log('i delete', serial);
    return this.http.put(`${this.productUrls}/${serial}`, {quantity, action});
  }
// To Create/Add New Employee
  addUser(body) {
    return this.http.post(`http://localhost:8081/api/customer`, body);
  }

  // private handleError(err: HttpErrorResponse) {
  //   let errorMessage = '';
  //   errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  //   console.error(errorMessage);
  //   return throwError(errorMessage);
  // }
}

