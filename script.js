/* ==========================================================================
   SABOR GOURMET · Interacciones del portal
   --------------------------------------------------------------------------
   Este archivo se carga al final de index.html, cuando toda la página ya existe.
   Contenido:
     1. Encabezado y botón "volver al inicio"
     2. Menú de navegación (hamburguesa y sección activa)
     3. Filtros del menú gastronómico
     4. Galería: filtros y visor de imágenes
     5. Horarios: día actual y estado "abierto / cerrado"
     6. Enlaces de demostración (redes sociales)
     7. Formulario de contacto con validación
   ========================================================================== */

'use strict'; // modo estricto: ayuda a detectar errores de escritura

/* Atajos para escribir menos: $ busca un elemento y $$ busca varios */
const $  = (selector, base = document) => base.querySelector(selector);
const $$ = (selector, base = document) => Array.from(base.querySelectorAll(selector));


/* ==========================================================================
   1. ENCABEZADO Y BOTÓN "VOLVER AL INICIO"
   ========================================================================== */
const encabezado = $('#encabezado');
const botonSubir = $('#botonSubir');

function actualizarAlDesplazar() {
  const bajado = window.scrollY;
  // Después de bajar un poco, el encabezado se pone sólido para que se lea bien
  encabezado.classList.toggle('solido', bajado > 30);
  // El botón de volver arriba aparece cuando ya se bajó bastante
  botonSubir.classList.toggle('visible', bajado > 600);
}
window.addEventListener('scroll', actualizarAlDesplazar, { passive: true });
actualizarAlDesplazar(); // se ejecuta una vez al cargar, por si la página ya está bajada


/* ==========================================================================
   2. MENÚ DE NAVEGACIÓN
   ========================================================================== */
const navBoton = $('#navBoton');
const enlacesNav = $$('#navPrincipal a');

/* Abre o cierra el menú en pantallas pequeñas */
function cambiarMenu(abrir) {
  encabezado.classList.toggle('nav-abierto', abrir);
  navBoton.setAttribute('aria-expanded', String(abrir));
}
navBoton.addEventListener('click', () => {
  cambiarMenu(!encabezado.classList.contains('nav-abierto'));
});
// Al elegir una sección, el menú se cierra solo
enlacesNav.forEach(enlace => enlace.addEventListener('click', () => cambiarMenu(false)));
// Con la tecla Escape también se cierra
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') cambiarMenu(false);
});
// Si la pantalla se agranda (por ejemplo, al girar la tablet), se restablece
window.addEventListener('resize', () => { if (window.innerWidth > 860) cambiarMenu(false); });

/* Marca en el menú la sección que se está viendo.
   IntersectionObserver avisa cuando una sección cruza la mitad de la pantalla. */
