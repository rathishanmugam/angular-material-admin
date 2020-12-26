import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap, catchError} from 'rxjs/operators';
import {ICustomer} from '../customer/customer';
import {Observable, of, throwError} from 'rxjs';
import {ISales, ICredit} from './salesReport';
// import {IProducts} from './salesReport';
import {BehaviorSubject} from 'rxjs';
import {IProduct} from '../product/product';
import {MatTableDataSource} from '@angular/material';

@Injectable({providedIn: 'root'})
export class SalesReportService {
  sales;
  creditSales;
  dues;
  totalSalesAmt = 0;
  selectedBillArray;
  selectedBillObject;
  selectedDueArray;
  parentId;
  private selectedProductSource = new BehaviorSubject<ISales | null>(null);
  selectedProductChanges$ = this.selectedProductSource.asObservable();
  private selectedCreditSource = new BehaviorSubject<ICredit | null>(null);
  selectedCreditChanges$ = this.selectedCreditSource.asObservable();
  private salesUrl = 'http://localhost:8081/api/sales';
  private creditUrl = 'http://localhost:8081/api/credit';

  constructor(private http: HttpClient) {
  }

// To Get The List Of Employee
  getSales(page, limit, sort, order, filter) {
    return this
      .http
      .get<ISales[]>('http://localhost:8081/api/sales', {
        params: new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString())
          .set('sort', sort.toString())
          .set('order', order.toString())
          .set('filter', filter)

      }).pipe(tap(sales => {
        this.sales = sales;
        // this.selectedProductSource.next(sales[0]);
        console.log('All SALES======>: ' + JSON.stringify(sales, null, 5));
      }));
  }

  getCreditSales(page, limit, sort, order, filter) {
    return this
      .http
      .get<ISales>('http://localhost:8081/api/sales/credit', {
        params: new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString())
          .set('sort', sort.toString())
          .set('order', order.toString())
          .set('filter', filter)

      }).pipe(tap(sales => {
        let duePending = 0;
        let diff = 0;
        console.log('HERE THE RECORDS ======>', sales);
        for (let j = 0; j < sales.docs.length; j++) {
          duePending = 0;
          diff = 0;
          for (let i = 0; i < sales.docs[j].credit.creditDue.length; i++) {
            console.log('today date', new Date());
            console.log('due payable date date', sales.docs[j].credit.creditDue[i].dueCurrentDate);

            console.log('due payable date', new Date(sales.docs[j].credit.creditDue[i].dueCurrentDate).toString());
            const currentDate = new Date(sales.docs[j].credit.creditDue[i].dueCurrentDate).getTime();
            const todayDate = new Date().getTime();
            console.log('iam in time difference (due pay date) (current date)', currentDate, todayDate);
            if (todayDate >= currentDate) {

              if (sales.docs[j].credit.creditDue[i].duePaid === false) {

                let days = 1000 * 60 * 60 * 24;
                const sub = (todayDate - currentDate);

                diff += Math.round((todayDate - currentDate) / days);
                console.log('i am in loop', diff);
                if (diff <= 31 ) {
                  duePending = 0 ;
                } else  if (diff > 31 ) {
                  duePending = Math.round(diff / 31);
                  console.log('i am in loop due pending', sub, days, diff, duePending);
                }
                // duePending =  Math.round(diff / 31);
                // console.log('i am in loop due pending', duePending, Math.round(diff / 31));

              }
              console.log('i am in', duePending);
              sales.docs[j].credit.duePending = `${duePending} month Due Pending,For ${diff} days`;
              console.log('the due pending====>', sales.docs[j].credit.duePending);
            }

          }
        }
        this.creditSales = sales;
        // this.selectedProductSource.next(sales[0]);
        console.log('ONLY CREDIT SALES ======>: ' + JSON.stringify(this.creditSales, null, 5));
      }));
  }

  changeSelectedBillNo(element): void {
    this.selectedBillArray = this.sales.docs.find(sale => sale.billNo === element.billNo).products;
    this.selectedBillObject = Object.assign({}, this.selectedBillArray);
    this.selectedProductSource.next(this.selectedBillArray);

  }

  getCreditDetails(element): void {
    this.parentId = element.credit._id;
    this.selectedDueArray = element.credit.creditDue;
    console.log('the selected due', this.selectedDueArray);
    this.selectedCreditSource.next(this.selectedDueArray);

  }

  addGracePeriod(resultt) {
    console.log('iam in getting ======>', resultt);
    // return this.http.put(`${this.uri}/${body._id}`, body);
    return this.http.put(`${this.creditUrl}/${resultt.creditNo}/${this.parentId}`, resultt);
  }

  // updatePendingDue(result) {
  //   console.log('iam in getting ======>', result);
  //   // return this.http.put(`${this.uri}/${body._id}`, body);
  //   return this.http.put(`${this.salesUrl}/${result.creditNo}`, result);
  // }

  // private handleError(err: HttpErrorResponse) {
  //   let errorMessage = '';
  //   errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  //   console.error(errorMessage);
  //   return throwError(errorMessage);
  // }
}

// const result = Object.assign({}, ...result,{ creditNo: this.creditDue.creditors}));
//const arr = (Object.assign({}, this.creditDue.creditNo));
