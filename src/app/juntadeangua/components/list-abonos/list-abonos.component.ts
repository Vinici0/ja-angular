import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FineDetail } from '../../interfaces/fineDetails.interface';
import { FineServiceDetails } from '../../services/finesDetails.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Fine } from '../../interfaces/fine.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-abonos',
  templateUrl: './list-abonos.component.html',
  styleUrls: ['./list-abonos.component.css']
})
export class ListAbonosComponent {
  id: string = '';
  fines: Fine[] = [];
  displayedColumns: string[] = [
    'valor_abonado',
    'fecha',
    'acciones',
  ];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  fineDetails: FineDetail[] = [];
  constructor(
    private fineService: FineServiceDetails,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  public myForm: FormGroup = this.fb.group({
    lastNameAndName: ['', [Validators.required]],
    ruc: ['', [Validators.required]],
    phone: [''],
  });

  ngOnInit(): void {
    this.disableFormControls();
    this.loadFineDetails();
  }

  disableFormControls(): void {
    this.myForm.controls['phone'].disable();
    this.myForm.controls['ruc'].disable();
    this.myForm.controls['lastNameAndName'].disable();
  }

  loadFineDetails(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.fineService.getMultaDetalleAbono(id))
      )
      .subscribe((fines) => {
        this.fineDetails = fines;
        this.dataSource.data = this.fineDetails;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Cargar datos del cliente en la posción 0 de fines
        this.loadClientData(fines);
      });
  }

  loadClientData(fines: any[]): void {
    this.myForm.patchValue({
      lastNameAndName: fines[0].Nombre,
      ruc: fines[0].Ruc,
      phone: fines[0].Celular,
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {}



  loadFinesbyIdClient(id: any) {
    this.fineService.getMultaDetalleAbono(id).subscribe((fines) => {
      console.log('fines', fines);

      this.fineDetails = fines;
      this.dataSource.data = this.fineDetails;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
    this.fineService.deleteFineDetailAbono(id).subscribe(
      (resp) => {
        this.loadFineDetails(); // Actualizar la tabla después de eliminar el registro
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
