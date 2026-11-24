# VISUE · Sitio web del proyecto

Página oficial de presentación de VISUE (Institución Universitaria Pascual Bravo, 2026).
Es una página estática: **HTML + CSS + JavaScript**, sin instalar nada.

## Estructura

```
visue-web/
├── index.html          ← contenido (las 9 secciones)
├── styles.css          ← diseño y responsive
├── script.js           ← interacciones + CONFIG (aquí cambias los enlaces)
├── README.md
└── assets/
    ├── img/
    │   ├── logo.svg        ← logo original de VISUE
    │   ├── hero-mano.svg   ← ilustración de la portada
    │   ├── captura-1.jpg   ← (tú la agregas) captura real del Paso 1
    │   ├── captura-2.jpg   ← (tú la agregas) captura real del Paso 2
    │   ├── captura-3.jpg   ← (tú la agregas) captura real del Paso 3
    │   ├── equipo-gustavo.jpg
    │   ├── equipo-juan-david.jpg
    │   └── equipo-sebastian.jpg
    └── docs/
        └── ensayo.pdf      ← (tú lo agregas) el ensayo en PDF
```

## Ver la página en tu computador

- **Forma rápida:** haz doble clic en `index.html`.
- **Con servidor local (recomendado):** en la carpeta del proyecto ejecuta
  `python -m http.server 8000` y abre <http://localhost:8000>.

## Qué falta completar (todo es fácil de reemplazar)

Abre `script.js` y edita el bloque **`CONFIG`** del inicio:

| Qué | Dónde | Ejemplo |
|---|---|---|
| Enlace del prototipo | `CONFIG.prototipoUrl` | `'https://mi-prototipo.netlify.app'` |
| Video pitch | `CONFIG.videoUrl` | `'https://www.youtube.com/watch?v=XXXXXXXXXXX'` (también sirve YouTube corto, Vimeo o `.mp4`) |
| Ensayo en PDF | `CONFIG.ensayoPdf` | `'assets/docs/ensayo.pdf'` |
| Rol, descripción y portafolio | `CONFIG.equipo[0..2]` | `{ rol: '...', descripcion: '...', portafolio: 'https://...' }` |

Mientras algo siga entre corchetes `[ ... ]` o vacío, la página muestra un espacio «pendiente»
y el botón avisa que falta el dato (nunca se rompe).

**Imágenes (sin tocar código):** guarda los archivos con estos nombres en `assets/img/`
y aparecen solos: `captura-1.jpg`, `captura-2.jpg`, `captura-3.jpg`,
`equipo-gustavo.jpg`, `equipo-juan-david.jpg`, `equipo-sebastian.jpg`.
Si usas otros nombres o formatos (png, webp), cámbialos en `CONFIG.capturas` y `CONFIG.equipo`.
Recomendado: fotos cuadradas para el equipo y capturas de celular verticales u horizontales de buena resolución.

**Referencias de las cifras (sección «El problema»):** en `index.html`, busca
`[Agregar la referencia citada en el ensayo]` (aparece 3 veces) y reemplázalo por la referencia
tal como está en el ensayo.

**Texto del ensayo:** hay una descripción breve y general en `index.html`
(`data-essay-desc`). Puedes mejorarla con el resumen real del ensayo, ya sea en el HTML
o en `CONFIG.ensayoDescripcion`.

> Importante: la página **no inventa** capturas, roles, portafolios ni cifras adicionales.
> Las únicas cifras mostradas son las que nos indicaron para el ensayo y los datos técnicos del modelo.

## Publicar gratis en Netlify

**Opción A · Arrastrar y soltar (la más rápida)**
1. Entra a <https://app.netlify.com/drop> (crea una cuenta gratuita si no tienes).
2. Arrastra **la carpeta completa `visue-web`** a la zona indicada.
3. Netlify te da un enlace público tipo `https://nombre-aleatorio.netlify.app`.
4. Para cambiar el nombre: *Site configuration → Change site name*.
5. Para actualizar después de editar archivos: *Deploys → arrastra de nuevo la carpeta*.

**Opción B · Con GitHub (se actualiza solo)**
1. Sube la carpeta a un repositorio de GitHub.
2. En Netlify: *Add new site → Import an existing project → GitHub* y elige el repositorio.
3. Deja el comando de build vacío y el directorio de publicación en `/` (raíz).

## Notas útiles

- **Vista previa incrustada del prototipo:** algunas plataformas bloquean que su página se muestre dentro de otra
  (encabezados `X-Frame-Options`). En ese caso el botón **ABRIR PROTOTIPO VISUE** siempre funciona. Para usar la
  cámara en celular, abrir el prototipo en su propia pestaña suele ser más confiable. El prototipo debe estar en
  `https://` para que el navegador permita la cámara.
- **Visor del PDF en celular:** muchos navegadores móviles (especialmente iPhone) no muestran bien PDFs dentro de la página;
  por eso hay botones de **Descargar** y **Abrir en otra pestaña**.
- **Antes de entregar:** revisa en tu celular que los 3 botones principales (*Conoce nuestra solución*, *Probar VISUE*,
  *ABRIR PROTOTIPO VISUE*), el video, el PDF y los portafolios abran lo esperado.
- **Vista previa al compartir (WhatsApp, etc.):** si quieres una imagen en la vista previa del enlace, agrega una
  imagen `assets/img/og-visue.png` (1200×630) y una etiqueta `<meta property="og:image" content="https://TU-SITIO.netlify.app/assets/img/og-visue.png">` en `index.html`.

## Créditos

Gustavo Giraldo · Juan David Quevedo · Sebastián Arévalo — Institución Universitaria Pascual Bravo, 2026.
Tipografías: Sora e Inter (Google Fonts). Iconos propios en SVG.
