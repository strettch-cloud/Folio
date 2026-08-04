# Folio

Folio is a full-stack reading curriculum web app. It lets you build themed reading plans (curricula) made up of books and articles, track your progress through each item's status, and maintain a personal backlog of things you want to read — with the ability to push backlog items straight into an active curriculum.

## Features

- **Curriculum Builder** — view your active reading plan, track progress with a live progress bar, and cycle each item's status through Not started → In progress → Completed
- **All Curricula** — browse every reading plan you've created, activate one, archive old ones, or delete them
- **Create Curriculum** — spin up a new themed plan with a title, subtitle, and date range
- **Reading Backlog** — a personal library of saved books and articles, searchable and filterable by type, with tags and notes
- **Add / Edit Item modal** — a single reusable form for adding or editing books and articles, shared across the Curriculum and Backlog views
- **Shareable curriculum links** — each curriculum has its own URL (`/curriculum/:id`) so a specific plan can be bookmarked or shared
- **Persistent data** — all data is stored in MongoDB, so it survives refreshes and is available from anywhere the app is deployed

## Local setup

```bash
cp .env.example .env                 # frontend: API base URL
cp server/.env.example server/.env   # backend: Mongo connection + port
npm install && npm run dev           # frontend on :5173
cd server && npm install && npm run dev   # API on :3000
```

Neither `.env` is committed. In production the values are supplied by the host
rather than by a file — see `.env.example` for which is which.

## Tech stack

**Frontend**
- Vue 3 (Composition API, `<script setup>`)
- Vue Router
- Vite
- Lucide icons (`lucide-vue-next`)

**Backend**
- Node.js
- Express
- Mongoose

**Database**
- MongoDB (hosted on MongoDB Atlas)

**Deployment**
- Coolify (on Strettch Cloud)

## Project structure

```
Folio/
├── src/            # Vue frontend
│   ├── components/ # Views and shared components
│   ├── store.js    # Shared reactive state + API calls
│   ├── router.js   # Vue Router routes
│   └── App.vue      # Root component
└── server/         # Express backend
    ├── models/     # Mongoose schemas (Curriculum, BacklogItem)
    ├── routes/     # REST API routes
    └── server.js    # Express app entry point
```

## Running locally

**Backend**
```bash
cd server
npm install
npm run dev
```

**Frontend**
```bash
npm install
npm run dev
```

Requires a `.env` file inside `server/` with:
```
MONGO_URI=your-mongodb-atlas-connection-string
PORT=3000
```
