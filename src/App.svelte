<script>
    import { data, colors, countries } from './lib/data.js';
    import Trails from './lib/Trails.svelte';
    import TimeSeries from './lib/TimeSeries.svelte';
    import RankingTable from './lib/RankingTable.svelte';

    let theme = $state('dark');
    let active = $state(new Set(countries));

    // lista derivada que pasamos a los gráficos (array para reactividad simple)
    let activeList = $derived(countries.filter(c => active.has(c)));

    $effect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    });

    function toggleCountry(c) {
        const next = new Set(active);
        if (next.has(c)) next.delete(c); else next.add(c);
        active = next;
    }
    function selAll() { active = new Set(countries); }
    function selNone() { active = new Set(); }
    function toggleTheme() { theme = theme === 'dark' ? 'light' : 'dark'; }
</script>

<div class="p-6 min-h-screen">
    <header class="mb-4 flex items-start justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold" style="color:#22b88a">Trayectorias Macroeconómicas en Latinoamérica (2016 – 2024)</h1>
            <p class="text-sm mt-1 max-w-4xl" style="color:var(--muted)">
                Crecimiento real del PIB y deuda pública de 9 economías. Datos oficiales verificados (Banco Mundial + FMI). Hecho con Svelte + D3.
            </p>
        </div>
        <button class="btn whitespace-nowrap" onclick={toggleTheme} title="Cambiar tema">
            {theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
    </header>

    <div class="mb-4 flex flex-wrap items-center gap-2">
        <span class="text-xs mr-1" style="color:var(--muted)">Países:</span>
        {#each countries as c}
            <button class="chip" class:active={active.has(c)} onclick={() => toggleCountry(c)}>
                <span class="dot" style="background:{colors[c]}"></span>{c}
            </button>
        {/each}
        <span class="mx-1 text-xs" style="color:var(--border)">|</span>
        <button class="btn" onclick={selAll}>Todos</button>
        <button class="btn" onclick={selNone}>Ninguno</button>
    </div>

    <section class="panel rounded-xl p-4 mb-5">
        <h2 class="text-sm font-semibold mb-1">
            1 · Trayectoria PIB vs Deuda
            <span class="font-normal" style="color:var(--muted)">— el "viaje" de cada país año a año (punto grande = 2024)</span>
        </h2>
        <Trails {activeList} {theme} />
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">2 · Crecimiento del PIB (%) por año</h2>
            <TimeSeries {activeList} {theme} dataKey="pib" label="PIB" yDomain={[-19, 17]} zeroLine={true} />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">3 · Deuda pública (% del PIB) por año</h2>
            <TimeSeries {activeList} {theme} dataKey="deuda" label="Deuda" yDomain={[18, 160]} />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">
                4 · Riesgo país (EMBI, pb) por año
                <span class="font-normal" style="color:var(--muted)">— escala log</span>
            </h2>
            <TimeSeries {activeList} {theme} dataKey="embi" label="EMBI" suffix=" pb"
                yDomain={[80, 2400]} yTicks={[100, 200, 400, 800, 1600]} logScale={true} />
        </section>
    </div>

    <section class="panel rounded-xl p-4 mt-5">
        <h2 class="text-sm font-semibold mb-1">
            5 · Ranking de tendencias <span class="font-normal" style="color:var(--muted)">— variación 2024 vs 2023</span>
        </h2>
        <p class="text-xs mb-3" style="color:var(--muted)">
            <span style="color:#22c55e">Verde = mejora</span> (PIB acelera · deuda baja · riesgo baja),
            <span style="color:#ef4444">rojo = empeora</span>. La columna <b>Señales</b> cuenta cuántas de las 3 mejoraron (0–3).
            Empates se ordenan por el crecimiento real del PIB 2024.
        </p>
        <RankingTable {activeList} {theme} />
        <p class="text-xs mt-3" style="color:var(--muted)">
            ⚠️ <b style="color:var(--text)">Leer con contexto:</b> esto mide <i>tendencia</i> (cambio), no <i>nivel</i> de salud.
            Argentina puntúa alto porque mejora desde una crisis profunda — pero la fuerte baja de su deuda es
            <b>nominal</b> (efecto de la devaluación), no pago real, y sigue en recesión (PIB −1,3%). Un score mecánico
            sin contexto engaña.
        </p>
    </section>

    <footer class="mt-5 border-t pt-4 text-xs leading-relaxed" style="color:var(--muted); border-color:var(--border)">
        <span class="font-semibold" style="color:var(--text)">Fuentes verificadas:</span>
        <ul class="mt-2 space-y-1 list-disc pl-5">
            <li>
                <span style="color:var(--text)">PIB (% crecimiento real):</span>
                <a class="src" href="https://datos.bancomundial.org/indicador/NY.GDP.MKTP.KD.ZG" target="_blank" rel="noopener">Banco Mundial — indicador NY.GDP.MKTP.KD.ZG</a>
            </li>
            <li>
                <span style="color:var(--text)">Deuda pública (% del PIB):</span>
                <a class="src" href="https://www.imf.org/external/datamapper/GGXWDG_NGDP" target="_blank" rel="noopener">FMI — World Economic Outlook (deuda bruta del gobierno general)</a>
            </li>
            <li>
                <span style="color:var(--text)">EMBI / riesgo país (pb, cierre de diciembre):</span>
                <a class="src" href="https://estadisticas.bcrp.gob.pe/estadisticas/series/mensuales/indicadores-de-riesgo-para-paises-emergentes-embig" target="_blank" rel="noopener">J.P. Morgan vía Banco Central de Reserva del Perú (BCRP)</a>
            </li>
            <li>
                <span style="color:var(--text)">Panamá y Uruguay (EMBI 2023–2024):</span>
                <a class="src" href="https://www.bloomberglinea.com/latinoamerica/asi-evoluciono-el-riesgo-pais-en-latinoamerica-en-2024-el-ranking-de-mexico-a-argentina/" target="_blank" rel="noopener">J.P. Morgan vía Bloomberg Línea</a>
                — el BCRP no publica su serie; años previos quedan sin dato.
            </li>
            <li>
                <span style="color:var(--text)">Ecuador 2024 (−2,0%):</span>
                <a class="src" href="https://www.bce.fin.ec/la-economia-ecuatoriana-reporto-una-contraccion-anual-de-20-en-2024/" target="_blank" rel="noopener">Banco Central del Ecuador</a>
            </li>
        </ul>
    </footer>
</div>
