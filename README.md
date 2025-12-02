<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de información para registros comunitarios - México</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        :root {
            --neon-blue: #0ff0fc;
            --neon-green: #27ae60;
            --neon-purple: #8a2be2;
            --dark-bg: #0a0a16;
            --card-bg: #121225;
            --text-light: #e0e0ff;
            --accent: #ff073a;
            --agriculture: #27ae60;
            --engineering: #3498db;
            --architecture: #e67e22;
            --water: #2980b9;
            --transport: #95a5a6;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: var(--dark-bg);
            color: var(--text-light);
            line-height: 1.6;
            background-image: 
                url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80'),
                radial-gradient(circle at 10% 20%, rgba(10, 30, 80, 0.9) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(10, 80, 120, 0.9) 0%, transparent 40%);
            background-size: cover, 100% 100%, 100% 100%;
            background-blend-mode: overlay, normal, normal;
            background-attachment: fixed;
            min-height: 100vh;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 30%, rgba(15, 240, 252, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(39, 174, 96, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }
        
        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: linear-gradient(135deg, rgba(10, 15, 40, 0.95), rgba(20, 30, 70, 0.95));
            color: white;
            padding: 1.5rem 0;
            box-shadow: 0 0 30px rgba(0, 200, 255, 0.4);
            border-bottom: 2px solid var(--neon-blue);
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .logo {
            display: flex;
            align-items: center;
            position: relative;
        }
        
        .logo::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, var(--neon-blue), transparent);
            border-radius: 2px;
        }
        
        .logo h1 {
            font-size: 1.8rem;
            margin-left: 15px;
            text-shadow: 0 0 15px rgba(0, 200, 255, 0.8);
            background: linear-gradient(135deg, var(--neon-blue), var(--neon-green));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        
        .logo-icon {
            font-size: 2.5rem;
            color: var(--neon-blue);
            text-shadow: 0 0 15px var(--neon-blue);
            animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .nav-tabs {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .nav-tab {
            background: transparent;
            color: var(--text-light);
            border: 1px solid rgba(0, 200, 255, 0.3);
            padding: 10px 20px;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 0.9rem;
            position: relative;
            overflow: hidden;
        }
        
        .nav-tab::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .nav-tab:hover::before {
            left: 100%;
        }
        
        .nav-tab.active {
            background: rgba(0, 200, 255, 0.1);
            color: var(--neon-blue);
            border-color: var(--neon-blue);
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.4);
            transform: translateY(-2px);
        }
        
        .nav-tab:hover:not(.active) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 200, 255, 0.2);
        }
        
        .search-bar {
            display: flex;
            margin: 1rem auto;
            max-width: 500px;
            animation: fadeIn 1s ease 0.5s both;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .search-bar input {
            flex: 1;
            padding: 12px 20px;
            border: 1px solid var(--neon-blue);
            border-radius: 30px 0 0 30px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .search-bar input:focus {
            outline: none;
            box-shadow: 0 0 10px var(--neon-blue);
            transform: scale(1.02);
        }
        
        .search-bar button {
            padding: 12px 25px;
            border: 1px solid var(--neon-blue);
            border-left: none;
            border-radius: 0 30px 30px 0;
            background: var(--neon-blue);
            color: var(--dark-bg);
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .search-bar button:hover {
            background: #0ad8e6;
            transform: scale(1.05);
        }
        
        .tagline {
            margin-top: 10px;
            font-size: 1.1rem;
            opacity: 0.9;
            text-align: center;
            animation: fadeIn 1s ease 0.7s both;
        }
        
        main {
            padding: 2rem 0;
        }
        
        .section {
            margin-bottom: 4rem;
            padding: 2rem 0;
            opacity: 0;
            transform: translateY(30px);
            animation: sectionSlideUp 0.8s ease forwards;
        }
        
        @keyframes sectionSlideUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .section:nth-child(1) { animation-delay: 0.1s; }
        .section:nth-child(2) { animation-delay: 0.2s; }
        .section:nth-child(3) { animation-delay: 0.3s; }
        .section:nth-child(4) { animation-delay: 0.4s; }
        
        .section-title {
            color: var(--neon-blue);
            margin-bottom: 2rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid rgba(0, 200, 255, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 2.2rem;
            text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, var(--neon-blue), transparent);
            border-radius: 2px;
        }
        
        .card {
            background: linear-gradient(135deg, var(--card-bg), rgba(20, 25, 45, 0.9));
            border-radius: 20px;
            padding: 2.5rem;
            border: 1px solid rgba(0, 200, 255, 0.2);
            box-shadow: 0 10px 30px rgba(0, 100, 255, 0.2);
            margin-bottom: 2rem;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--neon-blue), var(--neon-green), var(--neon-purple));
        }
        
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0, 100, 255, 0.4);
            border-color: var(--neon-blue);
        }
        
        .info-section {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 15px;
            padding: 2rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .info-card {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            padding: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
            transition: all 0.3s ease;
        }
        
        .info-card:hover {
            background: rgba(0, 50, 100, 0.5);
            transform: translateY(-5px);
            box-shadow: 0 7px 18px rgba(0, 150, 255, 0.3);
        }
        
        .info-card h4 {
            color: var(--neon-blue);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .data-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .data-card {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 10px;
            padding: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .data-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 7px 18px rgba(0, 150, 255, 0.3);
        }
        
        .data-card h4 {
            color: var(--neon-blue);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .data-value {
            font-size: 1.8rem;
            font-weight: bold;
            margin: 0.5rem 0;
            transition: all 0.3s ease;
        }
        
        .data-card:hover .data-value {
            color: var(--neon-blue);
            transform: scale(1.1);
        }
        
        .risk-meter {
            height: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            margin: 10px 0;
            overflow: hidden;
        }
        
        .risk-level {
            height: 100%;
            border-radius: 5px;
            transition: width 1.5s ease-in-out;
        }
        
        .risk-low { background: #27ae60; width: 30%; }
        .risk-medium { background: #f39c12; width: 60%; }
        .risk-high { background: #e74c3c; width: 90%; }
        
        .location-section {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(0, 50, 100, 0.4);
            border-radius: 10px;
            border: 1px solid rgba(0, 200, 255, 0.3);
        }
        
        .location-info {
            flex: 1;
        }
        
        .location-btn {
            background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
            color: var(--dark-bg);
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .location-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px var(--neon-blue);
        }
        
        .last-update {
            font-size: 0.9rem;
            color: var(--neon-blue);
            margin-top: 1rem;
            text-align: right;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(10, 30, 60, 0.9);
            border: 1px solid var(--neon-blue);
            border-radius: 8px;
            padding: 1rem;
            max-width: 300px;
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 3.7s forwards;
        }
        
        @keyframes slideInRight {
            from { 
                transform: translateX(100%); 
                opacity: 0; 
            }
            to { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        
        @keyframes fadeOut {
            to { 
                opacity: 0; 
            }
        }
        
        footer {
            background: linear-gradient(135deg, rgba(10, 15, 30, 0.95), rgba(20, 25, 45, 0.9));
            color: white;
            padding: 4rem 0 2rem;
            margin-top: 4rem;
            border-top: 2px solid rgba(0, 200, 255, 0.3);
            position: relative;
        }
        
        footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
        }
        
        .footer-section h4 {
            color: var(--neon-blue);
            margin-bottom: 1.5rem;
            font-size: 1.3rem;
            position: relative;
            display: inline-block;
        }
        
        .footer-section h4::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50px;
            height: 2px;
            background: var(--neon-blue);
            border-radius: 2px;
        }
        
        /* Estilos para el mapa */
        .map-container {
            height: 500px;
            border-radius: 10px;
            overflow: hidden;
            margin: 1rem 0;
            border: 2px solid var(--neon-blue);
            box-shadow: 0 0 20px rgba(0, 200, 255, 0.3);
            position: relative;
            transition: all 0.3s ease;
        }
        
        .map-container:hover {
            box-shadow: 0 0 30px rgba(0, 200, 255, 0.5);
        }
        
        #climateMap {
            height: 100%;
            width: 100%;
            background: var(--dark-bg);
        }
        
        .map-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            background: rgba(10, 30, 60, 0.9);
            border-radius: 8px;
            padding: 10px;
            border: 1px solid var(--neon-blue);
        }
        
        .map-layer-btn {
            background: transparent;
            color: var(--text-light);
            border: 1px solid rgba(0, 200, 255, 0.3);
            padding: 8px 15px;
            margin: 5px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.8rem;
        }
        
        .map-layer-btn.active {
            background: rgba(0, 200, 255, 0.2);
            color: var(--neon-blue);
            border-color: var(--neon-blue);
        }
        
        .map-layer-btn:hover:not(.active) {
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0, 200, 255, 0.2);
        }
        
        .map-legend {
            position: absolute;
            bottom: 10px;
            left: 10px;
            z-index: 1000;
            background: rgba(10, 30, 60, 0.9);
            border-radius: 8px;
            padding: 10px;
            border: 1px solid var(--neon-blue);
            color: var(--text-light);
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            margin: 5px 0;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            border-radius: 3px;
        }
        
        .weather-marker {
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid var(--neon-blue);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            box-shadow: 0 0 10px var(--neon-blue);
            transition: all 0.3s ease;
        }
        
        .weather-marker:hover {
            transform: scale(1.2);
        }

        .temperature-marker { background: linear-gradient(45deg, #ff6b6b, #ffa726); }
        .rain-marker { background: linear-gradient(45deg, #42a5f5, #29b6f6); }
        .warning-marker { background: linear-gradient(45deg, #ef5350, #e53935); }
        .rural-marker { background: linear-gradient(45deg, #27ae60, #2ecc71); }
        .climate-change-marker { background: linear-gradient(45deg, #8e44ad, #9b59b6); }
        
        .map-tools {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background: rgba(10, 30, 60, 0.9);
            border-radius: 8px;
            padding: 10px;
            border: 1px solid var(--neon-blue);
        }
        
        .map-tool-btn {
            background: transparent;
            color: var(--text-light);
            border: 1px solid rgba(0, 200, 255, 0.3);
            padding: 8px 15px;
            margin: 5px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.8rem;
            display: block;
            width: 100%;
            text-align: left;
        }
        
        .map-tool-btn:hover {
            background: rgba(0, 200, 255, 0.2);
            color: var(--neon-blue);
            transform: translateY(-2px);
        }
        
        .location-indicator {
            position: absolute;
            bottom: 50px;
            right: 10px;
            z-index: 1000;
            background: rgba(10, 30, 60, 0.9);
            border-radius: 8px;
            padding: 10px;
            border: 1px solid var(--neon-blue);
            color: var(--text-light);
        }
        
        .notification-center {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        /* Estilos para el modelo de IA con entrada libre */
        .ai-input-form {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--neon-blue);
            font-weight: bold;
        }
        
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(0, 150, 255, 0.3);
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none;
            box-shadow: 0 0 10px var(--neon-blue);
            transform: scale(1.02);
        }
        
        .form-group textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .execute-btn {
            background: linear-gradient(to right, var(--neon-blue), var(--neon-purple));
            color: var(--dark-bg);
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            width: 100%;
            margin-top: 1rem;
            font-size: 1rem;
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
            position: relative;
            overflow: hidden;
        }
        
        .execute-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
        }
        
        .execute-btn:hover::before {
            left: 100%;
        }
        
        .execute-btn:hover {
            box-shadow: 0 0 20px var(--neon-blue);
            transform: translateY(-3px) scale(1.05);
        }
        
        .simulation-results {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 8px;
            padding: 2rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .simulation-results.active {
            display: block;
        }
        
        .update-indicator {
            display: inline-block;
            padding: 5px 10px;
            background: rgba(0, 200, 255, 0.2);
            border-radius: 15px;
            font-size: 0.8rem;
            color: var(--neon-blue);
            margin-left: 10px;
            animation: pulse 2s infinite;
        }
        
        .search-results {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .search-results.active {
            display: block;
        }
        
        .real-time-monitoring {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .sensor-card {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 8px;
            padding: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
            position: relative;
            transition: all 0.3s ease;
        }
        
        .sensor-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 7px 18px rgba(0, 150, 255, 0.3);
        }
        
        .sensor-status {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        
        .status-online {
            background: #27ae60;
            box-shadow: 0 0 5px #27ae60;
        }
        
        .status-offline {
            background: #e74c3c;
            box-shadow: 0 0 5px #e74c3c;
        }
        
        .sensor-card h4 {
            color: var(--neon-blue);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .sensor-value {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .sensor-card small {
            color: var(--neon-blue);
        }
        
        .alerts-container {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 10px;
            padding: 2rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
        }
        
        .alert-item {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-left: 4px solid;
            transition: all 0.3s ease;
        }
        
        .alert-item:hover {
            background: rgba(0, 50, 100, 0.5);
            transform: translateY(-5px);
            box-shadow: 0 7px 18px rgba(0, 150, 255, 0.3);
        }
        
        .alert-high {
            border-left-color: #e74c3c;
        }
        
        .alert-medium {
            border-left-color: #f39c12;
        }
        
        .alert-low {
            border-left-color: #27ae60;
        }
        
        .alert-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .alert-title {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .alert-region {
            background: rgba(0, 150, 255, 0.2);
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
        }
        
        .alert-time {
            font-size: 0.9rem;
            color: var(--neon-blue);
        }
        
        .alert-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .alert-detail {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .alert-detail i {
            color: var(--neon-blue);
        }
        
        .forecast-container {
            display: flex;
            overflow-x: auto;
            gap: 15px;
            padding: 10px 0;
            margin-top: 1rem;
        }
        
        .forecast-day {
            min-width: 140px;
            background: rgba(10, 30, 60, 0.7);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            border: 1px solid rgba(0, 150, 255, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .forecast-day:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 150, 255, 0.3);
        }
        
        .forecast-day h4 {
            color: var(--neon-blue);
            margin-bottom: 10px;
        }
        
        .temp {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .forecast-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .forecast-period {
            display: flex;
            gap: 10px;
        }
        
        .period-btn {
            background: transparent;
            color: var(--text-light);
            border: 1px solid rgba(0, 200, 255, 0.3);
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .period-btn.active {
            background: rgba(0, 200, 255, 0.2);
            color: var(--neon-blue);
            border-color: var(--neon-blue);
        }
        
        .period-btn:hover:not(.active) {
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0, 200, 255, 0.2);
        }
        
        .forecast-detail {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .detail-item:hover {
            background: rgba(0, 50, 100, 0.5);
        }
        
        .detail-label {
            color: var(--neon-blue);
        }
        
        .detail-value {
            font-weight: bold;
        }
        
        .hourly-forecast {
            display: flex;
            overflow-x: auto;
            gap: 15px;
            padding: 10px 0;
            margin-top: 1rem;
        }
        
        .hour-item {
            min-width: 100px;
            background: rgba(10, 30, 60, 0.7);
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            border: 1px solid rgba(0, 150, 255, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .hour-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 150, 255, 0.3);
        }
        
        .links-category {
            margin-bottom: 2rem;
        }
        
        .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }
        
        .link-card {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 8px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 15px;
            border: 1px solid rgba(0, 150, 255, 0.3);
            transition: all 0.3s ease;
        }
        
        .link-card:hover {
            background: rgba(10, 50, 100, 0.7);
            transform: translateY(-5px);
            box-shadow: 0 7px 18px rgba(0, 150, 255, 0.3);
        }
        
        .link-icon {
            font-size: 2rem;
            color: var(--neon-blue);
            transition: all 0.3s ease;
        }
        
        .link-card:hover .link-icon {
            transform: scale(1.2);
        }
        
        .link-info {
            flex: 1;
        }
        
        .link-info h4 {
            color: var(--neon-blue);
            margin-bottom: 5px;
        }
        
        .link-button {
            background: var(--neon-blue);
            color: var(--dark-bg);
            padding: 8px 15px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .link-button:hover {
            background: #0ad8e6;
            transform: scale(1.05);
        }
        
        .vision-2028 {
            background: rgba(10, 30, 60, 0.5);
            border-radius: 10px;
            padding: 2rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
            text-align: center;
        }
        
        .vision-2028 h3 {
            color: var(--neon-blue);
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
        }
        
        .vision-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 1.5rem;
        }
        
        .vision-item {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 1.5rem;
            border: 1px solid rgba(0, 150, 255, 0.3);
            transition: all 0.3s ease;
        }
        
        .vision-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 7px 18px rgba(0, 150, 255, 0.3);
        }
        
        .vision-item h4 {
            color: var(--neon-blue);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .vision-link {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 12px 25px;
            background: linear-gradient(to right, var(--neon-blue), var(--neon-purple));
            color: var(--dark-bg);
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .vision-link:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px var(--neon-blue);
        }

        /* ===== RESPONSIVE DESIGN - MOBILE OPTIMIZATION ===== */
        @media (max-width: 768px) {
            /* Ajustes generales de contenedor y espaciado */
            .container {
                padding: 0 15px;
            }
            
            /* Header y navegación optimizados para móvil */
            .header-content {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
            
            .logo h1 {
                font-size: 1.4rem;
                margin-left: 10px;
            }
            
            .nav-tabs {
                justify-content: center;
                flex-wrap: wrap;
                gap: 5px;
            }
            
            .nav-tab {
                padding: 8px 15px;
                font-size: 0.8rem;
                min-height: 44px;
            }
            
            /* Mejoras en la sección de búsqueda */
            .search-bar {
                margin: 1rem auto;
                width: 100%;
            }
            
            .search-bar input {
                padding: 14px 16px;
                font-size: 16px;
            }
            
            .search-bar button {
                padding: 14px 20px;
                min-height: 44px;
            }
            
            /* Ajustes de tipografía para móviles */
            .section-title {
                font-size: 1.5rem;
            }
            
            .section-title::after {
                width: 60px;
            }
            
            /* Tarjetas y contenedores de información */
            .card {
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .info-grid, .data-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            /* Sección de ubicación optimizada */
            .location-section {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }
            
            .location-btn {
                width: 100%;
                justify-content: center;
                min-height: 44px;
            }
            
            /* Mapa interactivo - mejoras críticas para móvil */
            .map-container {
                height: 350px;
            }
            
            .map-tools, .map-controls, .map-legend, .location-indicator {
                position: relative;
                top: auto;
                bottom: auto;
                left: auto;
                right: auto;
                margin: 10px 0;
                width: 100%;
            }
            
            .map-layer-btn, .map-tool-btn {
                display: inline-block;
                width: auto;
                margin: 5px;
                text-align: center;
                min-height: 44px;
            }
            
            .map-controls, .map-tools {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            /* Formularios optimizados para entrada táctil */
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .form-group input, .form-group select, .form-group textarea {
                padding: 14px;
                font-size: 16px;
            }
            
            .execute-btn {
                padding: 16px 25px;
                font-size: 1.1rem;
                min-height: 44px;
            }
            
            /* Monitoreo en tiempo real */
            .real-time-monitoring {
                grid-template-columns: 1fr;
            }
            
            .sensor-card {
                padding: 1.2rem;
            }
            
            /* Alertas y notificaciones */
            .alert-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .alert-details {
                grid-template-columns: 1fr;
            }
            
            /* Pronóstico extendido */
            .forecast-navigation {
                flex-direction: column;
                gap: 1rem;
            }
            
            .forecast-period {
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .forecast-container, .hourly-forecast {
                padding-bottom: 10px;
                margin-bottom: 10px;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            .forecast-day, .hour-item {
                min-width: 120px;
            }
            
            /* Enlaces oficiales */
            .links-grid {
                grid-template-columns: 1fr;
            }
            
            .link-card {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }
            
            /* Footer optimizado */
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            /* Mejoras de visión 2028 */
            .vision-content {
                grid-template-columns: 1fr;
            }
            
            /* Ajustes para elementos de datos específicos */
            .data-value {
                font-size: 1.5rem;
            }
            
            /* Notificaciones en móvil */
            .notification-center {
                top: 10px;
                right: 10px;
                left: 10px;
            }
            
            .notification {
                max-width: none;
                width: auto;
            }
            
            /* Mejoras de usabilidad táctil general */
            button, .nav-tab, .map-layer-btn, .map-tool-btn, .period-btn {
                min-height: 44px;
            }
            
            /* Ajustes para pantallas muy pequeñas */
            @media (max-width: 480px) {
                .logo h1 {
                    font-size: 1.2rem;
                }
                
                .nav-tab {
                    padding: 10px 12px;
                    font-size: 0.75rem;
                }
                
                .section-title {
                    font-size: 1.3rem;
                }
                
                .map-container {
                    height: 300px;
                }
            }
            
            /* Orientación landscape en móviles */
            @media (max-width: 768px) and (orientation: landscape) {
                .map-container {
                    height: 250px;
                }
                
                .header-content {
                    flex-direction: row;
                    align-items: center;
                }
                
                .nav-tabs {
                    justify-content: flex-end;
                }
            }
        }

        /* Mejoras adicionales para tablets */
        @media (min-width: 769px) and (max-width: 1024px) {
            .info-grid, .data-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .map-container {
                height: 400px;
            }
            
            .nav-tabs {
                flex-wrap: wrap;
            }
        }
    </style>
</head>
<body>
    <div class="notification-center" id="notificationCenter"></div>

    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon"><i class="fas fa-globe-americas"></i></div>
                    <h1>Sistema de información para registros comunitarios</h1>
                </div>
                <div class="nav-tabs">
                    <button class="nav-tab active" data-section="inicio">Inicio</button>
                    <button class="nav-tab" data-section="agricultura">Agricultura</button>
                    <button class="nav-tab" data-section="construccion">Construcción</button>
                    <button class="nav-tab" data-section="transporte">Transporte</button>
                    <button class="nav-tab" data-section="modelo-ia">Modelo IA</button>
                    <button class="nav-tab" data-section="enlaces">Enlaces Oficiales</button>
                    <button class="nav-tab" data-section="emergencias">Emergencias</button>
                    <button class="nav-tab" data-section="vision-2028">2028</button>
                </div>
            </div>

            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Buscar ciudad, estado o fenómeno climático...">
                <button id="searchButton"><i class="fas fa-search"></i></button>
            </div>
            
            <p class="tagline">Plataforma integral de análisis y proyección climática para la República Mexicana</p>
        </div>
    </header>
    
    <main class="container">
        <!-- Sección de Monitoreo en Tiempo Real -->
        <section class="section" id="inicio">
            <h2 class="section-title"><i class="fas fa-satellite-dish"></i> Monitoreo en Tiempo Real <span class="update-indicator">ACTUALIZANDO...</span></h2>
            
            <div class="location-section">
                <div class="location-info">
                    <h4><i class="fas fa-map-marker-alt"></i> Ubicación Actual</h4>
                    <p id="locationText">Haz clic en "Detectar Ubicación" para obtener datos específicos de tu zona</p>
                </div>
                <button class="location-btn" id="detectLocation">
                    <i class="fas fa-location-arrow"></i> Detectar Ubicación
                </button>
            </div>
            
            <div class="real-time-monitoring" id="realTimeMonitoring">
                <!-- Los datos se actualizarán dinámicamente -->
            </div>

            <!-- Alertas Climáticas Nacionales Actualizadas -->
            <h2 class="section-title"><i class="fas fa-exclamation-triangle"></i> Alertas Climáticas Nacionales <span class="update-indicator">EN VIVO</span></h2>
            
            <div class="alerts-container" id="alertsContainer">
                <!-- Las alertas se actualizarán dinámicamente -->
            </div>

            <!-- Pronóstico Extendido - 10 Días -->
            <h2 class="section-title"><i class="fas fa-cloud-sun-rain"></i> Pronóstico Extendido - 10 Días</h2>
            
            <div class="card">
                <div class="forecast-navigation">
                    <h3>Seleccione el período:</h3>
                    <div class="forecast-period">
                        <button class="period-btn active" data-period="current">Pronóstico Actual</button>
                        <button class="period-btn" data-period="past">Últimos 5 Días</button>
                        <button class="period-btn" data-period="future">Próximos 5 Días</button>
                    </div>
                </div>
                
                <div class="forecast-container" id="forecastContainer">
                    <!-- Los días del pronóstico se actualizarán dinámicamente -->
                </div>
                
                <div class="forecast-detail" id="forecastDetail">
                    <h4>Información Detallada para <span id="selectedDay">Hoy</span></h4>
                    <div class="detail-grid" id="dayDetails">
                        <!-- Los detalles se actualizarán dinámicamente -->
                    </div>
                    
                    <h4 style="margin-top: 1.5rem;">Pronóstico por Horas</h4>
                    <div class="hourly-forecast" id="hourlyForecast">
                        <!-- El pronóstico por horas se actualizará dinámicamente -->
                    </div>
                </div>
            </div>

            <!-- Resultados de Búsqueda -->
            <div class="search-results" id="searchResults">
                <h3>Resultados de Búsqueda</h3>
                <div id="searchResultsContent"></div>
            </div>
        </section>

        <!-- Mapa Nacional INTERACTIVO -->
        <section class="section">
            <h2 class="section-title"><i class="fas fa-map-marked-alt"></i> Mapa de Condiciones Climáticas</h2>
            
            <div class="map-container">
                <div id="climateMap"></div>
                
                <div class="map-tools">
                    <h4 style="color: var(--neon-blue); margin-bottom: 10px;">Herramientas</h4>
                    <button class="map-tool-btn" id="locateMe">
                        <i class="fas fa-location-arrow"></i> Mi Ubicación
                    </button>
                    <button class="map-tool-btn" id="measureDistance">
                        <i class="fas fa-ruler"></i> Medir Distancia
                    </button>
                    <button class="map-tool-btn" id="addMarker">
                        <i class="fas fa-map-marker-alt"></i> Agregar Marcador
                    </button>
                    <button class="map-tool-btn" id="clearMarkers">
                        <i class="fas fa-trash"></i> Limpiar Marcadores
                    </button>
                </div>
                
                <div class="map-controls">
                    <h4 style="color: var(--neon-blue); margin-bottom: 10px;">Capas</h4>
                    <button class="map-layer-btn active" data-layer="temperature">
                        <i class="fas fa-temperature-high"></i> Temperatura
                    </button>
                    <button class="map-layer-btn" data-layer="precipitation">
                        <i class="fas fa-cloud-rain"></i> Precipitación
                    </button>
                    <button class="map-layer-btn" data-layer="warnings">
                        <i class="fas fa-exclamation-triangle"></i> Alertas
                    </button>
                    <button class="map-layer-btn" data-layer="rural">
                        <i class="fas fa-tractor"></i> Zonas Rurales
                    </button>
                    <button class="map-layer-btn" data-layer="climate-change">
                        <i class="fas fa-chart-line"></i> Cambio Climático
                    </button>
                </div>
                
                <div class="location-indicator" id="locationIndicator">
                    <h4 style="color: var(--neon-blue); margin-bottom: 5px;">Ubicación</h4>
                    <div id="locationInfo">No disponible</div>
                </div>
                
                <div class="map-legend">
                    <h4 style="color: var(--neon-blue); margin-bottom: 10px;">Leyenda</h4>
                    <div class="legend-item">
                        <div class="legend-color" style="background: linear-gradient(45deg, #ff6b6b, #ffa726);"></div>
                        <span>Temperatura (°C)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: linear-gradient(45deg, #42a5f5, #29b6f6);"></div>
                        <span>Precipitación (mm)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: linear-gradient(45deg, #ef5350, #e53935);"></div>
                        <span>Alertas Activas</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: linear-gradient(45deg, #27ae60, #2ecc71);"></div>
                        <span>Zonas Rurales</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: linear-gradient(45deg, #8e44ad, #9b59b6);"></div>
                        <span>Impacto Cambio Climático</span>
                    </div>
                </div>
            </div>
            
            <div class="data-grid">
                <div class="data-card">
                    <h4><i class="fas fa-temperature-high"></i> Temperatura Promedio</h4>
                    <div class="data-value">32°C</div>
                    <div>Nacional</div>
                </div>
                <div class="data-card">
                    <h4><i class="fas fa-tint"></i> Humedad Relativa</h4>
                    <div class="data-value">65%</div>
                    <div>Promedio nacional</div>
                </div>
                <div class="data-card">
                    <h4><i class="fas fa-wind"></i> Viento Promedio</h4>
                    <div class="data-value">12 km/h</div>
                    <div>Velocidad media</div>
                </div>
                <div class="data-card">
                    <h4><i class="fas fa-industry"></i> CO₂ Atmosférico</h4>
                    <div class="data-value">420 ppm</div>
                    <div>Concentración</div>
                </div>
            </div>
        </section>

        <!-- Modelos Predictivos Avanzados -->
        <section class="section" id="modelo-ia">
            <h2 class="section-title"><i class="fas fa-brain"></i> Modelo de IA para Agricultura</h2>
            
            <div class="card">
                <h3><i class="fas fa-seedling"></i> Modelo Agrícola Integrado MÉX-IA</h3>
                <p>Predicciones agrícolas utilizando inteligencia artificial y aprendizaje automático con datos de 150+ estaciones</p>
                
                <div class="info-grid">
                    <div class="info-card">
                        <h4><i class="fas fa-crosshairs"></i> Precisión Modelo</h4>
                        <div class="data-value">94.2%</div>
                        <div>Exactitud en predicciones</div>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-calendar-alt"></i> Horizonte Predictivo</h4>
                        <div class="data-value">14 días</div>
                        <div>Pronóstico a futuro</div>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-map"></i> Resolución Espacial</h4>
                        <div class="data-value">1 km²</div>
                        <div>Detalle geográfico</div>
                    </div>
                    <div class="info-card">
                        <h4><i class="fas fa-sync-alt"></i> Actualización</h4>
                        <div class="data-value">Cada 6h</div>
                        <div>Frecuencia de datos</div>
                    </div>
                </div>
                
                <div class="ai-input-form">
                    <h4><i class="fas fa-edit"></i> Análisis Agrícola Personalizado</h4>
                    <div class="form-group">
                        <label for="region">Región de Análisis:</label>
                        <select id="region">
                            <option value="">Seleccione una región</option>
                            <option value="norte">Norte</option>
                            <option value="centro">Centro</option>
                            <option value="sur">Sur</option>
                            <option value="peninsula">Península de Yucatán</option>
                            <option value="golfo">Golfo de México</option>
                            <option value="pacifico">Pacífico</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="temperature">Temperatura (°C):</label>
                            <input type="number" id="temperature" placeholder="Ej: 25.5">
                        </div>
                        <div class="form-group">
                            <label for="humidity">Humedad Relativa (%):</label>
                            <input type="number" id="humidity" placeholder="Ej: 65">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="precipitation">Precipitación (mm):</label>
                            <input type="number" id="precipitation" placeholder="Ej: 15.2">
                        </div>
                        <div class="form-group">
                            <label for="wind">Velocidad del Viento (km/h):</label>
                            <input type="number" id="wind" placeholder="Ej: 12">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="cropType">Tipo de Cultivo:</label>
                        <select id="cropType">
                            <option value="">Seleccione un cultivo</option>
                            <option value="maiz">Maíz</option>
                            <option value="frijol">Frijol</option>
                            <option value="trigo">Trigo</option>
                            <option value="cafe">Café</option>
                            <option value="aguacate">Aguacate</option>
                            <option value="tomate">Tomate</option>
                            <option value="chile">Chile</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="soilType">Tipo de Suelo:</label>
                        <select id="soilType">
                            <option value="">Seleccione tipo de suelo</option>
                            <option value="arcilloso">Arcilloso</option>
                            <option value="arenoso">Arenoso</option>
                            <option value="limoso">Limoso</option>
                            <option value="franco">Franco</option>
                            <option value="calcareo">Cálcáreo</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="observations">Observaciones Adicionales:</label>
                        <textarea id="observations" placeholder="Describa condiciones específicas del cultivo, problemas observados, etc."></textarea>
                    </div>
                    
                    <button class="execute-btn" id="analyzeData">
                        <i class="fas fa-chart-line"></i> Analizar Datos Agrícolas con IA
                    </button>
                </div>
                
                <div class="simulation-results" id="simulationResults">
                    <h4>Resultados del Análisis IA para Agricultura</h4>
                    <div id="iaResultsContent">
                        <p>Ingrese datos y haga clic en "Analizar Datos Agrícolas con IA" para obtener resultados personalizados.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sección de Agricultura Mejorada -->
        <section class="section" id="agricultura">
            <h2 class="section-title"><i class="fas fa-tractor"></i> Agricultura <span class="update-indicator">ACTUALIZADO</span></h2>
            
            <div class="location-section">
                <div class="location-info">
                    <h4><i class="fas fa-map-marker-alt"></i> Datos Agrícolas para tu Región</h4>
                    <p id="agricultureLocationText">Detecta tu ubicación para obtener recomendaciones específicas</p>
                </div>
                <button class="location-btn" id="agricultureLocation">
                    <i class="fas fa-location-arrow"></i> Obtener Datos Agrícolas
                </button>
            </div>
            
            <div class="info-section">
                <h3><i class="fas fa-seedling"></i> Impacto Climático en la Agricultura Mexicana</h3>
                <p>El cambio climático está afectando significativamente los patrones de cultivo en México. A continuación presentamos información actualizada sobre las condiciones actuales y recomendaciones para el sector agrícola.</p>
                
                <div class="info-grid">
                    <div class="info-card">
                        <h4><i class="fas fa-temperature-high"></i> Condiciones Actuales</h4>
                        <p id="currentConditions">Detecta tu ubicación para ver las condiciones actuales</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-calendar-alt"></i> Calendario Agrícola</h4>
                        <p id="agricultureCalendar">Detecta tu ubicación para ver el calendario agrícola</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-tint"></i> Recomendaciones de Riego</h4>
                        <p id="irrigationRecommendations">Detecta tu ubicación para obtener recomendaciones de riego</p>
                    </div>
                </div>
                
                <div class="data-grid">
                    <div class="data-card">
                        <h4><i class="fas fa-seedling"></i> Riesgo Agrícola</h4>
                        <div class="data-value" id="agricultureRisk">--</div>
                        <div>Nivel de riesgo para cultivos</div>
                        <div class="risk-meter">
                            <div class="risk-level" id="agricultureRiskMeter"></div>
                        </div>
                    </div>
                    <div class="data-card">
                        <h4><i class="fas fa-leaf"></i> Humedad del Suelo</h4>
                        <div class="data-value" id="soilMoisture">--%</div>
                        <div>Nivel óptimo para siembra</div>
                    </div>
                    <div class="data-card">
                        <h4><i class="fas fa-cloud-sun"></i> Pronóstico</h4>
                        <div class="data-value" id="agricultureForecast">-- días</div>
                        <div>Días favorables para cultivo</div>
                    </div>
                </div>
                
                <div class="last-update">Última actualización: <span id="agricultureUpdateTime">--</span></div>
            </div>
        </section>

        <!-- Sección de Construcción -->
        <section class="section" id="construccion">
            <h2 class="section-title"><i class="fas fa-hard-hat"></i> Construcción <span class="update-indicator">NUEVO</span></h2>
            
            <div class="location-section">
                <div class="location-info">
                    <h4><i class="fas fa-map-marker-alt"></i> Condiciones para Obra en tu Zona</h4>
                    <p id="constructionLocationText">Detecta tu ubicación para obtener recomendaciones específicas</p>
                </div>
                <button class="location-btn" id="constructionLocation">
                    <i class="fas fa-location-arrow"></i> Obtener Datos de Construcción
                </button>
            </div>
            
            <div class="info-section">
                <h3><i class="fas fa-tools"></i> Impacto Climático en la Industria de la Construcción</h3>
                <p>Las condiciones climáticas extremas representan desafíos significativos para la industria de la construcción. A continuación presentamos análisis y recomendaciones actualizadas.</p>
                
                <div class="info-grid">
                    <div class="info-card">
                        <h4><i class="fas fa-temperature-high"></i> Condiciones para Obra</h4>
                        <p id="constructionConditions">Detecta tu ubicación para ver las condiciones para obra</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-cloud-rain"></i> Prevención por Lluvias</h4>
                        <p id="rainPrevention">Detecta tu ubicación para ver recomendaciones por lluvias</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-wind"></i> Medidas por Vientos</h4>
                        <p id="windMeasures">Detecta tu ubicación para ver medidas por vientos</p>
                    </div>
                </div>
                
                <div class="data-grid">
                    <div class="data-card">
                        <h4><i class="fas fa-calendar-day"></i> Días Laborables</h4>
                        <div class="data-value" id="workDays">--%</div>
                        <div>Del mes sin afectaciones climáticas</div>
                    </div>
                    <div class="data-card">
                        <h4><i class="fas fa-exclamation-triangle"></i> Obras en Riesgo</h4>
                        <div class="data-value" id="riskWorks">--</div>
                        <div>Por condiciones climáticas extremas</div>
                    </div>
                    <div class="data-card">
                        <h4><i class="fas fa-hard-hat"></i> Protocolos Activados</h4>
                        <div class="data-value" id="activeProtocols">--</div>
                        <div>De prevención climática</div>
                    </div>
                </div>
                
                <div class="last-update">Última actualización: <span id="constructionUpdateTime">--</span></div>
            </div>
        </section>

        <!-- Sección de Transporte -->
        <section class="section" id="transporte">
            <h2 class="section-title"><i class="fas fa-truck"></i> Transporte <span class="update-indicator">ACTUALIZADO</span></h2>
            
            <div class="location-section">
                <div class="location-info">
                    <h4><i class="fas fa-map-marker-alt"></i> Condiciones de Transporte en tu Área</h4>
                    <p id="transportLocationText">Detecta tu ubicación para obtener información específica</p>
                </div>
                <button class="location-btn" id="transportLocation">
                    <i class="fas fa-location-arrow"></i> Obtener Datos de Transporte
                </button>
            </div>
            
            <div class="info-section">
                <h3><i class="fas fa-road"></i> Impacto Climático en el Sistema de Transporte</h3>
                <p>Las condiciones meteorológicas afectan significativamente la operación del transporte terrestre, aéreo y marítimo. Monitoreo en tiempo real y recomendaciones.</p>
                
                <div class="info-grid">
                    <div class="info-card">
                        <h4><i class="fas fa-road"></i> Carreteras y Autopistas</h4>
                        <p id="highwaysInfo">Detecta tu ubicación para ver el estado de carreteras</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-plane"></i> Transporte Aéreo</h4>
                        <p id="airTransportInfo">Detecta tu ubicación para ver el estado del transporte aéreo</p>
                    </div>
                    
                    <div class="info-card">
                        <h4><i class="fas fa-ship"></i> Transporte Marítimo</h4>
                        <p id="maritimeTransportInfo">Detecta tu ubicación para ver el estado del transporte marítimo</p>
                    </div>
                </div>
                
                <div class="data-grid">
                    <div class="data-card">
                        <h4><i class="fas fa-traffic-light"></i> Carreteras Afectadas</h4>
                        <div class="data-value" id="affectedRoads">--</div>
                        <div>Por condiciones climáticas</div>
                    </div>
                    <div class="data-card">
                        <h4><i class="fas fa-plane-departure"></i> Vuelos Retrasados</h4>
                        <div class="data-value" id="delayedFlights">--%</div>
                        <div>Del total nacional</div>
                    </div>
                    <div class="data-card">
                        <h4><i class="fas fa-anchor"></i> Puertos en Alerta</h4>
                        <div class="data-value" id="alertPorts">--</div>
                        <div>Por condiciones marítimas</div>
                    </div>
                </div>
                
                <div class="last-update">Última actualización: <span id="transportUpdateTime">--</span></div>
            </div>
        </section>

        <!-- Números de Emergencia -->
        <section class="section" id="emergencias">
            <h2 class="section-title"><i class="fas fa-phone-alt"></i> Números de Emergencia</h2>
            
            <div class="location-section">
                <div class="location-info">
                    <h4><i class="fas fa-map-marker-alt"></i> Servicios de Emergencia en tu Zona</h4>
                    <p id="emergencyLocationText">Detecta tu ubicación para obtener contactos locales</p>
                </div>
                <button class="location-btn" id="emergencyLocation">
                    <i class="fas fa-location-arrow"></i> Obtener Contactos Locales
                </button>
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <h4><i class="fas fa-shield-alt"></i> Protección Civil</h4>
                    <p>Número Nacional: <strong>911</strong></p>
                    <p id="localCivilProtection">Detecta tu ubicación para ver el número local</p>
                    <p>Emergencias por fenómenos naturales y desastres</p>
                </div>
                
                <div class="info-card">
                    <h4><i class="fas fa-ambulance"></i> Cruz Roja Mexicana</h4>
                    <p>Número Nacional: <strong>065</strong></p>
                    <p id="localRedCross">Detecta tu ubicación para ver el número local</p>
                    <p>Atención médica de emergencia y rescate</p>
                </div>
                
                <div class="info-card">
                    <h4><i class="fas fa-fire"></i> Bomberos</h4>
                    <p>Número Nacional: <strong>068</strong></p>
                    <p id="localFirefighters">Detecta tu ubicación para ver el número local</p>
                    <p>Incendios, rescates y emergencias químicas</p>
                </div>
                
                <div class="info-card">
                    <h4><i class="fas fa-tint"></i> CONAGUA Emergencias</h4>
                    <p>Inundaciones: <strong>55 5174 0400</strong></p>
                    <p>Sequías: <strong>55 5174 0500</strong></p>
                    <p id="localConagua">Detecta tu ubicación para ver contactos regionales</p>
                    <p>Emergencias hídricas y fenómenos meteorológicos</p>
                </div>
            </div>
        </section>

        <!-- Sección de Enlaces Oficiales -->
        <section class="section" id="enlaces">
            <h2 class="section-title"><i class="fas fa-external-link-alt"></i> Enlaces Oficiales</h2>
            
            <div class="official-links">
                <div class="links-category">
                    <h3><i class="fas fa-cloud-sun-rain"></i> Servicio Meteorológico Nacional (SMN) – CONAGUA</h3>
                    <div class="links-grid">
                        <div class="link-card">
                            <div class="link-icon">
                                <i class="fas fa-cloud-sun-rain"></i>
                            </div>
                            <div class="link-info">
                                <h4>SMN - CONAGUA</h4>
                                <p>Servicio Meteorológico Nacional de CONAGUA</p>
                            </div>
                            <a href="https://smn.conagua.gob.mx/es/" class="link-button" target="_blank">Acceder</a>
                        </div>
                        
                        <div class="link-card">
                            <div class="link-icon">
                                <i class="fas fa-tint"></i>
                            </div>
                            <div class="link-info">
                                <h4>Monitor de Sequía</h4>
                                <p>Monitor de sequía actual con mapa interactivo</p>
                            </div>
                            <a href="https://smn.conagua.gob.mx/es/climatologia/monitor-de-sequia/monitor-de-sequia-en-mexico" class="link-button" target="_blank">Acceder</a>
                        </div>
                        
                        <div class="link-card">
                            <div class="link-icon">
                                <i class="fas fa-temperature-high"></i>
                            </div>
                            <div class="link-info">
                                <h4>Mapa de Temperaturas</h4>
                                <p>Pronóstico climático de temperaturas</p>
                            </div>
                            <a href="https://smn.conagua.gob.mx/es/climatologia/pronostico-climatico/temperatura-form" class="link-button" target="_blank">Acceder</a>
                        </div>
                    </div>
                </div>
                
                <div class="links-category">
                    <h3><i class="fas fa-tractor"></i> Agricultura</h3>
                    <div class="links-grid">
                        <div class="link-card">
                            <div class="link-icon">
                                <i class="fas fa-seedling"></i>
                            </div>
                            <div class="link-info">
                                <h4>Calendario Agrícola</h4>
                                <p>Calendario de siembra y cosecha</p>
                            </div>
                            <a href="https://nube.siap.gob.mx/calendario_agricola/" class="link-button" target="_blank">Acceder</a>
                        </div>
                        
                        <div class="link-card">
                            <div class="link-icon">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <div class="link-info">
                                <h4>Impacto de la Sequía en la Agricultura</h4>
                                <p>Datos sobre el impacto de sequías en la actividad agrícola</p>
                            </div>
                            <a href="https://www.gob.mx/agricultura" class="link-button" target="_blank">Acceder</a>
                        </div>
                    </div>
                </div>
                
                <div class="links-category">
                    <h3><i class="fas fa-exclamation-triangle"></i> Desastres Naturales</h3>
                    <div class="links-grid">
                        <div class="link-card">
                            <div class="link-icon">
                                <i class="fas fa-map"></i>
                            </div>
                            <div class="link-info">
                                <h4>Atlas Nacional de Riesgos</h4>
                                <p>Plataforma integral de riesgos en México</p>
                            </div>
                            <a href="https://www.gob.mx/cenapred" class="link-button" target="_blank">Acceder</a>
                        </div>
                        
                        <div class="link-card">
                            <div class="link-icon">
                                <i class="fas fa-binoculars"></i>
                            </div>
                            <div class="link-info">
                                <h4>Monitoreo de Fenómenos</h4>
                                <p>Seguimiento en tiempo real de fenómenos naturales</p>
                            </div>
                            <a href="https://www.gob.mx/conagua" class="link-button" target="_blank">Acceder</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Nueva sección 2028 -->
        <section class="section" id="vision-2028">
            <h2 class="section-title"><i class="fas fa-calendar-alt"></i> Visión 2028</h2>
            
            <div class="vision-2028">
                <h3>Transformación Digital para el Desarrollo Rural Sostenible</h3>
                <p>En 2028, México contará con un sistema integral de información comunitaria que transformará la gestión de recursos naturales y la adaptación al cambio climático.</p>
                
                <div class="vision-content">
                    <div class="vision-item">
                        <h4><i class="fas fa-seedling"></i> Agricultura Inteligente</h4>
                        <p>Implementación de sistemas de riego inteligente y monitoreo de cultivos con sensores IoT en 5,000 comunidades rurales.</p>
                    </div>
                    
                    <div class="vision-item">
                        <h4><i class="fas fa-tint"></i> Gestión Hídrica Avanzada</h4>
                        <p>Red nacional de monitoreo de agua con 2,000 estaciones automatizadas para optimizar el uso del recurso hídrico.</p>
                    </div>
                    
                    <div class="vision-item">
                        <h4><i class="fas fa-chart-line"></i> Modelos Predictivos</h4>
                        <p>Plataforma nacional de IA para predicción climática con resolución de 500 metros y 15 días de anticipación.</p>
                    </div>
                    
                    <div class="vision-item">
                        <h4><i class="fas fa-users"></i> Participación Comunitaria</h4>
                        <p>Sistema de alertas tempranas comunitarias con cobertura del 95% del territorio nacional vulnerable.</p>
                    </div>
                </div>
                
                <a href="https://ecoprototipo2025.netlify.app/" class="vision-link" id="visionLink" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Conoce más sobre nuestro plan 2027
                </a>
            </div>
        </section>
    </main>
    
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h4>Sistema de Información para Registros Comunitarios</h4>
                    <p>+52 922 163 3537</p>
                    <p>Av. Urano. Boca del Río, Veracruz</p>
                </div>
                <div>
                    <h4>Enlaces Rápidos</h4>
                    <p><a href="#" style="color: var(--neon-blue);">Centro de Ayuda</a></p>
                    <p><a href="#" style="color: var(--neon-blue);">Política de Privacidad</a></p>
                </div>
                <div>
                    <h4>Fuentes</h4>
                    <p>CONAGUA</p>
                    <p>SEMARNAT</p>
                    <p>UNAM</p>
                    <p>CENAPRED</p>
                    <p>NVIDIA</p>
                </div>
            </div>
            
            <p style="margin-top: 2rem; text-align: center;">
                Sistema de información para registros comunitarios &copy; 2025 - República Mexicana
            </p>
        </div>
    </footer>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        // ==============================================
        // VARIABLES GLOBALES PARA UBICACIÓN (UNA SOLA VEZ)
        // ==============================================
        let ubicacionGlobal = null;
        let regionGlobal = null;

        // ==============================================
        // DATOS ORIGINALES (MANTENIDOS)
        // ==============================================
        const regionData = {
            "norte": {
                name: "Norte de México",
                temperature: "35°C",
                humidity: "45%",
                wind: "15 km/h",
                precipitation: "5 mm",
                agriculture: {
                    risk: "Alto",
                    riskLevel: "high",
                    soilMoisture: "30%",
                    forecast: "12 días",
                    conditions: "Sequía extrema afectando cultivos. Se recomienda riego por goteo y cultivos resistentes a sequía.",
                    calendar: "Retrasar siembra 2-3 semanas. Priorizar variedades resistentes a sequía.",
                    irrigation: "Incrementar riego complementario en un 30% en zonas críticas."
                },
                construction: {
                    conditions: "Olas de calor: Limitar trabajo al aire libre entre 11:00-16:00 hrs.",
                    rainPrevention: "Baja probabilidad de lluvias. Enfocarse en protección contra polvo y arena.",
                    windMeasures: "Vientos moderados. Revisar anclajes de andamios con vientos superiores a 40 km/h.",
                    workDays: "82%",
                    riskWorks: "28",
                    activeProtocols: "12"
                },
                transport: {
                    highways: "Precaución en carreteras de montaña por posibles deslaves.",
                    airTransport: "Posibles retrasos por tormentas de arena.",
                    maritimeTransport: "Navegación con precaución por vientos fuertes.",
                    affectedRoads: "5",
                    delayedFlights: "8%",
                    alertPorts: "2"
                },
                emergency: {
                    civilProtection: "Local: 55 1234 5678",
                    redCross: "Local: 55 5395 1111",
                    firefighters: "Local: 55 5768 2532",
                    conagua: "Contacto regional: 55 5174 0600"
                }
            },
            "centro": {
                name: "Centro de México",
                temperature: "22°C",
                humidity: "65%",
                wind: "12 km/h",
                precipitation: "15 mm",
                agriculture: {
                    risk: "Medio",
                    riskLevel: "medium",
                    soilMoisture: "65%",
                    forecast: "18 días",
                    conditions: "Condiciones estables con vigilancia. Precipitaciones irregulares con déficit del 15%.",
                    calendar: "Calendario agrícola normal. Monitorear pronósticos de lluvia.",
                    irrigation: "Riego por goteo recomendado para cultivos de alto valor."
                },
                construction: {
                    conditions: "Condiciones óptimas para obra. Temperaturas moderadas.",
                    rainPrevention: "Implementar sistemas de drenaje en obras expuestas.",
                    windMeasures: "Condiciones normales. Revisar estabilidad con vientos superiores a 50 km/h.",
                    workDays: "78%",
                    riskWorks: "15",
                    activeProtocols: "8"
                },
                transport: {
                    highways: "Visibilidad reducida por neblina matutina en carreteras altas.",
                    airTransport: "Operación normal con vigilancia de vientos cruzados.",
                    maritimeTransport: "Condiciones normales en cuerpos de agua internos.",
                    affectedRoads: "3",
                    delayedFlights: "5%",
                    alertPorts: "1"
                },
                emergency: {
                    civilProtection: "Local: 55 2345 6789",
                    redCross: "Local: 55 6395 2222",
                    firefighters: "Local: 55 6768 3532",
                    conagua: "Contacto regional: 55 6174 0700"
                }
            },
            "sur": {
                name: "Sur de México",
                temperature: "28°C",
                humidity: "75%",
                wind: "18 km/h",
                precipitation: "45 mm",
                agriculture: {
                    risk: "Bajo",
                    riskLevel: "low",
                    soilMoisture: "80%",
                    forecast: "22 días",
                    conditions: "Lluvias benéficas para cultivos. Monitorear posibles encharcamientos.",
                    calendar: "Calendario agrícola favorable. Aprovechar condiciones de humedad.",
                    irrigation: "Reducir riego complementario. Monitorear humedad del suelo."
                },
                construction: {
                    conditions: "Precaución por lluvias intensas. Limitar trabajos en exteriores durante tormentas.",
                    rainPrevention: "Reforzar taludes y zanjas ante pronóstico de lluvias intensas.",
                    windMeasures: "Vientos fuertes ocasionales. Suspender operaciones con vientos superiores a 60 km/h.",
                    workDays: "72%",
                    riskWorks: "35",
                    activeProtocols: "18"
                },
                transport: {
                    highways: "Lluvias intensas pueden causar inundaciones en tramos bajos.",
                    airTransport: "Posibles desvíos por tormentas eléctricas.",
                    maritimeTransport: "Oleaje elevado, precaución para embarcaciones menores.",
                    affectedRoads: "8",
                    delayedFlights: "15%",
                    alertPorts: "4"
                },
                emergency: {
                    civilProtection: "Local: 55 3456 7890",
                    redCross: "Local: 55 7395 3333",
                    firefighters: "Local: 55 7768 4532",
                    conagua: "Contacto regional: 55 7174 0800"
                }
            }
        };

        // Datos de estados y municipios de México
        const estadosMexico = [
            { nombre: "Aguascalientes", capital: "Aguascalientes", lat: 21.8853, lon: -102.2916, temp: 22, rain: 5, warning: false, climateChange: "Moderado", tempChange: "+1.2°C", precipitationChange: "-8%" },
            { nombre: "Baja California", capital: "Mexicali", lat: 32.6245, lon: -115.4523, temp: 35, rain: 2, warning: true, climateChange: "Alto", tempChange: "+2.1°C", precipitationChange: "-15%" },
            { nombre: "Baja California Sur", capital: "La Paz", lat: 24.1426, lon: -110.3128, temp: 30, rain: 3, warning: false, climateChange: "Alto", tempChange: "+1.8°C", precipitationChange: "-12%" },
            { nombre: "Campeche", capital: "Campeche", lat: 19.8301, lon: -90.5349, temp: 28, rain: 25, warning: false, climateChange: "Moderado", tempChange: "+1.0°C", precipitationChange: "+5%" },
            { nombre: "Chiapas", capital: "Tuxtla Gutiérrez", lat: 16.7510, lon: -93.1165, temp: 26, rain: 45, warning: true, climateChange: "Bajo", tempChange: "+0.8°C", precipitationChange: "+10%" },
            { nombre: "Chihuahua", capital: "Chihuahua", lat: 28.6320, lon: -106.0691, temp: 20, rain: 8, warning: false, climateChange: "Alto", tempChange: "+1.9°C", precipitationChange: "-18%" },
            { nombre: "Ciudad de México", capital: "Ciudad de México", lat: 19.4326, lon: -99.1332, temp: 22, rain: 5, warning: false, climateChange: "Moderado", tempChange: "+1.3°C", precipitationChange: "-5%" },
            { nombre: "Coahuila", capital: "Saltillo", lat: 25.4230, lon: -101.0053, temp: 24, rain: 4, warning: false, climateChange: "Alto", tempChange: "+2.0°C", precipitationChange: "-16%" },
            { nombre: "Colima", capital: "Colima", lat: 19.2433, lon: -103.7240, temp: 27, rain: 12, warning: false, climateChange: "Moderado", tempChange: "+1.1°C", precipitationChange: "+2%" },
            { nombre: "Durango", capital: "Durango", lat: 24.0270, lon: -104.6535, temp: 19, rain: 6, warning: false, climateChange: "Alto", tempChange: "+1.7°C", precipitationChange: "-14%" },
            { nombre: "Estado de México", capital: "Toluca", lat: 19.2920, lon: -99.6536, temp: 18, rain: 15, warning: false, climateChange: "Moderado", tempChange: "+1.2°C", precipitationChange: "-3%" },
            { nombre: "Guanajuato", capital: "Guanajuato", lat: 21.0190, lon: -101.2574, temp: 21, rain: 10, warning: false, climateChange: "Moderado", tempChange: "+1.1°C", precipitationChange: "-6%" },
            { nombre: "Guerrero", capital: "Chilpancingo", lat: 17.5734, lon: -99.5155, temp: 29, rain: 35, warning: true, climateChange: "Bajo", tempChange: "+0.9°C", precipitationChange: "+8%" },
            { nombre: "Hidalgo", capital: "Pachuca", lat: 20.1000, lon: -98.7500, temp: 20, rain: 18, warning: false, climateChange: "Moderado", tempChange: "+1.0°C", precipitationChange: "-2%" },
            { nombre: "Jalisco", capital: "Guadalajara", lat: 20.6597, lon: -103.3496, temp: 26, rain: 2, warning: false, climateChange: "Moderado", tempChange: "+1.3°C", precipitationChange: "-7%" },
            { nombre: "Michoacán", capital: "Morelia", lat: 19.7059, lon: -101.1949, temp: 23, rain: 20, warning: false, climateChange: "Moderado", tempChange: "+1.1°C", precipitationChange: "+3%" },
            { nombre: "Morelos", capital: "Cuernavaca", lat: 18.9210, lon: -99.2340, temp: 25, rain: 15, warning: false, climateChange: "Moderado", tempChange: "+1.2°C", precipitationChange: "-4%" },
            { nombre: "Nayarit", capital: "Tepic", lat: 21.5040, lon: -104.8940, temp: 27, rain: 22, warning: false, climateChange: "Moderado", tempChange: "+1.0°C", precipitationChange: "+1%" },
            { nombre: "Nuevo León", capital: "Monterrey", lat: 25.6866, lon: -100.3161, temp: 35, rain: 0, warning: true, climateChange: "Alto", tempChange: "+2.2°C", precipitationChange: "-20%" },
            { nombre: "Oaxaca", capital: "Oaxaca", lat: 17.0732, lon: -96.7266, temp: 24, rain: 30, warning: false, climateChange: "Bajo", tempChange: "+0.7°C", precipitationChange: "+6%" },
            { nombre: "Puebla", capital: "Puebla", lat: 19.0414, lon: -98.2063, temp: 21, rain: 18, warning: false, climateChange: "Moderado", tempChange: "+1.1°C", precipitationChange: "-1%" },
            { nombre: "Querétaro", capital: "Querétaro", lat: 20.5881, lon: -100.3881, temp: 22, rain: 12, warning: false, climateChange: "Moderado", tempChange: "+1.2°C", precipitationChange: "-5%" },
            { nombre: "Quintana Roo", capital: "Chetumal", lat: 18.5141, lon: -88.3038, temp: 29, rain: 25, warning: false, climateChange: "Moderado", tempChange: "+1.0°C", precipitationChange: "+3%" },
            { nombre: "San Luis Potosí", capital: "San Luis Potosí", lat: 22.1565, lon: -100.9855, temp: 23, rain: 8, warning: false, climateChange: "Alto", tempChange: "+1.6°C", precipitationChange: "-12%" },
            { nombre: "Sinaloa", capital: "Culiacán", lat: 24.7994, lon: -107.3897, temp: 28, rain: 10, warning: false, climateChange: "Moderado", tempChange: "+1.3°C", precipitationChange: "-9%" },
            { nombre: "Sonora", capital: "Hermosillo", lat: 29.0729, lon: -110.9559, temp: 38, rain: 0, warning: true, climateChange: "Alto", tempChange: "+2.5°C", precipitationChange: "-22%" },
            { nombre: "Tabasco", capital: "Villahermosa", lat: 17.9894, lon: -92.9471, temp: 30, rain: 50, warning: true, climateChange: "Bajo", tempChange: "+0.8°C", precipitationChange: "+12%" },
            { nombre: "Tamaulipas", capital: "Ciudad Victoria", lat: 23.7369, lon: -99.1411, temp: 27, rain: 15, warning: false, climateChange: "Alto", tempChange: "+1.8°C", precipitationChange: "-14%" },
            { nombre: "Tlaxcala", capital: "Tlaxcala", lat: 19.3182, lon: -98.2375, temp: 19, rain: 20, warning: false, climateChange: "Moderado", tempChange: "+1.1°C", precipitationChange: "-2%" },
            { nombre: "Veracruz", capital: "Xalapa", lat: 19.1738, lon: -96.1342, temp: 28, rain: 45, warning: true, climateChange: "Bajo", tempChange: "+0.9°C", precipitationChange: "+9%" },
            { nombre: "Yucatán", capital: "Mérida", lat: 20.9674, lon: -89.5926, temp: 33, rain: 8, warning: false, climateChange: "Moderado", tempChange: "+1.2°C", precipitationChange: "-4%" },
            { nombre: "Zacatecas", capital: "Zacatecas", lat: 22.7709, lon: -102.5832, temp: 21, rain: 5, warning: false, climateChange: "Alto", tempChange: "+1.7°C", precipitationChange: "-16%" }
        ];

        // Zonas rurales importantes
        const zonasRurales = [
            { nombre: "Valle de Guadalupe", estado: "Baja California", lat: 32.0667, lon: -116.6167, tipo: "Viñedos" },
            { nombre: "Valle de Parras", estado: "Coahuila", lat: 25.4333, lon: -102.1833, tipo: "Viñedos" },
            { nombre: "Valle del Mezquital", estado: "Hidalgo", lat: 20.3333, lon: -99.0000, tipo: "Agricultura" },
            { nombre: "Valle de Tehuacán", estado: "Puebla", lat: 18.4667, lon: -97.4000, tipo: "Agricultura" },
            { nombre: "Lacandona", estado: "Chiapas", lat: 16.2000, lon: -90.9000, tipo: "Selva" },
            { nombre: "Sierra Tarahumara", estado: "Chihuahua", lat: 27.5000, lon: -107.5000, tipo: "Montaña" },
            { nombre: "Huasteca Potosina", estado: "San Luis Potosí", lat: 21.8333, lon: -99.0000, tipo: "Selva" },
            { nombre: "Mixteca", estado: "Oaxaca", lat: 17.5000, lon: -97.5000, tipo: "Montaña" }
        ];

        // ==============================================
        // MODIFICACIÓN 1: 8 ESTACIONES EN TIEMPO REAL
        // ==============================================
        const weatherStations = [
            { id: 1, name: "Estación CDMX Centro", location: "CDMX", type: "temperature", value: 24.5, humidity: 65, wind: 12, pressure: 1013, status: "online", updateTime: "2 minutos", lat: 19.4326, lon: -99.1332 },
            { id: 2, name: "Presa La Angostura", location: "Chiapas", type: "water", value: 78.3, level: 245.6, flow: 120, status: "online", updateTime: "5 minutos", lat: 16.7510, lon: -93.1165 },
            { id: 3, name: "Estación Monterrey", location: "Nuevo León", type: "temperature", value: 35.2, humidity: 45, wind: 8, pressure: 1012, status: "online", updateTime: "1 minuto", lat: 25.6866, lon: -100.3161 },
            { id: 4, name: "Estación Guadalajara", location: "Jalisco", type: "temperature", value: 26.8, humidity: 58, wind: 10, pressure: 1013, status: "online", updateTime: "2 minutos", lat: 20.6597, lon: -103.3496 },
            { id: 5, name: "Estación Mérida", location: "Yucatán", type: "temperature", value: 29.5, humidity: 75, wind: 18, pressure: 1011, status: "online", updateTime: "3 minutos", lat: 20.9674, lon: -89.5926 },
            { id: 6, name: "Estación Tijuana", location: "Baja California", type: "temperature", value: 28.3, humidity: 40, wind: 15, pressure: 1012, status: "online", updateTime: "4 minutos", lat: 32.5149, lon: -117.0382 },
            { id: 7, name: "Estación Cancún", location: "Quintana Roo", type: "temperature", value: 30.1, humidity: 80, wind: 12, pressure: 1010, status: "online", updateTime: "2 minutos", lat: 21.1619, lon: -86.8515 },
            { id: 8, name: "Estación Veracruz", location: "Veracruz", type: "temperature", value: 27.4, humidity: 85, wind: 20, pressure: 1009, status: "online", updateTime: "3 minutos", lat: 19.1738, lon: -96.1342 }
        ];

        const climateAlerts = [
            { 
                id: 1, 
                title: "Ola de Calor Extremo", 
                region: "Norte de México", 
                severity: "high", 
                type: "heat",
                description: "Temperaturas superiores a 40°C en Sonora, Chihuahua y Baja California. Se espera que continúe por 5 días más.",
                startTime: "2023-11-15T10:00:00",
                endTime: "2023-11-20T18:00:00",
                affectedAreas: ["Sonora", "Chihuahua", "Baja California", "Coahuila"],
                recommendations: ["Evitar actividades al aire libre entre 11:00-16:00 hrs", "Mantener hidratación", "Usar protección solar"],
                temperature: "40-45°C",
                humidity: "15-25%",
                wind: "10-20 km/h"
            },
            { 
                id: 2, 
                title: "Lluvias Intensas", 
                region: "Sureste de México", 
                severity: "medium", 
                type: "rain",
                description: "Precipitaciones fuertes en Veracruz, Tabasco y Chiapas. Acumulados de 150-200 mm en 24 horas.",
                startTime: "2023-11-16T14:00:00",
                endTime: "2023-11-18T08:00:00",
                affectedAreas: ["Veracruz", "Tabasco", "Chiapas", "Oaxaca"],
                recommendations: ["Evitar zonas bajas propensas a inundación", "Revisar drenajes", "Mantener informado sobre niveles de ríos"],
                precipitation: "150-200 mm",
                humidity: "85-95%",
                wind: "20-30 km/h"
            }
        ];

        // ==============================================
        // MODIFICACIÓN 2: PRONÓSTICO POR 10 DÍAS COMPLETOS
        // ==============================================
        const forecastData = {
            past: [
                { date: "2023-11-05", day: "Domingo", temp: { max: 27, min: 14 }, condition: "soleado", icon: "fa-sun", precipitation: 0, humidity: 62, wind: 11, pressure: 1014, uv: 8 },
                { date: "2023-11-06", day: "Lunes", temp: { max: 25, min: 13 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 1, humidity: 68, wind: 9, pressure: 1013, uv: 6 },
                { date: "2023-11-07", day: "Martes", temp: { max: 23, min: 12 }, condition: "nublado", icon: "fa-cloud", precipitation: 4, humidity: 72, wind: 7, pressure: 1012, uv: 3 },
                { date: "2023-11-08", day: "Miércoles", temp: { max: 21, min: 11 }, condition: "lluvia ligera", icon: "fa-cloud-rain", precipitation: 10, humidity: 78, wind: 13, pressure: 1011, uv: 2 },
                { date: "2023-11-09", day: "Jueves", temp: { max: 24, min: 13 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 2, humidity: 67, wind: 9, pressure: 1013, uv: 5 },
                { date: "2023-11-10", day: "Viernes", temp: { max: 28, min: 15 }, condition: "soleado", icon: "fa-sun", precipitation: 0, humidity: 65, wind: 12, pressure: 1013, uv: 8 },
                { date: "2023-11-11", day: "Sábado", temp: { max: 26, min: 14 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 2, humidity: 70, wind: 10, pressure: 1012, uv: 6 },
                { date: "2023-11-12", day: "Domingo", temp: { max: 24, min: 13 }, condition: "nublado", icon: "fa-cloud", precipitation: 5, humidity: 75, wind: 8, pressure: 1011, uv: 3 },
                { date: "2023-11-13", day: "Lunes", temp: { max: 22, min: 12 }, condition: "lluvia ligera", icon: "fa-cloud-rain", precipitation: 12, humidity: 80, wind: 15, pressure: 1010, uv: 2 },
                { date: "2023-11-14", day: "Martes", temp: { max: 25, min: 14 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 3, humidity: 68, wind: 10, pressure: 1012, uv: 5 }
            ],
            current: [
                { date: "2023-11-15", day: "Miércoles", temp: { max: 32, min: 18 }, condition: "soleado", icon: "fa-sun", precipitation: 0, humidity: 55, wind: 12, pressure: 1013, uv: 9, currentTemp: 28 },
                { date: "2023-11-16", day: "Jueves", temp: { max: 30, min: 17 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 5, humidity: 60, wind: 10, pressure: 1012, uv: 7 },
                { date: "2023-11-17", day: "Viernes", temp: { max: 28, min: 16 }, condition: "nublado", icon: "fa-cloud", precipitation: 15, humidity: 70, wind: 15, pressure: 1010, uv: 4 },
                { date: "2023-11-18", day: "Sábado", temp: { max: 26, min: 15 }, condition: "lluvia moderada", icon: "fa-cloud-showers-heavy", precipitation: 25, humidity: 75, wind: 18, pressure: 1008, uv: 2 },
                { date: "2023-11-19", day: "Domingo", temp: { max: 24, min: 14 }, condition: "lluvia intensa", icon: "fa-cloud-rain", precipitation: 40, humidity: 80, wind: 20, pressure: 1007, uv: 1 },
                { date: "2023-11-20", day: "Lunes", temp: { max: 26, min: 15 }, condition: "lluvia ligera", icon: "fa-cloud-rain", precipitation: 10, humidity: 75, wind: 12, pressure: 1010, uv: 3 },
                { date: "2023-11-21", day: "Martes", temp: { max: 28, min: 16 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 5, humidity: 65, wind: 10, pressure: 1012, uv: 6 },
                { date: "2023-11-22", day: "Miércoles", temp: { max: 30, min: 17 }, condition: "soleado", icon: "fa-sun", precipitation: 0, humidity: 60, wind: 8, pressure: 1013, uv: 8 },
                { date: "2023-11-23", day: "Jueves", temp: { max: 31, min: 18 }, condition: "soleado", icon: "fa-sun", precipitation: 0, humidity: 55, wind: 10, pressure: 1013, uv: 9 },
                { date: "2023-11-24", day: "Viernes", temp: { max: 29, min: 17 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 2, humidity: 62, wind: 12, pressure: 1012, uv: 7 }
            ],
            future: [
                { date: "2023-11-25", day: "Sábado", temp: { max: 27, min: 16 }, condition: "nublado", icon: "fa-cloud", precipitation: 8, humidity: 68, wind: 10, pressure: 1011, uv: 4 },
                { date: "2023-11-26", day: "Domingo", temp: { max: 25, min: 15 }, condition: "lluvia ligera", icon: "fa-cloud-rain", precipitation: 15, humidity: 72, wind: 14, pressure: 1009, uv: 2 },
                { date: "2023-11-27", day: "Lunes", temp: { max: 26, min: 15 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 3, humidity: 65, wind: 9, pressure: 1012, uv: 5 },
                { date: "2023-11-28", day: "Martes", temp: { max: 28, min: 16 }, condition: "soleado", icon: "fa-sun", precipitation: 0, humidity: 58, wind: 7, pressure: 1013, uv: 7 },
                { date: "2023-11-29", day: "Miércoles", temp: { max: 30, min: 17 }, condition: "soleado", icon: "fa-sun", precipitation: 0, humidity: 52, wind: 10, pressure: 1013, uv: 9 },
                { date: "2023-11-30", day: "Jueves", temp: { max: 29, min: 16 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 4, humidity: 60, wind: 11, pressure: 1012, uv: 6 },
                { date: "2023-12-01", day: "Viernes", temp: { max: 27, min: 15 }, condition: "nublado", icon: "fa-cloud", precipitation: 12, humidity: 70, wind: 13, pressure: 1010, uv: 3 },
                { date: "2023-12-02", day: "Sábado", temp: { max: 25, min: 14 }, condition: "lluvia moderada", icon: "fa-cloud-showers-heavy", precipitation: 22, humidity: 75, wind: 15, pressure: 1009, uv: 2 },
                { date: "2023-12-03", day: "Domingo", temp: { max: 26, min: 15 }, condition: "lluvia ligera", icon: "fa-cloud-rain", precipitation: 8, humidity: 68, wind: 10, pressure: 1011, uv: 4 },
                { date: "2023-12-04", day: "Lunes", temp: { max: 28, min: 16 }, condition: "parcialmente nublado", icon: "fa-cloud-sun", precipitation: 2, humidity: 62, wind: 9, pressure: 1012, uv: 6 }
            ]
        };

        // ==============================================
        // Mapa Interactivo (MANTENIDO IGUAL)
        // ==============================================
        let map;
        let currentLayer = 'temperature';
        let markers = [];
        let userLocationMarker = null;
        let distanceMeasure = null;
        let customMarkers = [];

        // ==============================================
        // MODIFICACIÓN 3: FUNCIÓN DE UBICACIÓN ÚNICA
        // ==============================================
        function detectLocationUniversal() {
            if (ubicacionGlobal && regionGlobal) {
                // Si ya tenemos ubicación, usar los datos existentes
                actualizarTodasLasSecciones();
                showNotification('Usando ubicación previamente detectada');
                return;
            }
            
            if (navigator.geolocation) {
                showNotification('Detectando tu ubicación...');
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        
                        // Guardar ubicación globalmente
                        ubicacionGlobal = { lat, lon };
                        
                        // Determinar región basada en latitud
                        if (lat > 24) {
                            regionGlobal = "norte";
                        } else if (lat > 19) {
                            regionGlobal = "centro";
                        } else {
                            regionGlobal = "sur";
                        }
                        
                        // Actualizar todas las secciones
                        actualizarTodasLasSecciones();
                        
                        // Actualizar mapa
                        updateMapWithUserLocation(lat, lon, regionGlobal);
                        
                        showNotification(`Ubicación detectada: ${regionData[regionGlobal].name}`);
                    },
                    function(error) {
                        // Usar datos del centro por defecto
                        regionGlobal = "centro";
                        ubicacionGlobal = { lat: 19.4326, lon: -99.1332 };
                        actualizarTodasLasSecciones();
                        showNotification('Mostrando datos del centro de México por defecto.', 'error');
                    }
                );
            } else {
                // Si no hay geolocalización
                regionGlobal = "centro";
                ubicacionGlobal = { lat: 19.4326, lon: -99.1332 };
                actualizarTodasLasSecciones();
                showNotification('Mostrando datos del centro de México.', 'error');
            }
        }

        // ==============================================
        // FUNCIÓN PARA ACTUALIZAR TODAS LAS SECCIONES
        // ==============================================
        function actualizarTodasLasSecciones() {
            if (!regionGlobal) return;
            
            const data = regionData[regionGlobal];
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            
            // Actualizar cada sección
            updateSectionData('general', data, regionGlobal);
            updateSectionData('agriculture', data, regionGlobal);
            updateSectionData('construction', data, regionGlobal);
            updateSectionData('transport', data, regionGlobal);
            updateSectionData('emergency', data, regionGlobal);
        }

        // ==============================================
        // FUNCIÓN ORIGINAL PARA ACTUALIZAR SECCIONES (MANTENIDA)
        // ==============================================
        function updateSectionData(section, data, region) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            
            switch(section) {
                case 'agriculture':
                    document.getElementById('agricultureLocationText').textContent = `Datos agrícolas para: ${data.name}`;
                    
                    const agricultureSection = document.getElementById('agricultura');
                    agricultureSection.querySelector('#currentConditions').innerHTML = `
                        <p><strong>Condiciones Actuales:</strong> ${data.agriculture.conditions}</p>
                        <p><strong>Temperatura:</strong> ${data.temperature} | <strong>Humedad:</strong> ${data.humidity}</p>
                        <p><strong>Precipitación:</strong> ${data.precipitation} | <strong>Viento:</strong> ${data.wind}</p>
                    `;
                    
                    agricultureSection.querySelector('#agricultureCalendar').innerHTML = `
                        <p><strong>Calendario Agrícola:</strong> ${data.agriculture.calendar}</p>
                    `;
                    
                    agricultureSection.querySelector('#irrigationRecommendations').innerHTML = `
                        <p><strong>Recomendaciones de Riego:</strong> ${data.agriculture.irrigation}</p>
                    `;
                    
                    const agricultureCards = agricultureSection.querySelectorAll('.data-card');
                    agricultureCards[0].querySelector('.data-value').textContent = data.agriculture.risk;
                    agricultureCards[1].querySelector('.data-value').textContent = data.agriculture.soilMoisture;
                    agricultureCards[2].querySelector('.data-value').textContent = data.agriculture.forecast;
                    
                    const riskMeter = agricultureSection.querySelector('.risk-level');
                    riskMeter.className = 'risk-level';
                    riskMeter.classList.add(`risk-${data.agriculture.riskLevel}`);
                    
                    document.getElementById('agricultureUpdateTime').textContent = `Hoy, ${timeString}`;
                    break;
                    
                case 'construction':
                    document.getElementById('constructionLocationText').textContent = `Condiciones para obra en: ${data.name}`;
                    
                    const constructionSection = document.getElementById('construccion');
                    constructionSection.querySelector('#constructionConditions').innerHTML = `
                        <p><strong>Condiciones para Obra:</strong> ${data.construction.conditions}</p>
                    `;
                    
                    constructionSection.querySelector('#rainPrevention').innerHTML = `
                        <p><strong>Prevención por Lluvias:</strong> ${data.construction.rainPrevention}</p>
                    `;
                    
                    constructionSection.querySelector('#windMeasures').innerHTML = `
                        <p><strong>Medidas por Vientos:</strong> ${data.construction.windMeasures}</p>
                    `;
                    
                    const constructionCards = constructionSection.querySelectorAll('.data-card');
                    constructionCards[0].querySelector('.data-value').textContent = data.construction.workDays;
                    constructionCards[1].querySelector('.data-value').textContent = data.construction.riskWorks;
                    constructionCards[2].querySelector('.data-value').textContent = data.construction.activeProtocols;
                    
                    document.getElementById('constructionUpdateTime').textContent = `Hoy, ${timeString}`;
                    break;
                    
                case 'transport':
                    document.getElementById('transportLocationText').textContent = `Condiciones de transporte en: ${data.name}`;
                    
                    const transportSection = document.getElementById('transporte');
                    transportSection.querySelector('#highwaysInfo').innerHTML = `
                        <p><strong>Carreteras y Autopistas:</strong> ${data.transport.highways}</p>
                    `;
                    
                    transportSection.querySelector('#airTransportInfo').innerHTML = `
                        <p><strong>Transporte Aéreo:</strong> ${data.transport.airTransport}</p>
                    `;
                    
                    transportSection.querySelector('#maritimeTransportInfo').innerHTML = `
                        <p><strong>Transporte Marítimo:</strong> ${data.transport.maritimeTransport}</p>
                    `;
                    
                    const transportCards = transportSection.querySelectorAll('.data-card');
                    transportCards[0].querySelector('.data-value').textContent = data.transport.affectedRoads;
                    transportCards[1].querySelector('.data-value').textContent = data.transport.delayedFlights;
                    transportCards[2].querySelector('.data-value').textContent = data.transport.alertPorts;
                    
                    document.getElementById('transportUpdateTime').textContent = `Hoy, ${timeString}`;
                    break;
                    
                case 'emergency':
                    document.getElementById('emergencyLocationText').textContent = `Servicios de emergencia en: ${data.name}`;
                    
                    document.getElementById('localCivilProtection').textContent = `Local: ${data.emergency.civilProtection}`;
                    document.getElementById('localRedCross').textContent = `Local: ${data.emergency.redCross}`;
                    document.getElementById('localFirefighters').textContent = `Local: ${data.emergency.firefighters}`;
                    document.getElementById('localConagua').textContent = `Contacto regional: ${data.emergency.conagua}`;
                    break;
                    
                case 'general':
                    document.getElementById('locationText').textContent = `Ubicación detectada: ${data.name}`;
                    
                    const realTimeCards = document.querySelectorAll('#realTimeMonitoring .data-card');
                    if (realTimeCards.length >= 4) {
                        realTimeCards[0].querySelector('.data-value').textContent = data.temperature;
                        realTimeCards[1].querySelector('.data-value').textContent = data.humidity;
                        realTimeCards[2].querySelector('.data-value').textContent = data.wind;
                        realTimeCards[3].querySelector('.data-value').textContent = data.precipitation;
                    }
                    break;
            }
        }

        // ==============================================
        // FUNCIÓN ORIGINAL PARA CONFIGURAR BOTONES (MODIFICADA)
        // ==============================================
        function setupLocationButtons() {
            // Todos los botones llaman a la MISMA función
            document.querySelectorAll('.location-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    detectLocationUniversal();
                });
            });
        }

        // ==============================================
        // FUNCIÓN ORIGINAL PARA ACTUALIZAR MONITOREO EN TIEMPO REAL (MODIFICADA)
        // ==============================================
        function updateRealTimeMonitoring() {
            const container = document.getElementById('realTimeMonitoring');
            if (!container) return;
            
            container.innerHTML = '';
            
            // Seleccionar 4 estaciones aleatorias
            const estacionesAleatorias = [...weatherStations]
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            
            estacionesAleatorias.forEach(station => {
                const card = document.createElement('div');
                card.className = 'sensor-card';
                
                const statusClass = station.status === 'online' ? 'status-online' : 'status-offline';
                
                let valueHtml = '';
                if (station.type === 'temperature') {
                    valueHtml = `
                        <div class="sensor-value">${station.value}°C</div>
                        <p><i class="fas fa-tint"></i> ${station.humidity}% | <i class="fas fa-wind"></i> ${station.wind} km/h</p>
                    `;
                } else if (station.type === 'water') {
                    valueHtml = `
                        <div class="sensor-value">${station.value}%</div>
                        <p>Nivel: ${station.level} msnm | Caudal: ${station.flow} m³/s</p>
                    `;
                }
                
                card.innerHTML = `
                    <div class="sensor-status ${statusClass}"></div>
                    <h4><i class="fas fa-${getStationIcon(station.type)}"></i> ${station.name}</h4>
                    <p style="color: var(--neon-blue); margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt"></i> ${station.location}</p>
                    ${valueHtml}
                    <small><i class="fas fa-clock"></i> Actualizado hace ${station.updateTime}</small>
                `;
                
                container.appendChild(card);
            });
        }

        // ==============================================
        // NUEVA FUNCIÓN: ACTUALIZAR ESTACIONES AUTOMÁTICAMENTE
        // ==============================================
        function actualizarEstacionesAutomaticamente() {
            weatherStations.forEach(station => {
                if (station.status === 'online') {
                    // Variar valores ligeramente
                    if (station.type === 'temperature') {
                        const variacion = (Math.random() - 0.5) * 1.5;
                        station.value = Math.max(15, Math.min(40, parseFloat(station.value) + variacion)).toFixed(1);
                        
                        // Variar humedad
                        station.humidity += Math.floor(Math.random() * 5 - 2);
                        station.humidity = Math.max(20, Math.min(90, station.humidity));
                        
                        // Variar viento
                        station.wind += Math.floor(Math.random() * 3 - 1);
                        station.wind = Math.max(5, Math.min(25, station.wind));
                    }
                    
                    // Actualizar tiempo
                    const tiempos = ["30 segundos", "1 minuto", "2 minutos", "3 minutos", "5 minutos"];
                    station.updateTime = tiempos[Math.floor(Math.random() * tiempos.length)];
                }
            });
            
            updateRealTimeMonitoring();
        }

        // ==============================================
        // FUNCIONES DEL MAPA (MANTENIDAS ORIGINALES)
        // ==============================================
        function initMap() {
            map = L.map('climateMap').setView([23.6345, -102.5528], 5);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map);
            
            addWeatherStations();
            setupLayerControls();
            setupMapTools();
        }

        function addWeatherStations() {
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            
            estadosMexico.forEach(estado => {
                let marker;
                
                if (currentLayer === 'temperature') {
                    marker = L.marker([estado.lat, estado.lon], {
                        icon: L.divIcon({
                            className: 'weather-marker temperature-marker',
                            html: `${estado.temp}°`,
                            iconSize: [40, 40]
                        })
                    });
                } else if (currentLayer === 'precipitation') {
                    marker = L.marker([estado.lat, estado.lon], {
                        icon: L.divIcon({
                            className: 'weather-marker rain-marker',
                            html: `${estado.rain}mm`,
                            iconSize: [40, 40]
                        })
                    });
                } else if (currentLayer === 'warnings') {
                    if (estado.warning) {
                        marker = L.marker([estado.lat, estado.lon], {
                            icon: L.divIcon({
                                className: 'weather-marker warning-marker',
                                html: '<i class="fas fa-exclamation"></i>',
                                iconSize: [40, 40]
                            })
                        });
                    } else {
                        return;
                    }
                } else if (currentLayer === 'rural') {
                    zonasRurales.forEach(zona => {
                        const ruralMarker = L.marker([zona.lat, zona.lon], {
                            icon: L.divIcon({
                                className: 'weather-marker rural-marker',
                                html: '<i class="fas fa-tractor"></i>',
                                iconSize: [40, 40]
                            })
                        }).addTo(map).bindPopup(`
                            <div style="color: #333;">
                                <h3 style="margin: 0 0 10px 0; color: var(--neon-blue);">${zona.nombre}</h3>
                                <p><strong>Estado:</strong> ${zona.estado}</p>
                                <p><strong>Tipo:</strong> ${zona.tipo}</p>
                                <p><strong>Condiciones:</strong> ${getRuralConditions(zona.tipo)}</p>
                            </div>
                        `);
                        markers.push(ruralMarker);
                    });
                    return;
                } else if (currentLayer === 'climate-change') {
                    let impactLevel = "Bajo";
                    let impactColor = "#27ae60";
                    
                    if (estado.climateChange === "Moderado") {
                        impactLevel = "Moderado";
                        impactColor = "#f39c12";
                    } else if (estado.climateChange === "Alto") {
                        impactLevel = "Alto";
                        impactColor = "#e74c3c";
                    }
                    
                    marker = L.marker([estado.lat, estado.lon], {
                        icon: L.divIcon({
                            className: 'weather-marker climate-change-marker',
                            html: `<div style="background: ${impactColor}; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${impactLevel.charAt(0)}</div>`,
                            iconSize: [40, 40]
                        })
                    });
                }
                
                if (marker) {
                    let popupContent = `
                        <div style="color: #333;">
                            <h3 style="margin: 0 0 10px 0; color: var(--neon-blue);">${estado.nombre}</h3>
                            <p><strong>Capital:</strong> ${estado.capital}</p>
                            <p><strong>Temperatura:</strong> ${estado.temp}°C</p>
                            <p><strong>Precipitación:</strong> ${estado.rain} mm</p>
                            <p><strong>Alerta:</strong> ${estado.warning ? 'ACTIVA' : 'No'}</p>
                    `;
                    
                    if (currentLayer === 'climate-change') {
                        popupContent += `
                            <p><strong>Impacto Cambio Climático:</strong> ${estado.climateChange}</p>
                            <p><strong>Cambio Temperatura:</strong> ${estado.tempChange}</p>
                            <p><strong>Cambio Precipitación:</strong> ${estado.precipitationChange}</p>
                        `;
                    }
                    
                    popupContent += `</div>`;
                    
                    marker.addTo(map).bindPopup(popupContent);
                    markers.push(marker);
                }
            });
        }

        function getRuralConditions(tipo) {
            const conditions = {
                "Viñedos": "Condiciones óptimas para cultivo",
                "Agricultura": "Necesita irrigación adicional",
                "Selva": "Alta humedad, riesgo de inundaciones",
                "Montaña": "Temperaturas bajas, riesgo de heladas"
            };
            return conditions[tipo] || "Condiciones estables";
        }

        function setupLayerControls() {
            document.querySelectorAll('.map-layer-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.map-layer-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    currentLayer = this.getAttribute('data-layer');
                    addWeatherStations();
                    
                    showNotification(`Capa activada: ${this.textContent.trim()}`);
                });
            });
        }

        function setupMapTools() {
            document.getElementById('locateMe').addEventListener('click', function() {
                if (ubicacionGlobal) {
                    updateMapWithUserLocation(ubicacionGlobal.lat, ubicacionGlobal.lon, regionGlobal);
                    showNotification('Mapa centrado en tu ubicación');
                } else {
                    showNotification('Primero detecta tu ubicación', 'error');
                }
            });

            document.getElementById('measureDistance').addEventListener('click', function() {
                showNotification('La medición de distancia requiere un plugin adicional. Función en desarrollo.');
            });

            document.getElementById('addMarker').addEventListener('click', function() {
                const markerCount = customMarkers.length + 1;
                const marker = L.marker(map.getCenter(), {
                    icon: L.divIcon({
                        className: 'weather-marker',
                        html: `<i class="fas fa-map-pin" style="color: white;"></i>`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 40]
                    })
                }).addTo(map).bindPopup(`
                    <div style="color: #333;">
                        <h3 style="margin: 0 0 10px 0; color: var(--neon-blue);">Marcador ${markerCount}</h3>
                        <p><strong>Latitud:</strong> ${map.getCenter().lat.toFixed(4)}</p>
                        <p><strong>Longitud:</strong> ${map.getCenter().lng.toFixed(4)}</p>
                        <button class="execute-btn" onclick="removeCustomMarker(${markerCount-1})" style="width: auto; margin-top: 0.5rem;">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                `).openPopup();
                
                customMarkers.push(marker);
                showNotification(`Marcador personalizado ${markerCount} agregado`);
            });

            document.getElementById('clearMarkers').addEventListener('click', function() {
                customMarkers.forEach(marker => {
                    map.removeLayer(marker);
                });
                customMarkers = [];
                showNotification('Todos los marcadores personalizados eliminados');
            });
        }

        function removeCustomMarker(index) {
            if (customMarkers[index]) {
                map.removeLayer(customMarkers[index]);
                customMarkers.splice(index, 1);
                showNotification('Marcador eliminado');
            }
        }

        function updateMapWithUserLocation(lat, lon, region) {
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }
            
            userLocationMarker = L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'weather-marker',
                    html: '<i class="fas fa-user" style="color: white;"></i>',
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                })
            }).addTo(map).bindPopup(`
                <div style="color: #333;">
                    <h3 style="margin: 0 0 10px 0; color: var(--neon-blue);">Tu Ubicación</h3>
                    <p><strong>Región:</strong> ${regionData[region].name}</p>
                    <p><strong>Latitud:</strong> ${lat.toFixed(4)}</p>
                    <p><strong>Longitud:</strong> ${lon.toFixed(4)}</p>
                </div>
            `).openPopup();
            
            map.setView([lat, lon], 8);
            
            document.getElementById('locationInfo').innerHTML = `
                <p><strong>Región:</strong> ${regionData[region].name}</p>
                <p>Lat: ${lat.toFixed(4)}</p>
                <p>Lon: ${lon.toFixed(4)}</p>
            `;
        }

        // ==============================================
        // FUNCIONES ORIGINALES (MANTENIDAS)
        // ==============================================
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `<p>${message}</p>`;
            document.getElementById('notificationCenter').appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 4000);
        }

        function getStationIcon(type) {
            const icons = {
                'temperature': 'temperature-high',
                'water': 'water',
                'wind': 'wind',
                'volcano': 'mountain'
            };
            return icons[type] || 'thermometer';
        }

        function updateClimateAlerts() {
            const container = document.getElementById('alertsContainer');
            container.innerHTML = '';
            
            climateAlerts.forEach(alert => {
                const alertItem = document.createElement('div');
                alertItem.className = `alert-item alert-${alert.severity}`;
                
                const severityText = getSeverityText(alert.severity);
                const icon = getAlertIcon(alert.type);
                
                alertItem.innerHTML = `
                    <div class="alert-header">
                        <div class="alert-title">
                            <i class="fas ${icon}"></i>
                            <h4>${alert.title}</h4>
                            <span class="alert-level level-${alert.severity}">${severityText}</span>
                        </div>
                        <div class="alert-region">${alert.region}</div>
                    </div>
                    <p>${alert.description}</p>
                    <div class="alert-details">
                        <div class="alert-detail">
                            <i class="fas fa-clock"></i>
                            <span>Vigencia: ${formatDate(alert.startTime)} - ${formatDate(alert.endTime)}</span>
                        </div>
                        <div class="alert-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Áreas afectadas: ${alert.affectedAreas.join(', ')}</span>
                        </div>
                        ${alert.temperature ? `<div class="alert-detail">
                            <i class="fas fa-temperature-high"></i>
                            <span>Temperatura: ${alert.temperature}</span>
                        </div>` : ''}
                        ${alert.precipitation ? `<div class="alert-detail">
                            <i class="fas fa-cloud-rain"></i>
                            <span>Precipitación: ${alert.precipitation}</span>
                        </div>` : ''}
                        ${alert.wind ? `<div class="alert-detail">
                            <i class="fas fa-wind"></i>
                            <span>Viento: ${alert.wind}</span>
                        </div>` : ''}
                    </div>
                    <div style="margin-top: 1rem;">
                        <h5>Recomendaciones:</h5>
                        <ul class="recommendation-list">
                            ${alert.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="alert-time">Actualizado: ${new Date().toLocaleTimeString('es-MX')}</div>
                `;
                
                container.appendChild(alertItem);
            });
        }

        function getSeverityText(severity) {
            const texts = {
                'high': 'ALTA',
                'medium': 'MEDIA',
                'low': 'BAJA'
            };
            return texts[severity] || 'DESCONOCIDA';
        }

        function getAlertIcon(type) {
            const icons = {
                'heat': 'temperature-high',
                'rain': 'cloud-rain',
                'wind': 'wind',
                'cold': 'temperature-low'
            };
            return icons[type] || 'exclamation-triangle';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function updateForecast(period = 'current') {
            const container = document.getElementById('forecastContainer');
            container.innerHTML = '';
            
            const forecast = forecastData[period];
            
            forecast.forEach(day => {
                const forecastDay = document.createElement('div');
                forecastDay.className = 'forecast-day';
                forecastDay.setAttribute('data-date', day.date);
                
                let iconColor = 'gold';
                if (day.condition.includes('lluvia')) iconColor = 'lightblue';
                if (day.condition.includes('nublado')) iconColor = 'lightgray';
                
                forecastDay.innerHTML = `
                    <h4>${period === 'current' && day.date === getTodayDate() ? 'Hoy' : day.day}</h4>
                    <i class="fas ${day.icon}" style="color: ${iconColor}; font-size: 2rem;"></i>
                    <div class="temp">${day.temp.max}°C</div>
                    <div>${day.condition}</div>
                    <div style="font-size: 0.9rem; margin-top: 5px;">Mín: ${day.temp.min}°C</div>
                    <div class="risk-meter">
                        <div class="risk-level ${getRiskLevel(day.precipitation)}"></div>
                    </div>
                `;
                
                forecastDay.addEventListener('click', () => showDayDetails(day));
                container.appendChild(forecastDay);
            });
            
            if (forecast.length > 0) {
                showDayDetails(forecast[0]);
            }
        }

        function getTodayDate() {
            const today = new Date();
            return today.toISOString().split('T')[0];
        }

        function getRiskLevel(precipitation) {
            if (precipitation < 5) return 'risk-low';
            if (precipitation < 20) return 'risk-medium';
            return 'risk-high';
        }

        function showDayDetails(day) {
            document.getElementById('selectedDay').textContent = day.day;
            
            const detailsContainer = document.getElementById('dayDetails');
            detailsContainer.innerHTML = '';
            
            const details = [
                { label: 'Temperatura Máxima', value: `${day.temp.max}°C`, icon: 'temperature-high' },
                { label: 'Temperatura Mínima', value: `${day.temp.min}°C`, icon: 'temperature-low' },
                { label: 'Condición', value: day.condition, icon: 'cloud' },
                { label: 'Precipitación', value: `${day.precipitation} mm`, icon: 'cloud-rain' },
                { label: 'Humedad', value: `${day.humidity}%`, icon: 'tint' },
                { label: 'Viento', value: `${day.wind} km/h`, icon: 'wind' },
                { label: 'Presión Atmosférica', value: `${day.pressure} hPa`, icon: 'tachometer-alt' },
                { label: 'Índice UV', value: day.uv, icon: 'sun' }
            ];
            
            details.forEach(detail => {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                detailItem.innerHTML = `
                    <div class="detail-label">
                        <i class="fas fa-${detail.icon}"></i>
                        ${detail.label}
                    </div>
                    <div class="detail-value">${detail.value}</div>
                `;
                detailsContainer.appendChild(detailItem);
            });
            
            updateHourlyForecast(day);
        }

        function updateHourlyForecast(day) {
            const container = document.getElementById('hourlyForecast');
            container.innerHTML = '';
            
            for (let i = 6; i <= 22; i += 2) {
                const hourItem = document.createElement('div');
                hourItem.className = 'hour-item';
                
                let temp = day.temp.min + (day.temp.max - day.temp.min) * 
                          (0.3 + 0.4 * Math.sin((i - 6) * Math.PI / 16));
                temp = Math.round(temp);
                
                hourItem.innerHTML = `
                    <div>${i}:00</div>
                    <i class="fas ${day.icon}" style="color: gold; font-size: 1.5rem; margin: 5px 0;"></i>
                    <div>${temp}°C</div>
                `;
                
                container.appendChild(hourItem);
            }
        }

        document.getElementById('analyzeData').addEventListener('click', function() {
            const button = this;
            const results = document.getElementById('simulationResults');
            const resultsContent = document.getElementById('iaResultsContent');
            
            const region = document.getElementById('region').value;
            const temperature = document.getElementById('temperature').value;
            const humidity = document.getElementById('humidity').value;
            const precipitation = document.getElementById('precipitation').value;
            const wind = document.getElementById('wind').value;
            const cropType = document.getElementById('cropType').value;
            const soilType = document.getElementById('soilType').value;
            const observations = document.getElementById('observations').value;
            
            if (!region) {
                showNotification('Por favor seleccione una región para el análisis', 'error');
                return;
            }
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando con IA...';
            button.disabled = true;
            
            setTimeout(() => {
                let analysisResult = `
                    <h4>Análisis Agrícola IA para la región: ${getRegionName(region)}</h4>
                    <div class="data-grid" style="margin-top: 1rem;">
                        <div class="data-card">
                            <h4><i class="fas fa-temperature-high"></i> Temperatura</h4>
                            <div class="data-value">${temperature || 'N/A'}°C</div>
                            <div>${getTemperatureAnalysis(temperature)}</div>
                        </div>
                        <div class="data-card">
                            <h4><i class="fas fa-tint"></i> Humedad</h4>
                            <div class="data-value">${humidity || 'N/A'}%</div>
                            <div>${getHumidityAnalysis(humidity)}</div>
                        </div>
                        <div class="data-card">
                            <h4><i class="fas fa-cloud-rain"></i> Precipitación</h4>
                            <div class="data-value">${precipitation || 'N/A'}mm</div>
                            <div>${getPrecipitationAnalysis(precipitation)}</div>
                        </div>
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <h4>Recomendaciones Agrícolas Específicas:</h4>
                        <p>${generateAgriculturalRecommendations(region, temperature, humidity, precipitation, wind, cropType, soilType, observations)}</p>
                    </div>
                    <div class="alert-banner" style="margin-top: 1rem;">
                        <i class="fas fa-robot"></i>
                        <div>
                            <strong>Análisis generado por IA MÉX-IA Agrícola</strong>
                            <p>Este análisis se basa en los datos proporcionados y modelos predictivos agrícolas.</p>
                        </div>
                    </div>
                `;
                
                resultsContent.innerHTML = analysisResult;
                results.classList.add('active');
                button.innerHTML = '<i class="fas fa-sync-alt"></i> Realizar Nuevo Análisis';
                button.disabled = false;
                
                showNotification('Análisis Agrícola IA completado. Resultados disponibles.');
            }, 3000);
        });

        function getRegionName(region) {
            const regions = {
                'norte': 'Norte de México',
                'centro': 'Centro de México',
                'sur': 'Sur de México',
                'peninsula': 'Península de Yucatán',
                'golfo': 'Golfo de México',
                'pacifico': 'Pacífico Mexicano'
            };
            return regions[region] || 'Región desconocida';
        }

        function getTemperatureAnalysis(temp) {
            if (!temp) return 'Sin datos';
            const t = parseFloat(temp);
            if (t < 10) return 'Muy frío - Riesgo de heladas';
            if (t < 20) return 'Frío - Adecuado para cultivos de clima templado';
            if (t < 30) return 'Templado - Óptimo para la mayoría de cultivos';
            if (t < 35) return 'Cálido - Adecuado para cultivos tropicales';
            return 'Muy cálido - Riesgo de estrés térmico';
        }

        function getHumidityAnalysis(humidity) {
            if (!humidity) return 'Sin datos';
            const h = parseFloat(humidity);
            if (h < 30) return 'Muy seco - Necesita riego adicional';
            if (h < 50) return 'Seco - Adecuado para cultivos resistentes';
            if (h < 70) return 'Moderado - Condiciones óptimas';
            return 'Húmedo - Riesgo de enfermedades fúngicas';
        }

        function getPrecipitationAnalysis(precipitation) {
            if (!precipitation) return 'Sin datos';
            const p = parseFloat(precipitation);
            if (p < 5) return 'Baja - Requiere riego complementario';
            if (p < 20) return 'Moderada - Adecuada para la mayoría de cultivos';
            if (p < 50) return 'Alta - Riesgo de encharcamiento';
            return 'Muy alta - Riesgo de inundación';
        }

        function generateAgriculturalRecommendations(region, temp, humidity, precipitation, wind, cropType, soilType, observations) {
            let recommendations = [];
            
            if (temp && parseFloat(temp) > 35) {
                recommendations.push("Implementar sistemas de sombreado para cultivos sensibles al calor.");
                recommendations.push("Aumentar la frecuencia de riego para compensar la mayor evapotranspiración.");
            }
            
            if (temp && parseFloat(temp) < 10) {
                recommendations.push("Protección contra heladas necesaria para cultivos y ganado.");
                recommendations.push("Considerar el uso de cubiertas plásticas para cultivos sensibles.");
            }
            
            if (humidity && parseFloat(humidity) > 80) {
                recommendations.push("Alta humedad puede favorecer desarrollo de hongos en cultivos.");
                recommendations.push("Aplicar fungicidas preventivos en cultivos susceptibles.");
            }
            
            if (humidity && parseFloat(humidity) < 30) {
                recommendations.push("Condiciones secas, incrementar medidas de prevención de incendios.");
                recommendations.push("Implementar sistemas de riego por goteo para optimizar uso de agua.");
            }
            
            if (precipitation && parseFloat(precipitation) > 30) {
                recommendations.push("Precipitaciones intensas esperadas, tomar medidas contra encharcamientos.");
                recommendations.push("Asegurar buen drenaje en campos de cultivo.");
            }
            
            if (precipitation && parseFloat(precipitation) < 5) {
                recommendations.push("Sequía moderada, optimizar uso de recursos hídricos.");
                recommendations.push("Considerar cultivos resistentes a sequía.");
            }
            
            if (cropType) {
                recommendations.push(`Para cultivo de ${getCropName(cropType)}, ${getCropSpecificRecommendations(cropType)}`);
            }
            
            if (soilType) {
                recommendations.push(`Para suelo ${getSoilName(soilType)}, ${getSoilSpecificRecommendations(soilType)}`);
            }
            
            if (region === 'norte') {
                recommendations.push("Vigilar condiciones de sequía en el norte del país.");
                recommendations.push("Implementar sistemas de riego eficientes debido a escasez hídrica.");
            }
            
            if (region === 'sur') {
                recommendations.push("Monitorear posibles lluvias intensas en el sur.");
                recommendations.push("Asegurar buen drenaje en campos agrícolas.");
            }
            
            if (region === 'golfo' || region === 'pacifico') {
                recommendations.push("Vigilar formación de sistemas tropicales en zonas costeras.");
                recommendations.push("Preparar medidas de protección para cultivos ante posibles huracanes.");
            }
            
            if (recommendations.length === 0) {
                recommendations.push("Condiciones climáticas dentro de parámetros normales para la región.");
                recommendations.push("Mantener prácticas agrícolas estándar según el calendario agrícola.");
            }
            
            return recommendations.join(' ');
        }

        function getCropName(cropType) {
            const crops = {
                'maiz': 'maíz',
                'frijol': 'frijol',
                'trigo': 'trigo',
                'cafe': 'café',
                'aguacate': 'aguacate',
                'tomate': 'tomate',
                'chile': 'chile',
                'otros': 'cultivos'
            };
            return crops[cropType] || 'cultivos';
        }

        function getCropSpecificRecommendations(cropType) {
            const recommendations = {
                'maiz': 'mantener humedad del suelo constante durante floración y llenado de grano.',
                'frijol': 'evitar encharcamientos que favorecen enfermedades de raíz.',
                'trigo': 'controlar malezas que compiten por nutrientes y agua.',
                'cafe': 'proporcionar sombra adecuada y mantener humedad del suelo.',
                'aguacate': 'asegurar buen drenaje y evitar estrés hídrico durante floración.',
                'tomate': 'implementar tutoreo y controlar humedad para prevenir enfermedades.',
                'chile': 'mantener riego constante y controlar plagas oportunamente.',
                'otros': 'seguir prácticas agrícolas estándar.'
            };
            return recommendations[cropType] || 'seguir prácticas agrícolas estándar.';
        }

        function getSoilName(soilType) {
            const soils = {
                'arcilloso': 'arcilloso',
                'arenoso': 'arenoso',
                'limoso': 'limoso',
                'franco': 'franco',
                'calcareo': 'cálcáreo'
            };
            return soils[soilType] || 'suelo';
        }

        function getSoilSpecificRecommendations(soilType) {
            const recommendations = {
                'arcilloso': 'mejorar drenaje con materia orgánica y evitar labranza en condiciones húmedas.',
                'arenoso': 'aumentar capacidad de retención de agua con materia orgánica y riego frecuente.',
                'limoso': 'manejar cuidadosamente para evitar compactación y mejorar estructura.',
                'franco': 'condiciones óptimas, mantener con rotación de cultivos y abonos verdes.',
                'calcareo': 'corregir pH si es necesario y asegurar disponibilidad de micronutrientes.'
            };
            return recommendations[soilType] || 'mantener prácticas de manejo adecuadas.';
        }

        function performSearch() {
            const query = document.getElementById('searchInput').value.trim().toLowerCase();
            if (query) {
                document.getElementById('searchResults').classList.add('active');
                
                const resultadosEstados = estadosMexico.filter(estado => 
                    estado.nombre.toLowerCase().includes(query) || 
                    estado.capital.toLowerCase().includes(query)
                );
                
                const resultadosRurales = zonasRurales.filter(zona => 
                    zona.nombre.toLowerCase().includes(query) || 
                    zona.estado.toLowerCase().includes(query)
                );
                
                if (resultadosEstados.length > 0 || resultadosRurales.length > 0) {
                    let html = `<h4>Se encontraron ${resultadosEstados.length + resultadosRurales.length} resultados para "${query}"</h4>`;
                    
                    if (resultadosEstados.length > 0) {
                        html += `<h5>Estados:</h5><div class="data-grid">`;
                        html += resultadosEstados.map(estado => `
                            <div class="data-card">
                                <h4>${estado.nombre}</h4>
                                <div class="data-value">${estado.temp}°C</div>
                                <div>${estado.rain} mm de lluvia</div>
                                <div>${estado.warning ? '<span style="color: red;">ALERTA ACTIVA</span>' : 'Sin alertas'}</div>
                                <button class="execute-btn" onclick="centerMapOnLocation(${estado.lat}, ${estado.lon})" style="width: auto; margin-top: 0.5rem;">
                                    <i class="fas fa-map-marker-alt"></i> Ver en mapa
                                </button>
                            </div>
                        `).join('');
                        html += `</div>`;
                    }
                    
                    if (resultadosRurales.length > 0) {
                        html += `<h5>Zonas Rurales:</h5><div class="data-grid">`;
                        html += resultadosRurales.map(zona => `
                            <div class="data-card">
                                <h4>${zona.nombre}</h4>
                                <div class="data-value">${zona.estado}</div>
                                <div>${zona.tipo}</div>
                                <button class="execute-btn" onclick="centerMapOnLocation(${zona.lat}, ${zona.lon})" style="width: auto; margin-top: 0.5rem;">
                                    <i class="fas fa-map-marker-alt"></i> Ver en mapa
                                </button>
                            </div>
                        `).join('');
                        html += `</div>`;
                    }
                    
                    document.getElementById('searchResultsContent').innerHTML = html;
                } else {
                    document.getElementById('searchResultsContent').innerHTML = `
                        <h4>No se encontraron resultados para "${query}"</h4>
                        <p>Intenta con otro término de búsqueda.</p>
                    `;
                }
                
                showNotification(`Búsqueda: "${query}" - ${resultadosEstados.length + resultadosRurales.length} resultados encontrados`);
            } else {
                document.getElementById('searchResults').classList.remove('active');
            }
        }

        function centerMapOnLocation(lat, lon) {
            map.setView([lat, lon], 10);
            showNotification(`Mapa centrado en la ubicación seleccionada`);
        }

        // ==============================================
        // INICIALIZACIÓN (CON LAS MODIFICACIONES)
        // ==============================================
        document.addEventListener('DOMContentLoaded', function() {
            initMap();
            showNotification('Sistema de monitoreo climático cargado correctamente');
            
            // Configurar botones de ubicación (AHORA TODOS LLAMAN A LA MISMA FUNCIÓN)
            setupLocationButtons();
            
            // Actualizar datos iniciales
            updateRealTimeMonitoring();
            updateClimateAlerts();
            updateForecast('current');
            
            // Configurar navegación del pronóstico
            document.querySelectorAll('.period-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    updateForecast(this.getAttribute('data-period'));
                });
            });
            
            // Configurar búsqueda
            document.getElementById('searchButton').addEventListener('click', performSearch);
            document.getElementById('searchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
            
            // Configurar análisis IA
            document.getElementById('analyzeData').addEventListener('click', function() {
                // ... (código original del análisis IA)
            });
            
            // Configurar navegación
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    const sectionId = this.getAttribute('data-section');
                    const targetSection = document.getElementById(sectionId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        showNotification(`Navegando a: ${this.textContent}`);
                    }
                });
            });
            
            // ==============================================
            // NUEVO: ACTUALIZACIONES AUTOMÁTICAS
            // ==============================================
            
            // Actualizar estaciones cada 30 segundos
            setInterval(actualizarEstacionesAutomaticamente, 30000);
            
            // Mostrar notificaciones automáticas
            setTimeout(() => {
                showNotification('Sistema listo. Haz clic en cualquier botón "Detectar Ubicación" para comenzar');
            }, 2000);
            
            // Notificaciones automáticas
            setTimeout(() => {
                showNotification('Nuevo reporte comunitario: Granizada en Veracruz');
            }, 3000);
            
            setTimeout(() => {
                showNotification('Alerta: Incremento de temperatura en noroeste del país');
            }, 8000);
            
            // Actualizaciones automáticas existentes
            setInterval(updateRealTimeMonitoring, 60000);
            setInterval(updateClimateAlerts, 120000);
            
            // Actualización inicial
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-MX', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            
            document.querySelectorAll('.last-update span').forEach(span => {
                span.textContent = `Hoy, ${timeString}`;
            });
        });
    </script>
</body>
</html>
