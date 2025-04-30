import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SalaService } from '../../services/sala.service';

@Component({
  selector: 'app-crear-sala',
  standalone: true,
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class CrearSalaComponent implements OnInit {
  salas: any[] = [];
  usuariosDisponibles: any[] = []; 
  usuariosInvitados: any[] = [];   
  usuarioBuscar = '';            
  salaSeleccionadaId: number | null = null;
  salaEnAdministracionId: number | null = null;
  nombre: string = '';
  descripcion: string = '';
  editandoId: number | null = null;
  nuevoNombre: string = '';
  nuevaDescripcion: string = '';

  constructor(private router: Router, private salaService: SalaService) {}

  ngOnInit() {
    this.cargarMisSalas();
  }

  cargarMisSalas() {
    this.salaService.obtenerMisSalas().subscribe(
      (salas) => {
        this.salas = salas;
      },
      (error) => {
        console.error('Error al cargar salas:', error);
      }
    );
  }

  cargarSalas() {
    this.salaService.obtenerSalas().subscribe(
      (salas) => {
        this.salas = salas;
      },
      (error) => {
        console.error('Error al cargar salas:', error);
      }
    );
  }

  crearSala() {
    if (!this.nombre.trim()) return;
  
    this.salaService.crearSala(this.nombre, this.descripcion).subscribe(
      (salaCreada) => {
        this.salas.unshift(salaCreada);
        this.nombre = '';
        this.descripcion = '';
  
        this.mostrarToast('✅ Sala creada exitosamente');
      },
      (error) => {
        console.error('Error al crear sala:', error);
        this.mostrarToast('❌ Error al crear sala');
      }
    );
  }

  eliminarSala(id: number) {
    this.salaService.eliminarSala(id).subscribe(
      () => {
        this.salas = this.salas.filter(s => s.id !== id);
      },
      (error) => {
        console.error('Error al eliminar sala:', error);
      }
    );
  }

  irADiseno(id: number) {
    this.cargarUsuariosInvitados(id);
    this.router.navigate(['/editor', id]);
  }

  iniciarEdicion(sala: any) {
    this.editandoId = sala.id;
    this.nuevoNombre = sala.nombre;
    this.nuevaDescripcion = sala.descripcion;
  }

  guardarEdicion() {
    if (this.editandoId === null) return;

    const datosActualizados = {
      nombre: this.nuevoNombre,
      descripcion: this.nuevaDescripcion
    };

    this.salaService.editarSala(this.editandoId, datosActualizados).subscribe(
      () => {
        const sala = this.salas.find(s => s.id === this.editandoId);
        if (sala) {
          sala.nombre = this.nuevoNombre;
          sala.descripcion = this.nuevaDescripcion;
        }
        this.editandoId = null;
      },
      (error) => {
        console.error('Error al editar sala:', error);
      }
    );
  }

  cancelarEdicion() {
    this.editandoId = null;
  }

  cargarUsuariosInvitados(salaId: number) {
    this.salaService.listarUsuariosInvitados(salaId).subscribe(
      (usuarios) => {
        this.usuariosInvitados = usuarios;
        this.salaSeleccionadaId = salaId; // Guardamos la sala que está abierta
      },
      (error) => {
        console.error('Error al cargar usuarios invitados:', error);
      }
    );
  }

  administrarSala(id: number) {
    if (this.salaEnAdministracionId === id) {
      this.salaEnAdministracionId = null;
    } else {
      this.salaEnAdministracionId = id;
      this.cargarUsuariosInvitados(id);
    }
  }

  buscarUsuarios() {
    if (!this.usuarioBuscar.trim()) return;
  
    this.salaService.buscarUsuarios(this.usuarioBuscar).subscribe(
      (usuarios) => {
        this.usuariosDisponibles = usuarios;
      },
      (error) => {
        console.error('Error al buscar usuarios:', error);
        window.alert('❌ Error al buscar usuarios');
      }
    );
  }
  
  // 🔵 Invitar usuario a la sala
  invitarUsuario(usuarioId: number) {
    if (!this.salaSeleccionadaId) return;
  
    this.salaService.invitarUsuario(this.salaSeleccionadaId, usuarioId).subscribe(
      () => {
        window.alert('✅ Usuario invitado correctamente');
        this.cargarUsuariosInvitados(this.salaSeleccionadaId!);
      },
      (error) => {
        console.error('Error al invitar usuario:', error);
        window.alert('❌ Error al invitar usuario');
      }
    );
  }
  
  // 🔵 Eliminar usuario invitado
  eliminarUsuarioInvitado(usuarioId: number) {
    if (!this.salaSeleccionadaId) return;
  
    this.salaService.eliminarUsuarioInvitado(this.salaSeleccionadaId, usuarioId).subscribe(
      () => {
        window.alert('✅ Usuario eliminado correctamente');
        this.cargarUsuariosInvitados(this.salaSeleccionadaId!);
      },
      (error) => {
        console.error('Error al eliminar invitado:', error);
        window.alert('❌ Error al eliminar invitado');
      }
    );
  }

  mostrarToast(mensaje: string) {
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerText = mensaje;
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
  
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  }
}
