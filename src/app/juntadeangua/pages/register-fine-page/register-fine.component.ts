import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { DialogAddFineComponent } from '../../modals/dialog-add-fine/dialog-add-fine.component';
import { Fine } from '../../interfaces/fine.interface';
import { FineService } from '../../services/fines.service';
import { FineDetail } from '../../interfaces/fineDetails.interface';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-register-fine',
  templateUrl: './register-fine.component.html',
  styleUrls: ['./register-fine.component.css'],
})
export class RegisterFinePageComponent {
  displayedColumns: string[] = ['typeFine', 'cost', 'acciones'];
  fines: Fine[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('filterInput') filterInput!: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fineService: FineService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadFines();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadFines() {
    this.fineService.getFines().subscribe((fines) => {
      this.fines = fines;
      this.dataSource.data = this.fines;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  editarUsuario(id: any) {}

  createFine() {
    const dialogRef = this.dialog.open(DialogAddFineComponent, {
      disableClose: true,
      data: { accion: 'Agregar', fine: null }, // Pasar un objeto con el parámetro 'accion' y 'fine' como nulo para crear
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadFines();
      }
      dialogRef.close();
    });
  }

  updateFine(fine: Fine) {
    const dialogRef = this.dialog.open(DialogAddFineComponent, {
      disableClose: true,
      data: { accion: 'Actualizar', fine: fine },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadFines();
      }
      dialogRef.close();
    });
  }

  deleteFine(id: string) {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFineById(id);
      }
    });
  }

  deleteFineById(id: string) {
    this.fineService.deleteFine(id).subscribe(
      (resp) => {
        this.loadFines();
      },
      (error) => {
        console.log(error);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Error al eliminar',
          icon: 'error',
        });
      }
    );
  }
}
