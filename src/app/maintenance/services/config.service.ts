import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/app/environments/environmen';
import {
  Tabla,
  TableExtendsReponse,
} from '../interfaces/table-extends.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
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

  getEmpresaById(id: string): Observable<any> {
    const url = `${base_url}/config/${id}`;
    return this.http.get<any>(url);
  }

  updateEmpresa(id: string, data: any): Observable<any> {
    const url = `${base_url}/config/empresa/${id}`;
    return this.http.put<any>(url, data);
  }

  getTable(): Observable<Tabla[]> {
    const url = `${base_url}/config/tabla`;
    return this.http.get<TableExtendsReponse>(url, this.headers).pipe(
      map((resp) => {
        const { tabla } = resp.data;
        return tabla;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  updateTabla(data: Tabla): Observable<any> {
    const url = `${base_url}/config/tabla/${data.idTabla}`;
    return this.http.put<any>(url, data);
  }

  getInteres(): Observable<any> {
    const url = `${base_url}/config/interes`;
    return this.http.get<any>(url);
  }

  updateInteres(id: number, data: any): Observable<any> {
    const url = `${base_url}/config/interes/${id}`;
    return this.http.put<any>(url, data);
  }

  async  actualizarFoto(archivo: File, tipo: 'company' | 'user', id: string) {
    const url = `${base_url}/uploads/${tipo}/${id}`;
    const formData = new FormData();
    formData.append('archivo', archivo);
    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'x-token': this.token,
      },
      body: formData,
    });
    const data = await resp.json();

    if (data.ok) {
      return data.img;
    }

    return data;
  }

  updateAllMeasurements()  : Observable<any> {
    const url = `${base_url}/measures/updateAllMeasurements`;
    return this.http.put(url, {});
  }
}
