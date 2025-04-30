import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    try {
      const rawUser = localStorage.getItem('user');
      this.usuario = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : null;
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      this.usuario = null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
