<script>
    import { data, colors } from './data.js';

    let { activeList = [], theme = 'dark' } = $props();

    // Tendencia = variación 2024 vs 2023.
    // Favorable: PIB acelera (Δ>0), deuda baja (Δ<0), riesgo baja (Δ<0).
    function build(list) {
        const rows = list.map(c => {
            const v = data[c];
            const last = v[v.length - 1];   // 2024
            const prev = v[v.length - 2];   // 2023
            const dPib = +(last.pib - prev.pib).toFixed(1);
            const dDeuda = +(last.deuda - prev.deuda).toFixed(1);
            const dEmbi = (last.embi != null && prev.embi != null) ? (last.embi - prev.embi) : null;
            let score = 0;
            if (dPib > 0) score++;
            if (dDeuda < 0) score++;
            if (dEmbi != null && dEmbi < 0) score++;
            return { c, dPib, dDeuda, dEmbi, score, pib2024: last.pib };
        });
        // orden: más señales favorables primero; desempate por crecimiento real 2024
        rows.sort((a, b) => b.score - a.score || b.pib2024 - a.pib2024);
        return rows;
    }

    let rows = $derived(build(activeList));

    const fav = '#22c55e';   // verde = mejora
    const bad = '#ef4444';   // rojo = empeora
    function pibColor(d) { return d > 0 ? fav : bad; }
    function debtColor(d) { return d < 0 ? fav : bad; }
    function embiColor(d) { return d == null ? 'var(--muted)' : (d < 0 ? fav : bad); }
    function sign(n) { return n > 0 ? '+' + n : '' + n; }
</script>

<div class="overflow-x-auto">
    <table class="w-full text-sm" style="border-collapse:collapse">
        <thead>
            <tr style="color:var(--muted); border-bottom:1px solid var(--border)">
                <th class="text-left py-2 pr-3 font-semibold">#</th>
                <th class="text-left py-2 pr-3 font-semibold">País</th>
                <th class="text-right py-2 px-3 font-semibold">Δ PIB <span class="font-normal">(pp)</span></th>
                <th class="text-right py-2 px-3 font-semibold">Δ Deuda <span class="font-normal">(pp)</span></th>
                <th class="text-right py-2 px-3 font-semibold">Δ EMBI <span class="font-normal">(pb)</span></th>
                <th class="text-center py-2 pl-3 font-semibold">Señales</th>
            </tr>
        </thead>
        <tbody>
            {#each rows as r, i}
                <tr style="border-bottom:1px solid var(--border)">
                    <td class="py-2 pr-3" style="color:var(--muted)">{i + 1}</td>
                    <td class="py-2 pr-3 font-semibold" style="color:var(--text)">
                        <span style="display:inline-block;width:9px;height:9px;border-radius:999px;background:{colors[r.c]};margin-right:6px"></span>{r.c}
                    </td>
                    <td class="text-right py-2 px-3 font-mono" style="color:{pibColor(r.dPib)}">{sign(r.dPib)}</td>
                    <td class="text-right py-2 px-3 font-mono" style="color:{debtColor(r.dDeuda)}">{sign(r.dDeuda)}</td>
                    <td class="text-right py-2 px-3 font-mono" style="color:{embiColor(r.dEmbi)}">{r.dEmbi == null ? 'n/d' : sign(r.dEmbi)}</td>
                    <td class="text-center py-2 pl-3 font-semibold" style="color:{r.score >= 2 ? fav : (r.score === 0 ? bad : 'var(--text)')}">{r.score}/3</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
{#if rows.length === 0}
    <p class="text-sm py-4" style="color:var(--muted)">Activá al menos un país para ver el ranking.</p>
{/if}
