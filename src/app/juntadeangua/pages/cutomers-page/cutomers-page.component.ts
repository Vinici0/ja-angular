import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { DialogClienteComponent } from '../../modals/dialog-cliente/dialog-cliente.component';
import { PdfViewComponent } from '../../modals/pdf-view/pdf-view.component';

@Component({
  selector: 'app-cutomers-page',
  templateUrl: './cutomers-page.component.html',
  styleUrls: ['./cutomers-page.component.css'],
})
export class CutomersPageComponent implements OnInit {
  pdfurl = '';

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
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
    });
  }

  eliminarCliente(id: any) {}

  editarCliente(id: any) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  openDialog() {
    this.customerService.pdfCUstomerView().subscribe((resp: any) => {
      const blobUrl = window.URL.createObjectURL(resp);
      console.log(blobUrl);

      this.pdfurl = blobUrl;
      console.log(this.pdfurl);

      this.dialogView.open(PdfViewComponent, {
        width: '750px',
        height: '700px',
        data: {
          pdfurl: this.pdfurl,
        },
      });
    });
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

  onFormSubmit() {}
}
