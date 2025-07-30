import http from 'http';
import * as WebSocket from 'ws';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

const wss = new WebSocket.WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  wss.on('message', (message: WebSocket.Data) => {
    console.log(`Received message: ${message}`);
    ws.send(`Server received your message: ${message}`);
  });

  wss.on('close', () => {
    console.log('Client disconnected');
  });

  wss.on('error', (error: Error) => {
    console.error('Client WebSocket error observed:', error);
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
