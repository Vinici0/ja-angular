import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';
import { SearchClientComponent } from '../../modals/search-client/search-client.component';
import { FineService } from '../../services/fines.service';
import { Fine } from '../../interfaces/fine.interface';
import { FineServiceDetails } from '../../services/finesDetails.service';

@Component({
  selector: 'app-fineadd-page',
  templateUrl: './fineadd-page.component.html',
  styleUrls: ['./fineadd-page.component.css'],
})
export class FineaddPageComponent {
  fines: Fine[] = [];

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fineService: FineServiceDetails,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
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
    this.myForm.controls['cost'].disable();
    this.myForm.controls['date_fine'].setValue(new Date());
    this.leadFines();
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
          date_fine: new Date(),
          id_cliente: result.idCliente,
          id_multa: this.myForm.value.id_multa || '',
          valor_pagar: this.myForm.value.valor_pagar || '',
        });
      });
  }

  leadFines() {
    this.fineService.getFines().subscribe((fines) => {
      this.fines = fines;
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

  createFineDetail() {
    this.fineService.createFineDetail(this.myForm.value).subscribe(
      (resp) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Se ha creado correctamente',
          icon: 'success',
        });
        this.myForm.reset();
        this.router.navigate(['/junta-de-angua/pages/fine']);
      },
      (err) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Error al crear',
          icon: 'success',
        });
      }
    );
  }
}
