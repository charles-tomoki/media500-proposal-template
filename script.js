/**
 * MEDIA 500 — Propuesta Comercial (Editable)
 * Panel de edición + exportación standalone
 */

(function() {
    'use strict';

    document.body.classList.add('js-enabled');

    // ============================================
    // STATE
    // ============================================
    const state = {
        cliente: '',
        email: 'comercial@media500.com',
        tel: '+54 11 XXXX-XXXX',
        logo: null,
        fotoTrenes: null,
        fotoColectivos: null,
        fotoLed: null,
        showTrenes: true,
        showColectivos: true,
        showLed: true
    };

    // ============================================
    // TARIFARIO JULIO 2026
    // ============================================
    const TARIFARIO = {
        trenes: [
            { nombre: "Ploteo Parcial (7 coches Puertas y Ventanas)", exhibicion: 3600000, produccion: 8500000 },
            { nombre: "Ploteo Full (1 coche full)", exhibicion: 3120000, produccion: 2300000 },
            { nombre: "Ploteo Mixto (1 coche Full + 6 coches PyV)", exhibicion: 6360000, produccion: 10000000 },
            { nombre: "Ploteo Full Formación Completa (7 coches full)", exhibicion: 18000000, produccion: 16000000 },
            { nombre: "Cenefas Interiores (4 por coche de 2 x 0.30 mt)", exhibicion: 240000, produccion: 78000 },
            { nombre: "Cenefas Interiores (4 por coche de 1 x 0.15)", exhibicion: 180000, produccion: 55000 },
            { nombre: "Ploteo Parcial (3 coches Puertas y Ventanas)", exhibicion: 1680000, produccion: 3500000 },
            { nombre: "Ploteo Mixto (1 coche Full + 2 coches PyV)", exhibicion: 3840000, produccion: 4800000 },
            { nombre: "Ploteo Full (3 coches full)", exhibicion: 8400000, produccion: 5700000 }
        ],
        colectivos: [
            { nombre: "Luneta Premium CABA", exhibicion: 130000, produccion: 60000 },
            { nombre: "Luneta Standard GBA", exhibicion: 110000, produccion: 60000 },
            { nombre: "Diferencial", exhibicion: 3500000, produccion: 1400000 },
            { nombre: "Luneta Interior (Córdoba/Rosario/Mendoza/Santa Fe)", exhibicion: 140000, produccion: 70000 },
            { nombre: "Cenefas Interiores (4 por colectivo)", exhibicion: 110000, produccion: 50000 },
            { nombre: "Back Full", exhibicion: 300000, produccion: 150000 },
            { nombre: "Panorámico (ventanas + luneta)", exhibicion: 1800000, produccion: 980000 },
            { nombre: "Luneta LED", exhibicion: 450000, produccion: 0 },
            { nombre: "Tótems UBA", exhibicion: 380000, produccion: 0 }
        ]
    };

    function formatMoney(n) {
        return '$ ' + n.toLocaleString('es-AR');
    }

    // ============================================
    // FORMATO TABLES
    // ============================================
    function renderFormatoTables() {
        const tbodyTrenes = document.getElementById('tablaTrenes');
        const tbodyColectivos = document.getElementById('tablaColectivos');
        if (!tbodyTrenes || !tbodyColectivos) return;
        tbodyTrenes.innerHTML = TARIFARIO.trenes.map(f => `
            <tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>
        `).join('');
        tbodyColectivos.innerHTML = TARIFARIO.colectivos.map(f => `
            <tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>
        `).join('');
    }

    // ============================================
    // EDITOR
    // ============================================
    const els = {
        panel: document.getElementById('editorPanel'),
        btnClose: document.getElementById('btnCloseEditor'),
        btnOpen: document.getElementById('btnOpenEditor'),
        btnPreview: document.getElementById('btnPreview'),
        btnExport: document.getElementById('btnExport'),
        uploadLogo: document.getElementById('uploadLogo'),
        previewLogo: document.getElementById('previewLogo'),
        inputCliente: document.getElementById('inputCliente'),
        inputEmail: document.getElementById('inputEmail'),
        inputTel: document.getElementById('inputTel'),
        uploadTrenes: document.getElementById('uploadTrenes'),
        previewTrenes: document.getElementById('previewTrenes'),
        toggleTrenes: document.getElementById('toggleTrenes'),
        uploadColectivos: document.getElementById('uploadColectivos'),
        previewColectivos: document.getElementById('previewColectivos'),
        toggleColectivos: document.getElementById('toggleColectivos'),
        uploadLed: document.getElementById('uploadLed'),
        previewLed: document.getElementById('previewLed'),
        toggleLed: document.getElementById('toggleLed'),
    };

    const view = {
        clientNameDisplay: document.getElementById('clientNameDisplay'),
        emailDisplay: document.getElementById('emailDisplay'),
        telDisplay: document.getElementById('telDisplay'),
        clientLogoNav: document.getElementById('clientLogoNav'),
        imgTrenes: document.getElementById('imgTrenes'),
        imgColectivos: document.getElementById('imgColectivos'),
        imgLed: document.getElementById('imgLed'),
        mockupSection: document.getElementById('mockups'),
        mockupGrid: document.getElementById('mockupGrid'),
        coberturaSection: document.getElementById('cobertura'),
        navMockups: document.getElementById('navMockups'),
    };

    // Read file as base64
    function readFile(file) {
        return new Promise((resolve) => {
            if (!file) { resolve(null); return; }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }

    function setPreview(container, src) {
        if (!container) return;
        if (src) {
            container.innerHTML = `<img src="${src}" alt="preview">`;
        } else {
            container.innerHTML = '<span>Sin imagen</span>';
        }
    }

    function updateView() {
        if (view.clientNameDisplay) view.clientNameDisplay.textContent = state.cliente || '[NOMBRE DEL CLIENTE]';
        if (view.emailDisplay) view.emailDisplay.textContent = state.email;
        if (view.telDisplay) view.telDisplay.textContent = state.tel;
        if (view.clientLogoNav) {
            if (state.logo) { view.clientLogoNav.src = state.logo; view.clientLogoNav.classList.remove('hidden'); }
            else { view.clientLogoNav.classList.add('hidden'); }
        }
        if (view.imgTrenes) view.imgTrenes.src = state.fotoTrenes || '';
        if (view.imgColectivos) view.imgColectivos.src = state.fotoColectivos || '';
        if (view.imgLed) view.imgLed.src = state.fotoLed || '';

        // Mockups visibility
        const mockupItems = document.querySelectorAll('[data-mockup]');
        mockupItems.forEach(item => {
            const type = item.dataset.mockup;
            let show = false;
            if (type === 'trenes') show = state.showTrenes && state.fotoTrenes;
            if (type === 'colectivos') show = state.showColectivos && state.fotoColectivos;
            item.classList.toggle('hidden', !show);
        });

        const anyMockups = state.showTrenes && state.fotoTrenes || state.showColectivos && state.fotoColectivos;
        if (view.mockupSection) view.mockupSection.classList.toggle('hidden', !anyMockups);
        if (view.navMockups) view.navMockups.classList.toggle('hidden', !anyMockups);

        // Cobertura LED
        const showLedSection = state.showLed && state.fotoLed;
        if (view.coberturaSection) view.coberturaSection.classList.toggle('hidden', !showLedSection);
    }

    // Logo
    els.uploadLogo.addEventListener('change', async (e) => {
        state.logo = await readFile(e.target.files[0]);
        setPreview(els.previewLogo, state.logo);
        updateView();
    });

    // Trenes
    els.uploadTrenes.addEventListener('change', async (e) => {
        state.fotoTrenes = await readFile(e.target.files[0]);
        setPreview(els.previewTrenes, state.fotoTrenes);
        updateView();
    });
    els.toggleTrenes.addEventListener('change', (e) => { state.showTrenes = e.target.checked; updateView(); });

    // Colectivos
    els.uploadColectivos.addEventListener('change', async (e) => {
        state.fotoColectivos = await readFile(e.target.files[0]);
        setPreview(els.previewColectivos, state.fotoColectivos);
        updateView();
    });
    els.toggleColectivos.addEventListener('change', (e) => { state.showColectivos = e.target.checked; updateView(); });

    // LED
    els.uploadLed.addEventListener('change', async (e) => {
        state.fotoLed = await readFile(e.target.files[0]);
        setPreview(els.previewLed, state.fotoLed);
        updateView();
    });
    els.toggleLed.addEventListener('change', (e) => { state.showLed = e.target.checked; updateView(); });

    // Text inputs
    els.inputCliente.addEventListener('input', (e) => { state.cliente = e.target.value; updateView(); });
    els.inputEmail.addEventListener('input', (e) => { state.email = e.target.value; updateView(); });
    els.inputTel.addEventListener('input', (e) => { state.tel = e.target.value; updateView(); });

    // Panel toggle
    els.btnClose.addEventListener('click', () => { document.body.classList.add('editor-closed'); });
    els.btnOpen.addEventListener('click', () => { document.body.classList.remove('editor-closed'); });

    // Preview
    els.btnPreview.addEventListener('click', () => {
        document.body.classList.add('editor-closed');
    });

    // ============================================
    // EXPORT STANDALONE HTML
    // ============================================
    els.btnExport.addEventListener('click', async () => {
        const html = buildStandaloneHTML();
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `propuesta_${(state.cliente || 'media500').replace(/\s+/g, '_').toLowerCase()}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
    });

    function buildStandaloneHTML() {
        const clientName = state.cliente || '[NOMBRE DEL CLIENTE]';
        const logoHTML = state.logo ? `<img id="clientLogoNav" class="client-logo-nav" src="${state.logo}" alt="Logo">` : '';

        // Mockup items HTML (only visible ones)
        let mockupsHTML = '';
        if (state.showTrenes && state.fotoTrenes) {
            mockupsHTML += `
            <div class="mockup-item">
                <div class="mockup-image"><img src="${state.fotoTrenes}" alt="Trenes"><div class="mockup-overlay"><span class="mockup-tag">Trenes</span></div></div>
                <p class="mockup-caption">Impacto visual en formaciones de trenes</p>
            </div>`;
        }
        if (state.showColectivos && state.fotoColectivos) {
            mockupsHTML += `
            <div class="mockup-item">
                <div class="mockup-image"><img src="${state.fotoColectivos}" alt="Colectivos"><div class="mockup-overlay"><span class="mockup-tag">Colectivos</span></div></div>
                <p class="mockup-caption">Presencia en lunetas y laterales de colectivos</p>
            </div>`;
        }

        const mockupsSectionHTML = mockupsHTML ? `
        <section id="mockups" class="mockup-section">
            <div class="section-wrapper">
                <div class="mockup-header"><span class="section-number">03</span><h2 class="section-title">Así se vería tu campaña</h2><p class="section-subtitle">Mockups de referencia para visualizar el impacto</p></div>
                <div class="mockup-grid">${mockupsHTML}</div>
            </div>
        </section>` : '';

        const ledSectionHTML = (state.showLed && state.fotoLed) ? `
        <section id="cobertura" class="cobertura-section">
            <div class="section-wrapper">
                <div class="section-header"><span class="section-number">04</span><h2 class="section-title">Cobertura Líneas LED</h2><p class="section-subtitle">Visualización de la red de pantallas digitales</p></div>
                <div class="cobertura-image"><img src="${state.fotoLed}" alt="Cobertura LED"></div>
            </div>
        </section>` : '';

        // Tabla trenes
        const trenesRows = TARIFARIO.trenes.map(f =>
            `<tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>`
        ).join('');

        // Tabla colectivos
        const colectivosRows = TARIFARIO.colectivos.map(f =>
            `<tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>`
        ).join('');

        const datosNum = ledSectionHTML ? '05' : (mockupsSectionHTML ? '04' : '03');

        return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Media 500 — Propuesta para ${clientName}</title>
<style>
${getEmbeddedCSS()}
</style>
</head>
<body>
<nav class="navbar">
    <div class="nav-brand">
        <div class="brand-text"><span class="brand-media">MEDIA</span><span class="brand-500">500</span></div>
        ${logoHTML}
    </div>
</nav>

<section id="inicio" class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
        <div>
            <div class="hero-badge"><span class="badge-dot"></span><span>Propuesta Comercial</span></div>
            <h1 class="hero-title"><span class="title-line">Tu marca en el</span><span class="title-line highlight">camino de millones</span></h1>
            <p class="hero-subtitle">Publicidad OOH en trenes y colectivos de Buenos Aires. Alcance masivo, visibilidad constante, impacto medible.</p>
            <div class="hero-client"><span class="client-label">Propuesta preparada para:</span><span class="client-name">${clientName}</span></div>
            <div class="hero-actions"><a href="#formatos" class="btn btn-primary"><span>Ver formatos</span> →</a></div>
        </div>
        <div class="hero-visual">
            <div class="stats-card"><div class="sc-number">530.000</div><div class="sc-label">pasajeros/día en trenes</div></div>
            <div class="stats-card"><div class="sc-number">80</div><div class="sc-label">líneas de colectivos</div></div>
            <div class="stats-card"><div class="sc-number">2</div><div class="sc-label">líneas de trenes</div></div>
        </div>
    </div>
</section>

<section id="oportunidad" class="oportunidad">
    <div class="section-wrapper">
        <div class="section-header"><span class="section-number">01</span><h2 class="section-title">¿Por qué OOH en transporte público?</h2><p class="section-subtitle">El medio que no se puede bloquear, saltear ni silenciar</p></div>
        <div class="cards-grid">
            <div class="info-card"><div class="card-icon">◎</div><h3>Alcance Masivo</h3><p>Más de <strong>530.000 pasajeros diarios</strong> en trenes Belgrano Sur y Roca.</p></div>
            <div class="info-card"><div class="card-icon">◈</div><h3>Exposición Constante</h3><p>Presencia continua. El pasajero ve tu mensaje <strong>múltiples veces por semana</strong>.</p></div>
            <div class="info-card"><div class="card-icon">◎</div><h3>Alta Visibilidad</h3><p>Ubicaciones estratégicas en zonas de alto tránsito.</p></div>
            <div class="info-card"><div class="card-icon">☺</div><h3>Audiencia en Movimiento</h3><p>Pasajeros, peatones y conductores expuestos al mensaje.</p></div>
        </div>
    </div>
</section>

<section id="formatos" class="formatos">
    <div class="section-wrapper">
        <div class="section-header"><span class="section-number">02</span><h2 class="section-title">Formatos disponibles</h2><p class="section-subtitle">Desde una cenefa hasta una formación completa ploteada</p></div>
        <div class="formatos-content">
            <h3 style="text-align:center;margin-bottom:20px;font-family:var(--font-display);color:var(--navy);">🚆 Trenes</h3>
            <div class="formato-table-wrapper">
                <table class="formato-table"><thead><tr><th>Formato</th><th class="num">Exhibición mensual</th><th class="num">Producción</th></tr></thead><tbody>${trenesRows}</tbody></table>
            </div>
            <p class="formato-nota">* Precios no incluyen IVA. Los costos de producción pueden variar según especificaciones.</p>
            <br><br>
            <h3 style="text-align:center;margin-bottom:20px;font-family:var(--font-display);color:var(--navy);">🚌 Colectivos</h3>
            <div class="formato-table-wrapper">
                <table class="formato-table"><thead><tr><th>Formato</th><th class="num">Exhibición mensual</th><th class="num">Producción</th></tr></thead><tbody>${colectivosRows}</tbody></table>
            </div>
            <p class="formato-nota">* Precios no incluyen IVA. Los costos de producción pueden variar según especificaciones.</p>
        </div>
    </div>
</section>

${mockupsSectionHTML}
${ledSectionHTML}

<section id="datos" class="datos">
    <div class="section-wrapper">
        <div class="section-header"><span class="section-number">${datosNum}</span><h2 class="section-title">Datos que respaldan la inversión</h2><p class="section-subtitle">Números oficiales del Ministerio de Transporte</p></div>
        <div class="datos-grid">
            <div class="dato-card"><div class="dato-number">175.9M</div><div class="dato-label">pasajeros/año Línea Roca</div><div class="dato-context">~482.000 pasajeros por día. 75 estaciones. 198 km.</div></div>
            <div class="dato-card"><div class="dato-number">17.5M</div><div class="dato-label">pasajeros/año Línea Belgrano Sur</div><div class="dato-context">~47.900 pasajeros por día. Dwell time de 70-77 min.</div></div>
            <div class="dato-card"><div class="dato-number">6-9</div><div class="dato-label">horas pico mañana</div><div class="dato-context">Y 17-20 hs tarde. Frecuencia cada 8-15 min en pico.</div></div>
            <div class="dato-card"><div class="dato-number">40-77</div><div class="dato-label">minutos de exposición</div><div class="dato-context">Dwell time promedio por pasajero.</div></div>
        </div>
    </div>
</section>

<section id="contacto" class="contacto">
    <div class="section-wrapper">
        <div class="contacto-content">
            <h2 class="contacto-title">¿Listo para mover tu marca?</h2>
            <p class="contacto-subtitle">Contactanos y armamos una propuesta a medida</p>
            <div class="contacto-grid">
                <div class="contacto-item"><div class="contacto-icon">✉</div><span class="contacto-label">Email</span><span class="contacto-value">${state.email}</span></div>
                <div class="contacto-item"><div class="contacto-icon">☎</div><span class="contacto-label">Teléfono</span><span class="contacto-value">${state.tel}</span></div>
                <div class="contacto-item"><div class="contacto-icon">◎</div><span class="contacto-label">Oficina</span><span class="contacto-value">Buenos Aires, Argentina</span></div>
            </div>
        </div>
    </div>
</section>

<footer class="footer">
    <div class="footer-wrapper">
        <div class="footer-brand"><span class="footer-media">MEDIA</span><span class="footer-500">500</span></div>
        <p class="footer-tag">Publicidad OOH en Argentina</p>
        <p class="footer-legal">Las unidades ofrecidas están sujetas a disponibilidad. Los costos de producción pueden variar. No incluye IVA.</p>
        <p class="footer-copy">© 2026 Media 500 S.A.</p>
    </div>
</footer>
</body>
</html>`;
    }

    function getEmbeddedCSS() {
        // Minimal embedded CSS for standalone export
        return `:root{--blue:#008fd5;--blue-light:#e8f4fc;--blue-dark:#0069a8;--navy:#0a1628;--white:#fff;--gray-50:#f8fafc;--gray-100:#f1f5f9;--gray-200:#e2e8f0;--gray-300:#cbd5e1;--gray-400:#94a3b8;--gray-500:#64748b;--gray-600:#475569;--gray-700:#334155;--gray-800:#1e293b;--font-body:'Inter',sans-serif;--font-display:'Montserrat',sans-serif;--max-width:1200px;--section-padding:80px}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--font-body);background:var(--white);color:var(--gray-800);line-height:1.6;-webkit-font-smoothing:antialiased}
.navbar{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--gray-200)}
.nav-brand{display:flex;align-items:center;gap:12px}
.brand-text{display:flex;align-items:baseline;gap:2px}
.brand-media{font-family:var(--font-display);font-size:1.2rem;font-weight:800;color:var(--navy)}
.brand-500{font-family:var(--font-display);font-size:1.2rem;font-weight:800;color:var(--blue)}
.client-logo-nav{height:32px;width:auto;object-fit:contain;margin-left:12px;padding-left:12px;border-left:1px solid var(--gray-200)}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:140px 32px 80px;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--gray-50) 0%,var(--white) 50%,var(--blue-light) 100%)}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 30%,rgba(0,143,213,0.08) 0%,transparent 60%),radial-gradient(ellipse at 30% 70%,rgba(10,22,40,0.03) 0%,transparent 50%);pointer-events:none}
.hero-content{max-width:var(--max-width);width:100%;display:grid;grid-template-columns:1.2fr 1fr;gap:80px;align-items:center;position:relative;z-index:1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:var(--white);border:1px solid var(--gray-200);border-radius:50px;font-size:0.8rem;font-weight:600;color:var(--gray-500);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:24px}
.badge-dot{width:8px;height:8px;border-radius:50%;background:#22c55e}
.hero-title{font-family:var(--font-display);font-size:3.2rem;font-weight:800;line-height:1.1;color:var(--navy);margin-bottom:20px}
.hero-title .highlight{display:block;color:var(--blue)}
.hero-subtitle{font-size:1.1rem;color:var(--gray-500);max-width:480px;line-height:1.7;margin-bottom:24px}
.hero-client{margin-bottom:32px}
.client-label{display:block;font-size:0.8rem;font-weight:600;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px}
.client-name{font-family:var(--font-display);font-size:1.5rem;font-weight:700;color:var(--navy)}
.hero-actions{display:flex;gap:16px;align-items:center}
.btn{display:inline-flex;align-items:center;gap:10px;padding:14px 28px;border-radius:10px;font-family:var(--font-body);font-size:0.9rem;font-weight:600;text-decoration:none;cursor:pointer;border:none;transition:all 0.2s ease}
.btn-primary{background:var(--blue);color:var(--white)}
.btn-primary:hover{background:var(--blue-dark);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,143,213,0.3)}
.hero-visual{position:relative;display:flex;flex-direction:column;gap:16px}
.stats-card{background:var(--white);border:1px solid var(--gray-200);border-radius:12px;padding:24px 28px;box-shadow:0 4px 16px rgba(0,0,0,0.04)}
.sc-number{font-family:var(--font-display);font-size:2.2rem;font-weight:900;color:var(--blue);line-height:1}
.sc-label{font-size:0.85rem;color:var(--gray-500);margin-top:6px}
.section-wrapper{max-width:var(--max-width);margin:0 auto;padding:0 32px}
.section-header{text-align:center;margin-bottom:64px}
.section-number{display:inline-block;font-family:var(--font-display);font-size:0.8rem;font-weight:800;color:var(--blue);letter-spacing:0.15em;margin-bottom:12px}
.section-title{font-family:var(--font-display);font-size:2.2rem;font-weight:800;color:var(--navy);line-height:1.15;margin-bottom:12px}
.section-subtitle{font-size:1.05rem;color:var(--gray-500);max-width:500px;margin:0 auto;line-height:1.6}
.oportunidad{padding:var(--section-padding) 0;background:var(--white)}
.cards-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.info-card{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:16px;padding:36px 28px;text-align:center}
.card-icon{display:flex;justify-content:center;margin-bottom:20px;color:var(--blue);font-size:2rem}
.info-card h3{font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--navy);margin-bottom:10px}
.info-card p{font-size:0.9rem;color:var(--gray-500);line-height:1.6}
.info-card strong{color:var(--gray-700);font-weight:600}
.formatos{padding:var(--section-padding) 0;background:var(--gray-50)}
.formato-table-wrapper{background:var(--white);border-radius:16px;border:1px solid var(--gray-200);overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.03)}
.formato-table{width:100%;border-collapse:collapse;font-size:0.9rem}
.formato-table thead{background:var(--navy);color:var(--white)}
.formato-table th{padding:16px 20px;font-weight:600;font-size:0.8rem;letter-spacing:0.05em;text-transform:uppercase;text-align:left}
.formato-table th.num{text-align:right}
.formato-table td{padding:16px 20px;border-bottom:1px solid var(--gray-200);color:var(--gray-700)}
.formato-table td.num{text-align:right;font-variant-numeric:tabular-nums;font-weight:600;color:var(--gray-800)}
.formato-table tbody tr:last-child td{border-bottom:none}
.formato-table tbody tr:hover{background:var(--gray-50)}
.formato-nota{font-size:0.8rem;color:var(--gray-400);margin-top:16px;text-align:center}
.mockup-section{padding:var(--section-padding) 0;background:var(--white)}
.mockup-header{text-align:center;margin-bottom:64px}
.mockup-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:32px}
.mockup-item{border-radius:16px;overflow:hidden;border:1px solid var(--gray-200);background:var(--gray-50)}
.mockup-image{position:relative;width:100%;height:300px;overflow:hidden;background:var(--gray-200);display:flex;align-items:center;justify-content:center}
.mockup-image img{width:100%;height:100%;object-fit:cover}
.mockup-overlay{position:absolute;bottom:20px;left:20px}
.mockup-tag{background:var(--navy);color:var(--white);padding:8px 16px;border-radius:8px;font-size:0.8rem;font-weight:600;letter-spacing:0.05em}
.mockup-caption{padding:20px 24px;font-size:0.9rem;color:var(--gray-500)}
.cobertura-section{padding:var(--section-padding) 0;background:var(--gray-50)}
.cobertura-image{border-radius:16px;overflow:hidden;border:1px solid var(--gray-200);background:var(--white);max-height:500px;display:flex;align-items:center;justify-content:center}
.cobertura-image img{width:100%;max-height:500px;object-fit:contain}
.datos{padding:var(--section-padding) 0;background:var(--navy);color:var(--white)}
.datos .section-title{color:var(--white)}
.datos .section-subtitle{color:var(--gray-400)}
.datos-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.dato-card{text-align:center;padding:36px 24px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px}
.dato-number{font-family:var(--font-display);font-size:2.5rem;font-weight:900;color:var(--blue);line-height:1;margin-bottom:8px}
.dato-label{font-size:0.85rem;font-weight:600;color:var(--white);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px}
.dato-context{font-size:0.85rem;color:var(--gray-400);line-height:1.5}
.contacto{padding:var(--section-padding) 0;background:var(--white)}
.contacto-content{text-align:center;max-width:700px;margin:0 auto}
.contacto-title{font-family:var(--font-display);font-size:2.2rem;font-weight:800;color:var(--navy);margin-bottom:12px}
.contacto-subtitle{font-size:1.05rem;color:var(--gray-500);margin-bottom:48px}
.contacto-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.contacto-item{display:flex;flex-direction:column;align-items:center;gap:12px;padding:32px 24px;background:var(--gray-50);border-radius:16px;border:1px solid var(--gray-200)}
.contacto-icon{width:48px;height:48px;border-radius:12px;background:var(--blue-light);display:flex;align-items:center;justify-content:center;color:var(--blue);font-size:1.2rem}
.contacto-label{font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--gray-400)}
.contacto-value{font-size:1rem;font-weight:600;color:var(--navy)}
.footer{background:var(--navy);padding:60px 32px 32px;text-align:center}
.footer-wrapper{max-width:var(--max-width);margin:0 auto}
.footer-brand{display:flex;justify-content:center;align-items:baseline;gap:4px;margin-bottom:8px}
.footer-media{font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--white)}
.footer-500{font-family:var(--font-display);font-size:1.5rem;font-weight:800;color:var(--blue)}
.footer-tag{font-size:0.9rem;color:var(--gray-400);margin-bottom:24px}
.footer-divider{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:24px}
.footer-divider span:first-child,.footer-divider span:last-child{width:40px;height:1px;background:rgba(255,255,255,0.2)}
.footer-dot{width:6px;height:6px;border-radius:50%;background:var(--blue)}
.footer-legal{font-size:0.75rem;color:var(--gray-500);line-height:1.6;max-width:600px;margin:0 auto 16px}
.footer-copy{font-size:0.8rem;color:var(--gray-600)}
@media(max-width:1024px){
.hero-content{grid-template-columns:1fr;gap:48px;text-align:center}
.hero-title{font-size:2.6rem}
.hero-subtitle{margin:0 auto}
.cards-grid{grid-template-columns:repeat(2,1fr)}
.datos-grid{grid-template-columns:repeat(2,1fr)}
.mockup-grid{grid-template-columns:1fr}
.contacto-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:640px){
:root{--section-padding:60px}
.hero-title{font-size:2rem}
.hero-actions{flex-direction:column}
.btn{width:100%;justify-content:center}
.cards-grid{grid-template-columns:1fr}
.datos-grid{grid-template-columns:1fr}
.section-title{font-size:1.8rem}
.contacto-grid{grid-template-columns:1fr}
}
`;
    }

    // ============================================
    // TABS
    // ============================================
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
        });
    });

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => observer.observe(el));

    // ============================================
    // NAVBAR
    // ============================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // Smooth scroll
    document.querySelectorAll('.nav-link, .hero-actions .btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const pos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (pos >= top && pos < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    });

    // ============================================
    // PARTICLES
    // ============================================
    function initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        for (let i = 0; i < 25; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `position:absolute;width:${Math.random()*4+2}px;height:${Math.random()*4+2}px;background:rgba(0,143,213,0.15);border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:floatParticle ${Math.random()*10+10}s infinite ease-in-out;animation-delay:${Math.random()*5}s;`;
            container.appendChild(dot);
        }
    }
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `@keyframes floatParticle{0%,100%{transform:translate(0,0)}25%{transform:translate(${Math.random()*20-10}px,${Math.random()*20-10}px)}50%{transform:translate(${Math.random()*20-10}px,${Math.random()*20-10}px)}75%{transform:translate(${Math.random()*20-10}px,${Math.random()*20-10}px)}}`;
    document.head.appendChild(particleStyle);

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounter(el, target, duration = 2000) {
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);
            el.textContent = current.toLocaleString('es-AR');
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateCounter(entry.target, parseInt(entry.target.dataset.count, 10));
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.sc-number[data-count]').forEach(el => counterObserver.observe(el));

    // ============================================
    // INIT
    // ============================================
    renderFormatoTables();
    initParticles();
    updateView();

})();
