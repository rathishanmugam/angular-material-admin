// import { Injectable } from '@angular/core';
//
// @Injectable()
// export class DataService {
//   constructor() {}
//
//   getGdpData() {
//     return [
//       {
//         name: 'GM',
//         series: [
//           {
//             name: '2010',
//             value: 406
//           },
//           {
//             name: '2000',
//             value: 369
//           },
//           {
//             name: '1990',
//             value: 314
//           }
//         ]
//       },
//       {
//         name: 'US',
//         series: [
//           {
//             name: '2010',
//             value: 497
//           },
//           {
//             name: '2000',
//             value: 459
//           },
//           {
//             name: '1990',
//             value: 370
//           }
//         ]
//       },
//       {
//         name: 'FR',
//         series: [
//           {
//             name: '2010',
//             value: 367
//           },
//           {
//             name: '2000',
//             value: 347
//           },
//           {
//             name: '1990',
//             value: 294
//           }
//         ]
//       },
//       {
//         name: 'CA',
//         series: [
//           {
//             name: '1990',
//             value: 337
//           },
//           {
//             name: '2000',
//             value: 598
//           },
//           {
//             name: '2010',
//             value: 396
//           }
//         ]
//       }
//     ];
//   }
// }
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {ISales, ICredit} from '../salesReport/salesReport';
export interface IChart {
  _id: string;
  customerName: string;
  salesDate: Date;
  product: string;
  productType: string;
  qty: number;
  rate: number;
}
@Injectable({providedIn: 'root'})
export class DataService {
  private salesUrl = 'http://localhost:8081/api/sal/chart';
  private saleUrl = 'http://localhost:8081/api/sale/chart/bar';

  constructor(private http: HttpClient) {
  }
  getProducts(): Observable<IChart[]> {
    return this.http.get<IChart[]>(`${this.salesUrl}`);
  }
  getProduct(): Observable<IChart[]> {
    return this.http.get<IChart[]>(`${this.saleUrl}`);
  }
}
