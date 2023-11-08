import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/app/environments/environmen';
import { UsuarioReponse } from '../interfaces/user.interface';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public usuarios: Usuario[];

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

  getUsers(): Observable<any> {
    const url = `${base_url}/users`;
    return this.http.get<UsuarioReponse>(url, this.headers).pipe(
      map((resp) => {
        const usuarios = resp.data.usuarios;
        this.usuarios = usuarios;
        return usuarios;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  getUsuarioPorId(id: any): Observable<any> {
    const url = `${base_url}/users/${id}`;
    return this.http.get<any>(url, this.headers).pipe(
      map((resp) => {
        console.log(resp);

        const usuario = resp.data[0];
        console.log(usuario);

        return usuario;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  createUser(usuario: any): Observable<any> {
    const url = `${base_url}/users`;
    return this.http.post(url, usuario, this.headers);
  }

  actualizarUsuario(id: any, usuario: any): Observable<any> {
    const url = `${base_url}/users/${id}`;
    console.log('console.log(usuario);');
    console.log(usuario);
    return this.http.put(url, usuario, this.headers);
  }

  eliminarUsuario(id: any): Observable<any> {
    const url = `${base_url}/users/${id}`;
    return this.http.delete(url, this.headers);
  }

  updateUserInfo(id: any, usuario: any): Observable<any> {
    console.log(usuario, id);

    const url = `${base_url}/users/info/${id}`;
    return this.http.put(url, usuario, this.headers);
  }
}
