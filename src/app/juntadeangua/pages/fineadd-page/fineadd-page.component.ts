import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';
import { SearchClientComponent } from '../../modals/search-client/search-client.component';

@Component({
  selector: 'app-fineadd-page',
  templateUrl: './fineadd-page.component.html',
  styleUrls: ['./fineadd-page.component.css'],
})
export class FineaddPageComponent {

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

  searchClient() {
    this.dialog
      .open(SearchClientComponent, {
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
