var contenedorJuego = null;
var juego = null;
var resultado = null;
var contadorBanderas = null;
var contadorBanderasRestantes = null;
var botonGenerar = null;

var width = 0;
var numBombas = 0;
var numBanderas = 0;
var casillas = [];
var finPartida = false;

function añadeNumeros() {
    for (var i = 0; i < casillas.length; i++) {
        var total = 0;
        var estaBordeIzq = (i % width === 0);
        var estaBordeDech = (i % width === width - 1);

        if (casillas[i].classList.contains('vacio')) {
            if (i > 0 && !estaBordeIzq && casillas[i - 1].classList.contains('bomba')) total++;
            if (i < (width * width - 1) && !estaBordeDech && casillas[i + 1].classList.contains('bomba')) total++;
            if (i > width && casillas[i - width].classList.contains('bomba')) total++;
            if (i > (width - 1) && !estaBordeDech && casillas[i + 1 - width].classList.contains('bomba')) total++;
            if (i > width && !estaBordeIzq && casillas[i - 1 - width].classList.contains('bomba')) total++;
            if (i < (width * (width - 1)) && casillas[i + width].classList.contains('bomba')) total++;
            if (i < (width * (width - 1)) && !estaBordeDech && casillas[i + 1 + width].classList.contains('bomba')) total++;
            if (i < (width * (width - 1)) && !estaBordeIzq && casillas[i - 1 + width].classList.contains('bomba')) total++;

            casillas[i].setAttribute('data', total);
        }
    }
}

function revelarCasillas(casilla) {
    var idCasilla = parseInt(casilla.id);
    var estaBordeIzq = (idCasilla % width === 0);
    var estaBordeDech = (idCasilla % width === width - 1);

    setTimeout(function () {
        if (idCasilla > 0 && !estaBordeIzq) click(casillas[idCasilla - 1]);
        if (idCasilla < (width * width - 2) && !estaBordeDech) click(casillas[idCasilla + 1]);
        if (idCasilla >= width) click(casillas[idCasilla - width]);
        if (idCasilla > (width - 1) && !estaBordeDech) click(casillas[idCasilla + 1 - width]);
        if (idCasilla > (width + 1) && !estaBordeIzq) click(casillas[idCasilla - 1 - width]);
        if (idCasilla < (width * (width - 1))) click(casillas[idCasilla + width]);
        if (idCasilla < (width * width - width - 2) && !estaBordeDech) click(casillas[idCasilla + 1 + width]);
        if (idCasilla < (width * width - width) && !estaBordeIzq) click(casillas[idCasilla - 1 + width]);
    }, 10);
}

function bomba(casillaClickeada) {
    finPartida = true;
    casillaClickeada.classList.add('back-red');

    for (var i = 0; i < casillas.length; i++) {
        if (casillas[i].classList.contains('bomba')) {
            casillas[i].innerHTML = '💣';
            casillas[i].classList.remove('bomba');
            casillas[i].classList.add('marcada');
        }
    }

    resultado.textContent = 'PERDISTE! JAJAJA';
    resultado.classList.add('back-red');
}

function añadirBandera(casilla) {
    if (finPartida) return;

    if (!casilla.classList.contains('marcada') && numBanderas < numBombas) {
        if (!casilla.classList.contains('bandera')) {
            casilla.classList.add('bandera');
            casilla.innerHTML = '🚩';
            numBanderas++;
            actualizaNumBanderas();
            compruebaPartida();
        } else {
            casilla.classList.remove('bandera');
            casilla.innerHTML = '';
            numBanderas--;
            actualizaNumBanderas();
        }
    }
}

function compruebaPartida() {
    var aciertos = 0;

    for (var i = 0; i < casillas.length; i++) {
        if (casillas[i].classList.contains('bandera') && casillas[i].classList.contains('bomba'))
            aciertos++;
    }

    if (aciertos === numBombas) {
        finPartida = true;
        resultado.textContent = 'Muy bien GANASTE!!!';
        resultado.classList.add('back-green');
    }
}

function actualizaNumBanderas() {
    contadorBanderas.textContent = numBanderas;
    contadorBanderasRestantes.textContent = (numBombas - numBanderas);
}

function click(casilla) {
    if (casilla.classList.contains('marcada') || casilla.classList.contains('bandera') || finPartida) return;

    if (casilla.classList.contains('bomba')) {
        bomba(casilla);
    } else {
        var total = casilla.getAttribute('data');
        if (total != 0) {
            casilla.classList.add('marcada');
            casilla.innerHTML = total;
            return;
        }
        casilla.classList.add('marcada');
        revelarCasillas(casilla);
    }
}

function dobleClick(casilla) {
    if (!casilla.classList.contains('marcada') || finPartida) return;

    revelarCasillas(casilla);
}

function crearJuego() {
    width = parseInt(document.getElementById('tamaño').value);
    numBombas = parseInt(document.getElementById('num-bombas').value);

    if (width < 6 || width > 20) {
        alert('El tamaño no puede ser menor de 6 ni mayor de 20');
        return;
    }
    if (numBombas < 1) {
        alert('El número de bombas tiene que ser como mínimo 1');
        return;
    }
    if (numBombas > width * width) {
        alert('El número de bombas no puede ser superior al producto de "Tamaño" x "Tamaño" (' + (width * width) + ')');
        return;
    }

    if (contenedorJuego.classList.contains('hidden')) {
        contenedorJuego.classList.remove('hidden');
    } else {
        juego.innerHTML = "";
        resultado.innerHTML = "";
        resultado.className = "resultado-juego";
        casillas = [];
        finPartida = false;
        numBanderas = 0;
    }

    juego.style.width = (width * 4) + 'rem';
    resultado.style.width = (width * 4) + 'rem';

    var arrayBombas = Array(numBombas);
    for (var i = 0; i < arrayBombas.length; i++) arrayBombas[i] = 'bomba';

    var arrayVacios = Array(width * width - numBombas);
    for (var j = 0; j < arrayVacios.length; j++) arrayVacios[j] = 'vacio';

    var arrayCompleto = arrayVacios.concat(arrayBombas);
    arrayCompleto.sort(function () { return Math.random() - 0.5; });

    for (var k = 0; k < width * width; k++) {
        (function (i) {
            var casilla = document.createElement('div');
            casilla.setAttribute('id', i);
            casilla.classList.add(arrayCompleto[i]);
            juego.appendChild(casilla);
            casillas.push(casilla);

            casilla.addEventListener('click', function (event) {
                click(event.target);
            });

            casilla.oncontextmenu = function (event) {
                event.preventDefault();
                añadirBandera(casilla);
            };

            casilla.addEventListener('dblclick', function (event) {
                dobleClick(event.target);
            });
        })(k);
    }

    añadeNumeros();
    actualizaNumBanderas();
}

document.addEventListener('DOMContentLoaded', function () {
    contenedorJuego = document.querySelector('.contenedor-juego');
    juego = document.querySelector('.juego');
    resultado = document.querySelector('.resultado-juego');
    contadorBanderas = document.getElementById('num-banderas');
    contadorBanderasRestantes = document.getElementById('banderas-restantes');
    botonGenerar = document.querySelector('.btn-generar');

    botonGenerar.addEventListener('click', crearJuego);
});