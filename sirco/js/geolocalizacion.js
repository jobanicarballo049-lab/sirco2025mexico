// js/geolocalizacion.js
class Geolocalizador {
    constructor() {
        this.marker = null;
        this.watchId = null;
        this.inicializarGeolocalizacion();
    }

    inicializarGeolocalizacion() {
        const botonGeolocalizacion = document.getElementById('locate-me');
        
        if (!botonGeolocalizacion) {
            console.error('❌ Botón de geolocalización no encontrado');
            return;
        }

        botonGeolocalizacion.addEventListener('click', () => {
            this.obtenerUbicacion();
        });

        // Verificar soporte de geolocalización
        if (!navigator.geolocation) {
            botonGeolocalizacion.disabled = true;
            botonGeolocalizacion.innerHTML = '<i class="fas fa-ban"></i> No Soportado';
            this.mostrarError('La geolocalización no es soportada por tu navegador');
            return;
        }

        console.log('📍 Geolocalizador inicializado');
    }

    obtenerUbicacion() {
        const boton = document.getElementById('locate-me');
        const originalText = boton.innerHTML;
        
        // Mostrar loading
        boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Localizando...';
        boton.disabled = true;

        const opciones = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.mostrarUbicacion(position);
                boton.innerHTML = '<i class="fas fa-check"></i> Ubicada';
                setTimeout(() => {
                    boton.innerHTML = originalText;
                    boton.disabled = false;
                }, 2000);
            },
            (error) => {
                this.manejarErrorGeolocalizacion(error);
                boton.innerHTML = originalText;
                boton.disabled = false;
            },
            opciones
        );
    }

    mostrarUbicacion(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const precision = position.coords.accuracy;
        
        console.log(`📍 Ubicación obtenida: ${lat}, ${lng} (precisión: ${precision}m)`);

        // Remover marcador anterior
        if (this.marker) {
            window.mapaClimatico.map.removeLayer(this.marker);
        }
        
        // Crear marcador personalizado para ubicación del usuario
        const iconoUsuario = L.divIcon({
            className: 'user-location-marker',
            html: '<i class="fas fa-user-circle"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // Agregar nuevo marcador
        this.marker = L.marker([lat, lng], { icon: iconoUsuario })
            .addTo(window.mapaClimatico.map)
            .bindPopup(`
                <div class="popup-ubicacion">
                    <h3><i class="fas fa-user"></i> Tu Ubicación</h3>
                    <p><strong>Coordenadas:</strong><br>
                    Lat: ${lat.toFixed(6)}<br>
                    Lng: ${lng.toFixed(6)}</p>
                    <p><strong>Precisión:</strong> ±${Math.round(precision)} metros</p>
                    <p><small>Obtenido: ${new Date().toLocaleString('es-MX')}</small></p>
                </div>
            `)
            .openPopup();
            
        // Centrar mapa en la ubicación con zoom apropiado
        const zoom = precision < 100 ? 14 : 12;
        window.mapaClimatico.map.setView([lat, lng], zoom);
        
        // Mostrar datos de ubicación en el panel
        this.actualizarPanelUbicacion(lat, lng, precision);
        
        // Iniciar seguimiento si la precisión es buena
        if (precision < 100) {
            this.iniciarSeguimiento();
        }
    }

    actualizarPanelUbicacion(lat, lng, precision) {
        const panel = document.getElementById('location-data');
        if (panel) {
            panel.innerHTML = `
                <div class="ubicacion-info">
                    <h4><i class="fas fa-map-marker-alt"></i> Tu Ubicación</h4>
                    <p><strong>Latitud:</strong> ${lat.toFixed(6)}</p>
                    <p><strong>Longitud:</strong> ${lng.toFixed(6)}</p>
                    <p><strong>Precisión:</strong> ±${Math.round(precision)} metros</p>
                    <p><strong>Hora:</strong> ${new Date().toLocaleTimeString('es-MX')}</p>
                    <button onclick="geolocalizador.detenerSeguimiento()" class="btn-secundario">
                        <i class="fas fa-stop"></i> Detener Seguimiento
                    </button>
                </div>
            `;
        }
    }

    iniciarSeguimiento() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                if (this.marker) {
                    this.marker.setLatLng([lat, lng]);
                }
                
                console.log(`🔄 Ubicación actualizada: ${lat}, ${lng}`);
            },
            (error) => {
                console.warn('Error en seguimiento de ubicación:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 3000
            }
        );
    }

    detenerSeguimiento() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            console.log('⏹️ Seguimiento de ubicación detenido');
        }
    }

    manejarErrorGeolocalizacion(error) {
        let mensaje = "Error desconocido en geolocalización";
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                mensaje = "Permiso de ubicación denegado. Por favor, permite el acceso a la ubicación en tu navegador.";
                break;
            case error.POSITION_UNAVAILABLE:
                mensaje = "Información de ubicación no disponible. Verifica tu conexión GPS.";
                break;
            case error.TIMEOUT:
                mensaje = "Tiempo de espera agotado. Intenta nuevamente.";
                break;
        }
        
        this.mostrarError(mensaje);
        console.error('Error de geolocalización:', error);
    }

    mostrarError(mensaje) {
        const panel = document.getElementById('location-data');
        if (panel) {
            panel.innerHTML = `
                <div class="error-ubicacion">
                    <h4><i class="fas fa-exclamation-triangle"></i> Error</h4>
                    <p>${mensaje}</p>
                    <button onclick="geolocalizador.obtenerUbicacion()" class="btn-reintentar">
                        <i class="fas fa-redo"></i> Reintentar
                    </button>
                </div>
            `;
        }
    }
}

// Estilos CSS para el marcador de usuario
const estilosGeolocalizacion = `
    .user-location-marker {
        color: #00ff88;
        font-size: 24px;
        text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .btn-secundario, .btn-reintentar {
        background: rgba(0, 204, 255, 0.2);
        color: #00ccff;
        border: 1px solid #00ccff;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-top: 5px;
        font-size: 0.8rem;
    }
    
    .btn-secundario:hover, .btn-reintentar:hover {
        background: rgba(0, 204, 255, 0.4);
    }
    
    .ubicacion-info, .error-ubicacion {
        padding: 10px;
        border-radius: 5px;
    }
    
    .ubicacion-info {
        background: rgba(0, 255, 136, 0.1);
        border: 1px solid #00ff88;
    }
    
    .error-ubicacion {
        background: rgba(255, 0, 128, 0.1);
        border: 1px solid #ff0080;
    }
`;

// Añadir estilos al documento
const styleSheet = document.createElement("style");
styleSheet.textContent = estilosGeolocalizacion;
document.head.appendChild(styleSheet);

// Inicializar geolocalizador
let geolocalizador;

document.addEventListener('DOMContentLoaded', () => {
    geolocalizador = new Geolocalizador();
});