// ============================================
// CONFIGURACIÓN
// ============================================

// REEMPLAZA ESTA API KEY CON LA TUYA
const API_KEY = 'TU_API_KEY_AQUI';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ============================================
// REFERENCIAS AL DOM
// ============================================

const formulario = document.getElementById('formulario');
const inputCiudad = document.getElementById('inputCiudad');
const resultado = document.getElementById('resultado');
const estado = document.getElementById('estado');

// ============================================
// FUNCIÓN PRINCIPAL: CONSULTAR CLIMA
// ============================================

async function consultarClima(ciudad) {
    // Mostrar estado de carga
    estado.textContent = '🔄 Consultando el clima...';
    resultado.classList.remove('visible');

    try {
        // Codificar la ciudad para la URL
        const ciudadCodificada = encodeURIComponent(ciudad);

        // Construir la URL con parámetros
        const url =
            `${API_URL}?q=${ciudadCodificada}&appid=${API_KEY}&units=metric&lang=es`;

        // Hacer la petición
        const respuesta = await fetch(url);

        // Verificar si la respuesta fue exitosa
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error('Ciudad no encontrada');
            } else if (respuesta.status === 401) {
                throw new Error('API Key inválida');
            } else {
                throw new Error('Error en la petición: ' +
                    respuesta.status);
            }
        }

        // Convertir a JSON
        const datos = await respuesta.json();

        // Mostrar los datos
        mostrarClima(datos);

        estado.textContent = '✅ Datos actualizados correctamente.';

    } catch (error) {
        console.error('Error:', error);
        estado.textContent = `❌ ${error.message}. Intenta con otra ciudad.`;
        resultado.classList.remove('visible');
    }
}

// ============================================
// FUNCIÓN: MOSTRAR EL CLIMA EN EL DOM
// ============================================

function mostrarClima(datos) {

    // Extraer datos del objeto JSON anidado
    const ciudad = datos.name;
    const pais = datos.sys.country;
    const temperatura = Math.round(datos.main.temp);
    const sensacion = Math.round(datos.main.feels_like);
    const humedad = datos.main.humidity;
    const presion = datos.main.pressure;
    const viento = datos.wind.speed;
    const descripcion = datos.weather[0].description;
    const icono = datos.weather[0].icon;

    const iconoUrl =
        `https://openweathermap.org/img/wn/${icono}@2x.png`;

    // Construir el HTML del resultado
    resultado.innerHTML = `
        <div class="ciudad">${ciudad}</div>
        <div class="pais">${pais}</div>

        <img src="${iconoUrl}"
             alt="${descripcion}"
             class="icono-clima">

        <div class="temperatura">${temperatura}°C</div>
        <div class="descripcion">${descripcion}</div>

        <div class="detalles">

            <div class="detalle">
                <div class="etiqueta">Sensación</div>
                <div class="valor">${sensacion}°C</div>
            </div>

            <div class="detalle">
                <div class="etiqueta