import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  constructor(private http: HttpClient) {}

  getValues(): Observable<string[]> {
    return this.http
      .get<string[]>('https://localhost:44344/api/values')
      .pipe(tap(data => console.log(JSON.stringify(data))));
  }

  getValuesAnon(): Observable<string[]> {
    return this.http
      .get<string[]>('https://localhost:44344/api/values/get1')
      .pipe(tap(data => console.log(JSON.stringify(data))));
  }
}
