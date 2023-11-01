import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/confing.service';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
  clientPaiss: any[] = [];
  clientCiudads: any[] = [];
  clientTipoRucs: any[] = [];
  clientTipos: any[] = [];
  filteredPaises: any[];

  public myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    ruc: ['', [Validators.required]],
    telefono: ['', [Validators.required]],

    email: ['', [Validators.required, Validators.email]],
    idPais: ['', [Validators.required]],
    idCiudad: ['', [Validators.required]],
    direccion: ['', []],

    fechaNacimiento: ['', [Validators.required]],
    fechaIngreso: ['', [Validators.required]],
    fechaCaducidad: ['', [Validators.required]],

    idTipoRuc: ['', [Validators.required]],
    hombre: [false, [Validators.required]],
    ja_discapacidad: [false, [Validators.required]],
    ja_terceraEdad: [false, [Validators.required]],
    estadoCivil: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private configService: ConfigService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getClientPais();
    this.getClienteCiudad();
    this.getClienteTipoRuc();
    this.getClienteTipo();
  }

  onFormSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === 'string') {
          formData[key] = formData[key].toUpperCase();
          this.myForm.get(key)?.setValue(formData[key]); // Actualizar el valor en el formulario
        }
      });
      this.customerService.addCustomer(formData).subscribe(
        (data: any) => {
          console.log(data);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 450,
            timer: 2000,
            title: 'Se ha agregado correctamente',
            icon: 'success',
          });
          console.log(data.data.client[0].idCliente);

          this.router.navigateByUrl(
            '/junta-de-angua/pages/add-measure?id=' +
              data.data.client[0].idCliente
          ); // Agregar el ID a la URL
        },
        (err: any) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            width: 450,
            timer: 2000,
            title: 'Error al crear',
            icon: 'error', // Cambiar el icono a 'error'
          });
        }
      );
    }
  }

  getClientPais() {
    this.configService.getClientPais().subscribe((data: any) => {
      this.clientPaiss = data.data.pais;
      console.log(this.clientPaiss);
    });
  }

  getClienteCiudad() {
    this.configService.getClienteCiudad().subscribe((data: any) => {
      this.clientCiudads = data.data.ciudad;
    });
  }

  getClienteTipoRuc() {
    this.configService.getClienteTipoRuc().subscribe((data: any) => {
      this.clientTipoRucs = data.data.tipoRuc;
    });
  }

  getClienteTipo() {
    this.configService.getClienteTipo().subscribe((data: any) => {
      this.clientTipos = data.data.tipo;
    });
  }
}
