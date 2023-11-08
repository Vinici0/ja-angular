/*
  getClientPais,
  getClienteCiudad,
  getClienteTipoRuc,
  getClienteTipo,
*/
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
export class ConfigService {
  constructor(private http: HttpClient) {}
  url = `${base_url}/config`;

  getClientPais() {
    const url = `${this.url}/pais`;
    return this.http.get(url);
  }

  getClienteCiudad() {
    const url = `${this.url}/ciudad`;
    return this.http.get(url);
  }

  getClienteTipoRuc() {
    const url = `${this.url}/tipoRuc`;
    return this.http.get(url);
  }

  getClienteTipo() {
    const url = `${this.url}/tipo`;
    return this.http.get(url);
  }
}
