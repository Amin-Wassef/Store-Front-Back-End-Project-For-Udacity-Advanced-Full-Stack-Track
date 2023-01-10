import express, { Request, Response } from 'express';
import products_router from './routes/products_r';
import users_router from './routes/usres_r';
import orders_router from './routes/orders_r';

// Server instantiation
const app = express();

import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server has been started');
  console.log(`http://localhost:${port}`);
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Main route is working');
});

app.use(express.json());

app.use('/users', users_router);

app.use('/products', products_router);

app.use('/orders', orders_router);

export default app;
