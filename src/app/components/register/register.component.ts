import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const userData = { name: this.name, email: this.email, password: this.password };

    this.authService.register(userData).subscribe(
      (res) => {
        console.log('Usuario registrado', res);
        this.router.navigate(['/login']);
      },
      (err) => {
        console.error('Error en registro', err);
      }
    );
  }
}
