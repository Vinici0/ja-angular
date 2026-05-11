import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { DialogClienteComponent } from '../../modals/dialog-cliente/dialog-cliente.component';
import { DialogExportExcelComponent } from '../../modals/dialog-export-excel/dialog-export-excel.component';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';
import { MatSort } from '@angular/material/sort';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cutomers-page',
  templateUrl: './cutomers-page.component.html',
  styleUrls: ['./cutomers-page.component.css'],
})
export class CutomersPageComponent implements OnInit {
  pdfurl = '';

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'index',
    'Nombre',
    'Ruc',
    'Telefono',
    'Email',
    'Direccion',
    'FechaNacimiento',
    'FechaIngreso',
    'acciones',
  ];

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    public dialogView: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.customerService.getAllClients().subscribe((resp: any) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
    });
  }

  eliminarCliente(id: any) {}

  editarCliente(id: any) {


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }


  agregarCliente() {
    this.dialog
      .open(DialogClienteComponent, {
        disableClose: true,
        width: '750px',
      })
      .afterClosed()
      .subscribe((result) => {
        // if (result === "agregado") {
        //   this.mostrarUsuarios();
        // }
      });
  }

  downloadPDF() {
    const dialogRef = this.dialog.open(DialogExportExcelComponent, {
      disableClose: true,
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((clients: any[]) => {
      if (!clients || clients.length === 0) return;

      const doc = new jsPDF();
      const columns = ['Nombre', 'Cédula/RUC', 'Email', 'Manzana', 'Lote', 'Firma'];

      const rows: any[][] = clients.map((d) => [
        d.Nombre?.trim() || '',
        d.Ruc?.trim() || '',
        d.Email?.trim() || '',
        d.Manzana?.trim() || '',
        d.Lote?.trim() || '',
        '',
      ]);

      doc.setFontSize(11);
      doc.text('Reporte de Clientes', 11, 8);
      doc.setFontSize(8);
      doc.text(`Fecha: ${new Date().toLocaleString()}`, 11, 12);

      autoTable(doc, {
        columns,
        body: rows,
        startY: 14,
        theme: 'grid',
        headStyles: { fillColor: '#ffffff', textColor: '#000000', fontSize: 10 },
        bodyStyles: { fillColor: '#ffffff', textColor: '#000000', fontSize: 8 },
        alternateRowStyles: { fillColor: '#f5f5f5' },
      });

      doc.save('clientes.pdf');
    });
  }

  get pageOffset(): number {
    return this.paginatior ? this.paginatior.pageIndex * this.paginatior.pageSize : 0;
  }

  downloadExcel() {
    const dialogRef = this.dialog.open(DialogExportExcelComponent, {
      disableClose: true,
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((clients: any[]) => {
      if (!clients || clients.length === 0) return;

      const wsData = [
        ['#', 'Nombre', 'Cédula/RUC', 'Email', 'Manzana', 'Lote'],
        ...clients.map((c, i) => [
          i + 1,
          c.Nombre?.trim() || '',
          c.Ruc?.trim() || '',
          c.Email?.trim() || '',
          c.Manzana?.trim() || '',
          c.Lote?.trim() || '',
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = [
        { wch: 5 },
        { wch: 40 },
        { wch: 15 },
        { wch: 35 },
        { wch: 12 },
        { wch: 12 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
      const fecha = new Date().toLocaleDateString('es-EC').replace(/\//g, '-');
      XLSX.writeFile(wb, `clientes_${fecha}.xlsx`);
    });
  }

  onFormSubmit() {}
}
