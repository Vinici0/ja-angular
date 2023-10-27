import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, of, map, catchError } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/app/environments/environmen';
import { LoginResponse, User } from '../interfaces/user.interface';
import { Usuario } from '../models/usuario.model';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';
import { Company } from '../models/company.model';
import {
  ComapnyReponse,
  Empresa,
} from 'src/app/maintenance/interfaces/company.interface';

const base_url = environment.base_url;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = base_url;
  private user?: User;
  public usuario: Usuario;
  public company: Company;
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
    return this.http.get(`${base_url}/auth/renew`, this.headers).pipe(
      map((resp: any) => {
        const { email, nombre, role, img = '', idJaUsuario } = resp.data;
        this.usuario = new Usuario(nombre, email, '', role, img, idJaUsuario);
        this.getCompany().subscribe();
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

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/users`, formData).pipe(
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

    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/users?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url, this.headers).pipe(
      map((resp) => {
        const usuarios = resp.usuarios.map(
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
    const url = `${base_url}/users/${usuario.idJaUsuario}`;
    return this.http.delete(url, this.headers);
  }

  logout = () => {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth');
  };

  /* Company */
  getCompany(): Observable<Empresa[]> {
    const url = `${base_url}/config/empresa`;
    return this.http.get<ComapnyReponse>(url, this.headers).pipe(
      map((resp) => {
        const { empresa } = resp.data;
        this.company = new Company(
          empresa[0].nombreEmpresa,
          empresa[0].rucEmpresa,
          empresa[0].direccionEmpresa,
          empresa[0].telefonoEmpresa,
          empresa[0].emailEmpresa,
          empresa[0].mensajeEmpresa,
          empresa[0].img || '',
          empresa[0].idEmpresa ? empresa[0].idEmpresa.toString() : ''
        );
        return empresa;
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }
}
