import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Measure } from '../../interfaces/measure.interface';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';
import { MatSort } from '@angular/material/sort';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

interface TableRow {
  Nombre: string;
  Manzana: string;
  Lote: string;
  Codigo: string;
  Meses: string;
  Saldo: string;
}

@Component({
  selector: 'app-service-expense',
  templateUrl: './service-expense.component.html',
  styles: [],
})
export class ServiceExpenseComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnFilters: { [key: string]: string } = {};
  endDate = new Date();
  filterAnio: any;
  formGroup: FormGroup;
  loadingPdf = false;
  pdfurl: string = '';
  selectedDia: string = '';
  selectedMes: string = '';
  selectedMesesAtraso: string = '';
  startDate = new Date();

  constructor(
    private measureServiceTsService: MeasureServiceTsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogView: MatDialog
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });

    // Obtener el mes y día actuales al inicializar el componente
    const currentDate = new Date();
    this.selectedMes = (currentDate.getMonth() + 1).toString(); // Se suma 1 ya que los meses en JavaScript van de 0 a 11
    this.selectedDia = currentDate.getDate().toString();
    this.selectedMesesAtraso = '2';
  }

  displayedColumns: string[] = [
    'Nombre',
    'Manzana',
    'Lote',
    'Codigo',
    'Meses',
    'Saldo',
  ];

  meses: { value: string; viewValue: string }[] = [
    { value: '1', viewValue: 'Enero' },
    { value: '2', viewValue: 'Febrero' },
    { value: '3', viewValue: 'Marzo' },
    { value: '4', viewValue: 'Abril' },
    { value: '5', viewValue: 'Mayo' },
    { value: '6', viewValue: 'Junio' },
    { value: '7', viewValue: 'Julio' },
    { value: '8', viewValue: 'Agosto' },
    { value: '9', viewValue: 'Septiembre' },
    { value: '10', viewValue: 'Octubre' },
    { value: '11', viewValue: 'Noviembre' },
    { value: '12', viewValue: 'Diciembre' },
  ];

  dias: { value: string; viewValue: string }[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
    { value: '4', viewValue: '4' },
    { value: '5', viewValue: '5' },
    { value: '6', viewValue: '6' },
    { value: '7', viewValue: '7' },
    { value: '8', viewValue: '8' },
    { value: '9', viewValue: '9' },
    { value: '10', viewValue: '10' },
    { value: '11', viewValue: '11' },
    { value: '12', viewValue: '12' },
    { value: '13', viewValue: '13' },
    { value: '14', viewValue: '14' },
    { value: '15', viewValue: '15' },
    { value: '16', viewValue: '16' },
    { value: '17', viewValue: '17' },
    { value: '18', viewValue: '18' },
    { value: '19', viewValue: '19' },
    { value: '20', viewValue: '20' },
    { value: '21', viewValue: '21' },
    { value: '22', viewValue: '22' },
    { value: '23', viewValue: '23' },
    { value: '24', viewValue: '24' },
    { value: '25', viewValue: '25' },
    { value: '26', viewValue: '26' },
    { value: '27', viewValue: '27' },
    { value: '28', viewValue: '28' },
    { value: '29', viewValue: '29' },
    { value: '30', viewValue: '30' },
    { value: '31', viewValue: '31' },
  ];

  mesesAtraso: { value: string; viewValue: string }[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
    { value: '4', viewValue: '4' },
    { value: '5', viewValue: '5' },
    { value: '6', viewValue: '6' },
    { value: '7', viewValue: '7' },
    { value: '8', viewValue: '8' },
    { value: '9', viewValue: '9' },
    { value: '10', viewValue: '10' },
    { value: '11', viewValue: '11' },
    { value: '12', viewValue: '12' },
  ];

  ngOnInit(): void {
    this.execCorte();
  }

  execCorte() {
    this.measureServiceTsService.execCorte().subscribe((resp) => {
      console.log(resp);
      this.dataSource = new MatTableDataSource(resp.data.measure);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
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

  getMes() {
    // Actualizar lógica según sea necesario
    console.log('Mes seleccionado:', this.selectedMes);
  }

  getDia() {
    // Actualizar lógica según sea necesario
    console.log('Día seleccionado:', this.selectedDia);
  }

  onSubmitForm() {
    console.log(this.formGroup.value);
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

  openDialog() {
    if (this.dataSource.sort) {
      const sortedData = this.dataSource.sortData(
        this.dataSource.filteredData.slice(),
        this.dataSource.sort
      );
      this.measureServiceTsService
        .imprimirCorte(sortedData)
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

  printCorte() {
    const data = {
      meses: this.selectedMes,
      // El Dia actual  en numero
      day: this.selectedDia,
      monthsCorte: 11,
      month: 11,
    };

    this.measureServiceTsService.imprimirCorteNotificacion(data).subscribe(
      (resp: any) => {
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

  public downloadPDF() {
    const doc = new jsPDF();
    const addHeader = () => {
      doc.setFontSize(11);
      doc.setFont('bold');
      doc.text('Corte de Servicio', 11, 8);
      doc.setFontSize(8);
      doc.text(`Fecha: ${new Date().toLocaleString()}`, 11, 12);
    };
    // Define las columnas que deseas mostrar en el PDF
    const columns = ['Nombre', 'Codigo','Lote',  'Manzana', 'Meses', 'Saldo'];

    // Obtiene los datos de tu arreglo de objetos a mostrar en el PDF
    let sortedData = this.dataSource.filteredData.slice();

    if (this.dataSource.sort) {
      sortedData = this.dataSource.sortData(sortedData, this.dataSource.sort);
    }

    // Mapea los datos a un formato compatible con autoTable
    const rows: any[][] = sortedData.map((d) => [
      d.Nombre,
      d.codigo,
      d.Lote,
      d.Manzana,
      d.meses,
      `$${d.saldo.toFixed(2)}`,
    ]);

    // Establece el tamaño de la fuente
    doc.setFontSize(11);

    // Establece el titulo del PDF

    addHeader();
    // Crea la tabla
    autoTable(doc, {
      columns,
      body: rows,
      startY: 14,
      theme: 'grid',
      headStyles: {
        fillColor: '#ffffff',
        textColor: '#000000',
        fontSize: 10,
      },
      bodyStyles: {
        fillColor: '#ffffff',
        textColor: '#000000',
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: '#f5f5f5',
      },
    });

    // Abre el archivo PDF en una nueva ventana
    // doc.output('dataurlnewwindow');

    // Descarga el archivo PDF
    doc.save('corte-servicio.pdf');
  }
}
