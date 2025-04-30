import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GeminiService {

    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent';
    private readonly API_KEY = 'AIzaSyDSZmAJIE17Ei-QATNIPXHyFM3Rm9RSDBE';
// AIzaSyByopC8feRWNWImbDqJpi4nXyb49WHyUqQ
    constructor(private http: HttpClient) {}

    enviarPreguntaConImagen(pregunta: string, imagenBase64: string): Observable<any> {
        const body = {
            contents: [
            {
                parts: [
                { text: pregunta },
                { inlineData: { mimeType: 'image/png', data: imagenBase64.split(',')[1] } }
                ]
            }
            ]
        };
    
        return this.http.post(`${this.API_URL}?key=${this.API_KEY}`, body);
    }
}