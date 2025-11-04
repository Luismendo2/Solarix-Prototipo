// Datos de configuración para los simuladores
const CONFIG = {
    // Eficiencia de paneles (kW por panel)
    eficienciaPaneles: {
        monocristalino: 0.33,
        policristalino: 0.30,
        'pelicula-delgada': 0.25
    },
    
    // Radiación solar por región (kWh/m²/día)
    radiacionRegional: {
        caribe: 5.5,
        andina: 4.5,
        pacifico: 3.8,
        orinoquia: 5.2,
        amazonia: 4.2
    },
    
    // Precio promedio kWh en Colombia (COP)
    precioKWh: 750,
    
    // Factor de emisión CO₂ (kg CO₂/kWh)
    factorCO2: 0.45,
    
    // Costo por panel (COP)
    costoPaneles: {
        monocristalino: 800000,
        policristalino: 650000,
        'pelicula-delgada': 500000
    },
    
    // Área por panel (m²)
    areaPorPanel: 1.8
};

// Electrodomésticos comunes con consumo mensual estimado (kWh)
const ELECTRODOMESTICOS = [
    { id: 'nevera', nombre: 'Nevera', consumo: 50, seleccionado: false },
    { id: 'tv', nombre: 'Televisor', consumo: 25, seleccionado: false },
    { id: 'lavadora', nombre: 'Lavadora', consumo: 30, seleccionado: false },
    { id: 'aire', nombre: 'Aire Acondicionado', consumo: 150, seleccionado: false },
    { id: 'computador', nombre: 'Computador', consumo: 20, seleccionado: false },
    { id: 'iluminacion', nombre: 'Iluminación LED', consumo: 40, seleccionado: false },
    { id: 'microondas', nombre: 'Microondas', consumo: 15, seleccionado: false },
    { id: 'cafetera', nombre: 'Cafetera', consumo: 10, seleccionado: false },
    { id: 'ventilador', nombre: 'Ventilador', consumo: 20, seleccionado: false },
    { id: 'cargadores', nombre: 'Cargadores', consumo: 8, seleccionado: false }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarSimuladorConsumo();
});

