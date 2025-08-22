// Minimal demo WebSocket server to broadcast simple messages to all clients.
// Not production-ready. Run with `node server/server.js`.
// Listens on port 3001
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 }, () => {
  console.log('WebSocket server listening on ws://localhost:3001');
});

let clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected. total:', clients.size);
  ws.on('message', (data) => {
    let parsed = null;
    try {
      parsed = JSON.parse(data.toString());
    } catch (e) {
      console.warn('Invalid JSON from client', e);
      return;
    }
    // Basic echo/broadcast: tag with server timestamp and rebroadcast to everyone
    const out = { serverTime: Date.now(), from: 'server', received: parsed };
    broadcast(JSON.stringify(out));
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. total:', clients.size);
  });

  ws.on('error', (err) => {
    console.warn('WS error', err);
  });

  // send a hello
  ws.send(JSON.stringify({ from: 'server', msg: 'welcome' }));
});

function broadcast(msg) {
  for (const c of Array.from(clients)) {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  }
}

// simple persistence of snapshots to file (append only)
const fs = require('fs');
const path = require('path');
const outFile = path.join(__dirname, 'snapshots.log');
setInterval(() => {
  // write a heartbeat entry
  fs.appendFile(outFile, `[${new Date().toISOString()}] clients=${clients.size}\n`, () => {});
}, 60000);

console.log('Server ready.');
