import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {map, tap, take, exhaustMap, catchError} from 'rxjs/operators';

import {Observable, of, throwError} from 'rxjs';
export interface ISales {
  organizer?: string
  title?: string
  description?: string
  date?: Date
  price?: number
  onlineUrl?: string,
}

@Injectable({providedIn: 'root'})
export class SuspenseService {
  events: ISales[];
  private eventUrl = 'http://localhost:8080/api/suspense';
  private eventUrls = 'http://localhost:8080/api/suspense';

  constructor(private http: HttpClient){}
  fetchEvent() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<ISales[]>(
      this.eventUrl,{ headers: headers }
    ).pipe(tap(events => {
        this.events = events;
        console.log('All: ' + JSON.stringify(events,null,5));
        console.log('iam stored in array: ' , this.events);


      }),
      catchError(this.handleError));
  }
  getCategorys(): Observable<string[]> {
    return  of(['sustainability','nature','animal welfare','housing','education','community','food']);
  }
  getEventById(id): Observable<ISales> {
    console.log('url' , `${this.eventUrls}/${id}`);
    return this.http.get<ISales>(`${this.eventUrls}/${id}`);
  }
  addEvent( body) {
    console.log('i pass');
    return this.http.post(`${this.eventUrl}`, body);
  }

// To Updated Specific Employee
  updateSession( body) {
    console.log('i pass', body);

    return this.http.put(`${this.eventUrl}`, body);
  }

// To Create/Add New Employee
  addSession(body) {
    console.log('i pass', body);

    return this.http.post(`${this.eventUrl}`, body);
  }

// To Delete Any Employee
  deleteEvent(id) {
    console.log('i delete', id);

    return this.http.delete(`${this.eventUrl}/${id}`);
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

