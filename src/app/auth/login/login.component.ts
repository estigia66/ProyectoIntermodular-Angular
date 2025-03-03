import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await this.authService.login(email, password);
        this.router.navigate(['/']);
      }
      catch (error: any) {
        this.errorMessage = error.message;
      }
    }
  }

  onLoginWithGoogle(): void {
    this.authService.loginWithGoogle()
      .then(() => {
        console.log("Inicio de sesión con Google exitoso");
        this.router.navigate(['/proyectos']); // Redirige a la lista de proyectos o donde necesites
      })
      .catch(error => {
        console.error("Error al iniciar sesión con Google:", error);
      });
  }
}
