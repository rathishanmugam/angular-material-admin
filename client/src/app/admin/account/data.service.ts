import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {IPurchase} from '../purchase/purchase';
import {IAccount, ITally} from './account';
import {AdminService} from '../admin.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
// Main api url to call api
  uri = 'http://localhost:8081/api/account';
  uris = 'http://localhost:8081/api/accounts';
  tally = 'http://localhost:8081/api/accounts/tally';
  tallys = 'http://localhost:8081/api/tally';
  tallyYesterday = 'http://localhost:8081/api/tally/yesterday';
  msg;

  constructor(private http: HttpClient, private _authService: AdminService) {
  }

// To Get The List Of Employee
  getUsers(page, limit, sort, order, filter) {
    return from(this._authService.getAccessToken().then(token => {
      console.log('access token ===>', token);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this
        .http
        .get('http://localhost:8081/api/account', {
          headers,
          params: new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('sort', sort.toString())
            .set('order', order.toString())
            .set('filter', filter)

        }).toPromise();
    }));
  }

  getAccount(): Observable<IAccount[]> {
    return from(this._authService.getAccessToken().then(token => {
      console.log('access token ===>', token);
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this
        .http
        .get<IAccount[]>('http://localhost:8081/api/accounts', {
          headers: headers
        })
        .toPromise();
    }));
  }

// To Get Employee Details For Single Record Using Id
//   getAccount(): Observable<IAccount[]> {
//     return this.http.get<IAccount[]>(`${this.uris}`);
//   }

// To Updated Specific Employee
  updateUser(body) {
    console.log('the body to update: ' + JSON.stringify(body, null, 2));

    return this.http.put(`${this.uri}/${body._id}`, body);
  }

// To Create/Add New Employee
  addUser(body) {
    return this.http.post(`${this.uri}`, body);
  }

// To Delete Any Employee
  deleteUser(body) {
    console.log('the delete body is ======>', body);
    return this.http.delete(`${this.uri}/${body._id}`);
  }

  getAccountBalance(): Observable<ITally[]> {
    return this.http.get<ITally[]>(`${this.tally}`);
  }

  getTally(): Observable<ITally[]> {
    return this.http.get<ITally[]>(`${this.tallys}`);
  }

  getTallyYesterday(): Observable<ITally[]> {
    return this.http.get<ITally[]>(`${this.tallyYesterday}`);
  }

  carryForword(body) {
    console.log('the balance body is ======>', body);

    return this.http.post(`${this.uris}`, body);
  }
}

// Yesterday Date can be calculated as:-
//
//   let now = new Date();
// var defaultDate = now - 1000 * 60 * 60 * 24 * 1;
// defaultDate = new Date(defaultDate);


// var prev_date = new Date();
// prev_date.setDate(prev_date.getDate() - 1);


// var today = new Date();
// var yesterday = new Date(today);
//
// yesterday.setDate(today.getDate() - 1);
// console.log("Original Date : ",yesterday);
//
// const monthNames = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// ];
// var month = today.getMonth() + 1
// yesterday = yesterday.getDate() + ' ' + monthNames[month] + ' ' + yesterday.getFullYear()
//
// console.log("Modify Date : ",yesterday);


// var d = new Date();
// d.setDate(d.getDate() - 1);


// tomorrow Date can be calculated as:-
// var d = new Date("2012-02-29")
// console.log(d)
// // Wed Feb 29 2012 11:00:00 GMT+1100 (EST)
//
// d.setDate(d.getDate() + 1)
// console.log(d)
// // Thu Mar 01 2012 11:00:00 GMT+1100 (EST)
//
// console.log(d.getDate())
// // 1


// var d = new Date.today().addDays(1).toString("dd-mm-yyyy");


// function nextDayDate() {
//   // get today's date then add one
//   var nextDay = new Date();
//   nextDay.setDate(nextDay.getDate() + 1);
//
//   var month = nextDay.getMonth() + 1;
//   var day = nextDay.getDate();
//   var year = nextDay.getFullYear();
//
//   if (month < 10) { month = "0" + month }
//   if (day < 10) { day = "0" + day }
//
//   return month + day + year;
// }

// "2013-03-10T02:00:00Z".split("T")[0]
// var curDate = new Date().toLocaleString().split(',')[0];
