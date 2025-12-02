// mapa para México
class MapaClimaticoMexico {
    constructor() {
        this.map = null;
        this.capas = {};
        this.marcadores = [];
        this.estadosData = [];
        this.inicializarMapa();
        this.cargarDatosMexico();
        console.log('🗺️ Mapa climático de México inicializado');
    }

    inicializarMapa() {
        // Inicializar mapa centrado en México
        this.map = L.map('map', {
            zoomControl: true,
            attributionControl: true,
            center: [23.6345, -102.5528], // Centro geográfico de México
            zoom: 5
        });
        
        // Capa base OpenStreetMap 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Sirco México',
            maxZoom: 12,
            minZoom: 4
        }).addTo(this.map);

        //  controles adicionales
        this.agregarControlesMapa();
        this.inicializarCapas();
        this.configurarControles();
    }

    agregarControlesMapa() {
        // Control de escala
        L.control.scale({ imperial: false, metric: true }).addTo(this.map);
        
        // Botón para centrar en México
        const centerButton = L.control({ position: 'topleft' });
        centerButton.onAdd = () => {
            const div = L.DomUtil.create('div', 'center-button');
            div.innerHTML = `
                <button title="Centrar en México" style="
                    background: #00ff88; 
                    border: none; 
                    border-radius: 4px; 
                    padding: 8px; 
                    cursor: pointer;
                    color: #0a0a0a;">
                    <i class="fas fa-crosshairs"></i>
                </button>
            `;
            div.onclick = () => this.map.setView([23.6345, -102.5528], 5);
            return div;
        };
        centerButton.addTo(this.map);
    }

    inicializarCapas() {
        this.capas = {
            temperatura: L.layerGroup(),
            precipitacion: L.layerGroup(),
            sequia: L.layerGroup(),
            estados: L.layerGroup()
        };

        // Añadir capa de estados
        this.agregarCapasEstados();
    }

    agregarCapasEstados() {
        // Aquí podrías agregar polígonos de estados si tienes los datos GeoJSON
        console.log('📍 Inicializando capa de estados de México');
    }

    configurarControles() {
        // Control de capas mediante checkboxes
        document.getElementById('temperatura').addEventListener('change', (e) => {
            this.toggleCapa('temperatura', e.target.checked);
        });

        document.getElementById('precipitacion').addEventListener('change', (e) => {
            this.toggleCapa('precipitacion', e.target.checked);
        });

        document.getElementById('sequia').addEventListener('change', (e) => {
            this.toggleCapa('sequia', e.target.checked);
        });

        // Activar temperatura por defecto
        this.toggleCapa('temperatura', true);
    }

    toggleCapa(capa, activa) {
        if (activa) {
            this.capas[capa].addTo(this.map);
            console.log(`✅ Capa ${capa} activada`);
        } else {
            this.map.removeLayer(this.capas[capa]);
            console.log(`❌ Capa ${capa} desactivada`);
        }
    }

    async cargarDatosMexico() {
        try {
            console.log('🌡️ Cargando datos climáticos de México...');
            
            // Cargar datos de temperatura
            const datosTemperatura = await fetchClimateDataMexico('/temperature', {
                region: 'nacional'
            });

            this.mostrarDatosEnMapa(datosTemperatura, 'temperatura', '°C', '#ff6b35');
            
            // Cargar datos de precipitación
            const datosPrecipitacion = await fetchClimateDataMexico('/precipitation', {
                region: 'nacional'
            });

            this.mostrarDatosEnMapa(datosPrecipitacion, 'precipitacion', 'mm', '#4d8df5');

            // Cargar datos de sequía
            const datosSequia = await fetchClimateDataMexico('/drought', {
                region: 'nacional'
            });

            this.mostrarDatosEnMapa(datosSequia, 'sequia', '%', '#ffa500');

            console.log('✅ Datos climáticos de México cargados exitosamente');

        } catch (error) {
            console.log('⚠️ Usando datos simulados de México:', error);
            this.usarDatosSimuladosMexico();
        }
    }

    mostrarDatosEnMapa(datos, tipo, unidad, color) {
        // Limpiar marcadores anteriores de esta capa
        this.capas[tipo].clearLayers();

        if (!datos.data || datos.data.length === 0) {
            console.warn(`No hay datos para ${tipo} en México`);
            return;
        }

        // Agregar nuevos marcadores para cada estado
        datos.data.forEach(estado => {
            const radio = this.calcularRadioMarcador(estado.value, tipo);
            const opacidad = this.calcularOpacidad(estado.value, tipo);
            
            const marcador = L.circleMarker([estado.lat, estado.lng], {
                color: color,
                fillColor: color,
                fillOpacity: opacidad,
                radius: radio,
                weight: 2,
                opacity: 0.8
            });

            const popupContent = this.crearPopupContentMexico(estado, tipo, unidad);
            marcador.bindPopup(popupContent);
            
            // Tooltip hover
            marcador.bindTooltip(`
                <strong>${estado.city}, ${estado.state}</strong><br>
                ${this.getNombreTipo(tipo)}: ${estado.value} ${unidad}
            `, { permanent: false, direction: 'top' });

            marcador.addTo(this.capas[tipo]);
        });

        console.log(`📍 ${datos.data.length} marcadores de ${tipo} agregados al mapa de México`);
    }

    calcularRadioMarcador(valor, tipo) {
        const rangos = {
            temperatura: { min: 15, max: 35 },
            precipitacion: { min: 0, max: 400 },
            sequia: { min: 0, max: 100 }
        };
        
        const rango = rangos[tipo] || { min: 0, max: 100 };
        const normalizado = (valor - rango.min) / (rango.max - rango.min);
        return 6 + (normalizado * 12); // Radio entre 6 y 18
    }

    calcularOpacidad(valor, tipo) {
        const rangos = {
            temperatura: { min: 15, max: 35 },
            precipitacion: { min: 0, max: 400 },
            sequia: { min: 0, max: 100 }
        };
        
        const rango = rangos[tipo] || { min: 0, max: 100 };
        const normalizado = (valor - rango.min) / (rango.max - rango.min);
        return 0.4 + (normalizado * 0.4); // Opacidad entre 0.4 y 0.8
    }

    crearPopupContentMexico(estado, tipo, unidad) {
        const icono = this.getIconoTipo(tipo);
        const alerta = this.getNivelAlerta(estado.value, tipo);
        
        return `
            <div class="popup-clima-mexico">
                <div class="popup-header">
                    <h3><i class="fas ${icono}"></i> ${estado.city}, ${estado.state}</h3>
                    <span class="alerta ${alerta.nivel}">${alerta.texto}</span>
                </div>
                <div class="popup-datos">
                    <div class="dato-principal">
                        <span class="valor">${estado.value} ${unidad}</span>
                        <span class="etiqueta">${this.getNombreTipo(tipo)}</span>
                    </div>
                    <div class="info-adicional">
                        <p><i class="fas fa-map-marker-alt"></i> <strong>Coordenadas:</strong> ${estado.lat.toFixed(4)}, ${estado.lng.toFixed(4)}</p>
                        <p><i class="fas fa-clock"></i> <strong>Actualizado:</strong> ${new Date(estado.timestamp).toLocaleString('es-MX')}</p>
                    </div>
                </div>
                <div class="popup-acciones">
                    <button onclick="mapaMexico.centrarEnEstado('${estado.state}')" class="btn-popup">
                        <i class="fas fa-crosshairs"></i> Centrar
                    </button>
                    <button onclick="mapaMexico.mostrarHistorial('${estado.state}', '${tipo}')" class="btn-popup">
                        <i class="fas fa-chart-line"></i> Historial
                    </button>
                </div>
            </div>
        `;
    }

    getIconoTipo(tipo) {
        const iconos = {
            temperatura: 'fa-thermometer-half',
            precipitacion: 'fa-cloud-rain',
            sequia: 'fa-sun'
        };
        return iconos[tipo] || 'fa-info-circle';
    }

    getNivelAlerta(valor, tipo) {
        if (tipo === 'temperatura') {
            if (valor > 30) return { nivel: 'alta', texto: 'Alta Temperatura' };
            if (valor < 18) return { nivel: 'baja', texto: 'Baja Temperatura' };
            return { nivel: 'normal', texto: 'Normal' };
        }
        
        if (tipo === 'precipitacion') {
            if (valor < 50) return { nivel: 'sequia', texto: 'Sequía' };
            if (valor > 300) return { nivel: 'alta', texto: 'Alta Precipitación' };
            return { nivel: 'normal', texto: 'Normal' };
        }
        
        if (tipo === 'sequia') {
            if (valor > 70) return { nivel: 'extrema', texto: 'Sequía Extrema' };
            if (valor > 40) return { nivel: 'severa', texto: 'Sequía Severa' };
            if (valor > 20) return { nivel: 'moderada', texto: 'Sequía Moderada' };
            return { nivel: 'normal', texto: 'Sin Sequía' };
        }
        
        return { nivel: 'normal', texto: 'Normal' };
    }

    getNombreTipo(tipo) {
        const nombres = {
            temperatura: 'Temperatura',
            precipitacion: 'Precipitación',
            sequia: 'Nivel de Sequía'
        };
        return nombres[tipo] || tipo;
    }

    centrarEnEstado(nombreEstado) {
        const estado = ESTADOS_MEXICO.find(e => e.nombre === nombreEstado);
        if (estado) {
            this.map.setView([estado.lat, estado.lng], 8);
            console.log(`🎯 Mapa centrado en: ${estado.nombre}`);
        }
    }

    mostrarHistorial(estado, tipo) {
        console.log(`📊 Mostrando historial de ${tipo} para ${estado}`);
        // Aquí podrías implementar la visualización de datos históricos
        alert(`Función en desarrollo: Historial de ${tipo} para ${estado}`);
    }

    usarDatosSimuladosMexico() {
        console.log('🔄 Cargando datos simulados de México...');
        
        // Usar datos de la configuración
        const datosTemperatura = getSimulatedDataMexico('/temperature');
        const datosPrecipitacion = getSimulatedDataMexico('/precipitation');
        const datosSequia = getSimulatedDataMexico('/drought');

        this.mostrarDatosEnMapa(datosTemperatura, 'temperatura', '°C', '#ff6b35');
        this.mostrarDatosEnMapa(datosPrecipitacion, 'precipitacion', 'mm', '#4d8df5');
        this.mostrarDatosEnMapa(datosSequia, 'sequia', '%', '#ffa500');
    }

    // Método para filtrar por región de México
    filtrarPorRegion(region) {
        console.log(`📍 Filtrando datos por región: ${region}`);
        // Implementar filtrado por región
    }

    // Método para exportar datos de México
    exportarDatosMexico() {
        const datosExportar = {
            pais: 'México',
            estados: ESTADOS_MEXICO.length,
            datos: this.estadosData,
            exportado: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(datosExportar, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `datos_climaticos_mexico_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Hacer la instancia global para acceso desde popups
let mapaMexico;

// Inicializar mapa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    mapaMexico = new MapaClimaticoMexico();
    console.log('🚀 Sirco México - Mapa Climático listo');
});