const secciones = ['inicio', 'nosotros', 'menu', 'galeria', 'promociones', 'contacto']
  .map(id => document.getElementById(id));

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;
    enlacesNav.forEach(enlace => {
      enlace.classList.toggle('activo', enlace.getAttribute('href') === '#' + entrada.target.id);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

secciones.forEach(seccion => seccion && observador.observe(seccion));


/* ==========================================================================
   3. FILTROS DEL MENÚ GASTRONÓMICO
   Cada botón tiene data-filtro="entradas", "postres", etc.
   Cada categoría tiene data-categoria con el mismo nombre.
   ========================================================================== */
const botonesMenu = $$('[data-filtro]');
const categorias  = $$('.categoria');

function filtrarMenu(filtro) {
  // 1) Marcar el botón elegido
  botonesMenu.forEach(boton => {
    const activo = boton.dataset.filtro === filtro;
    boton.classList.toggle('activo', activo);
    boton.setAttribute('aria-pressed', String(activo));
  });

  // 2) Mostrar solo las categorías que corresponden
  categorias.forEach(categoria => {
    const visible = filtro === 'todo' || categoria.dataset.categoria === filtro;
    categoria.hidden = !visible;
    categoria.classList.remove('mostrar');
    if (visible) {
      void categoria.offsetWidth;          // reinicia la animación de entrada
      categoria.classList.add('mostrar');
    }
  });
}
botonesMenu.forEach(boton => boton.addEventListener('click', () => filtrarMenu(boton.dataset.filtro)));


/* ==========================================================================
   4. GALERÍA: FILTROS Y VISOR DE IMÁGENES
   ========================================================================== */
const botonesGaleria = $$('[data-galeria]');
const elementosGaleria = $$('#galeria-lista li');

function filtrarGaleria(tipo) {
  botonesGaleria.forEach(boton => {
    const activo = boton.dataset.galeria === tipo;
    boton.classList.toggle('activo', activo);
    boton.setAttribute('aria-pressed', String(activo));
  });
  elementosGaleria.forEach(li => {
    li.hidden = !(tipo === 'todo' || li.dataset.tipo === tipo);
  });
}
botonesGaleria.forEach(boton => boton.addEventListener('click', () => filtrarGaleria(boton.dataset.galeria)));

/* --- Visor: ventana emergente con la imagen en grande --- */
const visor          = $('#visor');
const visorImagen    = $('#visorImagen');
const visorPie       = $('#visorPie');
let imagenesVisibles = [];   // botones de la galería que se están mostrando
let posicion = 0;            // cuál de ellas está abierta

function mostrarEnVisor(indice) {
  // El operador % permite dar la vuelta: después de la última, vuelve a la primera
  posicion = (indice + imagenesVisibles.length) % imagenesVisibles.length;
  const boton = imagenesVisibles[posicion];
  const imagen = $('img', boton);
  visorImagen.src = imagen.src;
  visorImagen.alt = imagen.alt;
  visorPie.textContent = boton.dataset.pie || imagen.alt;
}

function abrirVisor(boton) {
  // Solo se puede recorrer lo que el filtro deja visible
  imagenesVisibles = $$('#galeria-lista li:not([hidden]) .galeria__item');
  mostrarEnVisor(imagenesVisibles.indexOf(boton));
  if (typeof visor.showModal === 'function') visor.showModal();
  else visor.setAttribute('open', '');
}

$$('.galeria__item').forEach(boton => boton.addEventListener('click', () => abrirVisor(boton)));
$('#visorCerrar').addEventListener('click', () => visor.close());
$('#visorAnterior').addEventListener('click', () => mostrarEnVisor(posicion - 1));
$('#visorSiguiente').addEventListener('click', () => mostrarEnVisor(posicion + 1));

// Clic en el fondo oscuro cierra el visor
visor.addEventListener('click', (evento) => { if (evento.target === visor) visor.close(); });
// Flechas del teclado para cambiar de imagen (Escape ya cierra el <dialog> por sí solo)
document.addEventListener('keydown', (evento) => {
  if (!visor.open) return;
  if (evento.key === 'ArrowLeft')  mostrarEnVisor(posicion - 1);
  if (evento.key === 'ArrowRight') mostrarEnVisor(posicion + 1);
});


/* ==========================================================================
   5. HORARIOS: DÍA ACTUAL Y ESTADO "ABIERTO / CERRADO"
   Se usa la hora de Guayaquil, sin importar dónde esté la persona.
   ========================================================================== */
function horaEnGuayaquil() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Guayaquil', weekday: 'short',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date());

  const dato = (tipo) => partes.find(p => p.type === tipo).value;
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { dia: dias[dato('weekday')], minutos: Number(dato('hour')) * 60 + Number(dato('minute')) };
}

function aMinutos(texto) {            // "11:30" → 690
  const [h, m] = texto.split(':').map(Number);
  return h * 60 + m;
}

function marcarHorario() {
  const etiqueta = $('#estadoLocal');
  const ahora = horaEnGuayaquil();

  $$('.horarios tr').forEach(fila => {
    const dias = fila.dataset.dias.split(',').map(Number);
    if (!dias.includes(ahora.dia)) return;

    fila.classList.add('hoy');                                  // resalta la fila de hoy
    const abierto = ahora.minutos >= aMinutos(fila.dataset.abre) &&
                    ahora.minutos <  aMinutos(fila.dataset.cierra);
    etiqueta.textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora';
    etiqueta.className = 'estado ' + (abierto ? 'abierto' : 'cerrado');
    etiqueta.hidden = false;
  });
}
marcarHorario();


/* ==========================================================================
   6. ENLACES DE DEMOSTRACIÓN (REDES SOCIALES)
   Los enlaces de redes no llevan a ningún lugar: avisamos con un mensaje breve.
   ========================================================================== */
const aviso = $('#aviso');
let temporizadorAviso;

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.hidden = false;
  clearTimeout(temporizadorAviso);                              // reinicia el tiempo si hay otro aviso
  temporizadorAviso = setTimeout(() => { aviso.hidden = true; }, 3200);
}

