import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environmen';

import { map } from 'rxjs';
import { Client, ClienteReponse } from '../interfaces/customer.interface';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private router: Router, private http: HttpClient) {}
  public countCustomersAll: number = 0;
  getAllClients(): any{
    const url = `${base_url}/customers`;
    return this.http.get<ClienteReponse>(url).pipe(
      map((resp) => {
        this.countCustomersAll = resp.data.total;
        const clientes = resp.data.clients;
        return clientes;
      })
    );
  }


}
