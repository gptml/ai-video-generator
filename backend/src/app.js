import express from 'express';
import logger from 'morgan';
import path from 'node:path';
import errorHandler from './middlewares/errorHandler.js';
import indexRouter from './routes/index.js';
import cors from './middlewares/cors.js';
import './migrate.js'
import authorize from "./middlewares/authorize.js";

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', true);

app.use('/public', express.static(path.resolve('./src/public')));
app.use(logger('dev'));
app.use(cors);
app.use(authorize);
app.use(express.json());
app.use(express.urlencoded());

app.use(indexRouter);

app.use(errorHandler.notFound);
app.use(errorHandler);

const port = +process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Server starting on ${port}`);
});

