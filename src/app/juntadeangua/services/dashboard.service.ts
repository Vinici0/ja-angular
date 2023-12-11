import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/app/environments/environmen';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})

export class DashboardService {
  constructor(private http: HttpClient) { }

  getContClients() {
    const url = `${base_url}/dashboard/numClients`;
    return this.http.get<any>(url);
  }

  getContMeter() {
    const url = `${base_url}/dashboard/numMeter`;
    return this.http.get<any>(url);
  }

  getContReportMeter() {
    const url = `${base_url}/dashboard/numReportMeter`;
    return this.http.get<any>(url);
  }

  getContUsers() {
    const url = `${base_url}/dashboard/numUsers`;
    return this.http.get<any>(url);
  }
}
