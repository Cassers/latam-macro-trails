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
            <h2 class="text-sm font-semibold mb-1">3 · PIB per cápita (crecim. %) por año</h2>
            <TimeSeries {activeList} {theme} dataKey="pibpc" label="PIB per cápita" yDomain={[-20, 17]} zeroLine={true} />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">
                4 · Inflación (IPC %) por año
                <span class="font-normal" style="color:var(--muted)">— escala symlog</span>
            </h2>
            <TimeSeries {activeList} {theme} dataKey="infla" label="Inflación"
                yDomain={[-2, 230]} yTicks={[0, 3, 10, 30, 100, 200]} scaleType="symlog" />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">5 · Desempleo (%) por año</h2>
            <TimeSeries {activeList} {theme} dataKey="desempleo" label="Desempleo" yDomain={[0, 17]} yTicks={[0, 5, 10, 15]} />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">6 · Deuda pública (% del PIB) por año</h2>
            <TimeSeries {activeList} {theme} dataKey="deuda" label="Deuda" yDomain={[18, 160]} />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">
                7 · Riesgo país (EMBI, pb) por año
                <span class="font-normal" style="color:var(--muted)">— escala log</span>
            </h2>
            <TimeSeries {activeList} {theme} dataKey="embi" label="EMBI" suffix=" pb"
                yDomain={[80, 2400]} yTicks={[100, 200, 400, 800, 1600]} scaleType="log" />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">
                8 · Desigualdad — Gini por año
                <span class="font-normal" style="color:var(--muted)">— Chile/México: bianual</span>
            </h2>
            <TimeSeries {activeList} {theme} dataKey="gini" label="Gini" suffix="" yDomain={[38, 56]} yTicks={[40, 45, 50, 55]} />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">
                9 · Homicidios (por 100k hab.) por año
                <span class="font-normal" style="color:var(--muted)">— hasta 2023</span>
            </h2>
            <TimeSeries {activeList} {theme} dataKey="homic" label="Homicidios" suffix="" yDomain={[0, 50]} yTicks={[0, 10, 20, 30, 40, 50]} />
        </section>
    </div>

    <section class="panel rounded-xl p-4 mt-5">
        <h2 class="text-sm font-semibold mb-1">
            5 · Ranking de tendencias <span class="font-normal" style="color:var(--muted)">— variación 2024 vs 2023</span>
        </h2>
        <p class="text-xs mb-3" style="color:var(--muted)">
            Δ = variación 2024 vs 2023. Señales = nº de variables con variación favorable
            (PIB Δ&gt;0, Deuda Δ&lt;0, EMBI Δ&lt;0). Orden: por señales y, en empate, por crecimiento del PIB 2024.
        </p>
        <RankingTable {activeList} {theme} />
    </section>

    <footer class="mt-5 border-t pt-4 text-xs leading-relaxed" style="color:var(--muted); border-color:var(--border)">
        <span class="font-semibold" style="color:var(--text)">Fuentes verificadas:</span>
        <ul class="mt-2 space-y-1 list-disc pl-5">
            <li>
                <span style="color:var(--text)">PIB y PIB per cápita (% crecimiento real):</span>
                <a class="src" href="https://datos.bancomundial.org/indicador/NY.GDP.MKTP.KD.ZG" target="_blank" rel="noopener">Banco Mundial — NY.GDP.MKTP.KD.ZG / NY.GDP.PCAP.KD.ZG</a>
            </li>
            <li>
                <span style="color:var(--text)">Inflación (IPC % anual):</span>
                <a class="src" href="https://datos.bancomundial.org/indicador/FP.CPI.TOTL.ZG" target="_blank" rel="noopener">Banco Mundial — FP.CPI.TOTL.ZG</a>
            </li>
            <li>
                <span style="color:var(--text)">Desempleo (% fuerza laboral, modelo OIT):</span>
                <a class="src" href="https://datos.bancomundial.org/indicador/SL.UEM.TOTL.ZS" target="_blank" rel="noopener">Banco Mundial — SL.UEM.TOTL.ZS</a>
            </li>
            <li>
                <span style="color:var(--text)">Desigualdad (índice de Gini):</span>
                <a class="src" href="https://datos.bancomundial.org/indicador/SI.POV.GINI" target="_blank" rel="noopener">Banco Mundial — SI.POV.GINI</a>
                — Chile y México se miden cada 2 años.
            </li>
            <li>
                <span style="color:var(--text)">Homicidios (por 100k hab.):</span>
                <a class="src" href="https://datos.bancomundial.org/indicador/VC.IHR.PSRC.P5" target="_blank" rel="noopener">Banco Mundial / UNODC — VC.IHR.PSRC.P5</a>
                — serie hasta 2023; Perú hasta 2021.
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
