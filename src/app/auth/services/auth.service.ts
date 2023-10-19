import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, of, map, catchError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/app/environments/environmen';
import { LoginResponse, User } from '../interfaces/user.interface';
import { Usuario } from '../models/usuario.model';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = base_url;
  private user?: User;
  public usuario: Usuario;
  constructor(private router: Router, private http: HttpClient) {}

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.idJaUsuario || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        const { email, nombre, role, img = '', idJaUsuario } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', role, img, idJaUsuario);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((user) => {
          localStorage.setItem('token', user.token);
          this.user = user.data;
        })
      );
  }

  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    const token = localStorage.getItem('token');
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      map((user) => !!user),
      catchError((err) => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    //El post trae la informacion que se envia al backend
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role?: string }) {
    data = {
      ...data,
      role: this.usuario.role,
    };

    console.log('Informacion del usuario: ');
    console.log(data);
    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url, this.headers).pipe(
      map((resp) => {
        //Obtenemos la informacion de los usuarios
        const usuarios = resp.usuarios.map(
          //Mapeamos la informacion de los usuarios
          (user) =>
            new Usuario(
              user.nombre,
              user.email,
              '',
              user.role,
              user.img,
              user.idJaUsuario
            )
        );
        return {
          total: resp.total,
          usuarios,
        };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.idJaUsuario}`;
    return this.http.delete(url, this.headers);
  }

  logout = () => {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  };
}
