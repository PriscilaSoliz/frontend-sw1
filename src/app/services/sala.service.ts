import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SalaService {
    private apiUrl = 'https://backend-sw1-ikh3.onrender.com/api/salas';

    private http = inject(HttpClient);

    // 🔵 Crear sala
    crearSala(nombre: string, descripcion: string) {
        const token = localStorage.getItem('token'); // 👈 el token que guardaste al loguear
        return this.http.post('https://backend-sw1-ikh3.onrender.com/api/salas', { nombre, descripcion }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // 🔵 Obtener salas
    obtenerSalas(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    // 🔵 Editar sala
    editarSala(id: number, data: { nombre: string; descripcion: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    // 🔵 Eliminar sala
    eliminarSala(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // 🔵 Obtener contenido de sala
    obtenerContenido(id: number) {
        return this.http.get<{ contenido: string }>(`${this.apiUrl}/${id}/contenido`);
    }
    
    // 🔵 Guardar contenido de sala
    guardarContenido(id: number, contenido: string) {
        return this.http.put(`${this.apiUrl}/${id}/contenido`, { contenido });
    }

    // 🔵 INVITAR usuario a sala
    invitarUsuario(salaId: number, usuarioId: number) {
        return this.http.post(`${this.apiUrl}/${salaId}/invitar`, { usuarioId });
    }
    
    // 🔵 LISTAR usuarios invitados de una sala
    listarUsuariosInvitados(salaId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/${salaId}/usuarios`);
    }
    
    // 🔵 ELIMINAR un usuario invitado
    eliminarUsuarioInvitado(salaId: number, usuarioId: number) {
        return this.http.delete(`${this.apiUrl}/${salaId}/usuarios/${usuarioId}`);
    }

    buscarUsuarios(texto: string) {
        return this.http.get<any[]>(`https://backend-sw1-ikh3.onrender.com/api/usuarios?search=${texto}`);
    }

    obtenerMisSalas() {
        return this.http.get<any[]>('https://backend-sw1-ikh3.onrender.com/api/mis-salas', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}
