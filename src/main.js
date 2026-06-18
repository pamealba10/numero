// main.js - Lógica principal del juego "Adivina el número"

import './style.css';



// ================================
// CONFIGURACIÓN DEL JUEGO
// ================================

const CONFIG = {
    MIN: 1,
    MAX: 100,
    MAX_INTENTOS: 10,
    MENSAJES: {
        BIENVENIDA: '💡 Ingresa un número y presiona "Adivinar"',
        EXITO: '🎉 ¡Felicidades! ¡Adivinaste el número!',
        GAME_OVER: '😢 ¡Has perdido! El número era ',
        FUERA_RANGO: '⚠️ Ingresa un número entre 1 y 100',
        NUMERO_INVALIDO: '❌ Ingresa un número válido',
        MAYOR: '📈 El número es más alto',
        MENOR: '📉 El número es más bajo'
    }
};

// ================================
// ESTADO DEL JUEGO
// ================================

const state = {
    numeroSecreto: 0,
    intentos: 0,
    mejorRacha: parseInt(localStorage.getItem('mejorRacha')) || 0,
    juegoTerminado: false,
    historial: []
};

// ================================
// ELEMENTOS DEL DOM
// ================================

const elementos = {
    input: document.getElementById('numeroInput'),
    adivinarBtn: document.getElementById('adivinarBtn'),
    mensaje: document.getElementById('mensaje'),
    intentos: document.getElementById('intentos'),
    rango: document.getElementById('rango'),
    mejorRacha: document.getElementById('mejorRacha'),
    historialLista: document.getElementById('historialLista'),
    reiniciarBtn: document.getElementById('reiniciarBtn'),
    pistaBtn: document.getElementById('pistaBtn'),
    reiniciarRachaBtn: document.getElementById('reiniciarRachaBtn')
};

// ================================
// FUNCIONES PRINCIPALES
// ================================

function iniciarJuego() {
    state.numeroSecreto = Math.floor(Math.random() * (CONFIG.MAX - CONFIG.MIN + 1)) + CONFIG.MIN;
    state.intentos = 0;
    state.juegoTerminado = false;
    state.historial = [];
    
    actualizarUI();
    elementos.mensaje.textContent = CONFIG.MENSAJES.BIENVENIDA;
    elementos.mensaje.className = 'message info';
    elementos.input.disabled = false;
    elementos.adivinarBtn.disabled = false;
    elementos.input.value = '';
    elementos.input.focus();
    
    console.log(`🔢 Número secreto: ${state.numeroSecreto}`); // Para debugging
}

function adivinarNumero() {
    if (state.juegoTerminado) {
        elementos.mensaje.textContent = '⚠️ El juego ha terminado. Presiona "Nuevo Juego" para continuar.';
        return;
    }

    const numeroJugador = parseInt(elementos.input.value);
    
    // Validaciones
    if (isNaN(numeroJugador)) {
        mostrarError(CONFIG.MENSAJES.NUMERO_INVALIDO);
        return;
    }
    
    if (numeroJugador < CONFIG.MIN || numeroJugador > CONFIG.MAX) {
        mostrarError(CONFIG.MENSAJES.FUERA_RANGO);
        return;
    }

    // Incrementar intentos
    state.intentos++;
    
    // Registrar en historial
    state.historial.push({
        numero: numeroJugador,
        resultado: '',
        intento: state.intentos
    });

    // Comparar
    let mensaje = '';
    let clase = '';
    
    if (numeroJugador === state.numeroSecreto) {
        mensaje = CONFIG.MENSAJES.EXITO;
        clase = 'success';
        state.juegoTerminado = true;
        actualizarMejorRacha();
        elementos.input.disabled = true;
        elementos.adivinarBtn.disabled = true;
    } else if (numeroJugador < state.numeroSecreto) {
        mensaje = CONFIG.MENSAJES.MAYOR;
        clase = 'warning';
        state.historial[state.historial.length - 1].resultado = '⬆️ Bajo';
    } else {
        mensaje = CONFIG.MENSAJES.MENOR;
        clase = 'warning';
        state.historial[state.historial.length - 1].resultado = '⬇️ Alto';
    }

    // Verificar límite de intentos
    if (state.intentos >= CONFIG.MAX_INTENTOS && !state.juegoTerminado) {
        mensaje = CONFIG.MENSAJES.GAME_OVER + state.numeroSecreto;
        clase = 'error';
        state.juegoTerminado = true;
        elementos.input.disabled = true;
        elementos.adivinarBtn.disabled = true;
    }

    // Actualizar UI
    elementos.mensaje.textContent = mensaje;
    elementos.mensaje.className = `message ${clase}`;
    actualizarUI();
    actualizarHistorial();
    elementos.input.value = '';
    elementos.input.focus();
}

