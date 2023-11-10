import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';
import { UserService } from '../../services/users.service';

import { AuthService } from '../../../auth/services/auth.service';
import { Usuario } from 'src/app/auth/models/usuario.model';

@Component({
  selector: 'app-usuario-page',
  templateUrl: './usuario-page.component.html',
  styleUrls: ['./usuario-page.component.css'],
})
export class UsuarioPageComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'email', 'role', 'acciones'];
  public usuario: Usuario;
  public usuarios: any[];

  dataSource = new MatTableDataSource<any, MatTableDataSourcePaginator>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.usuario = authService.usuario;
  }

  ngOnInit(): void {
    this.mostrarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {}

  mostrarUsuarios() {
    this.userService.getUsers().subscribe((resp) => {
      this.usuarios = resp;
      this.dataSource = new MatTableDataSource(this.usuarios);
      this.dataSource.paginator = this.paginator;
    });
  }

  editarUsuario(id: any) {
    //Si no es ADMIN_ROLE no puede editar usuarios
    if (this.usuario.role !== 'ADMIN_ROLE') {
      return;
    }
    this.userService.getUsuarioPorId(id).subscribe((usuario) => {
      this.dialog
        .open(DialogUsuarioComponent, {
          disableClose: true,
          data: usuario,
        })
        .afterClosed()
        .subscribe((result) => {
          console.log(result);

          if (result === 'actualizado') {
            this.mostrarUsuarios();
          }
        });
    });
  }

  eliminarUsuario(id: any) {
    //Si no es ADMIN_ROLE no puede eliminar usuarios
    if (this.usuario.role !== 'ADMIN_ROLE') {
      return;
    }
    this.userService.eliminarUsuario(id).subscribe((resp) => {
      if (resp) {
        this.mostrarUsuarios();
      }
    });
  }

  agregarUsuario() {

    //SI NO ADMIN_ROLE NO PUEDE AGREGAR USUARIOS
    if (this.usuario.role !== 'ADMIN_ROLE') {
      return;
    }


    this.dialog
      .open(DialogUsuarioComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'agregado') {
          this.mostrarUsuarios();
        }
      });
  }
}
