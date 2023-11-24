import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { DialogClienteComponent } from '../../modals/dialog-cliente/dialog-cliente.component';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';
import { MatSort } from '@angular/material/sort';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

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
    const doc = new jsPDF();

    // Define the columns for the PDF table
    const columns = [
      'Nombre',
      'Ruc/C.I',
      'Telefono',
      'Email',
      'Firma',
    ];

    // Get the data from the dataSource
    let data = this.dataSource.filteredData.slice();

    if (this.dataSource.sort) {
      data = this.dataSource.sortData(
        this.dataSource.filteredData.slice(),
        this.dataSource.sort
      );
    }

    // Map the data to a format compatible with autoTable
    const rows: any[][] = data.map((d) => [
      d.Nombre,
      d.Ruc,
      d.Telefono,
      d.Email,
      '       ', // Placeholder for the signature field
    ]);

    // Set the font size
    doc.setFontSize(11);

    // Set the title of the PDF
    doc.text('Clientes', 11, 8);

    // Set the subtitle of the PDF
    doc.setFontSize(8);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 11, 12);

    // Create the table
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

    // Add a line for the signature
    // doc.setLineWidth(0.5);

    // Save or open the PDF
    doc.save('clientes.pdf');
  }

  onFormSubmit() {}
}