function mostrarError(mensaje) {
    elementos.mensaje.textContent = mensaje;
    elementos.mensaje.className = 'message error';
    elementos.input.value = '';
    elementos.input.focus();
}

function darPista() {
    if (state.juegoTerminado) {
        elementos.mensaje.textContent = '⚠️ El juego ha terminado. Inicia uno nuevo para pedir pistas.';
        return;
    }
    
    const numero = state.numeroSecreto;
    let pista = '';
    
    if (numero % 2 === 0) {
        pista = '🔢 El número es par';
    } else {
        pista = '🔢 El número es impar';
    }
    
    if (numero > 50) {
        pista += ' y es mayor que 50';
    } else {
        pista += ' y es menor o igual a 50';
    }
    
    if (numero % 5 === 0) {
        pista += ', además es múltiplo de 5';
    }
    
    elementos.mensaje.textContent = `💡 Pista: ${pista}`;
    elementos.mensaje.className = 'message info';
}

function actualizarMejorRacha() {
    if (state.intentos < state.mejorRacha || state.mejorRacha === 0) {
        state.mejorRacha = state.intentos;
        localStorage.setItem('mejorRacha', state.mejorRacha.toString());
    }
}

// ================================
// ACTUALIZACIÓN DE UI
// ================================

function actualizarUI() {
    elementos.intentos.textContent = state.intentos;
    elementos.rango.textContent = `${CONFIG.MIN} - ${CONFIG.MAX}`;
    elementos.mejorRacha.textContent = state.mejorRacha || '—';
}

function actualizarHistorial() {
    const historialHTML = state.historial.map(item => {
        const icono = item.resultado === '⬆️ Bajo' ? '⬆️' : 
                      item.resultado === '⬇️ Alto' ? '⬇️' : '🎯';
        const color = item.resultado === '⬆️ Bajo' ? '#f39c12' : 
                     item.resultado === '⬇️ Alto' ? '#e74c3c' : '#2ecc71';
        return `<li style="border-left-color: ${color}">
            <span class="intento-num">#${item.intento}</span>
            <span class="intento-valor">${item.numero}</span>
            <span class="intento-resultado">${item.resultado || '🎯 ¡Correcto!'}</span>
        </li>`;
    }).join('');

    if (state.historial.length === 0) {
        elementos.historialLista.innerHTML = '<li class="empty">Aún no hay intentos</li>';
    } else {
        elementos.historialLista.innerHTML = historialHTML;
    }
}

// ================================
// EVENTOS
// ================================

function setupEventListeners() {
    // Botón adivinar
    elementos.adivinarBtn.addEventListener('click', adivinarNumero);
    
    // Enter en el input
    elementos.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adivinarNumero();
        }
    });
    
    // Botón reiniciar
    elementos.reiniciarBtn.addEventListener('click', () => {
        iniciarJuego();
        elementos.historialLista.innerHTML = '<li class="empty">Aún no hay intentos</li>';
    });
    
    // Botón pista
    elementos.pistaBtn.addEventListener('click', darPista);
    
    // Botón reiniciar racha
    elementos.reiniciarRachaBtn.addEventListener('click', () => {
        state.mejorRacha = 0;
        localStorage.setItem('mejorRacha', '0');
        actualizarUI();
        elementos.mensaje.textContent = '🏆 Racha reiniciada';
        elementos.mensaje.className = 'message info';
    });
    
    // Validar input en tiempo real
    elementos.input.addEventListener('input', () => {
        const val = parseInt(elementos.input.value);
        if (val < CONFIG.MIN || val > CONFIG.MAX) {
            elementos.input.style.borderColor = '#e74c3c';
        } else {
            elementos.input.style.borderColor = '#2ecc71';
        }
    });
}

// ================================
// INICIALIZACIÓN
// ================================

function init() {
    console.log('🎯 ¡Bienvenido a Adivina el Número!');
    console.log(`📐 Configuración: ${CONFIG.MIN}-${CONFIG.MAX}, ${CONFIG.MAX_INTENTOS} intentos máximos`);
    
    iniciarJuego();
    setupEventListeners();
    
    // Mensaje de bienvenida con estadísticas
    if (state.mejorRacha > 0) {
        setTimeout(() => {
            elementos.mensaje.textContent = `🏆 Tu mejor racha es de ${state.mejorRacha} intentos. ¡A superarla!`;
            elementos.mensaje.className = 'message info';
        }, 500);
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);