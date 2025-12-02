// js/graficos.js - Específico para México
class GraficosPrecipitacionMexico {
    constructor() {
        this.chart = null;
        this.datosActuales = null;
        this.regionActual = 'nacional';
        this.tipoGrafico = 'line';
        this.periodoActual = '2024';
        this.inicializarGraficos();
        this.cargarDatosMexico();
        console.log('📊 Gráficos de precipitación de México inicializados');
    }

    inicializarGraficos() {
        this.inicializarControles();
        this.crearGraficoVacioMexico();
        this.configurarEventos();
    }

    inicializarControles() {
        // Configurar selectores específicos de México
        const regionSelect = document.getElementById('region-select');
        const tipoGraficoSelect = document.getElementById('tipo-grafico');
        const periodoSelect = document.getElementById('periodo-select');

        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                this.regionActual = e.target.value;
                this.actualizarInfoRegion();
                this.actualizarGrafico();
            });
        }

        if (tipoGraficoSelect) {
            tipoGraficoSelect.addEventListener('change', (e) => {
                this.tipoGrafico = e.target.value;
                this.actualizarTipoGrafico();
            });
        }

        if (periodoSelect) {
            periodoSelect.addEventListener('change', (e) => {
                this.periodoActual = e.target.value;
                this.actualizarGrafico();
            });
        }
    }

    crearGraficoVacioMexico() {
        const ctx = document.getElementById('lluvias-chart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Cargando datos de México...',
                    data: [],
                    borderColor: '#00ccff',
                    backgroundColor: 'rgba(0, 204, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: this.getOpcionesGraficoMexico()
        });
    }

    async cargarDatosMexico() {
        try {
            console.log('📥 Cargando datos de precipitación de México...');
            
            const datos = await this.obtenerDatosPrecipitacionMexico(this.regionActual);
            this.datosActuales = datos;
            this.actualizarInfoRegion();
            this.actualizarGrafico();
            
            console.log('✅ Datos de precipitación de México cargados');
        } catch (error) {
            console.error('❌ Error cargando datos México:', error);
            this.mostrarError('Error al cargar datos de precipitación de México');
        }
    }

    async obtenerDatosPrecipitacionMexico(region) {
        // Simular obtención de datos realistas para México
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos realistas por región de México (mm de precipitación mensual)
        const datosPorRegion = {
            nacional: [25, 15, 20, 35, 65, 120, 150, 140, 130, 70, 30, 20],
            norte: [15, 10, 12, 20, 25, 40, 80, 75, 50, 30, 15, 12],
            centro: [20, 12, 15, 30, 55, 110, 160, 150, 120, 60, 25, 18],
            sur: [40, 25, 30, 50, 100, 180, 200, 190, 170, 110, 50, 35],
            peninsula: [35, 20, 25, 40, 80, 150, 170, 160, 140, 90, 45, 30],
            pacífico: [30, 18, 22, 45, 90, 160, 180, 170, 150, 85, 40, 28],
            golfo: [45, 30, 35, 55, 110, 190, 210, 200, 180, 120, 60, 40]
        };

        const datosBase = datosPorRegion[region] || datosPorRegion.nacional;
        
        // Generar datos históricos realistas (2014-2024)
        const años = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
        const seriesAnuales = años.map((año, index) => {
            // Tendencia de disminución de precipitación en México
            const tendencia = -index * 2; // -2mm por año en promedio
            const variacion = (Math.random() - 0.5) * 30; // ±15mm de variación anual
            
            return {
                año: año,
                datos: datosBase.map(d => Math.max(5, d + tendencia + variacion)),
                tendencia: tendencia,
                anomalia: variacion
            };
        });

        return {
            region: region,
            unidad: 'mm',
            series: seriesAnuales,
            actualizado: new Date().toISOString(),
            pais: "México"
        };
    }

    actualizarInfoRegion() {
        const infoElement = document.getElementById('region-info');
        if (!infoElement) return;

        const infoPorRegion = {
            nacional: "Datos de precipitación promedio para toda la República Mexicana. Incluye todas las regiones climáticas del país.",
            norte: "Región Norte: Estados como Chihuahua, Sonora, Coahuila. Clima árido y semiárido con baja precipitación.",
            centro: "Región Centro: CDMX, Estado de México, Puebla. Clima templado con precipitación moderada.",
            sur: "Región Sur: Chiapas, Oaxaca, Guerrero. Clima tropical con alta precipitación.",
            peninsula: "Península de Yucatán: Yucatán, Quintana Roo, Campeche. Clima tropical con lluvias estacionales.",
            pacífico: "Costa del Pacífico: Jalisco, Colima, Michoacán. Influencia de huracanes y tormentas tropicales.",
            golfo: "Costa del Golfo: Veracruz, Tamaulipas, Tabasco. Alta precipitación por humedad del Golfo de México."
        };

        infoElement.innerHTML = `
            <strong>${this.getNombreRegion(this.regionActual)}</strong><br>
            ${infoPorRegion[this.regionActual]}
            <br><br>
            <small><i class="fas fa-sync-alt"></i> Actualizado: ${new Date().toLocaleString('es-MX')}</small>
        `;
    }

    actualizarGrafico() {
        if (!this.datosActuales || !this.chart) return;

        const datosGrafico = this.prepararDatosParaGraficoMexico();
        this.actualizarDatosGrafico(datosGrafico);
        this.actualizarTituloMexico();
    }

    prepararDatosParaGraficoMexico() {
        let datosMostrar = [];
        
        if (this.periodoActual === 'historico') {
            // Mostrar promedio histórico
            datosMostrar = this.calcularPromedioHistoricoMexico();
        } else {
            // Mostrar año específico
            const añoData = this.datosActuales.series.find(s => s.año === this.periodoActual);
            datosMostrar = añoData ? añoData.datos : this.datosActuales.series[this.datosActuales.series.length - 1].datos;
        }

        const promedioHistorico = this.calcularPromedioHistoricoMexico();
        const tendencia = this.calcularTendenciaMexico();

        return {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
                {
                    label: this.periodoActual === 'historico' ? 'Promedio Histórico (2014-2023)' : `Precipitación ${this.periodoActual}`,
                    data: datosMostrar,
                    borderColor: this.periodoActual === '2024' ? '#00ff88' : '#00ccff',
                    backgroundColor: this.periodoActual === '2024' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 204, 255, 0.1)',
                    borderWidth: this.periodoActual === '2024' ? 3 : 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Línea de Tendencia',
                    data: tendencia,
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointStyle: false,
                    tension: 0.4
                }
            ]
        };
    }

    calcularPromedioHistoricoMexico() {
        const historico = this.datosActuales.series.slice(0, -1); // Excluir último año
        const meses = Array(12).fill(0);
        
        historico.forEach(año => {
            año.datos.forEach((valor, mes) => {
                meses[mes] += valor;
            });
        });

        return meses.map(total => Math.round(total / historico.length));
    }

    calcularTendenciaMexico() {
        // Calcular tendencia lineal basada en datos históricos
        const promedios = this.calcularPromedioHistoricoMexico();
        const ultimoAño = this.datosActuales.series[this.datosActuales.series.length - 1].datos;
        
        return promedios.map((promedio, index) => {
            const cambio = ultimoAño[index] - promedio;
            return promedio + (cambio * 0.3); // Suavizar la tendencia
        });
    }

    actualizarDatosGrafico(datosGrafico) {
        this.chart.data.labels = datosGrafico.labels;
        this.chart.data.datasets = datosGrafico.datasets;
        this.chart.update('none');
    }

    actualizarTipoGrafico() {
        if (!this.chart) return;

        this.chart.config.type = this.tipoGrafico;
        
        // Ajustar opciones específicas por tipo de gráfico
        const opciones = this.getOpcionesGraficoMexico();
        Object.assign(this.chart.options, opciones);
        
        this.chart.update();
    }

    getOpcionesGraficoMexico() {
        const opcionesBase = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#b0b0b0',
                        usePointStyle: true,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: `Precipitación Mensual - ${this.getNombreRegion(this.regionActual)}`,
                    color: '#00ccff',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    titleColor: '#00ff88',
                    bodyColor: '#ffffff',
                    borderColor: '#00ccff',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => {
                            return `${context.dataset.label}: ${context.parsed.y} mm`;
                        },
                        afterLabel: (context) => {
                            if (context.datasetIndex === 1) return null; // No mostrar para línea de tendencia
                            
                            const promedio = this.calcularPromedioHistoricoMexico()[context.dataIndex];
                            const diferencia = context.parsed.y - promedio;
                            const porcentaje = ((diferencia / promedio) * 100).toFixed(1);
                            
                            return `Variación: ${diferencia > 0 ? '+' : ''}${diferencia.toFixed(1)} mm (${diferencia > 0 ? '+' : ''}${porcentaje}%)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                            return value + ' mm';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Precipitación (mm)',
                        color: '#b0b0b0'
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        };

        // Ajustes específicos por tipo de gráfico
        if (this.tipoGrafico === 'bar') {
            return {
                ...opcionesBase,
                plugins: {
                    ...opcionesBase.plugins,
                    tooltip: {
                        ...opcionesBase.plugins.tooltip
                    }
                }
            };
        }

        return opcionesBase;
    }

    getNombreRegion(region) {
        const nombres = {
            nacional: 'México Nacional',
            norte: 'Norte de México',
            centro: 'Centro de México',
            sur: 'Sur de México',
            peninsula: 'Península de Yucatán',
            pacífico: 'Costa del Pacífico',
            golfo: 'Costa del Golfo'
        };
        return nombres[region] || region;
    }

    actualizarTituloMexico() {
        if (this.chart && this.chart.options.plugins.title) {
            let titulo = `Precipitación Mensual - ${this.getNombreRegion(this.regionActual)}`;
            
            if (this.periodoActual !== 'historico') {
                titulo += ` (${this.periodoActual})`;
            }
            
            this.chart.options.plugins.title.text = titulo;
            this.chart.update();
        }
    }

    mostrarError(mensaje) {
        const ctx = document.getElementById('lluvias-chart');
        if (ctx) {
            ctx.innerHTML = `
                <div style="color: #ff4444; text-align: center; padding: 40px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>Error al Cargar Datos de México</h3>
                    <p>${mensaje}</p>
                    <button onclick="graficosMexico.cargarDatosMexico()" style="
                        background: #ff4444; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        cursor: pointer;
                        margin-top: 15px;">
                        <i class="fas fa-redo"></i> Reintentar
                    </button>
                </div>
            `;
        }
    }

    // Método para mostrar análisis de la región
    mostrarAnalisisRegion() {
        if (!this.datosActuales) return;

        const ultimoAño = this.datosActuales.series[this.datosActuales.series.length - 1];
        const promedioHistorico = this.calcularPromedioHistoricoMexico();
        
        const totalAnual = ultimoAño.datos.reduce((a, b) => a + b, 0);
        const promedioAnual = promedioHistorico.reduce((a, b) => a + b, 0);
        const variacion = ((totalAnual - promedioAnual) / promedioAnual) * 100;

        const analisis = `
            <div class="analisis-region">
                <h4><i class="fas fa-chart-bar"></i> Análisis Anual ${ultimoAño.año}</h4>
                <p><strong>Precipitación Total:</strong> ${totalAnual.toFixed(0)} mm</p>
                <p><strong>Variación vs Promedio:</strong> 
                    <span style="color: ${variacion >= 0 ? '#00ff88' : '#ff4444'}">
                        ${variacion >= 0 ? '+' : ''}${variacion.toFixed(1)}%
                    </span>
                </p>
                <p><strong>Mes Más Lluvioso:</strong> ${this.getMesMasLluvioso(ultimoAño.datos)}</p>
                <p><strong>Mes Más Seco:</strong> ${this.getMesMasSeco(ultimoAño.datos)}</p>
            </div>
        `;

        // Mostrar análisis en el panel de información
        const infoElement = document.getElementById('region-info');
        if (infoElement) {
            const infoActual = infoElement.innerHTML;
            infoElement.innerHTML = infoActual + analisis;
        }
    }

    getMesMasLluvioso(datos) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const maxIndex = datos.indexOf(Math.max(...datos));
        return `${meses[maxIndex]} (${datos[maxIndex]} mm)`;
    }

    getMesMasSeco(datos) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const minIndex = datos.indexOf(Math.min(...datos));
        return `${meses[minIndex]} (${datos[minIndex]} mm)`;
    }

    // Método para exportar datos de México
    exportarDatosMexico() {
        if (!this.datosActuales) return;
        
        const datosExportar = {
            ...this.datosActuales,
            region: this.regionActual,
            periodo: this.periodoActual,
            exportado: new Date().toISOString(),
            tipo: 'datos_precipitacion_mexico_sirco'
        };
        
        const blob = new Blob([JSON.stringify(datosExportar, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `precipitacion_mexico_${this.regionActual}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Inicializar gráficos cuando el DOM esté listo
let graficosMexico;

document.addEventListener('DOMContentLoaded', () => {
    graficosMexico = new GraficosPrecipitacionMexico();
    console.log('🚀 Sirco México - Gráficos de Precipitación listos');
});