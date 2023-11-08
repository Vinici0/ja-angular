import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../services/confing.service';
import { CustomerService } from '../../services/customer.service';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';

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
  isEdit = false;

  public myForm: FormGroup = this.fb.group({
    nombre: [
      '',
      [Validators.required, Validators.minLength(2), /* Validators.maxLength(50) */],
    ], // Validación de longitud del nombre
    ruc: [
      '',
      [Validators.required, Validators.minLength(7), Validators.maxLength(15)],
    ], // Validación de longitud del RUC
    telefono: ['', /* [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(11)] */], // Validación de longitud del teléfono

    email: ['', [Validators.required, Validators.email]],
    idPais: ['', [Validators.required]],
    idCiudad: ['', [Validators.required]],
    direccion: ['', [Validators.maxLength(100)]], // Validación de longitud de dirección

    fechaNacimiento: ['', [Validators.required]],
    fechaIngreso: ['', [Validators.required]],
    fechaCaducidad: ['', /* [Validators.required] */],

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
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getClientPais();
    this.getClienteCiudad();
    this.getClienteTipoRuc();
    this.getClienteTipo();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      console.log(this.isEdit);

      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.customerService.getClientById(id)))
        .subscribe((data: any) => {
          const cliente = data.data.client[0];
          console.log(cliente);

          this.myForm.setValue({
            nombre: cliente.Nombre,
            ruc: cliente.Ruc,
            telefono: cliente.Telefono,
            email: cliente.Email,
            idPais: cliente.idPais,
            idCiudad: cliente.idCiudad,
            direccion: cliente.Direccion,
            fechaNacimiento: cliente.FechaNacimiento,
            fechaIngreso: cliente.FechaIngreso,
            fechaCaducidad: cliente.FechaCaducidad,
            idTipoRuc: cliente.idTipoRuc,
            hombre: cliente.Hombre,
            ja_discapacidad: cliente.JA_Discapacidad,
            ja_terceraEdad: cliente.JA_TerceraEdad,
            estadoCivil: cliente.EstadoCivil,
          });
        });
    }
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

      if (this.isEdit) {
        this.updateCustomer();
        return;
      }
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
          debugger;
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

  updateCustomer() {
    const formData = this.myForm.value;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.customerService.updateCustomer(id, formData).subscribe(
      (data: any) => {
        console.log(data);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Se ha actualizado correctamente',
          icon: 'success',
        });
        this.router.navigateByUrl('/junta-de-angua/pages/customers');
      },
      (err: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Error al actualizar',
          icon: 'error', // Cambiar el icono a 'error'
        });
      }
    );
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

  getClientById(id: any) {
    this.customerService.getClientById(id).subscribe((resp: any) => {
      const cliente = resp.data.client[0];
      this.myForm.setValue({
        nombre: cliente.Nombre,
        ruc: cliente.Ruc,
        telefono: cliente.Telefono,
        email: cliente.Email,
        idPais: cliente.idPais,
        idCiudad: cliente.idCiudad,
        direccion: cliente.Direccion,
        fechaNacimiento: cliente.FechaNacimiento,
        fechaIngreso: cliente.FechaIngreso,
        fechaCaducidad: cliente.FechaCaducidad,
        idTipoRuc: cliente.idTipoRuc,
        hombre: cliente.Hombre,
        ja_discapacidad: cliente.JA_Discapacidad,
        ja_terceraEdad: cliente.JA_TerceraEdad,
        estadoCivil: cliente.EstadoCivil,
      });
    });
  }
}
