import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-interest-page',
  templateUrl: './interest-page.component.html',
  styleUrls: ['./interest-page.component.css'],
})
export class InterestPageComponent implements OnInit {
  public interes: any;
  public loading = false;

  constructor(private configService: ConfigService, private fb: FormBuilder) {}

  public myForm: FormGroup = this.fb.group({
    interes: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getInteres();
  }

  getInteres() {
    this.configService.getInteres().subscribe((resp) => {
      console.log(resp);
      this.myForm.controls['interes'].setValue(resp.data.interes[0].interes);
      this.interes = resp.data.interes[0];
    });
  }

  updateInteres() {
    this.loading = true;
    console.log(this.interes);
    this.interes.interes = this.myForm.value.interes;
    this.configService
      .updateInteres(this.interes.idInteres, this.interes)
      .subscribe((resp) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Se ha actualizado correctamente',
          icon: 'success',
        });
      });

    this.configService.updateAllMeasurements().subscribe(
      (resp: any) => {
        console.log(resp);
        this.loading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'Se ha actualizado correctamente',
          icon: 'success',
        });
      },
      (err) => {
        this.loading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          width: 450,
          timer: 2000,
          title: 'No se ha podido actualizar',
          icon: 'error',
        });
      }
    );
  }
}
