// js/simulador.js - Específico para México
class SimuladorClimaticoMexico {
    constructor() {
        this.co2 = 420;
        this.temperatura = 1.2;
        this.precipitacion = -5; // % de cambio
        this.simulacionActiva = false;
        this.grafico = null;
        this.estadosAfectados = [];
        this.inicializarControles();
        this.inicializarEventos();
        console.log('🌍 Simulador climático de México inicializado');
    }

    inicializarControles() {
        // Configurar valores iniciales de los sliders
        this.actualizarValoresSlider();
        
        // Configurar sliders con eventos
        const sliders = [
            { 
                id: 'co2-slider', 
                valor: 'co2-value', 
                propiedad: 'co2', 
                formato: val => `${val} ppm`,
                tooltip: 'Niveles en México: Actual 420 ppm | Peligroso >450 ppm'
            },
            { 
                id: 'temp-slider', 
                valor: 'temp-value', 
                propiedad: 'temperatura', 
                formato: val => `+${val}°C`,
                tooltip: 'Aumento en México: Actual +1.2°C | Peligroso >2.0°C'
            },
            { 
                id: 'lluvia-slider', 
                valor: 'lluvia-value', 
                propiedad: 'precipitacion', 
                formato: val => `${val > 0 ? '+' : ''}${val}%`,
                tooltip: 'Cambio precipitación en México: Actual -5% | Crítico < -20%'
            }
        ];

        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const valorElement = document.getElementById(slider.valor);
            
            if (element && valorElement) {
                element.title = slider.tooltip;
                element.addEventListener('input', (e) => {
                    this[slider.propiedad] = parseFloat(e.target.value);
                    valorElement.textContent = slider.formato(this[slider.propiedad]);
                    this.actualizarPrevisualizacion();
                });
            }
        });

        // Botón de simulación
        const botonSimular = document.getElementById('simular');
        if (botonSimular) {
            botonSimular.addEventListener('click', () => {
                this.ejecutarSimulacionMexico();
            });
        }
    }

    inicializarEventos() {
        // Eventos de teclado para accesibilidad
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type === 'range') {
                this.ejecutarSimulacionMexico();
            }
        });
    }

    actualizarValoresSlider() {
        document.getElementById('co2-value').textContent = `${this.co2} ppm`;
        document.getElementById('temp-value').textContent = `+${this.temperatura}°C`;
        document.getElementById('lluvia-value').textContent = `${this.precipitacion > 0 ? '+' : ''}${this.precipitacion}%`;
    }

    actualizarPrevisualizacion() {
        this.actualizarColorSliders();
        const impactoPreview = this.calcularImpactoPreviewMexico();
        this.mostrarPreviewMexico(impactoPreview);
    }

    actualizarColorSliders() {
        const sliders = [
            { id: 'co2-slider', valor: this.co2, rangos: [300, 420, 450, 1000] },
            { id: 'temp-slider', valor: this.temperatura, rangos: [-2, 1.2, 2.0, 6] },
            { id: 'lluvia-slider', valor: this.precipitacion, rangos: [-50, -5, -20, 50] }
        ];

        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            if (element) {
                const porcentaje = ((slider.valor - slider.rangos[0]) / (slider.rangos[3] - slider.rangos[0])) * 100;
                let color;
                
                if (slider.id === 'lluvia-slider') {
                    // Para precipitación, valores negativos son malos
                    if (slider.valor >= -5) color = '#00ff88'; // Bueno
                    else if (slider.valor >= -20) color = '#ffa500'; // Precaución
                    else color = '#ff4444'; // Peligro
                } else {
                    if (slider.valor <= slider.rangos[1]) color = '#00ff88'; // Seguro
                    else if (slider.valor <= slider.rangos[2]) color = '#ffa500'; // Precaución
                    else color = '#ff4444'; // Peligro
                }
                
                element.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${porcentaje}%, #333 ${porcentaje}%, #333 100%)`;
            }
        });
    }

    calcularImpactoPreviewMexico() {
        const puntuacion = 
            (this.co2 - 300) / 6 + 
            (this.temperatura + 2) * 8 + 
            Math.abs(this.precipitacion) * 0.5;
        
        if (puntuacion < 25) return { nivel: 'Bajo', color: '#00ff88', descripcion: 'Impacto mínimo en México' };
        if (puntuacion < 50) return { nivel: 'Moderado', color: '#ffa500', descripcion: 'Impacto significativo' };
        if (puntuacion < 75) return { nivel: 'Alto', color: '#ff6b35', descripcion: 'Impacto severo' };
        return { nivel: 'Crítico', color: '#ff4444', descripcion: 'Impacto catastrófico en México' };
    }

    mostrarPreviewMexico(preview) {
        const resultados = document.getElementById('resultados-grafico');
        if (resultados) {
            resultados.innerHTML = `
                <div class="preview-simulacion-mexico" style="color: ${preview.color}; text-align: center; padding: 20px;">
                    <h3 style="margin-bottom: 10px;">Previsualización para México</h3>
                    <div style="font-size: 2rem; margin-bottom: 10px;">${preview.nivel}</div>
                    <p style="font-size: 0.9rem; opacity: 0.8;">${preview.descripcion}</p>
                    <div style="margin-top: 15px; font-size: 0.8rem;">
                        <i class="fas fa-map-marked-alt"></i> Ajusta los parámetros para simular impactos en México
                    </div>
                </div>
            `;
        }
    }

    async ejecutarSimulacionMexico() {
        if (this.simulacionActiva) return;
        
        this.simulacionActiva = true;
        const boton = document.getElementById('simular');
        const textoOriginal = boton.innerHTML;
        
        // Mostrar estado de carga
        boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Simulando...';
        boton.disabled = true;

        try {
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Calcular resultados específicos para México
            const resultados = this.calcularResultadosMexico();
            
            // Actualizar interfaz
            this.actualizarResultadosMexico(resultados);
            this.generarGraficoResultadosMexico(resultados);
            this.mostrarRecomendacionesMexico(resultados);
            this.mostrarEstadosAfectados(resultados);
            
            console.log('✅ Simulación para México completada:', resultados);
            
        } catch (error) {
            console.error('❌ Error en simulación México:', error);
            this.mostrarError('Error al ejecutar la simulación para México');
        } finally {
            this.simulacionActiva = false;
            boton.innerHTML = textoOriginal;
            boton.disabled = false;
        }
    }

    calcularResultadosMexico() {
        const impacto = this.calcularImpactoMexico();
        const zonasAfectadas = this.calcularZonasAfectadasMexico();
        const sequiaSevera = this.calcularSequiaSeveraMexico();
        const agriculturaAfectada = this.calcularAgriculturaAfectada();
        const costoEconomico = this.calcularCostoEconomicoMexico();
        
        return {
            impacto,
            zonasAfectadas,
            sequiaSevera,
            agriculturaAfectada,
            costoEconomico,
            parametros: {
                co2: this.co2,
                temperatura: this.temperatura,
                precipitacion: this.precipitacion
            },
            estadosAfectados: this.identificarEstadosAfectados(),
            timestamp: new Date().toISOString(),
            pais: "México"
        };
    }

    calcularImpactoMexico() {
        const puntuacion = 
            (this.co2 / 80) + 
            (this.temperatura * 12) + 
            (Math.abs(this.precipitacion) * 0.8);
        
        if (puntuacion < 20) return { nivel: 'Bajo', color: '#00ff88', score: puntuacion };
        if (puntuacion < 40) return { nivel: 'Moderado', color: '#ffa500', score: puntuacion };
        if (puntuacion < 60) return { nivel: 'Alto', color: '#ff6b35', score: puntuacion };
        return { nivel: 'Crítico', color: '#ff4444', score: puntuacion };
    }

    calcularZonasAfectadasMexico() {
        const base = 15;
        const adicionalCO2 = (this.co2 - 400) / 6;
        const adicionalTemp = this.temperatura * 15;
        const adicionalPrecip = Math.abs(this.precipitacion) * 0.6;
        
        return Math.min(95, Math.round(base + adicionalCO2 + adicionalTemp + adicionalPrecip));
    }

    calcularSequiaSeveraMexico() {
        const base = 10;
        const adicional = (this.temperatura * 8) + (Math.abs(this.precipitacion) * 0.8);
        return Math.min(80, Math.round(base + adicional));
    }

    calcularAgriculturaAfectada() {
        const base = 20;
        const adicional = (this.temperatura * 10) + (Math.abs(this.precipitacion) * 0.7);
        return Math.min(90, Math.round(base + adicional));
    }

    calcularCostoEconomicoMexico() {
        // En miles de millones de pesos mexicanos anuales
        const base = 25;
        const adicional = (this.temperatura * 15) + ((this.co2 - 400) / 3) + (Math.abs(this.precipitacion) * 0.5);
        return Math.round(base + adicional);
    }

    identificarEstadosAfectados() {
        // Simular estados más afectados basado en los parámetros
        const estados = [...ESTADOS_MEXICO];
        return estados
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.floor(8 + (this.temperatura * 2)))
            .map(estado => estado.nombre);
    }

    actualizarResultadosMexico(resultados) {
        // Actualizar métricas principales
        document.getElementById('impacto').textContent = resultados.impacto.nivel;
        document.getElementById('impacto').style.color = resultados.impacto.color;
        
        document.getElementById('zonas').textContent = `${resultados.zonasAfectadas}%`;
        document.getElementById('zonas').style.color = this.getColorPorPorcentaje(resultados.zonasAfectadas);

        document.getElementById('sequia').textContent = `${resultados.sequiaSevera}%`;
        document.getElementById('sequia').style.color = this.getColorPorPorcentaje(resultados.sequiaSevera);

        // Actualizar métricas adicionales
        this.actualizarMetricasAdicionalesMexico(resultados);
    }

    actualizarMetricasAdicionalesMexico(resultados) {
        const metricasContainer = document.querySelector('.metricas');
        if (metricasContainer && !metricasContainer.querySelector('.metrica-agricultura')) {
            metricasContainer.innerHTML += `
                <div class="metrica metrica-agricultura">
                    <h4><i class="fas fa-tractor"></i> Agricultura Afect.</h4>
                    <p id="agricultura" style="color: ${this.getColorPorPorcentaje(resultados.agriculturaAfectada)}">${resultados.agriculturaAfectada}%</p>
                </div>
                <div class="metrica metrica-economico">
                    <h4><i class="fas fa-peso-sign"></i> Costo Anual</h4>
                    <p id="costo-economico" style="color: #ff6b35">$${resultados.costoEconomico}B MXN</p>
                </div>
            `;
        } else {
            const agriculturaElement = document.getElementById('agricultura');
            const costoElement = document.getElementById('costo-economico');
            
            if (agriculturaElement) {
                agriculturaElement.textContent = `${resultados.agriculturaAfectada}%`;
                agriculturaElement.style.color = this.getColorPorPorcentaje(resultados.agriculturaAfectada);
            }
            if (costoElement) {
                costoElement.textContent = `$${resultados.costoEconomico}B MXN`;
            }
        }
    }

    getColorPorPorcentaje(porcentaje) {
        if (porcentaje < 25) return '#00ff88';
        if (porcentaje < 50) return '#ffa500';
        if (porcentaje < 75) return '#ff6b35';
        return '#ff4444';
    }

    generarGraficoResultadosMexico(resultados) {
        const ctx = document.getElementById('resultados-grafico');
        if (!ctx) return;

        // Destruir gráfico anterior si existe
        if (this.grafico) {
            this.grafico.destroy();
        }

        // Crear nuevo gráfico específico para México
        this.grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['CO₂', 'Temp. Prom.', 'Precipitación', 'Zonas Afect.', 'Sequía Severa', 'Agricultura'],
                datasets: [{
                    label: 'Impacto en México',
                    data: [
                        (resultados.parametros.co2 - 300) / 5,
                        (resultados.parametros.temperatura + 2) * 8,
                        Math.abs(resultados.parametros.precipitacion),
                        resultados.zonasAfectadas,
                        resultados.sequiaSevera,
                        resultados.agriculturaAfectada
                    ],
                    backgroundColor: [
                        '#ff6b35',
                        '#ff4444',
                        '#4d8df5',
                        '#ffa500',
                        '#8a2be2',
                        '#00ccff'
                    ],
                    borderColor: [
                        '#ff6b35',
                        '#ff4444',
                        '#4d8df5',
                        '#ffa500',
                        '#8a2be2',
                        '#00ccff'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Análisis de Impacto Climático en México',
                        color: '#00ccff',
                        font: {
                            size: 14
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Valor: ${context.parsed.y.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    }
                }
            }
        });
    }

    mostrarRecomendacionesMexico(resultados) {
        let recomendacionesSection = document.querySelector('.recomendaciones-simulacion');
        
        if (!recomendacionesSection) {
            recomendacionesSection = document.createElement('div');
            recomendacionesSection.className = 'recomendaciones-simulacion';
            recomendacionesSection.style.marginTop = '20px';
            recomendacionesSection.style.padding = '15px';
            recomendacionesSection.style.background = 'rgba(255,255,255,0.05)';
            recomendacionesSection.style.borderRadius = '5px';
            recomendacionesSection.style.border = '1px solid #00ccff';
            
            document.querySelector('.simulator-results').appendChild(recomendacionesSection);
        }

        const recomendaciones = this.generarRecomendacionesMexico(resultados);
        recomendacionesSection.innerHTML = `
            <h4 style="color: #00ccff; margin-bottom: 10px;">
                <i class="fas fa-lightbulb"></i> Recomendaciones para México
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #b0b0b0;">
                ${recomendaciones.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        `;
    }

    generarRecomendacionesMexico(resultados) {
        const recomendaciones = [];
        
        if (resultados.parametros.co2 > 450) {
            recomendaciones.push('Impulsar transición a energías renovables en industria mexicana');
        }
        
        if (resultados.parametros.temperatura > 1.5) {
            recomendaciones.push('Fortalecer sistemas de alerta temprana para olas de calor');
        }
        
        if (resultados.parametros.precipitacion < -10) {
            recomendaciones.push('Implementar programas de captación de agua pluvial en zonas urbanas');
        }
        
        if (resultados.sequiaSevera > 30) {
            recomendaciones.push('Desarrollar sistemas de riego eficiente para sector agrícola');
        }
        
        if (resultados.agriculturaAfectada > 40) {
            recomendaciones.push('Promover cultivos resistentes a sequía en regiones afectadas');
        }

        if (recomendaciones.length === 0) {
            recomendaciones.push('Mantener y fortalecer las políticas actuales de mitigación climática');
        }

        return recomendaciones;
    }

    mostrarEstadosAfectados(resultados) {
        console.log('🏙️ Estados más afectados:', resultados.estadosAfectados);
        // Aquí podrías mostrar una lista visual de estados afectados
    }

    mostrarError(mensaje) {
        const resultados = document.getElementById('resultados-grafico');
        if (resultados) {
            resultados.innerHTML = `
                <div style="color: #ff4444; text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <h3>Error en Simulación México</h3>
                    <p>${mensaje}</p>
                    <button onclick="simuladorMexico.ejecutarSimulacionMexico()" style="
                        background: #ff4444; 
                        color: white; 
                        border: none; 
                        padding: 8px 16px; 
                        border-radius: 3px; 
                        cursor: pointer;
                        margin-top: 10px;">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
}

// Inicializar simulador cuando el DOM esté listo
let simuladorMexico;

document.addEventListener('DOMContentLoaded', () => {
    simuladorMexico = new SimuladorClimaticoMexico();
    console.log('🚀 Sirco México - Simulador Climático listo');
});