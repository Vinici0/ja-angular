import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from 'src/app/environments/environmen';
import { FineReponse } from '../interfaces/fine.interface';
import { FinesDetailsReponse } from '../interfaces/fineDetails.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class FineServiceDetails {
  constructor(private http: HttpClient) { }

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




  // No se usa ya
  updateFineDetail(id: any, data: any): Observable<any> {
    const url = `${base_url}/details/${id}`;
    return this.http.put<any>(url, data);
  }

  updateFineDetailAbono(id_multaDetalle: any, id_cliente: any, abonoNumber: any): Observable<any> {
    const url = `${base_url}/details/${id_multaDetalle}/abono`;
    const body = { id_cliente, abonoNumber }; // Datos que se envían en el cuerpo de la solicitud

    return this.http.put(url, body).pipe(
      catchError(error => {
        console.error('Error al enviar el abono', error);
        return throwError(error); // Devolver el error recibido desde el servidor
      })
    );
  }

  getMultaDetalleAbono(id: string): Observable<any> {
    const url = `${base_url}/details/abonos/${id}`;
    return this.http.get<FinesDetailsReponse>(url, this.headers).pipe(
      map((resp) => {
        console.log('resp', resp);

        const fines = resp.data.fineDetails;
        return fines;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  deleteFineDetailAbono(id: string): Observable<any> {
    const url = `${base_url}/details/abonos/${id}`;
    return this.http.delete<any>(url);
  }



  
  deleteFineDetail(id: string): Observable<any> {
    const url = `${base_url}/details/${id}`;
    return this.http.delete<any>(url);
  }

  calculateTotalAmount(): Observable<any> {
    const url = `${base_url}/details/calculateTotalAmount`;
    return this.http.get<any>(url);
  }

  // router.get("/client/:id", getFineDetailsByIdClient);
  getFineDetailsByIdClient(id: string): Observable<any> {
    const url = `${base_url}/details/client/${id}`;
    return this.http.get<FinesDetailsReponse>(url, this.headers).pipe(
      map((resp) => {
        console.log('resp', resp);

        const fines = resp.data.fineDetails;
        return fines;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  // router.get("/getCustomerInformation/:id", getCustomerInformation);
  getCustomerInformation(id: string): Observable<any> {
    const url = `${base_url}/measures/getCustomerInformation/${id}`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp) => {
        const measure = resp.data.measure;
        return measure;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  getMeasureTotalFineByManzanaLote() {
    const url = `${base_url}/measures/getMeasureTotalFineByManzanaLote`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp) => {
        const measure = resp.data.measure;
        return measure;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

}
