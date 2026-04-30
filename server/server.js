import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from './inngest/index.js'
import listingRouter from './routes/listingRoute.js'
import chatRouter from './routes/chatRoute.js'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://flip-earn-henna.vercel.app"
  ],
  credentials: true
}));
app.use(clerkMiddleware());

const PORT = process.env.PORT || 7000;

app.get('/', (req, res) => res.send('server is live'));
app.use('/api/inngest',serve({
    client: inngest,
    functions,
  })
);
app.use('/api/listing', listingRouter);
app.use('/api/chat', chatRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));