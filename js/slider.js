function initializeSlider() {
    const slider = document.querySelector('.deslizador');
    const sliderContainer = slider.querySelector('.contenedor-deslizante');
    const slides = slider.querySelectorAll('.diapositiva');
    const prevBtn = slider.querySelector('.btn-previa');
    const nextBtn = slider.querySelector('.btn-siguiente');
    const puntosContainer = slider.querySelector('.puntos');

    let currentSlide = 0;
    let autoSlideInterval;

    // Crear los puntos
    slides.forEach((_, i) => {
        const punto = document.createElement('div');
        punto.classList.add('punto');
        if (i === 0) punto.classList.add('activo');
        punto.addEventListener('click', () => {
            showSlide(i);
            resetAutoSlide();
        });
        puntosContainer.appendChild(punto);
    });

    const puntos = slider.querySelectorAll('.punto');

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        const offset = currentSlide * -100;
        sliderContainer.style.transform = `translateX(${offset}%)`;

        puntos.forEach((p, i) => {
            p.classList.toggle('activo', i === currentSlide);
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Swipe para móvil
    let startX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    sliderContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        if (deltaX > 50) {
            prevSlide();
            resetAutoSlide();
        } else if (deltaX < -50) {
            nextSlide();
            resetAutoSlide();
        }
    });

    showSlide(currentSlide);
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', initializeSlider);
