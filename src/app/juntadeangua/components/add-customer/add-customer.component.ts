import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent {
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

  constructor(private fb: FormBuilder,private router: Router ) {}

  onFormSubmit() {
    // if (this.myForm.valid) {
    //   console.log(this.myForm.value);
      this.router.navigateByUrl('/junta-de-angua/pages/add-measure');
    // }
  }

}
