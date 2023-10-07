import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Measure } from '../../interfaces/measure';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-service-expense',
  templateUrl: './service-expense.component.html',
  styles: [],
})
export class ServiceExpenseComponent implements OnInit {
  months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  // measurelist!: Measure[];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  startDate = new Date();
  endDate = new Date();
  formGroup: FormGroup;
  filterAnio:any ;
  constructor(
    private measureServiceTsService: MeasureServiceTsService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  displayedColumns: string[] = [
    'Anio',
    'Mes',
    'Nombre',
    'Codigo',
    'Manzana',
    'Lote',
    'LecturaAnterior',
    'LecturaActual',
    'Basico',
    'Pago',
    'Saldo',
    'Excedente',
    'Total',
    'Acumulado',
  ];

  ngOnInit(): void {
    this.getMeasures();
  }

  getMeasures() {
    this.measureServiceTsService.getMeasures().subscribe((resp) => {
      console.log(resp.data.measure); // Esto imprimirá la respuesta en la consola
      this.dataSource = new MatTableDataSource(resp.data.measure);
      this.dataSource.paginator = this.paginatior;
    });
  }

  sortData(event: any) {
    console.log(event);
  }

  editcustomer(id: number) {}

  detailcustomer(id: number) {}

  addcustomer() {}

  Filterchange(event: any) {
    console.log(event);
  }

  onSubmitForm() {
    console.log(this.formGroup.value);
  }

  applyFilter() {
  }
}
