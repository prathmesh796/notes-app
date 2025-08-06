import WebSocket from 'ws';
import { OT, OTTypes } from './OT.js';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to the server');
  sendUpdates("Hello ", 0, OTTypes.INSERT);
});

ws.on('message', (message) => {
  console.log(`Received message: ${message.toString()}`);
});

ws.on('error', (error) => {
  console.error(`Error occurred: ${error.message}`);
});

ws.on('close', () => {
  console.log('Disconnected from the server');
});

const sendUpdates = (data: string, pos: number, type: OTTypes): void => {
  const operation: OT = {
    type,
    value: data,
    pos,
    timestamp: Date.now(),
  };
  ws.send(JSON.stringify(operation));
};

export { sendUpdates };
