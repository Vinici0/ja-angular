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
import Swal from 'sweetalert2';
import { Measure, Data } from '../../interfaces/measure.interface';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/maintenance/services/config.service';

@Component({
  selector: 'app-add-extent',
  templateUrl: './add-extent.component.html',
  styleUrls: ['./add-extent.component.css'],
})
export class AddExtentComponent implements OnInit {
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
    'Saldo',
    // 'Acumulado',
    'acciones',
  ];

  columnFilters: { [key: string]: string } = {};

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChildren('inputElement') inputElements: QueryList<ElementRef>;

  startDate = new Date();
  endDate = new Date();
  formGroup: FormGroup;
  isgeneraAndCalculo = false;
  // Obtener la fecha actual
  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth() + 1; // Se agrega 1 porque los meses en JavaScript van de 0 a 11
  currentYear: number = this.currentDate.getFullYear();
  public loading = false;

  constructor(
    private measureServiceTsService: MeasureServiceTsService,
    private fb: FormBuilder,
    public dialogView: MatDialog,
    private router: Router,
    private configService: ConfigService
  ) {
    this.formGroup = this.fb.group({
      year: ['2023', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  ngOnInit(): void {
    this.isgeneraAndCalculo = false;
    this.formGroup.controls['year'].setValue(this.selectedYear);
    this.formGroup.controls['fechaFin'].setValue(
      this.months[this.selectedMonth - 1]
    );
          this.getMeasures();
    // debugger;
    // this.measureServiceTsService.generaAndCalculo().subscribe(
    //   (resp) => {
    //     if (resp) {
    //     }
    //   },
    //   (error) => {
    //     this.getMeasures();
    //     console.log(error);
    //   }
    // );
  }

  isLoading = true;

  getMeasures() {
    console.log(this.selectedMonth, this.selectedYear);
    this.measureServiceTsService
      .getMeasurementsByMonthAndYear(this.selectedMonth, this.selectedYear)

      .subscribe((resp) => {
        if (resp.data.measure.length > 1) {
          console.log('entro al if');

          this.measureServiceTsService.generaAndCalculo().subscribe(
            (resp) => {
              if (resp) {
              }
            },
            (error) => {}
          );
        }
        this.dataSource = new MatTableDataSource(resp.data.measure);
        this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;
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

  editMeasure(idCliente: number, idMedida: number) {
    this.router.navigate(['/junta-de-angua/pages/edit-measure'], {
      queryParams: { idCliente, idMedida },
    });
  }

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
    this.measureServiceTsService.actualizarMedida(element).subscribe(
      (resp) => {
        debugger;
        console.log(resp);
        element.Acumulado = resp.data.measure.Acumulado;
        element.Saldo = resp.data.measure.Saldo + 3;
        element.Pago = resp.data.measure.Pago;
        element.Total = resp.data.measure.Total;
        element.Excedente = resp.data.measure.Excedente;
        element.Basico = resp.data.measure.Basico;
        element.ExcedenteV = resp.data.measure.ExcedenteV;
        Swal.fire({
          text: 'Actualización exitosa',
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 900,
          width: '300px',
          icon: 'success',
          toast: true,
        });
      },
      (error) => {
        console.log('Ingresando al error');
        debugger;
        console.log(error);
        Swal.fire({
          text: 'Error al actualizar',
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 900,
          width: '300px',
          icon: 'error',
          toast: true,
        });
      }
    );
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadingPdf = false;

  openDialog() {
    if (this.dataSource.sort) {
      this.loadingPdf = true;

      const sortedData = this.dataSource.sortData(
        this.dataSource.filteredData.slice(),
        this.dataSource.sort
      );

      this.measureServiceTsService.imprimirConsumo(sortedData).subscribe(
        (resp) => {
          const blobUrl = window.URL.createObjectURL(resp);
          this.pdfurl = blobUrl;

          this.dialogView.open(PdfViewComponent, {
            width: '750px',
            height: '700px',
            data: {
              pdfurl: this.pdfurl,
            },
          });

          this.loadingPdf = false; // Establece como falso cuando se ha cargado el PDF
        },
        (error) => {
          this.loadingPdf = false; // Establece como falso en caso de error
          // Realiza el manejo de errores aquí si es necesario
        }
      );
    }
  }

  // OpenDialog registro actual selectsionado
  openDialogRegistroActual(element: any) {
    const selecActual = [];
    selecActual.push(element);

    this.measureServiceTsService.imprimirConsumo(selecActual).subscribe(
      (resp) => {
        const blobUrl = window.URL.createObjectURL(resp);
        this.pdfurl = blobUrl;

        this.dialogView.open(PdfViewComponent, {
          width: '750px',
          height: '700px',
          data: {
            pdfurl: this.pdfurl,
          },
        });

        this.loadingPdf = false; // Establece como falso cuando se ha cargado el PDF
      },
      (error) => {
        this.loadingPdf = false; // Establece como falso en caso de error
        // Realiza el manejo de errores aquí si es necesario
      }
    );
  }

  updateLecturaAnterior(
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
    this.measureServiceTsService.actualizarMedida(element).subscribe(
      (resp) => {
        console.log(resp);
        element.Acumulado = resp.data.measure.Acumulado;
        element.Saldo = resp.data.measure.Saldo;
        element.Pago = resp.data.measure.Pago;
        element.Total = resp.data.measure.Total;
        element.Excedente = resp.data.measure.Excedente;
        element.Basico = resp.data.measure.Basico;
        element.ExcedenteV = resp.data.measure.ExcedenteV;
        Swal.fire({
          text: 'Actualización exitosa',
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 900,
          width: '300px',
          icon: 'success',
          toast: true,
        });
      },
      (error) => {
        console.log('Ingresando al error');
        console.log(error);
        Swal.fire({
          text: 'Error al actualizar',
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 900,
          width: '300px',
          icon: 'error',
          toast: true,
        });
      }
    );
  }

  actualizarMedidaAll() {
    console.log(this.selectedYear, this.selectedMonth);
    this.measureServiceTsService
      .actualizarMedidaAll({ Anio: this.selectedYear, Mes: this.selectedMonth })
      .subscribe((resp) => {
        this.getMeasures();
        Swal.fire({
          text: 'Actualización exitosa',
          position: 'bottom-end', // Posición en la parte inferior derecha
          showConfirmButton: false, // No muestra el botón de confirmación
          timer: 900, // Duración en milisegundos (1 segundo en este caso)
          width: '300px', // Ancho del modal en píxeles
          icon: 'success',
          //que el icono aparece a la izquierda
          toast: true, // El modal se muestra como toast
        });
      });
  }

  recalcular() {
    this.loading = true;
    this.configService
      .updateDatosAlcantarilladoConSaldoPositivo()
      .subscribe((resp: any) => {
        this.configService.updateAllMeasurements().subscribe(
          (resp: any) => {
            this.configService
              .calculateAllAndUpdateMedidasAcumulado()
              .subscribe((resp) => {
                this.loading = false;
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  width: 450,
                  timer: 2000,
                  title: 'Se ha actualizado correctamente',
                  icon: 'success',
                });
              });
          },
          (err) => {
            this.loading = false;
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              width: 450,
              timer: 2000,
              title: 'No se ha podido actualizar',
              icon: 'error',
            });
          }
        );
      });
  }
}
