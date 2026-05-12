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

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 8;
      const fecha = new Date().toLocaleString('es-EC');

      // — Encabezado —
      doc.setFillColor(30, 64, 175);
      doc.rect(margin, 6, pageW - margin * 2, 14, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE DE CLIENTES', margin + 4, 14);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total: ${clients.length} registros`, margin + 4, 18);

      doc.setFontSize(7.5);
      doc.text(`Generado: ${fecha}`, pageW - margin - 4, 14, { align: 'right' });

      // — Tabla —
      const rows: any[][] = clients.map((d, i) => [
        i + 1,
        d.Nombre?.trim() || '',
        d.Ruc?.trim() || '',
        d.Email?.trim() || '',
        d.Manzana?.trim() || '',
        d.Lote?.trim() || '',
        '',
      ]);

      autoTable(doc, {
        head: [['#', 'Nombre', 'Cédula / RUC', 'Email', 'Mz.', 'Lote', 'Firma']],
        body: rows,
        startY: 23,
        margin: { left: margin, right: margin },
        theme: 'grid',
        styles: {
          fontSize: 6.5,
          cellPadding: 1.8,
          overflow: 'linebreak',
          valign: 'middle',
          textColor: [30, 30, 30],
        },
        headStyles: {
          fillColor: [30, 64, 175],
          textColor: 255,
          fontSize: 7,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 2.5,
        },
        alternateRowStyles: { fillColor: [245, 247, 255] },
        columnStyles: {
          0: { halign: 'center', cellWidth: 7 },
          1: { cellWidth: 55 },
          2: { halign: 'center', cellWidth: 25 },
          3: { cellWidth: 55 },
          4: { halign: 'center', cellWidth: 14 },
          5: { halign: 'center', cellWidth: 14 },
          6: { cellWidth: 24 },
        },
        didDrawPage: (data) => {
          const total = (doc as any).getNumberOfPages();
          doc.setFontSize(6);
          doc.setTextColor(150);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `Página ${data.pageNumber} de ${total}`,
            pageW / 2,
            pageH - 4,
            { align: 'center' }
          );
        },
      });

      doc.save(`clientes_${new Date().toLocaleDateString('es-EC').replace(/\//g, '-')}.pdf`);
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
