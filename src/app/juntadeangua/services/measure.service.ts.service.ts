import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, map } from 'rxjs';
import { environment } from 'src/app/environments/environmen';
import { Router } from '@angular/router';
import { AnioAndMes, MeasureReponse } from '../interfaces/measure.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class MeasureServiceTsService {
  constructor(private router: Router, private http: HttpClient) {}

  getMeasures(): Observable<MeasureReponse> {
    const url = `${base_url}/measures`;
    return this.http.get<MeasureReponse>(url).pipe(
      map((resp) => {
        return resp;
      }),
      catchError((err) => of(err.error))
    );
  }

  getMeasurementsByMonthAndYear(
    month: number,
    year: number
  ): Observable<MeasureReponse> {
    const url = `${base_url}/measures/monthAndYear?Mes=${month}&Anio=${year}`;
    return this.http.get<MeasureReponse>(url).pipe(
      map((resp) => {
        console.log(resp.data);

        return resp;
      }),
      catchError((err) => of(err.error))
    );
  }

  imprimirConsumo(data: any): Observable<any> {
    const url = `${base_url}/reports/pdf`;
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

  execCorte() {
    const url = `${base_url}/measures/court`;
    return this.http.get<any>(url);
  }

  imprimirCorte(data: any): Observable<any> {
    const url = `${base_url}/reports/pdf-court`;
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

  actualizarMedida(data: any): Observable<any> {
    const url = `${base_url}/measures/updateMeasurement`;
    return this.http.post<any>(url, data);
  }

  actualizarMedidaAll(data: AnioAndMes): Observable<any> {
    const url = `${base_url}/measures/updateMeasurementForAll`;
    return this.http.put<any>(url, data);
  }

  getMeasureById(id: number): Observable<any> {
    const url = `${base_url}/measures/${id}`;
    return this.http.get<any>(url);
  }

  updateMeauseAndCustomer(data: any): Observable<any> {
    const url = `${base_url}/measures/updateMeauseAndCustomer`;
    return this.http.put<any>(url, data);
  }

  // router.post("/generaAndCalculo", generaAndCalculo);
  generaAndCalculo() {
    // Recuperar el año y mes actual
    const now = new Date();
    const anioActual = now.getFullYear(); // Obtiene el año actual
    const mesActual = now.getMonth() + 1; // Obtiene el mes actual (enero es 0)

    const mesActualFormatted = mesActual.toString().padStart(2, '0');

    const data = {
      Anio: anioActual,
      Mes: mesActualFormatted,
    };

    console.log(data);

    const url = `${base_url}/measures/generaAndCalculo`;
    return this.http.post(url, data);
  }
}
