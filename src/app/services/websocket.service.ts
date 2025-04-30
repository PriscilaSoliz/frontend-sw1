import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    socket: any;
    readonly uri: string = 'http://localhost:3000'; // URL de tu backend

    constructor() {
        this.socket = io(this.uri);
        this.socket.on('connect', () => {
            console.log('🟢 Conectado al servidor WebSocket');
        });
        
        this.socket.on('disconnect', () => {
            console.log('🔴 Desconectado del servidor WebSocket');
        });
    }

    joinSala(salaId: number) {
        this.socket.emit('joinSala', salaId);
    }

    enviarContenido(salaId: number, cambio: any) {
        console.log('📤 Enviando cambio via socket:', cambio);
        this.socket.emit('updateContenido', {
            salaId,
            contenido: JSON.stringify(cambio)
        });
    }

    escucharContenido(callback: (cambio: any) => void) {
        this.socket.on('recibirContenido', (contenido: string) => {
            console.log('📩 Recibí del servidor:', contenido); // 👈 Agrega este console.log
            try {
                const cambio = JSON.parse(contenido);
                console.log('📄 Cambio parseado:', cambio);
                callback(cambio);
            } catch (error) {
                console.error('❌ Error al parsear contenido recibido:', error);
            }
        });
    }
    
    
}
