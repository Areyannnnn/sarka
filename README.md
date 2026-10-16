# Wedding Website

An animated invitation site for Saurav & Alka, with a hidden admin dashboard.

Guests open a sealed invitation (two doors swing open), then scroll through the story timeline, the three celebrations with wardrobe planners, travel and venue details, an RSVP, and local recommendations.

## Requirements
- Node.js 20 (use `nvm use` — a `.nvmrc` is provided)
- MongoDB running locally (`mongodb://127.0.0.1:27017/wedding`), or set `MONGO_URI` in `server/.env`
- `ADMIN_PASSWORD` in `server/.env` (and in the host's environment variables) to unlock `/admin`. Without it, admin actions are refused.

## Setup
```bash
nvm use
npm run install:all
npm run seed        # loads the couple, venue and the three celebrations (fills only empty fields; safe to re-run)
```

`npm run seed` writes to the database in `MONGO_URI` (from `server/.env`) and leaves anything already edited in the admin dashboard alone; `npm run seed -- --force` overwrites everything with the defaults. To seed a different database:
```bash
MONGO_URI=mongodb://127.0.0.1:27017/wedding npm run seed
```

## Run (dev)
Start MongoDB (if not already running):
```bash
mongod --dbpath <your-db-path>
```

Then, from the project root:
```bash
npm run dev
```
This starts the Express API on port 5000 and the Vite dev server on port 5173 (with `/api` and `/uploads` proxied).

Visit:
- `http://localhost:5173/` — the invitation
- `http://localhost:5173/wardrobe/haldi` (also `sangeet`, `wedding`) — outfit planners for each celebration
- `http://localhost:5173/admin` — the admin dashboard (not linked anywhere; asks for `ADMIN_PASSWORD`, and a sign-in lasts 7 days)

## What lives where
- **Admin dashboard (database):** couple names, tagline, countdown time, RSVP deadline, hero image, story intro, venue and map pin, events (with theme, dress code and wardrobe planner), gallery photos, RSVPs (with CSV export) and guest notes.
- **`client/src/data/content.js`:** story chapters and photos, travel steps, venue blurb, places to explore and the wardrobe planners.
- **`client/public/images/`:** story photos, venue illustration and wardrobe outfits.

## Structure
- `server/` — Express + Mongoose API, file uploads saved to `server/uploads`, seed script in `server/src/seed.js`
- `client/` — React + Vite frontend (Tailwind CSS, Framer Motion, React Leaflet)
