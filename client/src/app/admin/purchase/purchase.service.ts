import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap, catchError} from 'rxjs/operators';
import {ICustomer} from '../customer/customer';
import {Observable, of, throwError} from 'rxjs';
import {IProduct} from '../product/product';
import {IPurchase} from './purchase';
import {ICreditor} from '../creditor/creditor';
import {IAccount} from '../account/account';

@Injectable({providedIn: 'root'})
export class PurchaseService {
  events: IPurchase[];
  totalSalesAmt = 0;
  private salesUrl = 'http://localhost:8081/api/sales';
  private creditorsUrl = 'http://localhost:8081/api/creditors';
  private productUrl = 'http://localhost:8081/api/product/serial';
  private productsUrl = 'http://localhost:8081/api/products';
  private productUrls = 'http://localhost:8081/api/products';
  private purchaseUrls = 'http://localhost:8081/api/purchases';
  private purchaseUrl = 'http://localhost:8081/api/purchase';
  private accountsUrl = 'http://localhost:8081/api/accounts';
  private accountUrl = 'http://localhost:8081/api/account';

  constructor(private http: HttpClient) {
  }

  fetchEvent() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.get<IPurchase[]>(
      this.salesUrl, {headers: headers}
    ).pipe(tap(events => {
      this.events = events;
      console.log('All: ' + JSON.stringify(events, null, 5));
      console.log('iam stored in array: ', this.events);


    }));
  }

  getCreditors(): Observable<ICreditor[]> {
    return this.http.get<ICreditor[]>(`${this.creditorsUrl}`);

  }

  getCreditorByName(name): Observable<ICreditor> {
    return this.http.get<ICreditor>(`${this.creditorsUrl}/${name}`);
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.productsUrl}`);

  }

  getProduct(code): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.productUrl}/${code}`);

  }

  getMaxBillNo(): Observable<IPurchase[]> {
    console.log('url', `${this.purchaseUrls}`);
    return this.http.get<IPurchase[]>(`${this.purchaseUrls}`);
  }

  getMaxAccountNo(): Observable<IAccount[]> {
    console.log('account url===>', `${this.accountsUrl}`);
    return this.http.get<IAccount[]>(`${this.accountsUrl}`);
  }

  addPurchase(body) {
    console.log('i pass');
    return this.http.post(`${this.purchaseUrl}`, body);
  }

// To Updated Specific Employee
  updateSession(body) {
    console.log('i pass', body);

    return this.http.put(`${this.salesUrl}`, body);
  }

// To Create/Add New Employee
  addAccount(body) {
    console.log('i pass', body);

    return this.http.post(`${this.accountUrl}`, body);
  }

// To add Any Employee
  updateQuantity(quantity, serial, action) {
    console.log('i add', serial);
    return this.http.put(`${this.productUrls}/${serial}`, {quantity, action});

  }

  // private handleError(err: HttpErrorResponse) {
  //   let errorMessage = '';
  //   errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  //   console.error(errorMessage);
  //   window.alert(errorMessage);
  //   return throwError(errorMessage);
  // }
}

