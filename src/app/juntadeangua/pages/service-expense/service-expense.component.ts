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

  startDate = new Date();
  endDate = new Date();
  formGroup: FormGroup;
  filterAnio: any;
  columnFilters: { [key: string]: string } = {};
  pdfurl: string = '';

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
  }

  displayedColumns: string[] = [
    'Nombre',
    'Manzana',
    'Lote',
    'Codigo',
    'Meses',
    'Saldo',
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

  printCorte() {}

  public downloadPDF() {
    const doc = new jsPDF();
    const addHeader = () =>  {
      doc.setFontSize(11);
      doc.setFont('bold');
      doc.text('Corte de Servicio', 11, 8);
      doc.setFontSize(8);
      doc.text(`Fecha: ${new Date().toLocaleString()}`, 11, 12);
    }
    // Define las columnas que deseas mostrar en el PDF
    const columns = ['Nombre', 'Manzana', 'Lote', 'Codigo', 'Meses', 'Saldo'];

    // Obtiene los datos de tu arreglo de objetos a mostrar en el PDF
    let sortedData = this.dataSource.filteredData.slice();

    if (this.dataSource.sort) {
      sortedData = this.dataSource.sortData(sortedData, this.dataSource.sort);
    }

    // Mapea los datos a un formato compatible con autoTable
    const rows: any[][] = sortedData.map((d) => [

      d.Nombre,
      d.Manzana,
      d.Lote,
      d.codigo,
      d.meses,
      d.saldo,
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
