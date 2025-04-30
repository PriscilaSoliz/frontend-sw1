export function loadBlocks(bm: any) {

    // 📦 Layouts
    bm.add('header', {
      label: 'Encabezado',
      category: 'Diseño - Contenedores',
      content: `
        <header style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
          <h1>Mi Encabezado</h1>
        </header>
      `
    });
  
    bm.add('hero', {
      label: 'Sección',
      category: 'Diseño - Contenedores',
      content: `
        <section style="padding: 40px; background: #ecf0f1;">
          <h2>Sección Nueva</h2>
          <p>Contenido editable aquí.</p>
        </section>
      `
    });
  
    bm.add('footer', {
      label: 'Pie de Página',
      category: 'Diseño - Contenedores',
      content: `
        <footer style="background: #34495e; color: white; padding: 30px; text-align: center;">
          <p>© 2025 Mi Empresa. Todos los derechos reservados.</p>
        </footer>
      `
    });
  
    // Otros elementos
    bm.add('input-text', {
      label: 'Campo Texto',
      category: 'Formulario - Entradas',
      content: `<input type="text" placeholder="Escribe aquí" style="width:100%;padding:10px;border-radius:4px;">`
    });
  
    bm.add('input-email', {
      label: 'Campo Email',
      category: 'Formulario - Entradas',
      content: `<input type="email" placeholder="correo@ejemplo.com" style="width:100%;padding:10px;border-radius:4px;">`
    });
  
    bm.add('button', {
      label: 'Botón',
      category: 'Formulario - Área y Botón',
      content: `<button style="padding:10px 20px; background:#3498db; border:none; color:white; border-radius:4px;">Enviar</button>`
    });

    bm.add('button-common', {
      label: 'Botón common',
      content: '<button style="padding:10px 20px; background:#3498db; border:none; color:white; border-radius:4px;" class="btn btn-primary">Click aquí</button>',
      category: 'Formulario - Área y Botón'
    });
  
    bm.add('textarea', {
      label: 'Área de Texto',
      category: 'Formulario - Área y Botón',
      content: `<textarea style="width:100%;padding:10px;border-radius:4px;" placeholder="Escribe tu mensaje..."></textarea>`
    });

    bm.add('select-common', {
      label: 'Boton Desplegable',
      content: `
        <select class="form-control">
          <option>Opción 1</option>
          <option>Opción 2</option>
        </select>`,
      category: 'Formulario - Área y Botón'
    });

    bm.add('checklist', {
      label: 'Checklist',
      content: `
        <ul>
          <li><input type="checkbox"> Item 1</li>
          <li><input type="checkbox"> Item 2</li>
        </ul>`,
      category: 'Formulario - Área y Botón'
    });
  
    bm.add('grid-layout', {
      label: 'Grid',
      content: `
        <div class="row">
          <div class="col">Columna 1</div>
          <div class="col">Columna 2</div>
        </div>`,
      category: 'Diseño - Contenedores'
    });

    bm.add('heading', {
      label: 'Título',
      category: 'Elementos - Texto e Imagen',
      content: `<h2 style="font-size:28px;">Título editable</h2>`
    });
  
    bm.add('paragraph', {
      label: 'Párrafo',
      category: 'Elementos - Texto e Imagen',
      content: `<p style="font-size:16px;">Este es un párrafo editable.</p>`
    });

    bm.add('container-fluid', {
      label: 'Contenedor Fluido',
      category: 'Diseño - Contenedores',
      content: `<div style="width:100%; padding:20px; background:#f8f9fa;">Contenido aquí...</div>`
    });
    
    bm.add('card', {
      label: 'Tarjeta (Card)',
      category: 'Diseño - Contenedores',
      content: `
        <div style="border:1px solid #ddd; border-radius:6px; padding:20px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          <h3>Título</h3>
          <p>Contenido de tarjeta</p>
        </div>
      `
    });

    bm.add('input-password', {
      label: 'Campo Contraseña',
      category: 'Formulario - Entradas',
      content: `<input type="password" placeholder="Contraseña" style="width:100%;padding:10px;border-radius:4px;">`
    });
    
    bm.add('radio-group', {
      label: 'Opciones (Radio)',
      category: 'Formulario - Área y Botón',
      content: `
        <div>
          <label><input type="radio" name="grupo" checked> Opción 1</label><br>
          <label><input type="radio" name="grupo"> Opción 2</label>
        </div>
      `
    });

    bm.add('image', {
      label: 'Imagen',
      category: 'Elementos - Texto e Imagen',
      content: `<img src="https://via.placeholder.com/400x200" style="width:100%; border-radius:8px;" alt="Imagen">`
    });
    
    bm.add('divider', {
      label: 'Separador',
      category: 'Elementos - Texto e Imagen',
      content: `<hr style="margin:20px 0; border-top:1px solid #ccc;">`
    });

    bm.add('accordion', {
      label: 'Acordeón',
      category: 'Diseño - Contenedores',
      content: `
        <div>
          <button style="width:100%;text-align:left;">➕ Título 1</button>
          <div style="display:none;">Contenido oculto</div>
        </div>
      `
    });
    
    bm.add('tabs', {
      label: 'Pestañas (Tabs)',
      category: 'Diseño - Contenedores',
      content: `
        <div>
          <ul style="display:flex;list-style:none;gap:10px;padding:0;">
            <li><a href="#">Pestaña 1</a></li>
            <li><a href="#">Pestaña 2</a></li>
          </ul>
          <div>Contenido pestaña 1</div>
        </div>
      `
    });
  }
  