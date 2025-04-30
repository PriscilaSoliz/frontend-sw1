import { Component, AfterViewInit, ViewChild } from '@angular/core';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SalaService } from '../services/sala.service';
import { WebSocketService } from '../services/websocket.service';
import { ChatGeminiComponent } from '../components/chat-gemini/chat-gemini.component';
import { SqlGenerateComponent } from '../components/sql-generate/sql-generate.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { loadBlocks } from './blocks';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  imports: [CommonModule, ChatGeminiComponent, SqlGenerateComponent, NavbarComponent],
})
export class EditorComponent implements AfterViewInit {
  @ViewChild(ChatGeminiComponent) chatGeminiComponent!: ChatGeminiComponent;
  @ViewChild(SqlGenerateComponent) sqlGenerateComponent!: SqlGenerateComponent;

  editor: any;
  idSala!: number;
  static editorInstance: any;

  htmlExportado = '';
  cssExportado = '';
  tsExportado = '';
  modalExportarAbierto = false;
  modalXmiAbierto = false;
  cargandoGeminiXMI = false; // Spinner
  mensajeGemini = '';

  constructor(
    private route: ActivatedRoute,
    private salaService: SalaService,
    private webSocketService: WebSocketService,
    private geminiService: GeminiService
  ) {}

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.idSala = +params['id'];

