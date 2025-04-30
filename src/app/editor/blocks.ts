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
  
    // 📦 Otros elementos (que ya tenías)
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
  
    bm.add('textarea', {
      label: 'Área de Texto',
      category: 'Formulario - Área y Botón',
      content: `<textarea style="width:100%;padding:10px;border-radius:4px;" placeholder="Escribe tu mensaje..."></textarea>`
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
  }
  