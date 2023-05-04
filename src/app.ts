import express from 'express';
import cors from 'cors';

const app = express();

app.enable('trust proxy');

app.use(express.json());
app.use(express.urlencoded({extends: true}));
app.use(cors());

export default app;


