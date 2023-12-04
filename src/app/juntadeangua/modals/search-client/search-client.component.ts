import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Client } from '../../interfaces/customer.interface';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.css'],
})
export class SearchClientComponent {
  dataSource!: MatTableDataSource<any, MatTableDataSourcePaginator>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  displayedColumns = [
    'Nombre',
    'Ruc',
    'Telefono',
    'Email',
    'acciones',
  ];

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    public dialogView: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SearchClientComponent>
  ) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.customerService.getAllClients().subscribe((clients: Client[]) => {
      this.dataSource = new MatTableDataSource(clients);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
    });
  }

  eliminarCliente(id: any) {}

  editarCliente(id: any) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onFormSubmit() {}

  seleccionarCliente(enect:any){
    this.dialogRef.close(enect);
  }
}
