# WomenRise — Frontend

React + Vite frontend for **WomenRise**, a digital ecosystem empowering women
through education, a handmade marketplace, and community/mentorship.

Backend repo: https://github.com/ibragimovAzizbek/WomenRise---backend

## Stack
- React 18 + Vite
- react-router-dom v6
- axios
- Custom CSS design system (no UI framework)

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173

The dev server proxies `/api` → `http://localhost:8000`, so start the
[backend](https://github.com/ibragimovAzizbek/WomenRise---backend) first.

**Demo login:** `demo@womenrise.org` / `demo1234`

## Pages
Landing · Courses + detail · Marketplace + product detail · Cart/checkout ·
Community feed + post detail · Mentors · Login/Register · Dashboard.

## Project layout
```
src/
  api/client.js        # all backend calls
  context/             # AuthContext, CartContext
  components/          # Navbar, Footer, cards, ui helpers
  pages/               # route components
  styles/index.css     # design system
  App.jsx              # routes
```
