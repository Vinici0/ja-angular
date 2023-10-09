import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../../services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cutomers-page',
  templateUrl: './cutomers-page.component.html',
  styleUrls: ['./cutomers-page.component.css'],
})
export class CutomersPageComponent implements OnInit {
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
    private fb: FormBuilder,
    public dialogView: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.customerService.getAllClients().subscribe((resp: any) => {
      this.dataSource = new MatTableDataSource(resp.data.clients);
      this.dataSource.paginator = this.paginatior;
    });
  }

  eliminarCliente(id: any) {}

  editarCliente(id: any) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  agregarCliente() {}
}
