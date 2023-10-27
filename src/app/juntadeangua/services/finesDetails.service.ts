import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/app/environments/environmen';
import { FineReponse } from '../interfaces/fine.interface';
import { FinesDetailsReponse } from '../interfaces/fineDetails.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class FineServiceDetails {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  getFineDetails(): Observable<any> {
    const url = `${base_url}/details`;
    return this.http.get<FinesDetailsReponse>(url, this.headers).pipe(
      map((resp) => {
        const fines = resp.data.fineDetails;
        return fines;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  getFineDetailById(id: string): Observable<any> {
    const url = `${base_url}/details/${id}`;
    return this.http.get<FinesDetailsReponse>(url, this.headers).pipe(
      map((resp) => {
        const fines = resp.data.fineDetails;
        return fines;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  createFineDetail(data: any): Observable<any> {
    console.log('data', data);

    const url = `${base_url}/details`;
    return this.http.post<any>(url, data);
  }

  togglePaymentStatus(id: string, data: any): Observable<any> {
    console.log('id', id, 'data', data);

    const url = `${base_url}/details/${id}/paymentStatus`;
    return this.http.put<any>(url, data);
  }

  getFines(): Observable<any> {
    const url = `${base_url}/fines`;
    return this.http.get<FineReponse>(url, this.headers).pipe(
      map((resp) => {
        const fines = resp.data.fines;
        return fines;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  updateFineDetail(id: any, data: any): Observable<any> {
    const url = `${base_url}/details/${id}`;
    return this.http.put<any>(url, data);
  }

  deleteFineDetail(id: string): Observable<any> {
    const url = `${base_url}/details/${id}`;
    return this.http.delete<any>(url);
  }
}
