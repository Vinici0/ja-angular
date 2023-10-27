import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import Swal from 'sweetalert2';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Tabla } from '../../interfaces/table-extends.interface';

@Component({
  selector: 'app-table-extent-page',
  templateUrl: './table-extent-page.component.html',
  styleUrls: ['./table-extent-page.component.css'],
})
export class TableExtentPageComponent implements OnInit {
  dataSource!: MatTableDataSource<Tabla, MatTableDataSourcePaginator>;
  displayedColumns = ['Desde', 'Hasta', 'Valor'];
  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.getTabla();
  }

  getTabla() {
    this.configService.getTable().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginatior;
    });
  }

  onValueChange(element: any) {}

  updateTableExtents() {
    const data = this.dataSource.data;
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if (element.Desde < 0 || element.Hasta < 0 || element.ValorExc < 0) {
        Swal.fire('Error', 'No se permiten valores negativos', 'error');
        return;
      }
    }
    Swal.fire({
      title: '¿Desea actualizar los datos?',
      showCancelButton: true,
      confirmButtonText: `Actualizar`,
      cancelButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateTable(data);
        Swal.fire('Actualizado!', '', 'success');
      }
    });
  }

  updateTable(data: Tabla[]) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.configService.updateTabla(element).subscribe(
        (data) => {},
        (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      );
    }
  }
}
