import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DialogUsuarioComponent } from '../../modals/dialog-usuario/dialog-usuario.component';
import { SearchClientComponent } from '../../modals/search-client/search-client.component';
import { FineService } from '../../services/fines.service';
import { Fine } from '../../interfaces/fine.interface';
import { FineServiceDetails } from '../../services/finesDetails.service';

@Component({
  selector: 'app-fineedit-page',
  templateUrl: './fineedit-page.component.html',
  styleUrls: ['./fineedit-page.component.css'],
})
export class FineeditPageComponent {
  fines: Fine[] = [];
  pagar: number;

  dataSource = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fineService: FineServiceDetails,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
    ) { }

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
    this.leadFines();
    this.myForm.controls['cost'].disable();
    this.myForm.controls['phone'].disable();
    this.myForm.controls['ruc'].disable();
    this.myForm.controls['lastNameAndName'].disable();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.fineService.getFineDetailById(id)))
      .subscribe((fines) => {
        console.log('   .subscribe((fine) => {');
        const fine = fines[0];
        // debugger;
        if (!fine) {
          console.log('No existe el id');
          this.router.navigate(['/junta-de-angua/pages/fine']);
        }

        this.myForm.setValue({
          lastNameAndName: fine.Nombre,
          ruc: fine.Ruc,
          phone: fine.Telefono || '',
          typeFine: fine.typeFine,
          descripcion: fine.descripcion,
          cost: fine.valor_pagar,
          date_fine: fine.date_fine,
          id_cliente: fine.id_cliente,
          id_multa: fine.id_multa,
          valor_pagar: fine.valor_pagar,
        });

        // Asigna el valor de pagar aquí después de haber cargado los datos
        this.pagar = this.myForm.value.valor_pagar;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) { }

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

  leadFines() {
    this.fineService.getFines().subscribe((fines) => {
      console.log('fines', fines);

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




  updateFineDetailAbono(abonoValue: string) {
    // Convertir el valor a un número
    const abonoNumber = parseFloat(abonoValue);

    if (isNaN(abonoNumber)) {
      // Manejar el caso en el que el valor no sea un número válido
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        width: 450,
        timer: 2000,
        title: 'El valor de abono no es un número válido',
        icon: 'error',
      });

      console.error('El valor de abono no es un número válido');
      return;
    }

    const id_multaDetalle = this.activatedRoute.snapshot.paramMap.get('id');
    const id_cliente = this.myForm.value.id_cliente;

    console.log(id_multaDetalle, id_cliente, abonoNumber);

    // Llama al servicio para enviar los datos de abono
    this.fineService.updateFineDetailAbono(id_multaDetalle, id_cliente, abonoNumber).subscribe(
      (resp) => {
        // Maneja la respuesta del servicio si es necesario
        console.log('Abono enviado correctamente', resp);
        // Puedes realizar acciones adicionales aquí
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Abono enviado correctamente',
          icon: 'success',
        });

        this.redirectToPreviousPage();
      },
      (err) => {
        // Maneja los errores del servicio si es necesario
        console.error('Error al enviar el abono', err);
        // Puedes mostrar mensajes de error u otras acciones aquí
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Error al enviar el abono',
          icon: 'error',
        });
      }
    );
  }


  redirectToPreviousPage() {
    this.location.back();
  }
}


