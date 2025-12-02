// Configuración México
const SIRCO_CONFIG = {
    API_KEY: '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',
    BASE_URL: 'https://api.nvdata.com/climate/mexico',
    PAIS: 'México',
    ENDPOINTS: {
        TEMPERATURA: '/temperature',
        PRECIPITACION: '/precipitation',
        SEQUIA: '/drought',
        CALIDAD_AIRE: '/air-quality',
        DATOS_HISTORICOS: '/historical'
    }
};

// Estados de México para el monitoreo
const ESTADOS_MEXICO = [
    { nombre: 'Aguascalientes', capital: 'Aguascalientes', lat: 21.8853, lng: -102.2916 },
    { nombre: 'Baja California', capital: 'Mexicali', lat: 32.6583, lng: -115.4675 },
    { nombre: 'Baja California Sur', capital: 'La Paz', lat: 24.1422, lng: -110.3108 },
    { nombre: 'Campeche', capital: 'Campeche', lat: 19.8301, lng: -90.5349 },
    { nombre: 'Chiapas', capital: 'Tuxtla Gutiérrez', lat: 16.7539, lng: -93.1161 },
    { nombre: 'Chihuahua', capital: 'Chihuahua', lat: 28.6320, lng: -106.0691 },
    { nombre: 'Ciudad de México', capital: 'CDMX', lat: 19.4326, lng: -99.1332 },
    { nombre: 'Coahuila', capital: 'Saltillo', lat: 25.4231, lng: -101.0053 },
    { nombre: 'Colima', capital: 'Colima', lat: 19.2433, lng: -103.7250 },
    { nombre: 'Durango', capital: 'Durango', lat: 24.0277, lng: -104.6532 },
    { nombre: 'Guanajuato', capital: 'Guanajuato', lat: 21.0190, lng: -101.2574 },
    { nombre: 'Guerrero', capital: 'Chilpancingo', lat: 17.5734, lng: -99.5150 },
    { nombre: 'Hidalgo', capital: 'Pachuca', lat: 20.1000, lng: -98.7500 },
    { nombre: 'Jalisco', capital: 'Guadalajara', lat: 20.6667, lng: -103.3333 },
    { nombre: 'México', capital: 'Toluca', lat: 19.2925, lng: -99.6532 },
    { nombre: 'Michoacán', capital: 'Morelia', lat: 19.7069, lng: -101.1925 },
    { nombre: 'Morelos', capital: 'Cuernavaca', lat: 18.9214, lng: -99.2342 },
    { nombre: 'Nayarit', capital: 'Tepic', lat: 21.5042, lng: -104.8944 },
    { nombre: 'Nuevo León', capital: 'Monterrey', lat: 25.6667, lng: -100.3167 },
    { nombre: 'Oaxaca', capital: 'Oaxaca', lat: 17.0732, lng: -96.7266 },
    { nombre: 'Puebla', capital: 'Puebla', lat: 19.0414, lng: -98.2063 },
    { nombre: 'Querétaro', capital: 'Querétaro', lat: 20.5881, lng: -100.3881 },
    { nombre: 'Quintana Roo', capital: 'Chetumal', lat: 18.5000, lng: -88.3000 },
    { nombre: 'San Luis Potosí', capital: 'San Luis Potosí', lat: 22.1500, lng: -100.9833 },
    { nombre: 'Sinaloa', capital: 'Culiacán', lat: 24.8069, lng: -107.3939 },
    { nombre: 'Sonora', capital: 'Hermosillo', lat: 29.0892, lng: -110.9614 },
    { nombre: 'Tabasco', capital: 'Villahermosa', lat: 17.9894, lng: -92.9475 },
    { nombre: 'Tamaulipas', capital: 'Ciudad Victoria', lat: 23.7361, lng: -99.1461 },
    { nombre: 'Tlaxcala', capital: 'Tlaxcala', lat: 19.3167, lng: -98.2333 },
    { nombre: 'Veracruz', capital: 'Xalapa', lat: 19.5400, lng: -96.9100 },
    { nombre: 'Yucatán', capital: 'Mérida', lat: 20.9667, lng: -89.6167 },
    { nombre: 'Zacatecas', capital: 'Zacatecas', lat: 22.7744, lng: -102.5731 }
];

// Función para hacer peticiones API seguras específicas para México
async function fetchClimateDataMexico(endpoint, params = {}) {
    try {
        console.log(`🔍 Solicitando datos de México: ${endpoint}`);
        
        // llamada API real 
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // datos simulados específicos de México
        const simulatedData = getSimulatedDataMexico(endpoint, params);
        return simulatedData;
        
    } catch (error) {
        console.error('❌ Error fetching climate data for Mexico:', error);
        // Fallback a datos simulados de México
        return getSimulatedDataMexico(endpoint, params);
    }
}

// Datos simulados específicos para México
function getSimulatedDataMexico(endpoint, params = {}) {
    const region = params.region || 'nacional';
    
    //  datos para capitales 
    const datosCapitales = ESTADOS_MEXICO.map(estado => {
        const baseTemp = 20 + (Math.random() * 15); // 20-35°C
        const basePrecip = 50 + (Math.random() * 350); // 50-400mm
        const baseSequia = Math.random() * 100; // 0-100%
        
        return {
            lat: estado.lat,
            lng: estado.lng,
            value: endpoint === '/temperature' ? Math.round(baseTemp) : 
                   endpoint === '/precipitation' ? Math.round(basePrecip) : 
                   Math.round(baseSequia),
            city: estado.capital,
            state: estado.nombre,
            timestamp: new Date().toISOString()
        };
    });

    const simulatedData = {
        '/temperature': {
            data: datosCapitales,
            unit: "°C",
            region: region,
            lastUpdated: new Date().toISOString(),
            pais: "México"
        },
        '/precipitation': {
            data: datosCapitales,
            unit: "mm",
            region: region,
            lastUpdated: new Date().toISOString(),
            pais: "México"
        },
        '/drought': {
            data: datosCapitales,
            unit: "%",
            region: region,
            lastUpdated: new Date().toISOString(),
            pais: "México",
            description: "Nivel de sequía según índice estandarizado"
        }
    };
    
    return simulatedData[endpoint] || { data: [], unit: "N/A", region: region, pais: "México" };
}

// obtener datos históricos de México
function getHistoricalDataMexico(estado, years = 10) {
    const historico = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = years - 1; i >= 0; i--) {
        const year = currentYear - i;
        historico.push({
            año: year,
            temperatura: 22 + (Math.random() * 6) + (i * 0.1), // Tendencia de aumento
            precipitacion: 800 + (Math.random() * 400) - (i * 5), // Tendencia de disminución
            sequia: 10 + (Math.random() * 20) + (i * 1.5) // Tendencia de aumento
        });
    }
    
    return historico;
}

// Exportar para uso global
window.SIRCO_CONFIG = SIRCO_CONFIG;
window.ESTADOS_MEXICO = ESTADOS_MEXICO;
window.fetchClimateDataMexico = fetchClimateDataMexico;
window.getHistoricalDataMexico = getHistoricalDataMexico;