<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { data, colors, countries } from './data.js';
    import { showTip, moveTip, hideTip } from './tooltip.js';

    // props (Svelte 5 runes)
    let { activeList = [], theme = 'dark' } = $props();

    let el;

    function css(v) {
        return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    }

    function draw() {
        if (!el) return;
        el.innerHTML = '';
        const m = { top: 20, right: 120, bottom: 45, left: 55 };
        const W = el.clientWidth, H = el.clientHeight;
        const w = W - m.left - m.right, h = H - m.top - m.bottom;
        const panel = css('--panel');

        const svg = d3.select(el).append('svg').attr('width', W).attr('height', H)
            .append('g').attr('transform', `translate(${m.left},${m.top})`);
        const x = d3.scaleLinear().domain([-19, 17]).range([0, w]);
        const y = d3.scaleLinear().domain([18, 160]).range([h, 0]);

        [-15, -10, -5, 0, 5, 10, 15].forEach(t => {
            svg.append('line').attr('class', 'grid-line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', 0).attr('y2', h);
            svg.append('text').attr('class', 'axis-text').attr('x', x(t)).attr('y', h + 16).attr('text-anchor', 'middle').text(t + '%');
        });
        [20, 40, 60, 80, 100, 120, 140, 160].forEach(t => {
            svg.append('line').attr('class', 'grid-line').attr('y1', y(t)).attr('y2', y(t)).attr('x1', 0).attr('x2', w);
            svg.append('text').attr('class', 'axis-text').attr('x', -9).attr('y', y(t) + 3).attr('text-anchor', 'end').text(t + '%');
        });
        svg.append('text').attr('class', 'axis-text').attr('x', w).attr('y', h + 38).attr('text-anchor', 'end').text('Crecimiento PIB (%) →');
        svg.append('text').attr('class', 'axis-text').attr('transform', 'rotate(-90)').attr('x', 0).attr('y', -42).attr('text-anchor', 'end').text('↑ Deuda (% PIB)');

        const line = d3.line().x(d => x(d.pib)).y(d => y(d.deuda)).curve(d3.curveCatmullRom.alpha(0.5));

        countries.filter(c => activeList.includes(c)).forEach(c => {
            const vals = data[c], color = colors[c];
            const g = svg.append('g');
            g.append('path').datum(vals).attr('class', 'trail-path').attr('d', line).attr('stroke', color).attr('opacity', 0.5);
            vals.forEach(d => {
                const fin = d === vals[vals.length - 1];
                g.append('circle').attr('cx', x(d.pib)).attr('cy', y(d.deuda)).attr('r', fin ? 5.5 : 3)
                    .attr('fill', fin ? color : panel).attr('stroke', color).attr('stroke-width', 1.5).attr('cursor', 'pointer')
                    .on('mouseover', e => { g.select('.trail-path').attr('opacity', 1).attr('stroke-width', 4.5);
                        showTip(`<b style="color:${color}">${c} · ${d.year}</b><br>PIB: <span style="color:${d.pib >= 0 ? '#22c55e' : '#ef4444'}">${d.pib >= 0 ? '+' : ''}${d.pib}%</span><br>Deuda: ${d.deuda}% PIB`, e); })
                    .on('mousemove', e => moveTip(e))
                    .on('mouseout', () => { g.select('.trail-path').attr('opacity', 0.5).attr('stroke-width', 3); hideTip(); });
                if (fin) g.append('text').attr('x', x(d.pib) + 9).attr('y', y(d.deuda) + 4).attr('fill', color).style('font-size', '11px').style('font-weight', '600').text(c);
            });
        });
    }

    onMount(() => {
        const ro = new ResizeObserver(() => draw());
        ro.observe(el);
        return () => ro.disconnect();
    });

    // redibuja cuando cambian los países activos o el tema
    $effect(() => { activeList; theme; draw(); });
</script>

<div bind:this={el} class="w-full" style="height:520px"></div>
