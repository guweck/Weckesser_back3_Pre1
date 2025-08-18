import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';


const app = express();
const PORT = process.env.PORT||8080;
const MONGO_URL = process.env.MONGO_URL ?? process.env.MONGO_URI;
const PORT = Number(process.env.PORT || process.env.PUERTO || 8080);
if(!MONGO_URL){ console.error('Falta MONGO_URL/MONGO_URI en .env'); process.exit(3); }
const connection = mongoose.connect(MONGO_URL)

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))