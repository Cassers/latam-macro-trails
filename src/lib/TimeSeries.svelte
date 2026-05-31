<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { data, colors, countries } from './data.js';
    import { showTip, moveTip, hideTip } from './tooltip.js';

    let {
        activeList = [],
        theme = 'dark',
        dataKey = 'pib',
        label = 'PIB',
        suffix = '%',
        yDomain = [-19, 17],
        yTicks = null,        // si null, se calcula con .ticks(5)
        logScale = false,
        zeroLine = false
    } = $props();

    let el;

    function css(v) {
        return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    }

    function draw() {
        if (!el) return;
        el.innerHTML = '';
        const m = { top: 15, right: 70, bottom: 30, left: 46 };
        const W = el.clientWidth, H = el.clientHeight;
        const w = W - m.left - m.right, h = H - m.top - m.bottom;

        const svg = d3.select(el).append('svg').attr('width', W).attr('height', H)
            .append('g').attr('transform', `translate(${m.left},${m.top})`);
        const x = d3.scaleLinear().domain([2016, 2024]).range([0, w]);
        const y = (logScale ? d3.scaleLog() : d3.scaleLinear()).domain(yDomain).range([h, 0]);

        const ticks = yTicks || y.ticks(5);
        ticks.forEach(t => {
            svg.append('line').attr('class', 'grid-line').attr('y1', y(t)).attr('y2', y(t)).attr('x1', 0).attr('x2', w);
            svg.append('text').attr('class', 'axis-text').attr('x', -8).attr('y', y(t) + 3).attr('text-anchor', 'end').text(t + suffix);
        });
        [2016, 2018, 2020, 2022, 2024].forEach(t => {
            svg.append('text').attr('class', 'axis-text').attr('x', x(t)).attr('y', h + 18).attr('text-anchor', 'middle').text(t);
        });
        if (zeroLine) {
            svg.append('line').attr('x1', 0).attr('x2', w).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', css('--axis')).attr('stroke-width', 1);
        }

        const line = d3.line().x(d => x(d.year)).y(d => y(d[dataKey])).curve(d3.curveMonotoneX);

        countries.filter(c => activeList.includes(c)).forEach(c => {
            const color = colors[c];
            const pts = data[c].filter(d => d[dataKey] != null);   // ignora huecos (n/d)
            if (pts.length === 0) return;
            const g = svg.append('g');
            g.append('path').datum(pts).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2).attr('opacity', 0.85)
                .attr('d', line).style('cursor', 'pointer')
                .on('mouseover', () => { g.raise().select('path').attr('stroke-width', 3.5); })
                .on('mouseout', () => g.select('path').attr('stroke-width', 2));
            pts.forEach(d => {
                g.append('circle').attr('cx', x(d.year)).attr('cy', y(d[dataKey])).attr('r', 2.5).attr('fill', color).attr('cursor', 'pointer')
                    .on('mouseover', e => showTip(`<b style="color:${color}">${c} · ${d.year}</b><br>${label}: ${d[dataKey]}${suffix}`, e))
                    .on('mousemove', e => moveTip(e))
                    .on('mouseout', hideTip);
            });
            const last = pts[pts.length - 1];
            g.append('text').attr('x', x(last.year) + 6).attr('y', y(last[dataKey]) + 3).attr('fill', color).style('font-size', '10px').text(c);
        });
    }

    onMount(() => {
        const ro = new ResizeObserver(() => draw());
        ro.observe(el);
        return () => ro.disconnect();
    });

    $effect(() => { activeList; theme; dataKey; logScale; draw(); });
</script>

<div bind:this={el} class="w-full" style="height:320px"></div>
