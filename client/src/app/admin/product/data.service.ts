import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
// Main api url to call api
  uri = 'http://localhost:8081/api/product';

  constructor(private http: HttpClient) {
  }

// To Get The List Of Employee
  getUsers(page, limit, sort, order, filter) {
    return this
      .http
      .get('http://localhost:8081/api/product', {
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
    return this.http.put(`${this.uri}/${body._id}`, body);
  }

// To Create/Add New Employee
  addUser(body) {
    return this.http.post(`${this.uri}`, body);
  }

// To Delete Any Employee
  deleteUser(body) {
    return this.http.delete(`${this.uri}/${body._id}`);
  }

}
