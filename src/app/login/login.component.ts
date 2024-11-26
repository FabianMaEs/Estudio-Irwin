import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {}

  
  login(): void {
    if (this.authService.login(this.username, this.password)) {
      this.alertService.simpleAlert('¡Bienvenido!', 'Sesión iniciada correctamente.', 'success');
      this.router.navigate(['/agendar']);
    } else {
      this.alertService.simpleAlert('Error', 'Usuario o contraseña incorrectos.', 'error');
      // this.errorMessage = 'Usuario o contraseña incorrectos.';
    }
  }
}
