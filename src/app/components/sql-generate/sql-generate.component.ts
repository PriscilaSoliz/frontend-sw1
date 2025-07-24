import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sql-generate',
  standalone: true,
  templateUrl: './sql-generate.component.html',
  styleUrls: ['./sql-generate.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class SqlGenerateComponent {
  modalAbierto = false;
  prompt: string = '';
  cargando = false;

  constructor(private http: HttpClient) {}

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.prompt = '';
  }

  enviarPrompt() {
    if (!this.prompt.trim()) return;

    this.cargando = true;

    const API_KEY = 'AIzaSyDSZmAJIE17Ei-QATNIPXHyFM3Rm9RSDBE'; 
    // AIzaSyByopC8feRWNWImbDqJpi4nXyb49WHyUqQ
    const url = `    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    const body = {
      contents: [
        {
          parts: [{ text: `
            Eres un generador de interfaces visuales. A partir de la siguiente estructura de base de datos en SQL:

            ${this.prompt}

            Devuélveme solo el HTML estructurado listo para GrapesJS (sin <html> ni <body>) y el CSS dentro de una etiqueta <style>.
            Importante:
            - Los formularios deben tener la etiqueta <form>.
            - Los botones de guardado deben ser <button type="submit">Guardar</button>.
            - Cada <input> debe tener un atributo name correspondiente a la columna.
            - No expliques nada, solo da el HTML y CSS limpio.
            Responde solo el código, sin explicaciones ni comentarios.
          ` }]
        }
      ]
    };

    this.http.post<any>(url, body).subscribe(
      (res) => {
        console.log('✅ Respuesta de Gemini:', res);

        const respuestaGemini = res.candidates[0].content.parts[0].text;
        
        // 🚀 Ahora buscamos el editor de GrapesJS globalmente:
        const editor = (window as any).grapesEditorInstance;
        if (editor) {
          editor.setComponents('');
          editor.addComponents(respuestaGemini);
        } else {
          console.error('❌ Editor de GrapesJS no encontrado.');
        }

        this.cargando = false;
        this.cerrarModal();
      },
      (err) => {
        console.error('❌ Error al enviar a Gemini:', err);
        this.cargando = false;
      }
    );
  }
}
