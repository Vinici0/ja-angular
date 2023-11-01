import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Client } from '../../interfaces/customer.interface';

@Component({
  selector: 'app-tablefine-view',
  templateUrl: './tablefine-view.component.html',
  styleUrls: ['./tablefine-view.component.css'],
})

export class TablefineViewComponent {
  dataSource!: MatTableDataSource<Client, MatTableDataSourcePaginator>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['Nombre', 'Ruc', 'Telefono', 'Email', 'acciones'];

  clients: Client[] = [];
  selectedClients = new Map<any, boolean>();

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    public dialogView: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TablefineViewComponent>
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  toggleSelection(clientId: any) {
    this.selectedClients.set(clientId, !this.selectedClients.get(clientId));
  }

  isClientSelected(clientId: any): boolean | undefined {
    return (
      this.selectedClients.has(clientId) && this.selectedClients.get(clientId)
    );
  }

  onSendClients() {
    console.log('this.selectedClients', this.selectedClients);
    this.dialogRef.close(this.selectedClients);
  }
}
