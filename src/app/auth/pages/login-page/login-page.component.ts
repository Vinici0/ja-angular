import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onLogin() {
    const { email, password } = this.myForm.value;
    this.authService.login(email, password).subscribe(
      (res) => {
        if (res.ok === true) {
          // Swal.fire('Success', 'Bi
        }
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', error.error.msg, 'error');
      }
    );
  }

}
