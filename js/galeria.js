// Lógica de la Galería con Lightbox
// Envuelve la lógica en una función para poder llamarla si es necesario
function initializeGallery() {
    const totalImagenes = 9; // Asumiendo que tienes img1.jpg a img9.jpg
    const galeria = document.querySelector('.galeria');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const prevBtn = document.querySelector('.lightbox-btn.prev');
    const nextBtn = document.querySelector('.lightbox-btn.next');
    const closeLightboxBtn = document.querySelector('.close-lightbox');

    if (!galeria || !lightbox || !lightboxImg || !prevBtn || !nextBtn || !closeLightboxBtn) {
        console.warn("Elementos de la galería/lightbox no encontrados. El script no se inicializará.");
        return;
    }

    let imagenes = [];
    let currentIndex = 0;

    // Cargar imágenes en la galería
    galeria.innerHTML = ''; // Limpiar por si se carga varias veces
    // Dentro de tu función initializeGallery()

    for (let i = 1; i <= totalImagenes; i++) {
        const div = document.createElement('div');
        div.className = 'item-galeria';  // cambia esto
        const img = document.createElement('img');
        img.src = `../img/img${i}.jpg`;
        img.alt = `Imagen ${i}`;
        if (i === 9) {
            img.classList.add('prioridad-arriba');
        }

        div.appendChild(img);
        galeria.appendChild(div);
        imagenes.push(img);
    }


    // Mostrar imagen en lightbox por índice
    function mostrarImagen(idx) {
        currentIndex = (idx + imagenes.length) % imagenes.length;
        lightboxImg.src = imagenes[currentIndex].src;
    }

    // Abrir lightbox y guardar índice actual
    galeria.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') {
            currentIndex = imagenes.indexOf(e.target);
            mostrarImagen(currentIndex);
            lightbox.classList.add('activo');
        }
    });

    // Navegación botones
    prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        mostrarImagen(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        mostrarImagen(currentIndex + 1);
    });

    // Cerrar lightbox al hacer clic en el botón de cerrar o fuera de la imagen
    closeLightboxBtn.addEventListener('click', function () {
        lightbox.classList.remove('activo');
        lightboxImg.src = '';
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('activo');
            lightboxImg.src = '';
        }
    });
    // Navegación con flechas del teclado
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('activo')) return;

        if (e.key === 'ArrowLeft') {
            mostrarImagen(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            mostrarImagen(currentIndex + 1);
        } else if (e.key === 'Escape') {
            lightbox.classList.remove('activo');
            lightboxImg.src = '';
        }
    });

}

// Llama a la función de inicialización cuando el DOM esté listo
// o cuando el script sea cargado dinámicamente por main.js
document.addEventListener('DOMContentLoaded', initializeGallery);
