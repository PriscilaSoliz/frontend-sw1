import { Component, Input } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat-gemini',
  standalone: true,
  templateUrl: './chat-gemini.component.html',
  styleUrls: ['./chat-gemini.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class ChatGeminiComponent {
  @Input() editor: any; //pasaremos el editor de GrapesJS
  pregunta: string = '';
  respuesta: string = '';
  imagen: File | null = null;
  previewUrl: string | null = null;
  cargando = false;
  modalAbierto = false;


  abrirModal() {
    this.modalAbierto = true;
  }
  
  cerrarModal() {
    this.modalAbierto = false;
    this.previewUrl = null;
    this.imagen = null;
  }

  constructor(private geminiService: GeminiService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
  
      // Para mostrar vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen() {
    this.imagen = null;
    this.previewUrl = null;
  }
  

  async enviar() {
    if (!this.imagen) {
      alert('Debes subir una imagen primero.');
      return;
    }
    this.cargando = true;
    const prompt = `
    Analiza esta imagen. Devuélveme únicamente el HTML estructurado para GrapesJS (sin etiquetas <html> ni <body>) 
    y el CSS dentro de una etiqueta <style>. No expliques nada, responde solo el contenido listo para usar.
    `;
    
    const imagenBase64 = await this.convertirImagenBase64(this.imagen);
  
    this.geminiService.enviarPreguntaConImagen(prompt, imagenBase64).subscribe(
      (res) => {
        console.log('✅ Respuesta de Gemini:', res);
        const rawRespuesta = res.candidates[0]?.content?.parts[0]?.text || 'Sin respuesta válida.';
  
        if (this.editor && rawRespuesta) {
          //Limpiar y procesar la respuesta
          const html = this.extraerHTML(rawRespuesta);
          const css = this.extraerCSS(rawRespuesta);
  
          // Insertar en GrapesJS
          this.editor.addComponents(html);
          this.editor.setStyle(css);
          this.cargando = false;
          window.alert('✅ Diseño insertado correctamente!');
        }
      },
      (err) => {
        console.error('❌ Error al enviar a Gemini:', err);
      }
    );
  }
  
  // Método para extraer el HTML de la respuesta
  extraerHTML(respuesta: string): string {
    // Elimina todo lo que esté dentro de <style>...</style>
    return respuesta.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').trim();
  }
  
  // Método para extraer el CSS de la respuesta
  extraerCSS(respuesta: string): string {
    const styleMatch = respuesta.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    return styleMatch ? styleMatch[1].trim() : '';
  }

  convertirImagenBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
