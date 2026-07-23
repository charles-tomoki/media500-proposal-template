     1|     1|/**
     2|     2| * MEDIA 500 — Propuesta Comercial (Editable + Cotizador)
     3|     3| */
     4|     4|
     5|     5|(function() {
     6|     6|    'use strict';
     7|     7|
     8|     8|    document.body.classList.add('js-enabled');
     9|     9|
    10|    10|    // ============================================
    11|    11|    // TARIFARIO JULIO 2026
    12|    12|    // ============================================
    13|    13|    const TARIFARIO = {
    14|    14|        trenes: [
    15|    15|            { nombre: "Ploteo Parcial (7 coches Puertas y Ventanas)", exhibicion: 3600000, produccion: 8500000 },
    16|    16|            { nombre: "Ploteo Full (1 coche full)", exhibicion: 3120000, produccion: 2300000 },
    17|    17|            { nombre: "Ploteo Mixto (1 coche Full + 6 coches PyV)", exhibicion: 6360000, produccion: 10000000 },
    18|    18|            { nombre: "Ploteo Full Formación Completa (7 coches full)", exhibicion: 18000000, produccion: 16000000 },
    19|    19|            { nombre: "Cenefas Interiores (4 por coche de 2 x 0.30 mt)", exhibicion: 240000, produccion: 78000 },
    20|    20|            { nombre: "Cenefas Interiores (4 por coche de 1 x 0.15)", exhibicion: 180000, produccion: 55000 },
    21|    21|            { nombre: "Ploteo Parcial (3 coches Puertas y Ventanas)", exhibicion: 1680000, produccion: 3500000 },
    22|    22|            { nombre: "Ploteo Mixto (1 coche Full + 2 coches PyV)", exhibicion: 3840000, produccion: 4800000 },
    23|    23|            { nombre: "Ploteo Full (3 coches full)", exhibicion: 8400000, produccion: 5700000 }
    24|    24|        ],
    25|    25|        colectivos: [
    26|    26|            { nombre: "Luneta Premium CABA", exhibicion: 130000, produccion: 60000 },
    27|    27|            { nombre: "Luneta Standard GBA", exhibicion: 110000, produccion: 60000 },
    28|    28|            { nombre: "Diferencial", exhibicion: 3500000, produccion: 1400000 },
    29|    29|            { nombre: "Luneta Interior (Córdoba/Rosario/Mendoza/Santa Fe)", exhibicion: 140000, produccion: 70000 },
    30|    30|            { nombre: "Cenefas Interiores (4 por colectivo)", exhibicion: 110000, produccion: 50000 },
    31|    31|            { nombre: "Back Full", exhibicion: 300000, produccion: 150000 },
    32|    32|            { nombre: "Panorámico (ventanas + luneta)", exhibicion: 1800000, produccion: 980000 },
    33|    33|            { nombre: "Luneta LED", exhibicion: 450000, produccion: 0 },
    34|    34|            { nombre: "Tótems UBA", exhibicion: 380000, produccion: 0 }
    35|    35|        ]
    36|    36|    };
    37|    37|
    38|    38|    function formatMoney(n) {
    39|    39|        return '$ ' + n.toLocaleString('es-AR');
    40|    40|    }
    41|    41|
    42|    42|    // ============================================
    43|    43|    // STATE
    44|    44|    // ============================================
    45|    45|    const state = {
    46|    46|        cliente: '',
    47|    47|        logo: null,
    48|    48|        fotoTrenes: null,
    49|    49|        fotoTrenesPyV: null,
    50|    50|        fotoTrenesCenefas: null,
    51|    51|        fotoColectivos: null,
    52|    52|        fotoColectivosDif: null,
    53|    53|        fotoColectivosInt: null,
    54|    54|        fotoLed: null,
    55|    55|        fotoTotems: null,
    56|    56|        fotoOtros: null,
    57|    57|        showTrenes: true,
    58|    58|        showTrenesPyV: true,
    59|    59|        showTrenesCenefas: true,
    60|    60|        showColectivos: true,
    61|    61|        showColectivosDif: true,
    62|    62|        showColectivosInt: true,
    63|    63|        showLed: true,
    64|    64|        showTotems: true,
    65|    65|        showOtros: true,
    66|    66|        showFormatos: false,
    67|    67|        cotItems: []
    68|    68|    };
    69|    69|
    70|    70|    // ============================================
    71|    71|    // FORMATO TABLES
    72|    72|    // ============================================
    73|    73|    function renderFormatoTables() {
    74|    74|        const tbodyTrenes = document.getElementById('tablaTrenes');
    75|    75|        const tbodyColectivos = document.getElementById('tablaColectivos');
    76|    76|        if (!tbodyTrenes || !tbodyColectivos) return;
    77|    77|        tbodyTrenes.innerHTML = TARIFARIO.trenes.map(f => `
    78|    78|            <tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>
    79|    79|        `).join('');
    80|    80|        tbodyColectivos.innerHTML = TARIFARIO.colectivos.map(f => `
    81|    81|            <tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>
    82|    82|        `).join('');
    83|    83|    }
    84|    84|
    85|    85|    // ============================================
    86|    86|    // EDITOR DROPDOWN
    87|    87|    // ============================================
    88|    88|    function populateDropdown() {
    89|    89|        const optgroupTrenes = document.getElementById('optgroupTrenes');
    90|    90|        const optgroupColectivos = document.getElementById('optgroupColectivos');
    91|    91|        if (!optgroupTrenes || !optgroupColectivos) return;
    92|    92|
    93|    93|        optgroupTrenes.innerHTML = TARIFARIO.trenes.map((f, i) =>
    94|    94|            `<option value="trenes-${i}">${f.nombre}</option>`
    95|    95|        ).join('');
    96|    96|
    97|    97|        optgroupColectivos.innerHTML = TARIFARIO.colectivos.map((f, i) =>
    98|    98|            `<option value="colectivos-${i}">${f.nombre}</option>`
    99|    99|        ).join('');
   100|   100|    }
   101|   101|
   102|   102|    // ============================================
   103|   103|    // COTIZADOR EDITOR
   104|   104|    // ============================================
   105|   105|    const cotFormato = document.getElementById('cotFormato');
   106|   106|    const cotCantidad = document.getElementById('cotCantidad');
   107|   107|    const cotMeses = document.getElementById('cotMeses');
   108|   108|    const btnAddCot = document.getElementById('btnAddCot');
   109|   109|    const editorCotBody = document.getElementById('editorCotBody');
   110|   110|    const editorCotTotals = document.getElementById('editorCotTotals');
   111|   111|
   112|   112|    function renderEditorCot() {
   113|   113|        if (state.cotItems.length === 0) {
   114|   114|            editorCotBody.innerHTML = '<tr class="empty-row"><td colspan="5">Sin items</td></tr>';
   115|   115|            editorCotTotals.innerHTML = '';
   116|   116|            return;
   117|   117|        }
   118|   118|
   119|   119|        let sumExh = 0, sumProd = 0;
   120|   120|        editorCotBody.innerHTML = state.cotItems.map((item, i) => {
   121|   121|            sumExh += item.totalExh;
   122|   122|            sumProd += item.totalProd;
   123|   123|            return `
   124|   124|                <tr>
   125|   125|                    <td>${item.cantidad}</td>
   126|   126|                    <td>${item.formato}${item.meses > 1 ? ' <span style="color:#008fd5">(' + item.meses + 'm)</span>' : ''}</td>
   127|   127|                    <td class="num">${formatMoney(item.totalExh)}</td>
   128|   128|                    <td class="num">${item.totalProd ? formatMoney(item.totalProd) : '—'}</td>
   129|   129|                    <td><button class="btn-delete-editor" data-idx="${i}">✕</button></td>
   130|   130|                </tr>
   131|   131|            `;
   132|   132|        }).join('');
   133|   133|
   134|   134|        editorCotTotals.innerHTML = `
   135|   135|            <div>Total Exhibición: <strong>${formatMoney(sumExh)}</strong></div>
   136|   136|            <div>Total Producción: <strong>${formatMoney(sumProd)}</strong></div>
   137|   137|        `;
   138|   138|
   139|   139|        // Attach delete handlers
   140|   140|        editorCotBody.querySelectorAll('.btn-delete-editor').forEach(btn => {
   141|   141|            btn.addEventListener('click', () => {
   142|   142|                const idx = parseInt(btn.dataset.idx);
   143|   143|                state.cotItems.splice(idx, 1);
   144|   144|                renderEditorCot();
   145|   145|                updateView();
   146|   146|            });
   147|   147|        });
   148|   148|    }
   149|   149|
   150|   150|    btnAddCot.addEventListener('click', () => {
   151|   151|        const val = cotFormato.value;
   152|   152|        const cantidad = parseInt(cotCantidad.value) || 1;
   153|   153|        const meses = parseInt(cotMeses.value) || 1;
   154|   154|
   155|   155|        if (!val) { alert('Seleccioná un formato'); return; }
   156|   156|
   157|   157|        const [cat, idx] = val.split('-');
   158|   158|        const formato = TARIFARIO[cat][parseInt(idx)];
   159|   159|        const totalExh = formato.exhibicion * cantidad * meses;
   160|   160|        const totalProd = formato.produccion * cantidad;
   161|   161|
   162|   162|        state.cotItems.push({
   163|   163|            id: Date.now(),
   164|   164|            cantidad,
   165|   165|            formato: formato.nombre,
   166|   166|            puExh: formato.exhibicion,
   167|   167|            puProd: formato.produccion,
   168|   168|            meses,
   169|   169|            totalExh,
   170|   170|            totalProd
   171|   171|        });
   172|   172|
   173|   173|        renderEditorCot();
   174|   174|        updateView();
   175|   175|    });
   176|   176|
   177|   177|    // ============================================
   178|   178|    // VIEW ELEMENTS
   179|   179|    // ============================================
   180|   180|    const view = {
   181|   181|        clientNameDisplay: document.getElementById('clientNameDisplay'),
   182|   182|        clientLogoNav: document.getElementById('clientLogoNav'),
   183|   183|        imgTrenes: document.getElementById('imgTrenes'),
   184|   184|        imgTrenesPyV: document.getElementById('imgTrenesPyV'),
   185|   185|        imgTrenesCenefas: document.getElementById('imgTrenesCenefas'),
   186|   186|        imgColectivos: document.getElementById('imgColectivos'),
   187|   187|        imgColectivosDif: document.getElementById('imgColectivosDif'),
        imgColectivosPan: document.getElementById('imgColectivosPan'),
   188|   188|        imgColectivosInt: document.getElementById('imgColectivosInt'),
   189|   189|        imgLed: document.getElementById('imgLed'),
   190|   190|        imgTotems: document.getElementById('imgTotems'),
   191|   191|        imgOtros: document.getElementById('imgOtros'),
   192|   192|        formatosSection: document.getElementById('formatos'),
   193|   193|        cotizacionSection: document.getElementById('cotizacion'),
   194|   194|        cotTableBody: document.getElementById('cotTableBody'),
   195|   195|        cotTableFoot: document.getElementById('cotTableFoot'),
   196|   196|        mockupSection: document.getElementById('mockups'),
   197|   197|        coberturaSection: document.getElementById('cobertura'),
   198|   198|        navCotizacion: document.getElementById('navCotizacion'),
   199|   199|        navMockups: document.getElementById('navMockups'),
   200|   200|        cotNumber: document.getElementById('cotNumber'),
   201|   201|        mockNumber: document.getElementById('mockNumber'),
   202|   202|        ledNumber: document.getElementById('ledNumber'),
   203|   203|    };
   204|   204|
   205|   205|    function readFile(file) {
   206|   206|        return new Promise((resolve) => {
   207|   207|            if (!file) { resolve(null); return; }
   208|   208|            const reader = new FileReader();
   209|   209|            reader.onload = () => resolve(reader.result);
   210|   210|            reader.readAsDataURL(file);
   211|   211|        });
   212|   212|    }
   213|   213|
   214|   214|    function setPreview(container, src) {
   215|   215|        if (!container) return;
   216|   216|        if (src) { container.innerHTML = `<img src="${src}" alt="preview">`; }
   217|   217|        else { container.innerHTML = '<span>Sin imagen</span>'; }
   218|   218|    }
   219|   219|
   220|   220|    function updateView() {
   221|   221|        // Text
   222|   222|        if (view.clientNameDisplay) view.clientNameDisplay.textContent = state.cliente || '[NOMBRE DEL CLIENTE]';
   223|   223|
   224|   224|        // Logo
   225|   225|        if (view.clientLogoNav) {
   226|   226|            if (state.logo) { view.clientLogoNav.src = state.logo; view.clientLogoNav.classList.remove('hidden'); }
   227|   227|            else { view.clientLogoNav.classList.add('hidden'); }
   228|   228|        }
   229|   229|
   230|   230|        // Images
   231|   231|        if (view.imgTrenes) view.imgTrenes.src = state.fotoTrenes || '';
   232|   232|        if (view.imgTrenesPyV) view.imgTrenesPyV.src = state.fotoTrenesPyV || '';
   233|   233|        if (view.imgTrenesCenefas) view.imgTrenesCenefas.src = state.fotoTrenesCenefas || '';
   234|   234|        if (view.imgColectivos) view.imgColectivos.src = state.fotoColectivos || '';
   235|   235|        if (view.imgColectivosDif) view.imgColectivosDif.src = state.fotoColectivosDif || '';
        if (view.imgColectivosPan) view.imgColectivosPan.src = state.fotoColectivosPan || '';
   236|   236|        if (view.imgColectivosInt) view.imgColectivosInt.src = state.fotoColectivosInt || '';
   237|   237|        if (view.imgLed) view.imgLed.src = state.fotoLed || '';
   238|   238|        if (view.imgTotems) view.imgTotems.src = state.fotoTotems || '';
   239|   239|        if (view.imgOtros) view.imgOtros.src = state.fotoOtros || '';
   240|   240|
   241|   241|        // Cotización section
   242|   242|        const hasCot = state.cotItems.length > 0;
   243|   243|        if (view.cotizacionSection) view.cotizacionSection.classList.toggle('hidden', !hasCot);
   244|   244|        if (view.navCotizacion) view.navCotizacion.classList.toggle('hidden', !hasCot);
   245|   245|
   246|   246|        if (hasCot && view.cotTableBody) {
   247|   247|            let sumExh = 0, sumProd = 0;
   248|   248|            view.cotTableBody.innerHTML = state.cotItems.map(item => {
   249|   249|                sumExh += item.totalExh;
   250|   250|                sumProd += item.totalProd;
   251|   251|                return `
   252|   252|                    <tr>
   253|   253|                        <td>${item.cantidad}</td>
   254|   254|                        <td>${item.formato}${item.meses > 1 ? ' <span style="color:#008fd5">(' + item.meses + ' meses)</span>' : ''}</td>
   255|   255|                        <td class="num">${formatMoney(item.puExh)}</td>
   256|   256|                        <td class="num">${item.puProd ? formatMoney(item.puProd) : '—'}</td>
   257|   257|                        <td class="num">${formatMoney(item.totalExh)}</td>
   258|   258|                        <td class="num">${item.totalProd ? formatMoney(item.totalProd) : '—'}</td>
   259|   259|                    </tr>
   260|   260|                `;
   261|   261|            }).join('');
   262|   262|
   263|   263|            if (view.cotTableFoot) {
   264|   264|                view.cotTableFoot.innerHTML = `
   265|   265|                    <tr>
   266|   266|                        <td colspan="4" style="text-align:right;font-weight:700;">TOTAL</td>
   267|   267|                        <td class="num" style="font-size:1.05rem;color:var(--blue);"><strong>${formatMoney(sumExh)}</strong></td>
   268|   268|                        <td class="num" style="font-size:1.05rem;color:var(--blue);"><strong>${formatMoney(sumProd)}</strong></td>
   269|   269|                    </tr>
   270|   270|                `;
   271|   271|            }
   272|   272|        }
   273|   273|
   274|   274|        // Mockups
   275|   275|        const mockupItems = document.querySelectorAll('[data-mockup]');
   276|   276|        mockupItems.forEach(item => {
   277|   277|            const type = item.dataset.mockup;
   278|   278|            let show = false;
   279|   279|            if (type === 'trenes') show = state.showTrenes && state.fotoTrenes;
   280|   280|            if (type === 'trenesPyV') show = state.showTrenesPyV && state.fotoTrenesPyV;
   281|   281|            if (type === 'trenesCenefas') show = state.showTrenesCenefas && state.fotoTrenesCenefas;
   282|   282|            if (type === 'colectivos') show = state.showColectivos && state.fotoColectivos;
   283|   283|            if (type === 'colectivosDif') show = state.showColectivosDif && state.fotoColectivosDif;
   284|   284|            if (type === 'colectivosInt') show = state.showColectivosInt && state.fotoColectivosInt;
   285|   285|            if (type === 'led') show = state.showLed && state.fotoLed;
   286|   286|            if (type === 'totems') show = state.showTotems && state.fotoTotems;
   287|   287|            if (type === 'otros') show = state.showOtros && state.fotoOtros;
   288|   288|            item.classList.toggle('hidden', !show);
   289|   289|        });
   290|   290|        const anyMockups = [
   291|   291|            state.showTrenes && state.fotoTrenes,
   292|   292|            state.showTrenesPyV && state.fotoTrenesPyV,
   293|   293|            state.showTrenesCenefas && state.fotoTrenesCenefas,
   294|   294|            state.showColectivos && state.fotoColectivos,
   295|   295|            state.showColectivosDif && state.fotoColectivosDif,
            state.showColectivosPan && state.fotoColectivosPan,
   296|   296|            state.showColectivosInt && state.fotoColectivosInt,
   297|   297|            state.showLed && state.fotoLed,
   298|   298|            state.showTotems && state.fotoTotems,
   299|   299|            state.showOtros && state.fotoOtros
   300|   300|        ].some(Boolean);
   301|   301|        if (view.mockupSection) view.mockupSection.classList.toggle('hidden', !anyMockups);
   302|   302|        if (view.navMockups) view.navMockups.classList.toggle('hidden', !anyMockups);
   303|   303|
   304|   304|        // Cobertura LED section (now part of mockups, but keep separate section if needed)
   305|   305|        const showLedSection = state.showLed && state.fotoLed;
   306|   306|        if (view.coberturaSection) view.coberturaSection.classList.toggle('hidden', !showLedSection);
   307|   307|
   308|   308|        // Formatos section visibility
   309|   309|        const showFormatos = state.showFormatos;
   310|   310|        if (view.formatosSection) view.formatosSection.classList.toggle('hidden', !showFormatos);
   311|   311|
   312|   312|        // Dynamic numbering
   313|   313|        let num = 2;
   314|   314|        if (showFormatos) { num++; }
   315|   315|        if (hasCot) { if (view.cotNumber) view.cotNumber.textContent = String(num).padStart(2, '0'); num++; }
   316|   316|        if (anyMockups) { if (view.mockNumber) view.mockNumber.textContent = String(num).padStart(2, '0'); num++; }
   317|   317|        if (showLed) { if (view.ledNumber) view.ledNumber.textContent = String(num).padStart(2, '0'); num++; }
   318|   318|    }
   319|   319|
   320|   320|    // ============================================
   321|   321|    // EDITOR EVENTS
   322|   322|    // ============================================
   323|   323|    const els = {
   324|   324|        uploadLogo: document.getElementById('uploadLogo'),
   325|   325|        previewLogo: document.getElementById('previewLogo'),
   326|   326|        inputCliente: document.getElementById('inputCliente'),
   327|   327|        uploadTrenes: document.getElementById('uploadTrenes'),
   328|   328|        previewTrenes: document.getElementById('previewTrenes'),
   329|   329|        toggleTrenes: document.getElementById('toggleTrenes'),
   330|   330|        uploadTrenesPyV: document.getElementById('uploadTrenesPyV'),
   331|   331|        previewTrenesPyV: document.getElementById('previewTrenesPyV'),
   332|   332|        toggleTrenesPyV: document.getElementById('toggleTrenesPyV'),
   333|   333|        uploadTrenesCenefas: document.getElementById('uploadTrenesCenefas'),
   334|   334|        previewTrenesCenefas: document.getElementById('previewTrenesCenefas'),
   335|   335|        toggleTrenesCenefas: document.getElementById('toggleTrenesCenefas'),
   336|   336|        uploadColectivos: document.getElementById('uploadColectivos'),
   337|   337|        previewColectivos: document.getElementById('previewColectivos'),
   338|   338|        toggleColectivos: document.getElementById('toggleColectivos'),
   339|   339|        uploadColectivosDif: document.getElementById('uploadColectivosDif'),
   340|   340|        previewColectivosDif: document.getElementById('previewColectivosDif'),
   341|   341|        toggleColectivosDif: document.getElementById('toggleColectivosDif'),
        uploadColectivosPan: document.getElementById('uploadColectivosPan'),
        previewColectivosPan: document.getElementById('previewColectivosPan'),
        toggleColectivosPan: document.getElementById('toggleColectivosPan'),
   342|   342|        uploadColectivosInt: document.getElementById('uploadColectivosInt'),
   343|   343|        previewColectivosInt: document.getElementById('previewColectivosInt'),
   344|   344|        toggleColectivosInt: document.getElementById('toggleColectivosInt'),
   345|   345|        uploadLed: document.getElementById('uploadLed'),
   346|   346|        previewLed: document.getElementById('previewLed'),
   347|   347|        toggleLed: document.getElementById('toggleLed'),
   348|   348|        uploadTotems: document.getElementById('uploadTotems'),
   349|   349|        previewTotems: document.getElementById('previewTotems'),
   350|   350|        toggleTotems: document.getElementById('toggleTotems'),
   351|   351|        uploadOtros: document.getElementById('uploadOtros'),
   352|   352|        previewOtros: document.getElementById('previewOtros'),
   353|   353|        toggleOtros: document.getElementById('toggleOtros'),
   354|   354|        toggleFormatos: document.getElementById('toggleFormatos'),
   355|   355|        btnCloseEditor: document.getElementById('btnCloseEditor'),
   356|   356|        btnOpenEditor: document.getElementById('btnOpenEditor'),
   357|   357|        btnPreview: document.getElementById('btnPreview'),
   358|   358|        btnExport: document.getElementById('btnExport'),
   359|   359|    };
   360|   360|
   361|   361|    if (els.uploadLogo) els.uploadLogo.addEventListener('change', async (e) => { state.logo = await readFile(e.target.files[0]); setPreview(els.previewLogo, state.logo); updateView(); });
   362|   362|    if (els.inputCliente) els.inputCliente.addEventListener('input', (e) => { state.cliente = e.target.value; updateView(); });
   363|   363|    if (els.inputEmail) els.inputEmail.addEventListener('input', (e) => { state.email = e.target.value; updateView(); });
   364|   364|    if (els.inputTel) els.inputTel.addEventListener('input', (e) => { state.tel = e.target.value; updateView(); });
   365|   365|
   366|   366|    if (els.uploadTrenes) els.uploadTrenes.addEventListener('change', async (e) => { state.fotoTrenes = await readFile(e.target.files[0]); setPreview(els.previewTrenes, state.fotoTrenes); updateView(); });
   367|   367|    if (els.toggleTrenes) els.toggleTrenes.addEventListener('change', (e) => { state.showTrenes = e.target.checked; updateView(); });
   368|   368|
   369|   369|    if (els.uploadTrenesPyV) els.uploadTrenesPyV.addEventListener('change', async (e) => { state.fotoTrenesPyV = await readFile(e.target.files[0]); setPreview(els.previewTrenesPyV, state.fotoTrenesPyV); updateView(); });
   370|   370|    if (els.toggleTrenesPyV) els.toggleTrenesPyV.addEventListener('change', (e) => { state.showTrenesPyV = e.target.checked; updateView(); });
   371|   371|
   372|   372|    if (els.uploadTrenesCenefas) els.uploadTrenesCenefas.addEventListener('change', async (e) => { state.fotoTrenesCenefas = await readFile(e.target.files[0]); setPreview(els.previewTrenesCenefas, state.fotoTrenesCenefas); updateView(); });
   373|   373|    if (els.toggleTrenesCenefas) els.toggleTrenesCenefas.addEventListener('change', (e) => { state.showTrenesCenefas = e.target.checked; updateView(); });
   374|   374|
   375|   375|    if (els.uploadColectivos) els.uploadColectivos.addEventListener('change', async (e) => { state.fotoColectivos = await readFile(e.target.files[0]); setPreview(els.previewColectivos, state.fotoColectivos); updateView(); });
   376|   376|    if (els.toggleColectivos) els.toggleColectivos.addEventListener('change', (e) => { state.showColectivos = e.target.checked; updateView(); });
   377|   377|
   378|   378|    if (els.uploadColectivosDif) els.uploadColectivosDif.addEventListener('change', async (e) => { state.fotoColectivosDif = await readFile(e.target.files[0]); setPreview(els.previewColectivosDif, state.fotoColectivosDif); updateView(); });
   379|   379|    if (els.toggleColectivosDif) els.toggleColectivosDif.addEventListener('change', (e) => { state.showColectivosDif = e.target.checked; updateView(); });
   380|   380|
   381|   381|    if (els.uploadColectivosInt) els.uploadColectivosInt.addEventListener('change', async (e) => { state.fotoColectivosInt = await readFile(e.target.files[0]); setPreview(els.previewColectivosInt, state.fotoColectivosInt); updateView(); });
   382|   382|    if (els.toggleColectivosInt) els.toggleColectivosInt.addEventListener('change', (e) => { state.showColectivosInt = e.target.checked; updateView(); });
   383|   383|
   384|   384|    if (els.uploadLed) els.uploadLed.addEventListener('change', async (e) => { state.fotoLed = await readFile(e.target.files[0]); setPreview(els.previewLed, state.fotoLed); updateView(); });
   385|   385|    if (els.toggleLed) els.toggleLed.addEventListener('change', (e) => { state.showLed = e.target.checked; updateView(); });
   386|   386|
   387|   387|    if (els.uploadTotems) els.uploadTotems.addEventListener('change', async (e) => { state.fotoTotems = await readFile(e.target.files[0]); setPreview(els.previewTotems, state.fotoTotems); updateView(); });
   388|   388|    if (els.toggleTotems) els.toggleTotems.addEventListener('change', (e) => { state.showTotems = e.target.checked; updateView(); });
   389|   389|
   390|   390|    if (els.uploadOtros) els.uploadOtros.addEventListener('change', async (e) => { state.fotoOtros = await readFile(e.target.files[0]); setPreview(els.previewOtros, state.fotoOtros); updateView(); });
   391|   391|    if (els.toggleOtros) els.toggleOtros.addEventListener('change', (e) => { state.showOtros = e.target.checked; updateView(); });
   392|   392|
   393|   393|    if (els.btnCloseEditor) els.btnCloseEditor.addEventListener('click', () => document.body.classList.add('editor-closed'));
   394|   394|    if (els.btnOpenEditor) els.btnOpenEditor.addEventListener('click', () => document.body.classList.remove('editor-closed'));
   395|   395|    if (els.btnPreview) els.btnPreview.addEventListener('click', () => document.body.classList.add('editor-closed'));
   396|   396|
   397|   397|    // ============================================
   398|   398|    // EXPORT
   399|   399|    // ============================================
   400|   400|    if (els.btnExport) els.btnExport.addEventListener('click', () => {
   401|   401|        const html = buildStandaloneHTML();
   402|   402|        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
   403|   403|        const link = document.createElement('a');
   404|   404|        link.href = URL.createObjectURL(blob);
   405|   405|        link.download = `propuesta_${(state.cliente || 'media500').replace(/\s+/g, '_').toLowerCase()}.html`;
   406|   406|        link.click();
   407|   407|        URL.revokeObjectURL(link.href);
   408|   408|    });
   409|   409|
   410|   410|    function buildStandaloneHTML() {
   411|   411|        const clientName = state.cliente || '[NOMBRE DEL CLIENTE]';
   412|   412|        const logoHTML = state.logo ? `<img id="clientLogoNav" class="client-logo-nav" src="${state.logo}" alt="Logo">` : '';
   413|   413|
   414|   414|        // Cotización (solo items cotizados)
   415|   415|        let cotHTML = '';
   416|   416|        if (state.cotItems.length > 0) {
   417|   417|            let sumExh = 0, sumProd = 0;
   418|   418|            const rows = state.cotItems.map(item => {
   419|   419|                sumExh += item.totalExh;
   420|   420|                sumProd += item.totalProd;
   421|   421|                return `<tr><td>${item.cantidad}</td><td>${item.formato}${item.meses > 1 ? ' (' + item.meses + ' meses)' : ''}</td><td class="num">${formatMoney(item.puExh)}</td><td class="num">${item.puProd ? formatMoney(item.puProd) : '—'}</td><td class="num">${formatMoney(item.totalExh)}</td><td class="num">${item.totalProd ? formatMoney(item.totalProd) : '—'}</td></tr>`;
   422|   422|            }).join('');
   423|   423|            const cotNum = state.showFormatos ? '03' : '02';
   424|   424|            cotHTML = `
   425|   425|            <section id="cotizacion" class="cotizacion-section">
   426|   426|                <div class="section-wrapper">
   427|   427|                    <div class="section-header"><span class="section-number">${cotNum}</span><h2 class="section-title">Cotización</h2><p class="section-subtitle">Propuesta económica personalizada</p></div>
   428|   428|                    <div class="cot-table-wrapper">
   429|   429|                        <table class="cot-table">
   430|   430|                            <thead><tr><th>Cant.</th><th>Formato</th><th class="num">P.U. Exhibición</th><th class="num">P.U. Producción</th><th class="num">Total Exhibición</th><th class="num">Total Producción</th></tr></thead>
   431|   431|                            <tbody>${rows}</tbody>
   432|   432|                            <tfoot><tr><td colspan="4" style="text-align:right;font-weight:700;">TOTAL</td><td class="num" style="font-size:1.05rem;color:var(--blue);"><strong>${formatMoney(sumExh)}</strong></td><td class="num" style="font-size:1.05rem;color:var(--blue);"><strong>${formatMoney(sumProd)}</strong></td></tr></tfoot>
   433|   433|                        </table>
   434|   434|                    </div>
   435|   435|                    <p class="formato-nota" style="margin-top:16px;">* No incluye IVA. El costo de producción es por única vez o por cambio de creatividad. Incluye fijación.</p>
   436|   436|                </div>
   437|   437|            </section>`;
   438|   438|        }
   439|   439|
   440|   440|        // Mockups / Galería
   441|   441|        let mockupsHTML = '';
   442|   442|        let mockItems = '';
   443|   443|        if (state.showTrenes && state.fotoTrenes) {
   444|   444|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoTrenes}" alt="Ploteo full trenes"><div class="mockup-overlay"><span class="mockup-tag">Trenes · Full</span></div></div><p class="mockup-caption">Formación completa ploteada</p></div>`;
   445|   445|        }
   446|   446|        if (state.showTrenesPyV && state.fotoTrenesPyV) {
   447|   447|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoTrenesPyV}" alt="Ploteo parcial trenes"><div class="mockup-overlay"><span class="mockup-tag">Trenes · Puertas y Ventanas</span></div></div><p class="mockup-caption">Ploteo parcial en puertas y ventanas</p></div>`;
   448|   448|        }
   449|   449|        if (state.showTrenesCenefas && state.fotoTrenesCenefas) {
   450|   450|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoTrenesCenefas}" alt="Cenefas trenes"><div class="mockup-overlay"><span class="mockup-tag">Trenes · Cenefas</span></div></div><p class="mockup-caption">Cenefas interiores en coches</p></div>`;
   451|   451|        }
   452|   452|        if (state.showColectivos && state.fotoColectivos) {
   453|   453|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoColectivos}" alt="Luneta premium"><div class="mockup-overlay"><span class="mockup-tag">Colectivos · Luneta</span></div></div><p class="mockup-caption">Luneta premium en unidades</p></div>`;
   454|   454|        }
   455|   455|        if (state.showColectivosDif && state.fotoColectivosDif) {
   456|   456|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoColectivosDif}" alt="Diferencial colectivos"><div class="mockup-overlay"><span class="mockup-tag">Colectivos · Diferencial</span></div></div><p class="mockup-caption">Formato diferencial / panorámico</p></div>`;
   457|   457|        }
   458|   458|        if (state.showColectivosInt && state.fotoColectivosInt) {
   459|   459|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoColectivosInt}" alt="Interior colectivos"><div class="mockup-overlay"><span class="mockup-tag">Colectivos · Interior</span></div></div><p class="mockup-caption">Cenefas y publicidad interior</p></div>`;
   460|   460|        }
   461|   461|        if (state.showLed && state.fotoLed) {
   462|   462|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoLed}" alt="Pantallas LED"><div class="mockup-overlay"><span class="mockup-tag">Pantallas LED</span></div></div><p class="mockup-caption">Pantallas digitales en estaciones</p></div>`;
   463|   463|        }
   464|   464|        if (state.showTotems && state.fotoTotems) {
   465|   465|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoTotems}" alt="Tótems UBA"><div class="mockup-overlay"><span class="mockup-tag">Tótems UBA</span></div></div><p class="mockup-caption">Tótems digitales universitarios</p></div>`;
   466|   466|        }
   467|   467|        if (state.showOtros && state.fotoOtros) {
   468|   468|            mockItems += `<div class="mockup-item"><div class="mockup-image"><img src="${state.fotoOtros}" alt="Otros formatos"><div class="mockup-overlay"><span class="mockup-tag">Otros formatos</span></div></div><p class="mockup-caption">Back full y formatos especiales</p></div>`;
   469|   469|        }
   470|   470|
   471|   471|        let num = 2;
   472|   472|        if (state.showFormatos) num++;
   473|   473|        const hasCot = state.cotItems.length > 0;
   474|   474|        if (hasCot) { const cotNum = String(num).padStart(2,'0'); num++; }
   475|   475|        if (mockItems) { const mockNum = String(num).padStart(2,'0'); mockupsHTML = `
   476|   476|            <section id="mockups" class="mockup-section">
   477|   477|                <div class="section-wrapper">
   478|   478|                    <div class="mockup-header"><span class="section-number">${mockNum}</span><h2 class="section-title">Así se vería tu campaña</h2><p class="section-subtitle">Mockups de referencia para visualizar el impacto</p></div>
   479|   479|                    <div class="mockup-grid">${mockItems}</div>
   480|   480|                </div>
   481|   481|            </section>`;
   482|   482|        num++; }
   483|   483|
   484|   484|        // Formatos section (conditional, visible solo si hay cotización o si showFormatos=true)
   485|   485|        // En standalone, mostramos formatos solo si showFormatos está activado
   486|   486|        let formatosHTML = '';
   487|   487|        if (state.showFormatos) {
   488|   488|            const trenesRows = TARIFARIO.trenes.map(f => `<tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>`).join('');
   489|   489|            const colectivosRows = TARIFARIO.colectivos.map(f => `<tr><td>${f.nombre}</td><td class="num">${formatMoney(f.exhibicion)}</td><td class="num">${f.produccion ? formatMoney(f.produccion) : '—'}</td></tr>`).join('');
   490|   490|            const formatosNum = '02';
   491|   491|            formatosHTML = `
   492|   492|            <section id="formatos" class="formatos">
   493|   493|                <div class="section-wrapper">
   494|   494|                    <div class="formatos-content">
   495|   495|                        <h3 style="text-align:center;margin-bottom:20px;font-family:var(--font-display);color:var(--navy);">🚆 Trenes</h3>
   496|   496|                        <div class="formato-table-wrapper"><table class="formato-table"><thead><tr><th>Formato</th><th class="num">Exhibición mensual</th><th class="num">Producción</th></tr></thead><tbody>${trenesRows}</tbody></table></div>
   497|   497|                        <p class="formato-nota">* No incluye IVA. El costo de producción es por única vez o por cambio de creatividad. Incluye fijación.</p>
   498|   498|                        <br><br>
   499|   499|                        <h3 style="text-align:center;margin-bottom:20px;font-family:var(--font-display);color:var(--navy);">🚌 Colectivos</h3>
   500|   500|                        <div class="formato-table-wrapper"><table class="formato-table"><thead><tr><th>Formato</th><th class="num">Exhibición mensual</th><th class="num">Producción</th></tr></thead><tbody>${colectivosRows}</tbody></table></div>
   501|