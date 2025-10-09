// Mapa interactivo de proyectos solares en Colombia
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa
    const map = L.map('solar-map').setView([4.5709, -74.2973], 6);
    
    // Añadir capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Variable para almacenar todos los marcadores
    let markers = [];
    let allProjects = [];
    
    // Cargar los datos del GeoJSON
    fetch('data/Proyectos de generación (XM).geojson')
        .then(response => response.json())
        .then(data => {
            allProjects = data.features;
            initializeMap(allProjects);
            updateStatistics(allProjects);
            populateDepartmentFilter(allProjects);
        })
        .catch(error => {
            console.error('Error cargando el GeoJSON:', error);
            document.getElementById('solar-map').innerHTML = '<p>Error cargando los datos del mapa. Por favor, intente más tarde.</p>';
        });
    
    // Función para inicializar el mapa con los proyectos
    function initializeMap(projects) {
        // Limpiar marcadores existentes
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Procesar cada proyecto y añadirlo al mapa
        projects.forEach(project => {
            const coords = project.geometry.coordinates;
            const props = project.properties;
            
            // Determinar el color del marcador según el estado
            let markerColor;
            switch(props.estado_recurso) {
                case 'OPERACIÓN':
                    markerColor = 'green';
                    break;
                case 'PRUEBAS':
                    markerColor = 'orange';
                    break;
                case 'EN TRAMITE':
                    markerColor = 'blue';
                    break;
                default:
                    markerColor = 'gray';
            }
            
            // Crear el marcador
            const marker = L.circleMarker([coords[1], coords[0]], {
                radius: getMarkerSize(props.capacidad_efectiva_neta_mw),
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);
            
            // Crear contenido del popup
            const popupContent = `
                <div class="project-popup">
                    <h3>${props.nombre_recurso}</h3>
                    <p><strong>Departamento:</strong> ${props.departamento_oficial}</p>
                    <p><strong>Municipio:</strong> ${props.municipio_oficial}</p>
                    <p><strong>Estado:</strong> ${props.estado_recurso}</p>
                    <p><strong>Capacidad:</strong> ${props.capacidad_efectiva_neta_mw} MW</p>
                    <p><strong>Tipo:</strong> ${props.tipo_generacion}</p>
                    <p><strong>Clasificación:</strong> ${props.clasificacion}</p>
                    <p><strong>Agente:</strong> ${props.agente_representante}</p>
                    <p><strong>Fecha operación:</strong> ${props.fecha_operacion}</p>
                </div>
            `;
            
            // Añadir popup al marcador
            marker.bindPopup(popupContent);
            
            // Guardar referencia al marcador
            markers.push(marker);
        });
    }
    
    // Función para determinar el tamaño del marcador según la capacidad
    function getMarkerSize(capacity) {
        const cap = parseFloat(capacity) || 0;
        if (cap === 0) return 5;
        if (cap < 1) return 7;
        if (cap < 10) return 10;
        if (cap < 50) return 15;
        return 20;
    }
    
    // Función para actualizar las estadísticas
    function updateStatistics(projects) {
        const totalProjects = projects.length;
        const totalCapacity = projects.reduce((sum, project) => {
            return sum + (parseFloat(project.properties.capacidad_efectiva_neta_mw) || 0);
        }, 0);
        const operatingProjects = projects.filter(project => 
            project.properties.estado_recurso === 'OPERACIÓN'
        ).length;
        
        document.getElementById('total-projects').textContent = totalProjects;
        document.getElementById('total-capacity').textContent = totalCapacity.toFixed(2);
        document.getElementById('operating-projects').textContent = operatingProjects;
    }
    
    // Función para poblar el filtro de departamentos
    function populateDepartmentFilter(projects) {
        const departments = [...new Set(projects.map(project => 
            project.properties.departamento_oficial
        ))].sort();
        
        const filter = document.getElementById('departamento-filter');
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            filter.appendChild(option);
        });
    }
    
    // Función para aplicar filtros
    function applyFilters() {
        const deptFilter = document.getElementById('departamento-filter').value;
        const estadoFilter = document.getElementById('estado-filter').value;
        const capacidadFilter = document.getElementById('capacidad-filter').value;
        
        const filteredProjects = allProjects.filter(project => {
            const props = project.properties;
            const capacidad = parseFloat(props.capacidad_efectiva_neta_mw) || 0;
            
            // Aplicar filtros
            const deptMatch = deptFilter === 'todos' || props.departamento_oficial === deptFilter;
            const estadoMatch = estadoFilter === 'todos' || props.estado_recurso === estadoFilter;
            
            let capacidadMatch = true;
            if (capacidadFilter !== 'todos') {
                switch(capacidadFilter) {
                    case '0-1':
                        capacidadMatch = capacidad >= 0 && capacidad < 1;
                        break;
                    case '1-10':
                        capacidadMatch = capacidad >= 1 && capacidad < 10;
                        break;
                    case '10-50':
                        capacidadMatch = capacidad >= 10 && capacidad < 50;
                        break;
                    case '50+':
                        capacidadMatch = capacidad >= 50;
                        break;
                }
            }
            
            return deptMatch && estadoMatch && capacidadMatch;
        });
        
        initializeMap(filteredProjects);
        updateStatistics(filteredProjects);
    }
    
    // Event listeners para los filtros
    document.getElementById('departamento-filter').addEventListener('change', applyFilters);
    document.getElementById('estado-filter').addEventListener('change', applyFilters);
    document.getElementById('capacidad-filter').addEventListener('change', applyFilters);
    
    // Event listener para el botón de restablecer
    document.getElementById('reset-filters').addEventListener('click', function() {
        document.getElementById('departamento-filter').value = 'todos';
        document.getElementById('estado-filter').value = 'todos';
        document.getElementById('capacidad-filter').value = 'todos';
        applyFilters();
    });
});