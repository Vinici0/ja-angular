import { Component,ViewChild,OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';

const ELEMENT_DATA: any[] = [
  { idUsuario: 1, nombreApellidos: "jose mendez", correo: "jose@gmail.com", idRol: 1,rolDescripcion:"Administrador",clave:"1233"},
  { idUsuario: 2, nombreApellidos: "leo muñoz", correo: "leo@gmail.com", idRol: 2, rolDescripcion: "Empleado",clave:"4566"},
  { idUsuario: 3, nombreApellidos: "yamile pinto", correo: "yamile@gmail.com", idRol: 2, rolDescripcion: "Empleado",clave:"6788"},

];

@Component({
  selector: 'app-usuario-page',
  templateUrl: './usuario-page.component.html',
  styleUrls: ['./usuario-page.component.css']
})

export class UsuarioPageComponent  implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['nombreApellidos', 'correo', 'rolDescripcion','acciones'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.mostrarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
  }


  mostrarUsuarios() {

  }

  editarUsuario(id:any) {
  }

  eliminarUsuario(id:any) {
  }

  agregarUsuario() {
    this.dialog.open(DialogUsuarioComponent, {
        disableClose: true
      }).afterClosed().subscribe(result => {

        if (result === "agregado") {
          this.mostrarUsuarios();
        }
      });
  }

}
