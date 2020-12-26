import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, combineLatest, EMPTY, from, merge, Subject, throwError, of, Observable, forkJoin} from 'rxjs';
import {catchError, filter, map, mergeMap, scan, shareReplay, tap, toArray, switchMap} from 'rxjs/operators';
import {ICreditor, IAddress} from './creditor';

@Injectable({
  providedIn: 'root'
})
export class DataService {
// Main api url to call api
  uri = 'http://localhost:8081/api/creditor';
  uriAddress = 'http://localhost:8081/api/address';
  creditorsWithId$;
  users: ICreditor[];
  address: IAddress[];
  userWithAddress: ICreditor[];

  constructor(private http: HttpClient) {
  }

  // getUsers(page, limit, sort, order, filter) {
  //   const addresses$ = this.http.get<IAddress[]>(`${this.uriAddress}`);
  //   addresses$.subscribe(console.log);
  //
  //   const creditors$ = this.http.get<ICreditor[]>('http://localhost:8081/api/creditor', {
  //     params: new HttpParams()
  //       .set('page', page.toString())
  //       .set('limit', limit.toString())
  //       .set('sort', sort.toString())
  //       .set('order', order.toString())
  //       .set('filter', filter)
  //   });
  //   creditors$.subscribe(console.log);
  //
  //   this.creditorsWithId$ = combineLatest([
  //     creditors$,
  //     addresses$,
  //   ]);
  //   this.creditorsWithId$.subscribe(console.log);
  //
  //   return this.creditorsWithId$ = combineLatest([
  //     creditors$,
  //     addresses$,
  //   ])
  //     .pipe(
  //       map(([creditors, addresses]) =>
  //         creditors.map(creditor => ({
  //           ...creditor,
  //           // street: addresses.find(a => a.creditorId === creditor._id ).street,
  //           // city: addresses.find(a => a.creditorId === creditor._id ).city,
  //           //
  //           // state: addresses.find(a => a.creditorId === creditor._id ).state,
  //           // zipCode: addresses.find(a => a.creditorId === creditor._id ).zipCode
  //         }) as ICreditor)
  //       ),
  //       tap(creditor => console.log('zzzzzzzzzzzzzzzzzzz', JSON.stringify(creditor))),
  //
  //       shareReplay(1)
  //     );
  // }

// To Get The List Of Employee
  getUsers(page, limit, sort, order, filter) {
    return this
      .http
      .get<ICreditor[]>('http://localhost:8081/api/creditor', {
        params: new HttpParams()
          .set('page', page.toString())
          .set('limit', limit.toString())
          .set('sort', sort.toString())
          .set('order', order.toString())
          .set('filter', filter)

      });

  }

// To Get Employee Details For Single Record Using Id
  getUserById(empid) {
    return this.http.get(`${this.uri}/${empid}`);
  }

// To Updated Specific Employee
  updateUser(body) {
    console.log('the body to update: ' + JSON.stringify(body, null, 2));

    return this.http.put(`${this.uri}/${body.addr}/${body.id}`, body);
  }

// To Create/Add New Employee
  addUser(body) {
    return this.http.post(`${this.uri}`, body);
  }

// To Delete Any Employee
  deleteUser(body) {
    return this.http.delete(`${this.uri}/${body.addr}/${body.id}`);
  }

}