$$('[data-demo]').forEach(enlace => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault();                                    // evita que la página salte al inicio
    mostrarAviso('Enlace de demostración: ' + enlace.dataset.demo + ' no tiene una cuenta real.');
  });
});


/* ==========================================================================
   7. FORMULARIO DE CONTACTO CON VALIDACIÓN
   Cada regla recibe el texto escrito y devuelve un mensaje de error,
   o un texto vacío ('') si el dato es correcto.
   ========================================================================== */
const formulario = $('#formContacto');
const resultado  = $('#resultadoForm');
const contador   = $('#contador');

const reglas = {
  nombre(valor) {
    if (valor.length < 3) return 'Escribe tu nombre completo.';
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(valor)) return 'El nombre solo puede tener letras y espacios.';
    if (!/\S+\s+\S+/.test(valor)) return 'Escribe al menos un nombre y un apellido.';
    return '';
  },
  correo(valor) {
    if (valor === '') return 'Escribe tu correo electrónico.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    return '';
  },
  asunto(valor) {
    if (valor.length < 4) return 'El asunto debe tener al menos 4 caracteres.';
    if (valor.length > 80) return 'El asunto puede tener hasta 80 caracteres.';
    return '';
  },
  mensaje(valor) {
    if (valor.length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
    if (valor.length > 500) return 'El mensaje puede tener hasta 500 caracteres.';
    return '';
  }
};

/* Valida un campo y muestra (o quita) su mensaje de error. Devuelve true si está bien. */
function validarCampo(campo) {
  const valor = campo.value.trim();
  const error = reglas[campo.name](valor);
  const contenedor = campo.closest('.campo');

  $('.error', contenedor).textContent = error;
  contenedor.classList.toggle('invalido', error !== '');
  contenedor.classList.toggle('valido', error === '' && valor !== '');
  campo.setAttribute('aria-invalid', String(error !== ''));
  return error === '';
}

const camposForm = $$('input, textarea', formulario);

camposForm.forEach(campo => {
  // Al salir del campo se revisa lo escrito
  campo.addEventListener('blur', () => validarCampo(campo));
  // Mientras se escribe, solo se vuelve a revisar si ya tenía un error
  campo.addEventListener('input', () => {
    if (campo.closest('.campo').classList.contains('invalido')) validarCampo(campo);
  });
});

// Contador de caracteres del mensaje
$('#mensaje').addEventListener('input', (evento) => {
  contador.textContent = evento.target.value.length + ' / 500';
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault(); // evita que el navegador recargue la página

  // Se validan todos los campos (sin detenerse en el primer error)
  const resultados = camposForm.map(validarCampo);
  const todoCorrecto = resultados.every(Boolean);
  resultado.hidden = false;

  if (!todoCorrecto) {
    resultado.className = 'resultado problema';
    resultado.innerHTML = '<p><strong>Falta corregir algunos datos.</strong> Revisa los campos marcados en rojo y vuelve a intentarlo.</p>';
    camposForm[resultados.indexOf(false)].focus();   // lleva el cursor al primer campo con error
    return;
  }

  // IMPORTANTE: aquí NO se envía nada. Un envío real necesitaría un servidor
  // (por ejemplo PHP, Node.js o un servicio de formularios). Por eso se informa con claridad.
  resultado.className = 'resultado';
  resultado.innerHTML = '<p><strong>Los datos están completos y son correctos.</strong> ' +
    'Como este sitio es una demostración y no tiene un servidor configurado, ' +
    'tu mensaje no se envió ni fue recibido por el restaurante.</p>';
});
