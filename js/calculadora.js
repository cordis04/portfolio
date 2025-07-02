// Lógica de la Calculadora
function suma(a, b) { return a + b; }
function resta(a, b) { return a - b; }
function multiplicacion(a, b) { return a * b; }
function division(a, b) { return a / b; }
function porcentaje(a) { return a / 100; }
function raiz(a) { return Math.sqrt(a); }

document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.calculadora button');
    const inputSpan = document.querySelector('.visor .entrada');   // corregido
    const resultadoSpan = document.querySelector('.visor .resultado');

    if (!botones.length || !inputSpan || !resultadoSpan) {
        console.warn("Elementos de la calculadora no encontrados. El script no se inicializará.");
        return;
    }

    let inputActual = '';
    let operador = null;
    let valorAnterior = null;
    let esperandoSegundoOperando = false;

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const valor = boton.textContent;

            if (boton.classList.contains('numero')) {
                if (esperandoSegundoOperando) {
                    inputActual = valor;
                    esperandoSegundoOperando = false;
                } else {
                    inputActual += valor;
                }
                inputSpan.textContent = inputActual;

            } else if (valor === '.') {
                if (!inputActual.includes('.')) {
                    if (inputActual === '') {
                        inputActual = '0.';
                    } else {
                        inputActual += '.';
                    }
                    inputSpan.textContent = inputActual;
                }

            } else if (boton.classList.contains('borrar')) {  // corregido: borrar en vez de clear
                if (boton.dataset.accion === 'borrar-todo') {  // corregido: borrar-todo en vez de clear-all
                    inputActual = '';
                    operador = null;
                    valorAnterior = null;
                    esperandoSegundoOperando = false;
                    inputSpan.textContent = '';
                    resultadoSpan.textContent = '';
                } else if (boton.dataset.accion === 'borrar-entrada') { // corregido: borrar-entrada en vez de clear-entry
                    inputActual = '';
                    inputSpan.textContent = '';
                }

            } else if (valor === '=') {
                if (operador && valorAnterior !== null && inputActual !== '') {
                    const valorActual = parseFloat(inputActual);
                    let res;
                    switch (operador) {
                        case '+': res = suma(valorAnterior, valorActual); break;
                        case '-': res = resta(valorAnterior, valorActual); break;
                        case '*': res = multiplicacion(valorAnterior, valorActual); break;
                        case '/': res = division(valorAnterior, valorActual); break;
                        default: res = '';
                    }
                    resultadoSpan.textContent = res.toFixed(2);
                    inputSpan.textContent = '';
                    inputActual = res.toString();
                    operador = null;
                    valorAnterior = null;
                    esperandoSegundoOperando = true;
                }

            } else if (valor === '%') {
                if (inputActual !== '') {
                    const num = parseFloat(inputActual);
                    const res = porcentaje(num);
                    resultadoSpan.textContent = res.toFixed(2);
                    inputSpan.textContent = '';
                    inputActual = res.toString();
                    esperandoSegundoOperando = true;
                }

            } else if (valor === '√') {
                if (inputActual !== '') {
                    const num = parseFloat(inputActual);
                    if (num >= 0) {
                        const res = raiz(num);
                        resultadoSpan.textContent = res.toFixed(2);
                        inputSpan.textContent = '';
                        inputActual = res.toString();
                        esperandoSegundoOperando = true;
                    } else {
                        resultadoSpan.textContent = 'Error';
                        inputSpan.textContent = '';
                        inputActual = '';
                    }
                }

            } else {
                if (inputActual !== '') {
                    if (valorAnterior === null) {
                        valorAnterior = parseFloat(inputActual);
                    } else if (!esperandoSegundoOperando) {
                        const valorActual = parseFloat(inputActual);
                        switch (operador) {
                            case '+': valorAnterior = suma(valorAnterior, valorActual); break;
                            case '-': valorAnterior = resta(valorAnterior, valorActual); break;
                            case '*': valorAnterior = multiplicacion(valorAnterior, valorActual); break;
                            case '/': valorAnterior = division(valorAnterior, valorActual); break;
                        }
                        resultadoSpan.textContent = valorAnterior.toFixed(2);
                    }
                    operador = valor;
                    inputSpan.textContent = operador + ' ';
                    esperandoSegundoOperando = true;
                } else if (resultadoSpan.textContent !== '') {
                    valorAnterior = parseFloat(resultadoSpan.textContent);
                    operador = valor;
                    inputSpan.textContent = operador + ' ';
                    resultadoSpan.textContent = '';
                    esperandoSegundoOperando = true;
                }
            }
        });
    });
});
