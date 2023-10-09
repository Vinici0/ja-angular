import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environmen';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private router: Router, private http: HttpClient) {}

  getAllClients() {
    const url = `${base_url}/customers`;
    return this.http.get<any>(url);
  }
}
