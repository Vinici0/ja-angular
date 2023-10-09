import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Measure, Data } from '../../interfaces/measure';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';

@Component({
  selector: 'app-add-extent',
  templateUrl: './add-extent.component.html',
  styleUrls: ['./add-extent.component.css'],
})
export class AddExtentComponent {
  public pdfurl = '';
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

  displayedColumns: string[] = [
    // 'Anio',
    // 'Mes',
    'Nombre',
    'Codigo',
    'Manzana',
    'Lote',
    'LecturaAnterior',
    'LecturaActual',
    'Basico',
    // 'Pago',
    'Excedente',
    'Total',
    // 'Saldo',
    // 'Acumulado',
    'acciones',
  ];

  columnFilters: { [key: string]: string } = {};

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  @ViewChildren('inputElement') inputElements: QueryList<ElementRef>;

  startDate = new Date();
  endDate = new Date();
  formGroup: FormGroup;

  constructor(
    private measureServiceTsService: MeasureServiceTsService,
    private fb: FormBuilder,
    public dialogView: MatDialog
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getMeasures();
  }

  getMeasures() {
    this.measureServiceTsService
      .getMeasurementsByMonthAndYear(8, 2023)
      .subscribe((resp) => {
        this.dataSource = new MatTableDataSource(resp.data.measure);
        this.dataSource.paginator = this.paginatior;
      });
  }

  filterByManzana(event: any) {
    console.log(event.target.value); // Verifica si event.target.value es lo que esperas
    this.dataSource.data.forEach((measure: Measure) => {
      measure.Manzana = measure.Manzana.trim();
    });
    this.dataSource.filter = event.target.value.trim().toLowerCase();
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

  updateLecturaActual(
    Anio: any,
    Mes: any,
    LecturaAnterior: any,
    LecturaActual: any,
    idCliente: any,
    Codigo: any,
    Basico: any,
    Acumulado: any,
    element: any
  ) {
    let Excedente = LecturaActual - LecturaAnterior;
    console.log(Excedente);

    // const Basico = 5.5;
    let ExcedenteV = 0;

    if (Excedente >= 0 && Excedente <= 15) {
      Excedente = 0;
      ExcedenteV = 0;
    } else if (Excedente >= 16 && Excedente <= 39) {
      Excedente = Excedente - 15;
      ExcedenteV = 0.25 * Excedente;
    } else if (Excedente >= 40 && Excedente <= 49) {
      Excedente = Excedente - 15;
      ExcedenteV = 0.5 * Excedente;
    } else if (Excedente >= 50) {
      Excedente = Excedente - 15;
      ExcedenteV = 1 * Excedente;
    }

    const Total = Basico + ExcedenteV;
    const Pago = 0; // TODO: Implementar en la base de datos

    // Actualiza las propiedades del objeto element
    element.Excedente = Excedente;
    element.Basico = Basico;
    element.ExcedenteV = ExcedenteV;
    element.Total = Total;
    element.Pago = Pago;
    element.Saldo = Total;
    // element.Acumulado  = Acumulado + Total;
  }

  filtrarSoloPorNumeroDeManzana(event: any) {
    const filtro = event.target.value.trim().toLowerCase();

    // Aplicar el filtro solo a las filas con el número de manzana deseado
    this.dataSource.filter = filtro;

    // Si deseas ocultar las filas con números de manzana diferentes, puedes hacer lo siguiente:
    if (filtro !== '') {
      const numeroManzana = filtro; // Puedes ajustar esto según cómo obtengas el número de manzana deseado
      this.dataSource.filteredData = this.dataSource.filteredData.filter(
        (measure: Measure) => {
          return measure.Manzana === numeroManzana;
        }
      );
    }
  }

  applyFilter(event: Event, columnName: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.columnFilters[columnName] = filterValue;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const transformedData = (data[columnName] || '').trim().toLowerCase();
      return transformedData.includes(filter);
    };

    this.dataSource.filter = this.columnFilters[columnName];
  }

  // imprimirConsumo() {
  //   this.measureServiceTsService.imprimirConsumo().subscribe((resp) => {
  //     const blobUrl = window.URL.createObjectURL(resp);
  //     console.log(blobUrl);

  //     this.pdfurl = blobUrl;
  //     // window.open( blobUrl, '_blank' );
  //   });
  // }

  openDialog() {
    this.measureServiceTsService
      .imprimirConsumo(this.dataSource.filteredData)
      .subscribe((resp) => {
        const blobUrl = window.URL.createObjectURL(resp);
        this.pdfurl = blobUrl;

        this.dialogView.open(PdfViewComponent, {
          width: '750px',
          height: '700px',
          data: {
            pdfurl: this.pdfurl,
          },
        });
      });
  }
}
