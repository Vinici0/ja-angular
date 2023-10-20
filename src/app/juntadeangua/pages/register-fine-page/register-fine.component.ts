import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-register-fine',
  templateUrl: './register-fine.component.html',
  styleUrls: ['./register-fine.component.css'],
})
export class RegisterFinePageComponent {
  displayedColumns: string[] = [
    'nombreApellidos',
    'correo',
    'rolDescripcion',
    'acciones',
  ];

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.mostrarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {}

  mostrarUsuarios() {}

  editarUsuario(id: any) {}

  eliminarUsuario(id: any) {}

  agregarUsuario() {
    // this.dialog.open(DialogUsuarioComponent, {
    //     disableClose: true
    //   }).afterClosed().subscribe(result => {
    //     if (result === "agregado") {
    //       this.mostrarUsuarios();
    //     }
    //   });
  }
}
