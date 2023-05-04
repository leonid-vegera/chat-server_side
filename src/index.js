import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { EventEmitter } from 'events';
import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

const messages = [];
const emitter = new EventEmitter();

const server = app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

// aka post request
wss.on('connection', (client) => {
  client.on('message', (text) => {
    const message = {
      text: text.toString(),
      time: Date.now(),
    };

    messages.push(message);
    emitter.emit('message', message);
  });
});

// aka get request
emitter.on('message', (message) => {
  for (const client of wss.clients) {
    client.send(JSON.stringify(message));
  }
});
