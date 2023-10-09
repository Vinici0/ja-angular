import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/app/environments/environmen';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class MeterService {
  constructor(private http: HttpClient) {}

  getMeters() {
    const url = `${base_url}/meters`;
    return this.http.get<any>(url);
  }

  updateMeterStatus(id: string, estado: any) {
    const url = `${base_url}/meters/${id}`;
    return this.http.put<any>(url, { estado });
  }

  imprimirConsumo(data: any): Observable<any> {
    console.log(data);

    const url = `${base_url}/reports/pdf-meter`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(url, data, { headers, responseType: 'blob' as 'json' })
      .pipe(
        map((resp) => {
          // console.log(resp.data);
          return resp;
        }),
        catchError((err) => of(err.error))
      );
  }
}
