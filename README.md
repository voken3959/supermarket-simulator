```markdown
# Supermarket Simulator — Expanded Prototype

This repository contains an expanded 2D supermarket simulator web prototype built with React + TypeScript + Phaser 3.

What's included (expanded from MVP)
- 2D supermarket map with aisles and tiled layout
- Player movement (WASD / Arrow keys)
- Items placed in the store you can pick up
- React UI overlay with advanced inventory and drag & drop (React DnD)
- NPC shoppers with simple A* pathfinding, goals, and checkout behavior
- Checkout lanes with queuing behavior
- Lightweight local multiplayer sync server (WebSocket) that broadcasts state (simple authoritative server for demo)
- Save / load (localStorage + server persistence)
- EventBus for UI <-> Game communication
- Zustand state store for global UI/game state
- Store control panel for spawning items, toggling NPCs, exporting logs
- Sound hooks (simple beeps)
- Clean project scaffold (Vite + TypeScript)

Quick start (dev)
1. Install dependencies:
   npm install

2. Start dev server + local WebSocket server:
   npm run start
   - Opens Vite dev server on http://localhost:5173
   - Starts a local WebSocket server on ws://localhost:3001

3. Or run front-end only:
   npm run dev

Notes
- The WebSocket server is minimal and meant for demonstration. It accepts connections and broadcasts snapshots. It's not secure or production-ready.
- Assets are procedurally generated (no external image assets required). Replace with sprite sheets & audio as desired.

Next steps you can request (I can implement iteratively)
- Full multiplayer authoritative server with player authentication and persistence (Node + DB)
- Polished art, animations, and sound design
- Rich AI for NPC shoppers (budgeting, preferences, group shopping)
- Admin dashboard & metrics export (CSV, analytics)
- User accounts, cloud saves, and daily in-game economy

If you'd like I will:
- Continue and polish any requested feature from the list above
- Improve server to be TypeScript with file persistence or add a simple REST API
- Add more advanced UI interactions (drag items from map into React cart, receipts, coupons)

Tell me which of the advanced features you want prioritized next or if you want the whole stack hardened for production. 
```
