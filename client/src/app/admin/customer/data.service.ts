import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { EnvService } from '../../env.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
// Main api url to call api
  uri = 'http://localhost:8081/api/customer';

  constructor(private http: HttpClient, private env: EnvService) {
  }

// To Get The List Of Employee
  getUsers(page, limit, sort, order, filter) {
    console.log('THE WINDOW ENVIRONMENT PARAMETER IS -------->', this.env.environmentName);

    return this
      .http
      .get(`${this.env.environmentName}/api/customer`, {

        // .get('http://localhost:8081/api/customer', {
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
     return this.http.get(`${this.env.environmentName}/api/customer/${empid}`);

    // return this.http.get(`${this.uri}/${empid}`);
  }

// To Updated Specific Employee
  updateUser(body) {
    console.log('the body to update: ' + JSON.stringify(body, null, 2));
    return this.http.put(`${this.env.environmentName}/api/customer/${body.addr}/${body.id}`, body);

    // return this.http.put(`${this.uri}/${body.addr}/${body.id}`, body);
  }

// To Create/Add New Employee
  addUser(body) {
    return this.http.post(`${this.env.environmentName}/api/customer`, body);

    // return this.http.post(`${this.uri}`, body);
  }

// To Delete Any Employee
  deleteUser(body) {
    return this.http.delete(`${this.env.environmentName}/api/customer/${body.addr}/${body.id}`);

    // return this.http.delete(`${this.uri}/${body.addr}/${body.id}`);
  }

}

