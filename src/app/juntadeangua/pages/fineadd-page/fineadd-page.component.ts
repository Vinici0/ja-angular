import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Fine } from '../../interfaces/fine.interface';
import { FineServiceDetails } from '../../services/finesDetails.service';
import { TablefineViewComponent } from '../../modals/tablefine-view/tablefine-view.component';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs';

@Component({
  selector: 'app-fineadd-page',
  templateUrl: './fineadd-page.component.html',
  styleUrls: ['./fineadd-page.component.css'],
})
export class FineaddPageComponent {
  fines: Fine[] = [];
  clients: any[] = [];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['Nombre', 'Ruc', 'Manzana', 'Lote', 'acciones'];

  constructor(
    private fineService: FineServiceDetails,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public myForm: FormGroup = this.fb.group({
    typeFine: ['', [Validators.required]],
    descripcion: [''],
    cost: ['', [Validators.required]],
    date_fine: ['', [Validators.required]],
    id_multa: [''],
    valor_pagar: [''],
  });

  ngOnInit(): void {
    this.myForm.controls['cost'];
    this.myForm.controls['date_fine'].setValue(new Date());
    this.leadFines();
  }

  onDeleteClient(id: any) {
    const index = this.clients.findIndex((c) => c.idCliente === id);
    this.clients.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.clients);
    this.dataSource.paginator = this.paginatior;
    this.dataSource.sort = this.sort;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  searchClients() {
    this.dialog
      .open(TablefineViewComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        console.log('result', result);

        result.forEach((value: boolean, key: any) => {
          const client = key;

          // Verifica si el cliente ya existe en el array clients
          const existingClient = this.clients.find(
            (c) => c.idCliente === client.idCliente
          );

          // Si el cliente no existe en el array, agrégalo
          if (!existingClient) {
            this.clients.push({
              Nombre: client.nombre,
              Ruc: client.ruc,
              Telefono: client.telefono,
              Manzana: client.manzana,
              Lote: client.lote,
              idCliente: client.idCliente,
            });
          }
        });

        this.dataSource = new MatTableDataSource(this.clients);
        this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;

        this.myForm.setValue({
          ruc: result.Ruc,
          typeFine: this.myForm.value.typeFine || '',
          descripcion: '',
          cost: this.myForm.value.cost || '',
          date_fine: new Date(),
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
    const data = {
      fineDetalle: this.myForm.value,
      clients: this.clients,
    }

    if (this.myForm.invalid) {
      console.log('Formulario inválido');

      return;
    }
    this.fineService.createFineDetail(data).subscribe(
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
