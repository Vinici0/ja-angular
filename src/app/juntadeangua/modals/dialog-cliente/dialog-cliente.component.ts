import { Component, Inject } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-cliente',
  templateUrl: './dialog-cliente.component.html',
  styleUrls: ['./dialog-cliente.component.css'],
})
export class DialogClienteComponent {
  public myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    ruc: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    ciudad: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    fechaIngreso: ['', [Validators.required]],
    numeroLote: ['', [Validators.required]],
    numeroManzana: ['', [Validators.required]],
    discapacidad: [false, [Validators.required]],
    terceraEdad: [false, [Validators.required]],
    JA_EstadoCivil: ['', [Validators.required]],
    JA_Sexo: ['', [Validators.required]],
    tipoRuc: ['', [Validators.required]],
    //
    EstadoCivil: ['', [Validators.required]],

  });

  constructor(
    private dialogoReferencia: MatDialogRef<DialogClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public usuarioEditar: any,
    private fb: FormBuilder
  ) {}

  onFormSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.dialogoReferencia.close(this.myForm.value);
    }
  }
}
