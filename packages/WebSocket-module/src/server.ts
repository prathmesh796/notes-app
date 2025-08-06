import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { OTTypes, OT } from './OT.js';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

const wss = new WebSocketServer({ server });

let documentText = ""; 
const clients = new Set<WebSocket>(); 

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  clients.add(ws);

  // Send initial document state
  ws.send(JSON.stringify({ type: OTTypes.INIT, content: documentText }));

  ws.on('message', (message: WebSocket.Data) => {
    try {
      const msgStr = message.toString();
      let op: OT;

      try {
        op = JSON.parse(msgStr) as OT;
      } catch {
        console.log('Non-JSON message received:', msgStr);
        return;
      }

      if (!Object.values(OTTypes).includes(op.type)) {
        console.error('Invalid operation type:', op.type);
        return;
      }
      if (typeof op.pos !== 'number' || typeof op.value !== 'string') {
        throw new Error("Invalid OT operation format");
      }

      switch (op.type) {
        case OTTypes.INSERT:
          documentText = 
            documentText.slice(0, op.pos) + 
            op.value + 
            documentText.slice(op.pos);
          break;
        case OTTypes.DELETE:
          documentText = 
            documentText.slice(0, op.pos) + 
            documentText.slice(op.pos + op.value.length);
          break;
        case OTTypes.INIT:
          // You can optionally reset documentText or ignore
          break;
        default:
          console.error('Unhandled operation type:', op.type);
          return;
      }

      console.log(`Document updated: "${documentText}"`);

      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(op));
        }
      }
      console.log(`Broadcasted operation: ${JSON.stringify(op)}`);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error: Error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
