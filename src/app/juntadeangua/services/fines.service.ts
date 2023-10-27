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
export class FineService {
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

  getFineById(id: string): Observable<any> {
    const url = `${base_url}/fines/${id}`;
    return this.http.get<any>(url);
  }

  createFine(data: any): Observable<any> {
    const url = `${base_url}/fines`;
    return this.http.post<any>(url, data);
  }

  updateFine(id: string, data: any): Observable<any> {
    const url = `${base_url}/fines/${id}`;
    return this.http.put<any>(url, data);
  }

  deleteFine(id: string): Observable<any> {
    const url = `${base_url}/fines/${id}`;
    return this.http.delete<any>(url);
  }



}
