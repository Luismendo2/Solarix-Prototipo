// script.js - Funcionalidades principales de Solarix

// Menu Hamburguesa
function initializeMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Simular carga de contenido multimedia
function initializeMediaPlaceholders() {
    const placeholders = document.querySelectorAll('[class*="placeholder"], [class*="infographic"], [class*="model3d"]');
    placeholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            ;
        });
    });
}

// Navegación entre módulos (simulación)
function initializeModuleNavigation() {
    const moduleButtons = document.querySelectorAll('.module-button, .nav-button');
    moduleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('Esta funcionalidad estará disponible cuando completes todos los módulos.');
            }
        });
    });
}

// Simular progreso de aprendizaje
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        // Simular animación de carga
        setTimeout(() => {
            bar.style.width = bar.style.width;
        }, 500);
    });
}

// Funcionalidades específicas para Módulo 2 - Tecnologías Solares
function initModule2Features() {
    // Simular interacción con modelos 3D
    const modelPlaceholders = document.querySelectorAll('.model3d-placeholder');
    modelPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            alert('Este modelo 3D te permitirá explorar las diferentes tecnologías solares de forma interactiva. Podrás rotar, acercar y ver detalles de cada componente.');
        });
    });
    
    // Simular calculadora comparativa
    const comparisonTable = document.querySelector('.comparison-table table');
    if (comparisonTable) {
        comparisonTable.addEventListener('click', function(e) {
            if (e.target.tagName === 'TD') {
                const row = e.target.parentElement;
                const technology = row.cells[0].textContent;
                alert(`Has seleccionado la tecnología: ${technology}. Próximamente podrás ver detalles específicos y comparativas avanzadas.`);
            }
        });
    }
}

// Funcionalidades específicas para Módulo 3 - Instalación y Mantenimiento
function initModule3Features() {
    // Simular interacción con pasos de instalación
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.querySelector('.step-number').textContent;
            alert(`Paso ${stepNumber}: En la versión final, podrás ver un video detallado de este paso de instalación.`);
        });
    });
    
    // Simular calculadora de retorno de inversión
    const calculator = document.querySelector('.calculator-placeholder');
    if (calculator) {
        calculator.addEventListener('click', function() {
            alert('La calculadora de retorno de inversión te permitirá ingresar datos específicos de tu ubicación y consumo para estimar el tiempo de recuperación de tu inversión en energía solar.');
        });
    }
    
    // Simular tabla de solución de problemas interactiva
    const troubleshootingRows = document.querySelectorAll('.troubleshooting-table tbody tr');
    troubleshootingRows.forEach(row => {
        row.addEventListener('click', function() {
            const problem = this.cells[0].textContent;
            const solution = this.cells[2].textContent;
            alert(`Problema: ${problem}\n\nSolución: ${solution}\n\nEn la versión final, podrás ver tutoriales paso a paso para cada solución.`);
        });
    });
}

// === FUNCIONALIDAD DEL PANEL DE CONFIGURACIONES - VERSIÓN SEGURA ===
function initializeSettingsPanel() {
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsPanel = document.getElementById('settingsPanel');
    const themeSelect = document.getElementById('themeSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const applySettings = document.getElementById('applySettings');
    const closeSettings = document.getElementById('closeSettings');

    // Verificar que TODOS los elementos existen antes de continuar
    if (!settingsToggle || !settingsPanel || !themeSelect || !fontSizeSlider || !fontSizeValue || !applySettings || !closeSettings) {
        console.log('Panel de configuraciones no disponible en esta página');
        return; // Salir silenciosamente si no hay panel de configuraciones
    }

    console.log('Inicializando panel de configuraciones...');

    // Abrir/cerrar panel
    settingsToggle.addEventListener('click', () => {
        const isVisible = settingsPanel.style.display === 'block';
        settingsPanel.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            loadSavedSettings();
        }
    });

    // Cerrar panel
    closeSettings.addEventListener('click', () => {
        settingsPanel.style.display = 'none';
    });

    // Actualizar valor de fuente en tiempo real
    fontSizeSlider.addEventListener('input', () => {
        fontSizeValue.textContent = `${fontSizeSlider.value}px`;
    });

    // Aplicar configuraciones
    applySettings.addEventListener('click', () => {
        applyTheme(themeSelect.value);
        applyFontSize(fontSizeSlider.value + 'px');
        saveSettings();
        settingsPanel.style.display = 'none';
        
        // Mostrar confirmación
        showNotification('Configuraciones aplicadas correctamente');
    });

    // Cerrar panel al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        if (settingsPanel.style.display === 'block' && 
            !settingsPanel.contains(event.target) && 
            event.target !== settingsToggle) {
            settingsPanel.style.display = 'none';
        }
    });

    // Cargar configuraciones guardadas al iniciar
    loadSavedSettings();
}

// Funciones auxiliares para el sistema de temas
function applyTheme(theme) {
    // Remover todos los temas primero
    document.documentElement.removeAttribute('data-theme');
    
    // Aplicar el tema seleccionado (solo si no es light, que es el por defecto)
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function applyFontSize(size) {
    document.documentElement.style.setProperty('--base-font-size', size);
}

function saveSettings() {
    const themeSelect = document.getElementById('themeSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    
    if (themeSelect && fontSizeSlider) {
        const settings = {
            theme: themeSelect.value,
            fontSize: fontSizeSlider.value
        };
        localStorage.setItem('solarixSettings', JSON.stringify(settings));
    }
}

function loadSavedSettings() {
    const saved = JSON.parse(localStorage.getItem('solarixSettings'));
    const themeSelect = document.getElementById('themeSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontSizeValue = document.getElementById('fontSizeValue');
    
    if (saved && themeSelect && fontSizeSlider && fontSizeValue) {
        // Cargar configuración guardada
        themeSelect.value = saved.theme;
        fontSizeSlider.value = saved.fontSize;
        fontSizeValue.textContent = `${saved.fontSize}px`;
        
        applyTheme(saved.theme);
        applyFontSize(saved.fontSize + 'px');
    }
}

function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 1003;
        font-family: var(--body-font);
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: fadeInOut 3s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades comunes
    initializeMenu();
    initializeMediaPlaceholders();
    initializeModuleNavigation();
    initializeProgressBars();
    
    // Inicializar panel de configuraciones (si existe)
    initializeSettingsPanel();
    
    // Inicializar funcionalidades específicas según la página
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('modulo2.html')) {
        initModule2Features();
    } else if (currentPage.includes('modulo3.html')) {
        initModule3Features();
    }
});

// Agregar estilos para la animación de notificación
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        15% { opacity: 1; transform: translateY(0); }
        85% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(notificationStyles);