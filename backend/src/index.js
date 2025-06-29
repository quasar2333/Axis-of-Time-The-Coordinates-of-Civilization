import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
