import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environmen';

import { catchError, map, of } from 'rxjs';
import { Client, ClienteReponse } from '../interfaces/customer.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}
  public countCustomersAll: number = 0;
  getAllClients(): any {
    const url = `${base_url}/customers`;
    return this.http.get<ClienteReponse>(url).pipe(
      map((resp) => {
        // this.countCustomersAll = resp.data.total;
        const clientes = resp.data.clients;
        return clientes;
      })
    );
  }

  getClientById(id: any): any {
    const url = `${base_url}/customers/${id}`;
    return this.http.get(url);
  }

  addCustomer(customer: any): any {
    const url = `${base_url}/customers`;
    return this.http.post(url, customer);
  }

  pdfCUstomerView(): any {
    const url = `${base_url}/reports/pdf-customer`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>(url, {nomber:'vinicio'},{ headers, responseType: 'blob' as 'json' })
      .pipe(
        map((resp) => {
          // console.log(resp.data);
          return resp;
        }),
        catchError((err) => of(err.error))
      );
  }

  createMeusereAndUpdateCustomer(data: any): any {
    console.log(data, 'service');

    const url = `${base_url}/measures/createMeusereAndUpdateCustomer`;
    return this.http.post(url, data);
  }
}
