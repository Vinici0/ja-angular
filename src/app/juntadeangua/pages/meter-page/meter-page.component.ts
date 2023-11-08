import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';

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
  selectedEstado: string = '';
  @ViewChild('filterInput') filterInput!: any;

  columnFilters: { [key: string]: string } = {};

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  public pdfurl = '';

  constructor(
    private meterService: MeterService,
    public dialogView: MatDialog
  ) {}

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

  changeStatus(element: any): void {
    element.Estado = !element.Estado;
    this.updateMeterStatus(element.idMedidor, element.Estado);
  }

  applyFilter(filterValue: string, estado: any) {
    // Aplicar el filtro al MatTableDataSource
    console.log(estado);

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (estado) {
      this.dataSource.filter = estado;
    }
  }

  exportExcel() {
    const fileName = 'Meters.xlsx';

    const filteredValues = this.dataSource.filteredData.map((item) => {
      const filteredItem: any = {};
      Object.keys(item).forEach((key) => {
        filteredItem[key] = item[key];
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredValues);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Meters');

    XLSX.writeFile(wb, fileName);
  }

  applyFilterSelect(event: any) {
    const estado = event.value;
    const filterValue = this.filterInput.nativeElement.value;
    this.applyFilter(filterValue, estado);
  }

  updateMeterStatus(id: string, status: any) {
    this.meterService.updateMeterStatus(id, status).subscribe((resp) => {
      console.log(resp);
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

  openDialog() {
    this.meterService.imprimirConsumo().subscribe(
      (blob: Blob) => { // Asegúrate de que la respuesta es un Blob.
        const blobUrl = window.URL.createObjectURL(blob);
        this.pdfurl = blobUrl;

        // Abre el diálogo pasando la URL del PDF
        this.dialogView.open(PdfViewComponent, {
          width: '750px',
          height: '700px',
          data: { pdfurl: this.pdfurl },
        });
      },
      (error) => {
        console.error('Error al obtener el PDF:', error);
      }
    );
  }

}
