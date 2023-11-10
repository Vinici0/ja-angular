import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';
import { SearchClientComponent } from '../../modals/search-client/search-client.component';
import { FineService } from '../../services/fines.service';
import { Fine } from '../../interfaces/fine.interface';
import { FineServiceDetails } from '../../services/finesDetails.service';
import { MatSort } from '@angular/material/sort';
import { FineDetail } from '../../interfaces/fineDetails.interface';

@Component({
  selector: 'app-calculate-total-amount',
  templateUrl: './calculate-total-amount.component.html',
  styleUrls: ['./calculate-total-amount.component.css'],
})
export class CalculateTotalAmountComponent {
  fines: Fine[] = [];
  displayedColumns: string[] = [
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

  ];
  constructor(
    private fineService: FineServiceDetails,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public myForm: FormGroup = this.fb.group({
    lastNameAndName: ['', [Validators.required]],
    ruc: ['', [Validators.required]],
    phone: [''],
    typeFine: ['', [Validators.required]],
    descripcion: [''],
    cost: ['', [Validators.required]],
    date_fine: ['', [Validators.required]],
    id_cliente: [''],
    id_multa: [''],
    valor_pagar: [''],
  });

  ngOnInit(): void {
    this.disableFormControls();
    this.loadFineDetails();
  }

  disableFormControls(): void {
    this.myForm.controls['cost'].disable();
    this.myForm.controls['phone'].disable();
    this.myForm.controls['ruc'].disable();
    this.myForm.controls['lastNameAndName'].disable();
  }

  loadFineDetails(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.fineService.getFineDetailsByIdClient(id)))
      .subscribe((fines) => {
        console.log('fines', fines);

        this.fineDetails = fines;
        this.dataSource.data = this.fineDetails;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Cargar datos del cliente en la posción 0 de fines
        this.loadClientData(fines);
      });
  }

  loadClientData(fines: any[]): void {
    this.myForm.setValue({
      lastNameAndName: fines[0].nombre,
      ruc: fines[0].ruc,
      phone: fines[0].telefono,
      typeFine: '',
      descripcion: '',
      cost: '',
      date_fine: new Date().toISOString().substring(0, 10), // Usa el formato UTC
      id_cliente: fines[0].id_cliente,
      id_multa: '',
      valor_pagar: '',
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {}

  searchClient() {
    this.dialog
      .open(SearchClientComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        this.myForm.setValue({
          lastNameAndName: result.Nombre,
          ruc: result.Ruc,
          phone: result.Telefono,
          typeFine: this.myForm.value.typeFine || '',
          descripcion: '',
          cost: this.myForm.value.cost || '',
          date_fine: new Date().toISOString().substring(0, 10), // Usa el formato UTC
          id_cliente: result.idCliente,
          id_multa: this.myForm.value.id_multa || '',
          valor_pagar: this.myForm.value.valor_pagar || '',
        });
      });
  }

  loadFinesbyIdClient(id: any) {
    this.fineService.getFineDetailsByIdClient(id).subscribe((fines) => {
      console.log('fines', fines);

      this.fineDetails = fines;
      this.dataSource.data = this.fineDetails;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onSelectionChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.fines.forEach((fine) => {
      if (fine.typeFine === value) {
        this.myForm.controls['cost'].setValue(fine.cost);
        this.myForm.controls['id_multa'].setValue(fine.idMulta);
        this.myForm.controls['valor_pagar'].setValue(fine.cost);
      }
    });
  }

  updateFineDetail() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id', id, 'data', this.myForm.value);

    this.fineService.updateFineDetail(id, this.myForm.value).subscribe(
      (resp) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Se ha actualizado correctamente',
          icon: 'success',
        });

        this.router.navigate(['/junta-de-angua/pages/fine']);
      },
      (err) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Error al actualizar',
          icon: 'success',
        });
      }
    );
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
        this.loadFineDetails();
      }
    });
  }

  deleteFineDetailById(id: string) {
    this.fineService.deleteFineDetail(id).subscribe(
      (resp) => {
        // this.loadFines();
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
