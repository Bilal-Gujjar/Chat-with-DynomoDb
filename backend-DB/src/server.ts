import express from 'express';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';
import qaRoutes from './routes/qa.routes';
import { getQuestions } from './models/qa.model';
const app = express();
app.use(cors());
app.use(qaRoutes);
const port = process.env.PORT || 8080;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', async (message) => {
    console.log(`Received message: ${message}`);
    const data = JSON.parse(message.toString());
    const question = data.question;
    const questions = await getQuestions();
    if (!questions) {
      // Handle error
      console.error('Failed to retrieve data from DynamoDB');
      return;
    }
    const qaItem = questions.find((item) => item.question === question);
    const answer = qaItem ? qaItem.answer : 'Sorry, I don\'t know the answer to that question.';
    const words = answer.split(' ');
    let index = 0;
    const intervalId = setInterval(() => {
      ws.send(words[index]);
      index++;
      if (index === words.length) {
        clearInterval(intervalId);
      }
    }, 100);
    console.log(`Sent answer: ${answer}`);
    
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
