import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/authRouter.js';
import urlRouter from './routers/urlRouter.js';
import usersRouter from './routers/usersRouter.js';

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());

server.use(authRouter);
server.use(urlRouter);
server.use(usersRouter);

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}.`));