// Navegación entre simuladores
function showSimulator(simulatorId) {
    // Ocultar todos los simuladores
    document.querySelectorAll('.simulator-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Remover clase active de todas las pestañas
    document.querySelectorAll('.simulator-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Mostrar simulador seleccionado
    document.getElementById(`simulator-${simulatorId}`).classList.add('active');
    
    // Activar pestaña correspondiente
    event.target.classList.add('active');
}

// HU1.1.1 - Simulador de Ahorro Mensual
function calcularAhorro() {
    // Obtener valores del formulario
    const tipoPanel = document.getElementById('tipo-panel').value;
    const cantidadPaneles = parseInt(document.getElementById('cantidad-paneles').value);
    const consumoMensual = parseInt(document.getElementById('consumo-mensual').value);
    const ubicacion = document.getElementById('ubicacion').value;
    
    // Validaciones básicas
    if (!cantidadPaneles || !consumoMensual) {
        alert('Por favor complete todos los campos requeridos');
        return;
    }
    
    // Cálculos
    const eficienciaPanel = CONFIG.eficienciaPaneles[tipoPanel];
    const radiacionDiaria = CONFIG.radiacionRegional[ubicacion];
    
    // Generación mensual estimada (kWh)
    const generacionMensual = cantidadPaneles * eficienciaPanel * radiacionDiaria * 30;
    
    // Ahorro mensual (COP)
    const ahorroMensual = Math.min(generacionMensual, consumoMensual) * CONFIG.precioKWh;
    
    // Reducción de CO₂ (kg)
    const reduccionCO2 = Math.min(generacionMensual, consumoMensual) * CONFIG.factorCO2;
    
    // Porcentaje de autosuficiencia
    const autosuficiencia = Math.min((generacionMensual / consumoMensual) * 100, 100);
    
    // Mostrar resultados
    mostrarResultadosAhorro({
        generacionMensual: Math.round(generacionMensual),
        ahorroMensual: Math.round(ahorroMensual),
        reduccionCO2: Math.round(reduccionCO2),
        autosuficiencia: Math.round(autosuficiencia)
    });
}

function mostrarResultadosAhorro(resultados) {
    document.getElementById('generacion-mensual').textContent = resultados.generacionMensual.toLocaleString();
    document.getElementById('ahorro-mensual').textContent = resultados.ahorroMensual.toLocaleString();
    document.getElementById('reduccion-co2').textContent = resultados.reduccionCO2.toLocaleString();
    document.getElementById('autosuficiencia').textContent = resultados.autosuficiencia;
    
    // Actualizar estado de maqueta
    const maquetaStatus = document.getElementById('maqueta-status');
    if (resultados.autosuficiencia >= 80) {
        maquetaStatus.textContent = '✅ Sistema muy eficiente - Validar en maqueta';
        maquetaStatus.style.color = '#4CAF50';
    } else if (resultados.autosuficiencia >= 50) {
        maquetaStatus.textContent = '⚠️ Sistema moderado - Comparar con maqueta';
        maquetaStatus.style.color = '#FF9800';
    } else {
        maquetaStatus.textContent = '🔍 Sistema básico - Verificar en laboratorio';
        maquetaStatus.style.color = '#F44336';
    }
    
    // Mostrar sección de resultados
    document.getElementById('results-ahorro').style.display = 'block';
}

// HU1.1.4 - Simulador de Consumo Doméstico
function inicializarSimuladorConsumo() {
    const container = document.getElementById('electrodomesticos-container');
    
    ELECTRODOMESTICOS.forEach(electrodomestico => {
        const applianceDiv = document.createElement('div');
        applianceDiv.className = 'appliance-item';
        applianceDiv.innerHTML = `
            <label class="appliance-checkbox">
                <input type="checkbox" 
                       id="${electrodomestico.id}" 
                       onchange="actualizarConsumoTotal()"
                       ${electrodomestico.seleccionado ? 'checked' : ''}>
                <span class="checkmark"></span>
                <span class="appliance-name">${electrodomestico.nombre}</span>
                <span class="appliance-consumo">${electrodomestico.consumo} kWh/mes</span>
            </label>
        `;
        container.appendChild(applianceDiv);
    });
}

function actualizarConsumoTotal() {
    let consumoTotal = 0;
    
    ELECTRODOMESTICOS.forEach(electrodomestico => {
        const checkbox = document.getElementById(electrodomestico.id);
        if (checkbox.checked) {
            consumoTotal += electrodomestico.consumo;
        }
    });
    
    document.getElementById('consumo-total').textContent = consumoTotal;
}

function calcularPanelesNecesarios() {
    const consumoTotal = parseInt(document.getElementById('consumo-total').textContent);
    const tipoPanel = document.getElementById('tipo-panel-consumo').value;
    const horasSol = parseFloat(document.getElementById('horas-sol').value);
    
    if (consumoTotal === 0) {
        alert('Por favor seleccione al menos un electrodoméstico');
        return;
    }
    
    // Cálculos
    const eficienciaPanel = CONFIG.eficienciaPaneles[tipoPanel];
    
    // Consumo diario (kWh/día)
    const consumoDiario = consumoTotal / 30;
    
    // Paneles necesarios considerando pérdidas del 20%
    const panelesNecesarios = Math.ceil((consumoDiario / (eficienciaPanel * horasSol)) * 1.2);
    
    // Potencia del sistema (kWp)
    const potenciaSistema = panelesNecesarios * eficienciaPanel;
    
    // Área requerida (m²)
    const areaRequerida = panelesNecesarios * CONFIG.areaPorPanel;
    
    // Inversión aproximada (COP)
    const inversionAprox = panelesNecesarios * CONFIG.costoPaneles[tipoPanel];
    
    // Mostrar resultados
    mostrarResultadosConsumo({
        panelesNecesarios,
        potenciaSistema: potenciaSistema.toFixed(2),
        areaRequerida: Math.round(areaRequerida),
        inversionAprox: Math.round(inversionAprox)
    });
    
    // Generar recomendaciones
    generarRecomendaciones(panelesNecesarios, consumoTotal);
}

function mostrarResultadosConsumo(resultados) {
    document.getElementById('paneles-necesarios').textContent = resultados.panelesNecesarios;
    document.getElementById('potencia-sistema').textContent = resultados.potenciaSistema;
    document.getElementById('area-requerida').textContent = resultados.areaRequerida;
    document.getElementById('inversion-aprox').textContent = resultados.inversionAprox.toLocaleString();
    
    // Actualizar estado de maqueta
    const maquetaStatus = document.getElementById('maqueta-status-consumo');
    if (resultados.panelesNecesarios <= 10) {
        maquetaStatus.textContent = '✅ Sistema viable - Validar en maqueta física';
        maquetaStatus.style.color = '#4CAF50';
    } else if (resultados.panelesNecesarios <= 20) {
        maquetaStatus.textContent = '⚠️ Sistema mediano - Comparar con prototipo';
        maquetaStatus.style.color = '#FF9800';
    } else {
        maquetaStatus.textContent = '🔍 Sistema grande - Requiere estudio técnico';
        maquetaStatus.style.color = '#F44336';
    }
    
    // Mostrar sección de resultados
    document.getElementById('results-consumo').style.display = 'block';
}

function generarRecomendaciones(panelesNecesarios, consumoTotal) {
    const recomendacionesContainer = document.getElementById('recomendaciones-list');
    recomendacionesContainer.innerHTML = '';
    
    const recomendaciones = [];
    
    if (consumoTotal > 500) {
        recomendaciones.push('Considere optimizar el consumo con electrodomésticos eficientes');
    }
    
    if (panelesNecesarios > 15) {
        recomendaciones.push('Recomendamos realizar un estudio de viabilidad técnica');
    } else {
        recomendaciones.push('Sistema adecuado para instalación residencial');
    }
    
    if (consumoTotal < 200) {
        recomendaciones.push('Excelente eficiencia energética, considere baterías para autonomía');
    }
    
    recomendaciones.forEach(recomendacion => {
        const li = document.createElement('div');
        li.className = 'recomendacion-item';
        li.innerHTML = `✓ ${recomendacion}`;
        recomendacionesContainer.appendChild(li);
    });
}

// Funciones auxiliares
function resetSimulator(tipo) {
    if (tipo === 'ahorro') {
        document.getElementById('cantidad-paneles').value = 10;
        document.getElementById('consumo-mensual').value = 500;
        document.getElementById('results-ahorro').style.display = 'none';
    } else {
        // Desmarcar todos los electrodomésticos
        ELECTRODOMESTICOS.forEach(electrodomestico => {
            const checkbox = document.getElementById(electrodomestico.id);
            if (checkbox) checkbox.checked = false;
        });
        document.getElementById('consumo-total').textContent = '0';
        document.getElementById('horas-sol').value = 5;
        document.getElementById('results-consumo').style.display = 'none';
    }
}

function descargarReporte() {
    alert('Función de descarga de reporte será implementada en la siguiente iteración');
    // Aquí se implementaría la generación de PDF
}

function generarPresupuesto() {
    alert('Función de generación de presupuesto será implementada en la siguiente iteración');
    // Aquí se implementaría la generación de presupuesto detallado
}

// Validaciones en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    // Validar número de paneles
    const cantidadPaneles = document.getElementById('cantidad-paneles');
    if (cantidadPaneles) {
        cantidadPaneles.addEventListener('change', function() {
            if (this.value > 50) this.value = 50;
            if (this.value < 1) this.value = 1;
        });
    }
    
    // Validar horas de sol
    const horasSol = document.getElementById('horas-sol');
    if (horasSol) {
        horasSol.addEventListener('change', function() {
            if (this.value > 8) this.value = 8;
            if (this.value < 3) this.value = 3;
        });
    }
});