/**
 * MEDIA 500 — Plantilla de Propuesta Comercial
 * Calculadora interactiva, animaciones, tabs
 */

(function() {
    'use strict';

    // JS enabled — add class for progressive enhancement
    document.body.classList.add('js-enabled');

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

    // ============================================
    // UTILS
    // ============================================
    function formatMoney(n) {
        return '$ ' + n.toLocaleString('es-AR');
    }

    function parseArg(str) {
        if (!str) return 0;
        str = String(str).replace(/[^\d.,]/g, '').trim();
        if (!str) return 0;
        const lastDot = str.lastIndexOf('.');
        const lastComma = str.lastIndexOf(',');
        const lastSep = Math.max(lastDot, lastComma);
        if (lastSep === -1) return parseInt(str, 10);
        const after = str.slice(lastSep + 1);
        if (after.length === 3) {
            return parseInt(str.replace(/[.,]/g, ''), 10);
        } else {
            return parseFloat(str.replace(/\./g, '').replace(',', '.'));
        }
    }

    // ============================================
    // FORMATO TABLES
    // ============================================
    function renderFormatoTables() {
        const tbodyTrenes = document.getElementById('tablaTrenes');
        const tbodyColectivos = document.getElementById('tablaColectivos');

        tbodyTrenes.innerHTML = TARIFARIO.trenes.map(f => `
            <tr>
                <td>${f.nombre}</td>
                <td class="num">${formatMoney(f.exhibicion)}</td>
                <td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td>
            </tr>
        `).join('');

        tbodyColectivos.innerHTML = TARIFARIO.colectivos.map(f => `
            <tr>
                <td>${f.nombre}</td>
                <td class="num">${formatMoney(f.exhibicion)}</td>
                <td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td>
            </tr>
        `).join('');
    }

    // ============================================
    // CALCULADORA
    // ============================================
    let cotizacionFilas = [];

    const catSelect = document.getElementById('calcCategoria');
    const fmtSelect = document.getElementById('calcFormato');
    const cantInput = document.getElementById('calcCantidad');
    const mesesInput = document.getElementById('calcMeses');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const btnExportar = document.getElementById('btnExportar');
    const tbody = document.getElementById('cotizacionBody');
    const tfoot = document.getElementById('cotizacionFooter');

    catSelect.addEventListener('change', () => {
        const cat = catSelect.value;
        fmtSelect.innerHTML = '';
        if (!cat) {
            fmtSelect.disabled = true;
            fmtSelect.innerHTML = '<option value="">Primero seleccioná categoría</option>';
            return;
        }
        fmtSelect.disabled = false;
        fmtSelect.innerHTML = '<option value="">Seleccionar formato...</option>' +
            TARIFARIO[cat].map((f, i) => `<option value="${i}" data-exh="${f.exhibicion}" data-prod="${f.produccion}">${f.nombre}</option>`).join('');
    });

    btnAgregar.addEventListener('click', () => {
        const cat = catSelect.value;
        const fmtIdx = fmtSelect.value;
        const cant = parseInt(cantInput.value) || 1;
        const meses = parseInt(mesesInput.value) || 1;

        if (!cat || fmtIdx === '') {
            alert('Seleccioná categoría y formato');
            return;
        }

        const formato = TARIFARIO[cat][fmtIdx];
        const totalExh = formato.exhibicion * cant * meses;
        const totalProd = formato.produccion * cant;

        cotizacionFilas.push({
            id: Date.now(),
            cantidad: cant,
            formato: formato.nombre,
            puExh: formato.exhibicion,
            puProd: formato.produccion,
            meses: meses,
            totalExh: totalExh,
            totalProd: totalProd
        });

        renderCotizacion();
    });

    function renderCotizacion() {
        if (cotizacionFilas.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7">
                        <div class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="8" y="12" width="32" height="24" rx="2"/>
                                <path d="M8 20h32M16 28h16"/>
                            </svg>
                            <p>Tu cotización aparecerá acá</p>
                            <span>Seleccioná un formato y cantidad para comenzar</span>
                        </div>
                    </td>
                </tr>
            `;
            tfoot.style.display = 'none';
            return;
        }

        let sumExh = 0, sumProd = 0;
        tbody.innerHTML = cotizacionFilas.map((fila, i) => {
            sumExh += fila.totalExh;
            sumProd += fila.totalProd;
            const isEven = i % 2 === 0;
            return `
                <tr class="${isEven ? 'row-even' : 'row-odd'}">
                    <td>${fila.cantidad}</td>
                    <td>${fila.formato}${fila.meses > 1 ? ' <span style="color:#008fd5">(' + fila.meses + ' meses)</span>' : ''}</td>
                    <td class="num">${formatMoney(fila.puExh)}</td>
                    <td class="num">${fila.puProd ? formatMoney(fila.puProd) : '—'}</td>
                    <td class="num">${formatMoney(fila.totalExh)}</td>
                    <td class="num">${fila.totalProd ? formatMoney(fila.totalProd) : '—'}</td>
                    <td>
                        <button class="btn-delete" onclick="window.eliminarFila(${fila.id})" title="Eliminar">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 3l12 12M15 3L3 15"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('totalExhibicion').innerHTML = `<strong>${formatMoney(sumExh)}</strong>`;
        document.getElementById('totalProduccion').innerHTML = `<strong>${formatMoney(sumProd)}</strong>`;
        tfoot.style.display = '';
    }

    window.eliminarFila = function(id) {
        if (confirm('¿Eliminar esta fila?')) {
            cotizacionFilas = cotizacionFilas.filter(f => f.id !== id);
            renderCotizacion();
        }
    };

    btnLimpiar.addEventListener('click', () => {
        if (cotizacionFilas.length === 0) return;
        if (confirm('¿Limpiar toda la cotización?')) {
            cotizacionFilas = [];
            renderCotizacion();
        }
    });

    btnExportar.addEventListener('click', () => {
        if (cotizacionFilas.length === 0) {
            alert('No hay filas para exportar');
            return;
        }
        let csv = 'Cantidad,Formato,P.U. Exhibicion,P.U. Produccion,Total Exhibicion,Total Produccion\n';
        let sumExh = 0, sumProd = 0;
        cotizacionFilas.forEach(f => {
            csv += `${f.cantidad},"${f.formato}",${f.puExh},${f.puProd},${f.totalExh},${f.totalProd}\n`;
            sumExh += f.totalExh;
            sumProd += f.totalProd;
        });
        csv += `,,,,${sumExh},${sumProd}\n`;
        csv += 'TOTAL,,,,TOTAL EXHIBICION,TOTAL PRODUCCION\n';

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cotizacion_media500.csv';
        link.click();
    });

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
    // NAVBAR SCROLL
    // ============================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('.nav-link, .hero-actions .btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar.offsetHeight + 20;
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ============================================
    // PARTICLES (subtle background dots)
    // ============================================
    function initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        const count = 25;
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(0,143,213,0.15);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${Math.random() * 10 + 10}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(dot);
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
            50% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
            75% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
        }
    `;
    document.head.appendChild(style);

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
                const target = parseInt(entry.target.dataset.count, 10);
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.sc-number[data-count]').forEach(el => counterObserver.observe(el));

    // ============================================
    // INIT
    // ============================================
    renderFormatoTables();
    initParticles();

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

})();
