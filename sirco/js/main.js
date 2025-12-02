// js/main.js - Específico para México
class SircoAppMexico {
    constructor() {
        this.inicializada = false;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Iniciando Sirco México - Sistema de Monitoreo Climático Nacional');
            
            // Inicializar componentes principales
            await this.inicializarComponentesMexico();
            
            // Configurar eventos globales específicos de México
            this.configurarEventosMexico();
            
            // Inicializar animaciones y efectos
            this.inicializarAnimacionesMexico();
            
            this.inicializada = true;
            console.log('✅ Sirco México inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando Sirco México:', error);
            this.mostrarErrorInicializacion();
        }
    }

    async inicializarComponentesMexico() {
        // Esperar a que los componentes se carguen
        await this.esperarComponentes();
        
        // Inicializar navegación suave
        this.inicializarNavegacionMexico();
        
        // Inicializar efectos visuales específicos de México
        this.inicializarEfectosVisualesMexico();
        
        // Inicializar sistema de notificaciones
        this.inicializarNotificacionesMexico();
        
        // Verificar estado de los servicios
        await this.verificarServiciosMexico();
    }

    inicializarNavegacionMexico() {
        // Navegación suave entre secciones (igual que antes)
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Actualizar URL sin recargar
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });

        // Efecto activo en navegación
        this.actualizarNavegacionActiva();
        window.addEventListener('scroll', () => this.actualizarNavegacionActiva());
    }

    inicializarEfectosVisualesMexico() {
        // Efectos de aparición al hacer scroll
        this.inicializarScrollAnimations();
        
        // Efectos de hover en tarjetas
        this.inicializarEfectosHover();
        
        // Efectos específicos de México
        this.inicializarEfectosMexico();
    }

    inicializarEfectosMexico() {
        // Bandera mexicana sutil en el hero
        const hero = document.querySelector('.hero');
        if (hero) {
            const banderaMexico = document.createElement('div');
            banderaMexico.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                width: 60px;
                height: 40px;
                background: linear-gradient(90deg, #006847 0%, #006847 33%, #ffffff 33%, #ffffff 66%, #ce1126 66%, #ce1126 100%);
                border-radius: 3px;
                opacity: 0.7;
                z-index: 2;
            `;
            hero.appendChild(banderaMexico);
        }
    }

    inicializarNotificacionesMexico() {
        // Sistema de notificaciones con toque mexicano
        console.log('🔔 Sistema de notificaciones México listo');
    }

    async verificarServiciosMexico() {
        console.log('🔍 Verificando servicios de México...');
        
        const servicios = [
            { nombre: 'Mapa de México', verificar: () => !!window.mapaMexico },
            { nombre: 'Simulador México', verificar: () => !!window.simuladorMexico },
            { nombre: 'Gráficos México', verificar: () => !!window.graficosMexico },
            { nombre: 'Geolocalización', verificar: () => !!window.geolocalizador }
        ];

        servicios.forEach(servicio => {
            if (servicio.verificar()) {
                console.log(`✅ ${servicio.nombre}: OK`);
            } else {
                console.warn(`⚠️ ${servicio.nombre}: No disponible`);
            }
        });
    }

    configurarEventosMexico() {
        // Evento para el botón CTA del hero
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Manejar errores no capturados
        window.addEventListener('error', (e) => {
            console.error('Error no capturado en Sirco México:', e.error);
            this.mostrarNotificacion('Error en la aplicación México', 'error');
        });

        // Botón de exportación de datos de México
        this.inicializarBotonesExportacionMexico();
    }

    inicializarBotonesExportacionMexico() {
        // Añadir botón de exportación específico para México
        if (!document.getElementById('exportar-datos-mexico')) {
            const exportButton = document.createElement('button');
            exportButton.id = 'exportar-datos-mexico';
            exportButton.innerHTML = '<i class="fas fa-download"></i> Exportar Datos México';
            exportButton.style.cssText = `
                position: fixed;
                bottom: 70px;
                right: 20px;
                background: var(--neon-purple);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                z-index: 1000;
                font-size: 0.9rem;
                box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
                transition: all 0.3s ease;
            `;
            
            exportButton.addEventListener('click', () => {
                if (window.graficosMexico) {
                    window.graficosMexico.exportarDatosMexico();
                }
            });
            
            exportButton.addEventListener('mouseenter', () => {
                exportButton.style.transform = 'translateY(-2px)';
                exportButton.style.boxShadow = '0 6px 20px rgba(138, 43, 226, 0.5)';
            });
            
            exportButton.addEventListener('mouseleave', () => {
                exportButton.style.transform = 'translateY(0)';
                exportButton.style.boxShadow = '0 4px 15px rgba(138, 43, 226, 0.3)';
            });
            
            document.body.appendChild(exportButton);
        }
    }

    // Métodos de utilidad pública específicos para México
    recargarDatosMexico() {
        if (window.mapaMexico) window.mapaMexico.cargarDatosMexico();
        if (window.graficosMexico) window.graficosMexico.cargarDatosMexico();
        this.mostrarNotificacion('Datos de México actualizados', 'success');
    }

    mostrarInfoMexico() {
        this.mostrarNotificacion(`
            Sirco México - Monitoreo Climático Nacional
            • 32 estados monitoreados
            • Datos en tiempo real
            • Simulaciones específicas para México
        `, 'info');
    }
}

// Inicializar aplicación México cuando el DOM esté listo
let sircoAppMexico;

document.addEventListener('DOMContentLoaded', () => {
    sircoAppMexico = new SircoAppMexico();
    
    // Atajos de teclado globales para México
    document.addEventListener('keydown', (e) => {
        // Ctrl + R para recargar datos México
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            sircoAppMexico.recargarDatosMexico();
        }
        
        // Ctrl + I para información de México
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            sircoAppMexico.mostrarInfoMexico();
        }
    });
    
    console.log('🎉 Sirco México completamente cargado y listo para usar!');
    console.log('🇲🇽 Monitoreando los 32 estados de la República Mexicana');
});

// Hacer métodos disponibles globalmente
window.SircoAppMexico = SircoAppMexico;