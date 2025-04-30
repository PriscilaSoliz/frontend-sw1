import { Component, AfterViewInit, ViewChild } from '@angular/core';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SalaService } from '../services/sala.service';
import { WebSocketService } from '../services/websocket.service';
import { ChatGeminiComponent } from '../components/chat-gemini/chat-gemini.component';
import { SqlGenerateComponent } from '../components/sql-generate/sql-generate.component';
import { loadBlocks } from './blocks';

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  imports: [CommonModule, ChatGeminiComponent, SqlGenerateComponent],
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

  constructor(
    private route: ActivatedRoute,
    private salaService: SalaService,
    private webSocketService: WebSocketService
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
}
