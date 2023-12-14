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

  // Obtener contidad de datos
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



  // Obtener lista de datos Clientes
  getListCiudades() {
    const url = `${base_url}/dashboard/listCiudades`;
    return this.http.get<any>(url);
  }

  getListPaises() {
    const url = `${base_url}/dashboard/listPaises`;
    return this.http.get<any>(url);
  }

  getListTipoClientes() {
    const url = `${base_url}/dashboard/listTipoCliente`;
    return this.http.get<any>(url);
  }

  getDataFiltradaClients(idCiudad: string, idPais: string, idTipoCliente: string): Observable<any[]> {
    const url = `${base_url}/dashboard/datosFiltradosClientes/${idCiudad}/${idPais}/${idTipoCliente}`;
    return this.http.get<any[]>(url);
  }



  // Obtener lista de medidores
  getListEstados() {
    const url = `${base_url}/dashboard/listEstados`;
    return this.http.get<any>(url);
  }

  getListCantidades() {
    const url = `${base_url}/dashboard/listCantidades`;
    return this.http.get<any>(url);
  }

  getListLotes() {
    const url = `${base_url}/dashboard/listLotes`;
    return this.http.get<any>(url);
  }

  getListManzanas() {
    const url = `${base_url}/dashboard/listManzanas`;
    return this.http.get<any>(url);
  }

  getDataFiltradaMeter(estado: string, numMedidores: string, lote: string, manzana: string): Observable<any[]> {
    const url = `${base_url}/dashboard/datosFiltradosMedidores/${estado}/${numMedidores}/${lote}/${manzana}`;
    return this.http.get<any[]>(url);
  }



  // Obtener lista de x



  // Obtener lista de datos Usuarios
  getListRoles() {
    const url = `${base_url}/dashboard/listRoles`;
    return this.http.get<any>(url);
  }

  graficaUsers_todos() {
    const url = `${base_url}/dashboard/graficaUserTodos`;
    return this.http.get<any>(url)
      .pipe(
        map((response: any) => {
          const formattedData = (response.data.total || []).map((item: any) => ({
            role: item.role,
            Total: item.Total,
            fecha: item.fecha ? new Date(item.fecha) : null,
          }));
          return { ...response, data: { total: formattedData } };
        })
      );
  }

  graficaUser(customRole: string): Observable<any> {
    const url = `${base_url}/dashboard/graficaUser/${customRole}`;
    return this.http.get<any>(url)
      .pipe(
        map((response: any) => {
          const formattedData = (response.data.total || []).map((item: any) => ({
            fechaIni: item.fechaIni,
            Total: item.Total,
            fecha: item.fecha ? new Date(item.fecha) : null,
          }));
          return { ...response, data: { total: formattedData } };
        })
      );
  }

}
