import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import {EventEmitter} from 'events';

const PORT = process.env.PORT || 5050;

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json());

const messages = [];
const emitter = new EventEmitter();

app.post('/messages', (req, res, next) => {
  const {text} = req.body;
  const message = {
    text,
    time: Date.now()
  }

  messages.push(message);
  emitter.emit('message', message);

  res.status(201).json(message);
})

app.get('/messages', (req, res, next) => {
  emitter.once('message', (message) => {
    res.json(messages);
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`)
})
