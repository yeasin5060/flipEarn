import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import {server} from 'inngest/express'
import {inngest , functions} from './inngest/index.js'

const app = express ();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

const PORT = process.env.PORT || 7000;

app.get('/', (req , res)=> res.send('server is live'));
app.use('/api/inngest' , server({client : inngest , functions}))

app.listen(PORT , ()=> console.log(`Server runing on port ${PORT}`))