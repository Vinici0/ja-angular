import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';
import { FineDetail } from '../../interfaces/fineDetails.interface';
import { FineServiceDetails } from '../../services/finesDetails.service';
import Swal from 'sweetalert2';
//Direccionar a la pagina de multas
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-fine-page',
  templateUrl: './fine-page.component.html',
  styleUrls: ['./fine-page.component.css'],
})
export class FinePageComponent {
  displayedColumns: string[] = [
    'nombre',
    'ruc',
    'typeFine',
    'valor_pagar',
    'date_fine',
    'pagado',
    'acciones',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  fineDetails: FineDetail[] = [
    {
      idMultaDetalle: 1,
      id_cliente: 1,
      date_fine: new Date(),
      pagado: false,
      valor_pagar: 50,
      nombre: 'Juan Perez',
      ruc: '123456789',
      typeFine: 'Multa por no usar mascarilla',
    },
  ];
  constructor(
    private fineService: FineServiceDetails,
    private dialog: MatDialog,
    private router: Router
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngOnInit(): void {
    this.loadFines();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadFines() {
    this.fineService.getFineDetails().subscribe((fines) => {
      console.log('fines', fines);

      this.fineDetails = fines;
      this.dataSource.data = this.fineDetails;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  agregarUsuario() {
    this.dialog
      .open(DialogUsuarioComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'agregado') {
          // this.mostrarUsuarios();
        }
      });
  }

  togglePagado(element: any) {
    this.fineService
      .togglePaymentStatus(element.idMultaDetalle, element)
      .subscribe(
        (resp) => {
          element.pagado = !element.pagado;
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 450,
            timer: 2000,
            icon: 'success',
            title: 'Se ha actualizado correctamente',
          });
        },
        (error) => {
          console.log(error);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 450,
            timer: 2000,
            icon: 'error',
            title: 'Error al actualizar',
          });
        }
      );
  }

  updateFineDetail(fineDetail: FineDetail) {
    // this.router.navigate(['/multas', fineDetail.idMultaDetalle]);
  }

  adjustDateToLocale(dateString: string) {
    const date = new Date(dateString);
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toISOString().split('T')[0];
  }

  deleteFineDetail(id: string) {
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
        this.deleteFineDetailById(id);
      }
    });
  }

  deleteFineDetailById(id: string) {
    this.fineService.deleteFineDetail(id).subscribe(
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
