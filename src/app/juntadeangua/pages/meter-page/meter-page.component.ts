import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MeterService } from '../../services/meter.service';
@Component({
  selector: 'app-meter-page',
  templateUrl: './meter-page.component.html',
  styleUrls: ['./meter-page.component.css'],
})
export class MeterPageComponent implements OnInit {
  displayedColumns: string[] = [
    'Nombre',
    'Codigo',
    'Manzana',
    'Lote',
    'Estado',
  ];

  columnFilters: { [key: string]: string } = {};

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  constructor(private meterService: MeterService) {}

  ngOnInit(): void {
    this.getMeters();
  }

  getMeters() {
    this.meterService.getMeters().subscribe((resp: any) => {
      console.log(resp.data.meters);

      this.dataSource = new MatTableDataSource(resp.data.meters);
      this.dataSource.paginator = this.paginatior;
    });
  }

  applyFilter(event: Event, columnName: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.columnFilters[columnName] = filterValue;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const transformedData = (data[columnName] || '').trim().toLowerCase();
      return transformedData.includes(filter);
    };

    this.dataSource.filter = this.columnFilters[columnName];
  }

  openDialog() {}

  changeStatus(element: any): void {
    // Cambia el estado del elemento al hacer clic en el botón
    element.Estado = element.Estado === 'Dañado' ? 'Estable' : 'Dañado';
  }


  getTextColorClass(element: any): string {
    return element.Estado === 'Dañado' ? 'text-danger' : '';
  }

}