      this.editor = grapesjs.init({
        container: '#gjs',
        height: '100vh',
        width: 'auto',
        fromElement: false,
        storageManager: false,
        plugins: ['gjs-preset-webpage'],
        pluginsOpts: {
          'gjs-preset-webpage': {
            blocksBasic: false,
            forms: false,
            navbar: false,
            countdown: false,
            export: false,
            flexGrid: false,
          },
        },
        blockManager: { appendTo: '#blocks' },
        styleManager: { appendTo: '#styles' },
        traitManager: { appendTo: '#traits' },
        layerManager: { appendTo: '#layers' },
        selectorManager: { appendTo: '#selectors' },
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px' },
            { name: 'Mobile', width: '375px' },
          ],
        },
      });

      loadBlocks(this.editor.BlockManager);
      (window as any).grapesEditorInstance = this.editor;

      this.cargarContenido();
      this.webSocketService.joinSala(this.idSala);

      this.editor.on('component:update', (model: any) => {
        this.enviarActualizacion(model);
      });
  
      this.editor.on('component:drag:end', (model: any) => {
        this.enviarActualizacion(model);
      });
  
      this.editor.on('component:remove', (model: any) => {
        this.enviarEliminacion(model);
      });
  
      // 🔵 Escuchar cambios remotos
      this.webSocketService.escucharContenido((cambio: any) => {
        if (!cambio) return;
        if (cambio.tipo === 'update') {
          this.actualizarComponenteRemoto(cambio.data);
        } else if (cambio.tipo === 'delete') {
          this.eliminarComponenteRemoto(cambio.data);
        }
      });
    });
  }

  cargarContenido() {
    this.salaService.obtenerContenido(this.idSala).subscribe(
      (res) => {
        if (res.contenido) {
          this.editor.loadProjectData(JSON.parse(res.contenido));
        }
      },
      (err) => console.error('Error al cargar contenido:', err)
    );
  }

  guardarContenido() {
    const projectData = this.editor.getProjectData();
    this.salaService.guardarContenido(this.idSala, JSON.stringify(projectData)).subscribe(
      () => window.alert('✅ Guardado exitosamente'),
      (err) => console.error('Error al guardar contenido:', err)
    );
  }

  abrirModalGemini() {
    this.chatGeminiComponent?.abrirModal();
  }

  abrirModalSql() {
    this.sqlGenerateComponent?.abrirModal();
  }

  /*-------- 🔵 SOCKET.IO Funciones ---------*/

  enviarActualizacion(model: any) {
    const id = typeof model.getId === 'function' ? model.getId() : model.id;
    const attributes = typeof model.getAttributes === 'function' ? model.getAttributes() : model.attributes || {};
    const style = typeof model.getStyle === 'function' ? model.getStyle() : model.style || {};
    const content = typeof model.toHTML === 'function' ? model.toHTML() : model.content || '';
  
    if (!id) {
      console.warn('⚠️ No se pudo obtener ID válido del componente:', model);
      return;
    }
  
    const rawContent = model.toHTML ? model.toHTML() : model.content || '';
    const cleanContent = rawContent
      .replace(/<\/?body[^>]*>/g, '')  // Elimina <body> y </body>
      .replace(/<\/?html[^>]*>/g, '')  // Elimina <html>
      .replace(/<\/?head[^>]*>/g, ''); // Elimina <head>

    const data = {
      tipo: 'update',
      data: {
        id,
        attributes: model.getAttributes ? model.getAttributes() : model.attributes || {},
        style: model.getStyle ? model.getStyle() : model.style || {},
        content: cleanContent,
      }
    };
  
    console.log('📤 Enviando actualización:', data);
    this.webSocketService.enviarContenido(this.idSala, JSON.stringify(data));
  }
   
  enviarEliminacion(model: any) {
    const data = {
      tipo: 'delete',
      data: {
        id: model.getId(),
      }
    };
    console.log('📤 Enviando eliminación:', data);
    this.webSocketService.enviarContenido(this.idSala, JSON.stringify(data));
  }
  
  actualizarComponenteRemoto(data: any) {
    console.log('🔵 Aplicando cambio remoto:', data);
    const wrapper = this.editor.getWrapper();
    
    if (data.id === 'wrapper' || !data.id) {
        // 🔵 Si no hay id o es el canvas raíz => actualiza TODO
        wrapper.components([]);
        wrapper.append(data.content);
    } else {
        // 🔵 Si tiene id, buscar y actualizar ese componente específico
        const target = wrapper.find(`#${data.id}`)[0];
        
        if (target) {
            console.log('🎯 Componente encontrado:', target);
            if (data.attributes) {
                target.setAttributes(data.attributes);
            }
            if (data.style) {
                target.setStyle(data.style);
            }
            if (data.content !== undefined) {
                target.components([]);
                target.append(data.content);
            }
        } else {
            console.warn('⚠️ No se encontró el componente, se crea uno nuevo');
            wrapper.append({
                type: 'default',
                id: data.id,
                attributes: data.attributes || {},
                style: data.style || {},
                content: data.content || '',
            });
        }
    }

    this.editor.refresh();
  }

  
  eliminarComponenteRemoto(data: any) {
    const component = this.editor.getWrapper().find(`#${data.id}`)[0];
    if (component) {
      component.remove();
    }
  }

  /* -------- 🛠 Exportar a Angular --------- */

  abrirModalExportar() {
    this.htmlExportado = this.editor.getHtml();
    this.cssExportado = this.editor.getCss();

    const nombreComponente = 'mi-componente';
    this.tsExportado = `
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-${nombreComponente}',
        templateUrl: './${nombreComponente}.component.html',
        styleUrls: ['./${nombreComponente}.component.css']
      })
      export class ${this.pascalCase(nombreComponente)}Component {}
    `.trim();

    this.modalExportarAbierto = true;
  }

  cerrarModalExportar() {
    this.modalExportarAbierto = false;
  }

  descargarArchivos() {
    const nombreComponente = 'mi-componente';

    // HTML
    const htmlBlob = new Blob([this.htmlExportado], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    this.descargarArchivo(htmlUrl, `${nombreComponente}.component.html`);

    // CSS
    const cssBlob = new Blob([this.cssExportado], { type: 'text/css' });
    const cssUrl = URL.createObjectURL(cssBlob);
    this.descargarArchivo(cssUrl, `${nombreComponente}.component.css`);

    // TS
    const tsBlob = new Blob([this.tsExportado], { type: 'text/plain' });
    const tsUrl = URL.createObjectURL(tsBlob);
    this.descargarArchivo(tsUrl, `${nombreComponente}.component.ts`);
  }

  private descargarArchivo(url: string, nombre: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  private pascalCase(nombre: string): string {
    return nombre
      .split('-')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
  }

  /*---------EXPORTAR A XMI O XML */
  procesarXMI(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const contenidoXML = e.target.result;
      this.cargandoGeminiXMI = true;
      this.mensajeGemini = 'Enviando archivo a Gemini...';
  
      try {
        const prompt = `
          Eres un experto en front-end y estás ayudando a convertir diagramas XMI en diseños web.
          Eres un asistente experto en Angular. Se te proporciona un archivo XMI que representa un modelo de base de datos generado en Enterprise Architect. Quiero que generes a partir de ese XMI un diseño web CRUD funcional utilizando HTML y CSS compatible con Angular. Este diseño debe contener formularios, inputs, botones y estructura visual editable en un editor como GrapesJS. No generes el diseño como un diagrama UML, sino como una interfaz visual de formulario web moderna, con estilo limpio y organizado.
          
          <xml>
          ${contenidoXML}
          </xml>
          Solo responde con el contenido de <body> y <style> para que sea fácil insertarlo al canvas. No incluyas etiquetas <html> ni <head>.
          No expliques nada, solo da el HTML y CSS limpio.  
          `;
        // 👉 Suponiendo que tienes GeminiService ya configurado:
        const respuesta = await this.geminiService.enviarPrompt(prompt);
        const { html, css } = this.extraerHtmlCss(respuesta);
        console.log('📦 Respuesta de Gemini:', respuesta); /*---- */
        this.editor.addComponents(`
          <style>${css}</style>
          ${html}
        `);
        this.mensajeGemini = '✅ Diseño generado con éxito.';
      } catch (err) {
        console.error('Error al procesar con Gemini:', err);
        this.mensajeGemini = '❌ Error al procesar el archivo.';
      } finally {
        this.cargandoGeminiXMI = false;
        this.cerrarModalXMI();
      }
    };
    reader.readAsText(file);
  }
  

  convertirXMIaEditor(xmlString: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'text/xml');
  
    const tablas = Array.from(xml.getElementsByTagName('table'));
  
    tablas.forEach((tabla: any) => {
      const nombreTabla = tabla.getAttribute('name');
      const columnas = Array.from(tabla.getElementsByTagName('column')).map((col: any) =>
        col.getAttribute('name')
      );
  
      // Crear bloque visual simulado (ajústalo a tu editor específico)
      const html = `
        <div class="tabla-sql">
          <h3>${nombreTabla}</h3>
          <ul>${columnas.map(col => `<li>${col}</li>`).join('')}</ul>
        </div>
      `;
  
      this.editor.addComponents(html);
    });
  }

  extraerHtmlCss(respuesta: string): { html: string, css: string } {
    const bodyMatch = respuesta.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const cssMatch = respuesta.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  
    return {
      html: bodyMatch ? bodyMatch[1].trim() : '',
      css: cssMatch ? cssMatch[1].trim() : ''
    };
  }
  
  abrirModalXMI() {
    this.modalXmiAbierto = true;
  }
  
  cerrarModalXMI() {
    this.modalXmiAbierto = false;
  }
}
