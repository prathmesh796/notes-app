import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';
import * as Y from 'yjs';
import { setupWSConnection } from 'y-websocket/dist/y-websocket.cjs';

const port = 1234;
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// File where we save the doc
const PERSISTENCE_FILE = './doc-state.bin';

// Create or load the Yjs document
const doc = new Y.Doc();

// Load existing state from disk if available
if (fs.existsSync(PERSISTENCE_FILE)) {
  const savedState = fs.readFileSync(PERSISTENCE_FILE);
  Y.applyUpdate(doc, savedState);
  console.log('Loaded document from disk.');
}

// Save to disk whenever the document changes
doc.on('update', (update) => {
  const currentState = Y.encodeStateAsUpdate(doc);
  fs.writeFileSync(PERSISTENCE_FILE, currentState);
});

// Handle connections
wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req, { doc }); // Pass doc so all clients share this instance
});

server.listen(port, () => {
  console.log(`y-websocket server running at http://localhost:${port}`);
});
