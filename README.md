# Sabor Gourmet · Portal web de un restaurante ficticio

Proyecto académico de 3.er año de Bachillerato. Restaurante de cocina ecuatoriana en Guayaquil (todos los datos son ficticios).

## Cómo verlo
1. Descomprime la carpeta.
2. Abre `index.html` con doble clic. No necesita internet ni instalar nada
   (sin internet solo cambian las tipografías de Google Fonts por unas de respaldo).

## Archivos
| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura y textos de cada sección |
| `style.css` | Colores (variables al inicio), diseño, animaciones y pantallas pequeñas |
| `script.js` | Menú móvil, filtros, galería, horarios y validación del formulario |
| `img/` | Ilustraciones originales en SVG: logotipo, platos, bebidas, postres y local |

## Qué editar
- **Datos del grupo:** en `index.html`, sección `id="proyecto"` (busca los textos entre corchetes).
- **Colores:** variables en `:root` al inicio de `style.css`.
- **Platos y precios:** cada tarjeta `<article class="plato">` del menú.
- **Fotografías reales:** las imágenes incluidas son ilustraciones, no fotos. Para usar fotos propias,
  guárdalas en `img/` (por ejemplo `ceviche.jpg`) y cambia el `src` de la etiqueta `<img>` correspondiente.

## Formulario de contacto
Valida los campos, pero **no envía nada**: el sitio no tiene servidor. Así lo indica en pantalla.
