import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environmen';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class MeterService {

  constructor(private http: HttpClient) { }


  getMeters() {
    const url = `${base_url}/meters`;
    return this.http.get<any>(url);
  }
}
