# Strolli

Brooklyn stroller walks for napping kids.

**Live:** https://jamoscow.github.io/strolli/

## What is this?

Strolli helps parents in Brooklyn find the perfect stroller route for their baby's nap window. Pick how long your baby needs to sleep, and get curated walking routes that follow real streets — optimized for smooth sidewalks, flat terrain, shade, and low traffic noise.

Also discover family-friendly spots: parks, playgrounds, cafes, restaurants, and picnic areas — all rated for stroller accessibility.

## Neighborhoods

- **Fort Greene** — fully covered with 7 routes and 14 spots
- **Park Slope** — 3 routes and 6 spots
- Cobble Hill, Carroll Gardens, Brooklyn Heights, DUMBO — coming soon

## Features

- **Nap Routes** — curated loops and point-to-point walks filtered by nap duration (15–90 min)
- **Surface & elevation info** — know if a route is flat, smooth, hilly, or mixed before you go
- **Interactive map** — all routes visible, tap to select, geolocation to find the closest start
- **Places** — parks, playgrounds, cafes, restaurants, picnic spots filtered by category
- **Favorites** — save routes and spots (stored locally, no account needed)
- **Mobile-first** — designed for one-handed use while pushing a stroller
- **Parent tips** — real notes from parents who've walked these routes

## Tech stack

- React + TypeScript
- Vite (static build, hosted on GitHub Pages)
- Mapbox GL JS (map rendering + route display)
- Tailwind CSS (styling)
- Framer Motion (animations)

## Development

```bash
npm install
npm run dev
```

Create a `.env` file with your Mapbox token:

```
VITE_MAPBOX_TOKEN=your_token_here
```

## Deployment

Pushes to `main` auto-deploy via GitHub Actions to GitHub Pages.

## Contributing

This is a prototype. If you're a Brooklyn parent with route suggestions, spot recommendations, or feedback — open an issue.
