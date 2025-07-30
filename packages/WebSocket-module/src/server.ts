import * as WebSocket from 'ws';

const WS_SERVER_URL = 'ws://localhost:8080';

const ws = new WebSocket.WebSocket(WS_SERVER_URL);

ws.onopen = () => {
  console.log('Connected to WebSocket server');
  ws.send('Hello from the client!');
  console.log('Sent message: "Hello from the client!"');
};

ws.onmessage = (event) => {
  console.log(`Received message from server: ${event.data}`);
};

ws.onclose = (event) => {
  if (event.wasClean) {
    console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error('Connection died unexpectedly');
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error observed:', error);
};

setTimeout(() => {
  if (ws.readyState === ws.OPEN) {
    ws.close(1000, 'Client initiated close');
    console.log('Client initiated WebSocket close.');
  }
}, 5000);
