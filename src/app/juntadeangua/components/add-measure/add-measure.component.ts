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

@Component({
  selector: 'app-add-measure',
  templateUrl: './add-measure.component.html',
  styleUrls: ['./add-measure.component.css'],
})
export class AddMeasureComponent implements OnInit {
  cliente: any;
  anio: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;

  public myForm: FormGroup = this.fb.group({
    nombre: [{ value: '', disabled: true }, [Validators.required]],
    ruc: [{ value: '', disabled: true }, [Validators.required]],
    telefono: [{ value: '', disabled: true }, [Validators.required]],
    lote: ['', [Validators.required]],
    manzana: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    JA_LoteVacio: ['', [Validators.required]],
    idCliente: [''],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Si tiene un query id que traiga los datos del cliente
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.getClientById(params.id);
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
        this.myForm.setValue({
          idCliente: result.idCliente || '',
          nombre: result.Nombre,
          ruc: result.Ruc,
          telefono: result.Telefono,
          lote: this.myForm.value.lote || '',
          manzana: this.myForm.value.manzana || '',
          codigo: this.myForm.value.codigo || '',
          JA_LoteVacio: this.myForm.value.JA_LoteVacio || '',
        });
      });
  }

  getClientById(id: any) {
    this.customerService.getClientById(id).subscribe((resp: any) => {
      this.cliente = resp.data.client[0];
      this.myForm.setValue({
        nombre: this.cliente.Nombre,
        ruc: this.cliente.Ruc,
        telefono: this.cliente.Telefono,
        idCliente: this.cliente.idCliente,
        lote: this.myForm.value.lote || '',
        manzana: this.myForm.value.manzana || '',
        codigo: this.myForm.value.codigo || '',
        JA_LoteVacio: this.myForm.value.JA_LoteVacio || '',
      });
    });
  }

  onFormSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      formData.Anio = this.anio;
      formData.Mes = this.mes;
      this.customerService
        .createMeusereAndUpdateCustomer(formData)
        .subscribe((resp: any) => {
          if (resp.ok) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              width: 450,
              timer: 2000,
              title: 'Se ha agregado correctamente',
              icon: 'success',
            });
            this.router.navigateByUrl(
              '/junta-de-angua/pages/add-measure?id=' + resp.data.idCliente
            );
          }
        });
    }
  }
}
