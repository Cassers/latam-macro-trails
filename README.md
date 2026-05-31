# Latam Macro Trails — Dashboard PIB vs Deuda

Dashboard interactivo (**Svelte 5 + Vite + D3.js**) de las trayectorias macroeconómicas
de 9 economías de Latinoamérica entre **2016 y 2024**.

**Ver online:** https://cassers.github.io/latam-macro-trails/

## Features
- 🌗 Modo claro / oscuro
- 🔘 Filtros: quitar y poner países (chips + "Todos" / "Ninguno")
- 📊 3 gráficos:
  1. Trayectoria PIB vs Deuda (scatter con "rastro" temporal por país)
  2. Crecimiento del PIB (%) por año
  3. Deuda pública (% del PIB) por año

## Fuentes de datos (verificadas)

| Variable | Fuente | Indicador |
|----------|--------|-----------|
| Crecimiento del PIB (% real) | **Banco Mundial** | `NY.GDP.MKTP.KD.ZG` |
| Deuda pública (% del PIB) | **FMI** (World Economic Outlook) | Deuda bruta del gobierno general |

> Ecuador 2024: contracción de −2,0% confirmada por el Banco Central del Ecuador.
> El EMBI / riesgo país se omitió: J.P. Morgan no publica serie histórica pública
> (no se incluyen cifras estimadas).

## Desarrollo local

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción -> dist/
npm run preview  # previsualizar el build
```

## Deploy
Automático vía **GitHub Actions** (`.github/workflows/deploy.yml`): cada push a `main`
buildea con Vite y publica en GitHub Pages (source de Pages = "GitHub Actions").

## Stack
- [Svelte 5](https://svelte.dev/) (runes) + [Vite 6](https://vite.dev/)
- [D3.js v7](https://d3js.org/) — visualización
- [Tailwind CSS](https://tailwindcss.com/) (CDN) — utilidades de layout
