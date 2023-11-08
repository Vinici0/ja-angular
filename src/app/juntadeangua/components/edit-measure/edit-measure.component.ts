import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchClientComponent } from '../../modals/search-client/search-client.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2';
import { MeasureServiceTsService } from '../../services/measure.service.ts.service';

@Component({
  selector: 'app-edit-measure',
  templateUrl: './edit-measure.component.html',
  styleUrls: ['./edit-measure.component.css'],
})
export class EditMeasureComponent {
  cliente: any;
  anio: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;
  ja_loteVacio: boolean;
  codigo = '';

  public myForm: FormGroup = this.fb.group({
    nombre: [{ value: '', disabled: true }, [Validators.required]],
    ruc: [{ value: '', disabled: true }, [Validators.required]],
    telefono: [{ value: '', disabled: true }, ],
    lote: ['', [Validators.required]],
    manzana: ['', [Validators.required]],
    codigo: [{ value: '', disabled: true }, [Validators.required]],
    JA_LoteVacio: ['', [Validators.required]],
    idCliente: [''],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private measureServiceTsService: MeasureServiceTsService
  ) {}

  ngOnInit(): void {
    // Si tiene un query id que traiga los datos del cliente
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.idCliente && params.idMedida) {
        this.getClientById(params.idCliente);
        this.getMeasureById(params.idMedida);
      }
    });
  }

  searchClient() {
    this.dialog
      .open(SearchClientComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        this.getClientById(result.idCliente);
      });
  }

  getClientById(id: any) {
    this.customerService.getClientById(id).subscribe((resp: any) => {
      this.cliente = resp.data.client[0];
      this.ja_loteVacio = this.cliente.JA_LoteVacio;
      this.myForm.setValue({
        nombre: this.cliente.Nombre,
        ruc: this.cliente.Ruc,
        telefono: this.cliente.Telefono,
        idCliente: this.cliente.idCliente,
        lote: this.myForm.value.lote || '',
        manzana: this.myForm.value.manzana || '',
        codigo: '',
        JA_LoteVacio: this.myForm.value.JA_LoteVacio || '',
      });
    });
  }

  getMeasureById(id: any) {
    this.measureServiceTsService.getMeasureById(id).subscribe((resp: any) => {
      console.log(resp);
      this.myForm.get('lote')?.setValue(resp.data.measure[0].Lote);
      this.myForm.get('manzana')?.setValue(resp.data.measure[0].Manzana);
      this.myForm.get('codigo')?.setValue(resp.data.measure[0].Codigo);
      this.codigo = resp.data.measure[0].Codigo;
      this.myForm.get('JA_LoteVacio')?.setValue(this.ja_loteVacio);
    });
  }

  updateMeauseAndCustomer() {
    //agregar codigo al formulario
    const formData = this.myForm.value;
    formData.codigo = this.codigo;
    if (this.myForm.valid) {
      this.customerService
        .updateMeauseAndCustomer(formData)
        .subscribe((resp: any) => {
          if (resp.ok) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              width: 450,
              timer: 2000,
              title: 'Se ha editado correctamente',
              icon: 'success',
            });
            this.router.navigateByUrl(
              '/junta-de-angua/pages/add-extent'
            );
          }
        });
    }
  }

  onFormSubmit() {
    console.log('Cliente editado correcto');

    // if (this.myForm.valid) {
    //   const formData = this.myForm.value;
    //   formData.Anio = this.anio;
    //   formData.Mes = this.mes;
    //   this.customerService
    //     .createMeusereAndUpdateCustomer(formData)
    //     .subscribe((resp: any) => {
    //       if (resp.ok) {
    //         Swal.fire({
    //           toast: true,
    //           position: 'top-end',
    //           showConfirmButton: false,
    //           width: 450,
    //           timer: 2000,
    //           title: 'Se ha agregado correctamente',
    //           icon: 'success',
    //         });
    //         this.router.navigateByUrl(
    //           '/junta-de-angua/pages/add-measure?id=' + resp.data.idCliente
    //         );
    //       }
    //     });
    // }
  }
}
