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
  selector: 'app-add-measure',
  templateUrl: './add-measure.component.html',
  styleUrls: ['./add-measure.component.css']
})
export class AddMeasureComponent {

  public myForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],

  });

  constructor(private fb: FormBuilder,  private router: Router) {}

}
