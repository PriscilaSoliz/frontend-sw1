import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class GeminiService {

    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';
    private readonly API_KEY = 'AIzaSyDSZmAJIE17Ei-QATNIPXHyFM3Rm9RSDBE';
// AIzaSyByopC8feRWNWImbDqJpi4nXyb49WHyUqQ
    constructor(private http: HttpClient) {}

    enviarPreguntaConImagen(pregunta: string, imagenBase64: string): Observable<any> {
        const body = {
            contents: [{
                parts: [
                    { text: pregunta },
                    { inlineData: { mimeType: 'image/png', data: imagenBase64.split(',')[1] } }
                ]
            }]
        };
        return this.http.post(`${this.API_URL}?key=${this.API_KEY}`, body);
    }

    async enviarPrompt(prompt: string): Promise<string> {
        const body = {
          contents: [{ parts: [{ text: prompt }] }]
        };
        const response: any = await firstValueFrom(
          this.http.post(`${this.API_URL}?key=${this.API_KEY}`, body)
        );
        return response.candidates[0]?.content?.parts[0]?.text || '';
    }
}

