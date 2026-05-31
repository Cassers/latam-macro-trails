<script>
    import { data, colors, countries } from './lib/data.js';
    import Trails from './lib/Trails.svelte';
    import TimeSeries from './lib/TimeSeries.svelte';

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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">2 · Crecimiento del PIB (%) por año</h2>
            <TimeSeries {activeList} {theme} dataKey="pib" label="PIB" yDomain={[-19, 17]} zeroLine={true} />
        </section>
        <section class="panel rounded-xl p-4">
            <h2 class="text-sm font-semibold mb-1">3 · Deuda pública (% del PIB) por año</h2>
            <TimeSeries {activeList} {theme} dataKey="deuda" label="Deuda" yDomain={[18, 160]} />
        </section>
    </div>

    <footer class="mt-5 border-t pt-4 text-xs" style="color:var(--muted); border-color:var(--border)">
        <span class="font-semibold" style="color:var(--text)">Fuentes verificadas:</span>
        PIB — Banco Mundial (<code>NY.GDP.MKTP.KD.ZG</code>, API oficial). ·
        Deuda — FMI World Economic Outlook (deuda bruta del gobierno general, % PIB). ·
        Ecuador 2024: contracción de −2,0% confirmada por el Banco Central del Ecuador.
        <span class="italic">El EMBI / riesgo país se omitió: J.P. Morgan no publica serie histórica pública.</span>
    </footer>
</div>
