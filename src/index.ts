import express, { Request, Response } from 'express';
import users_router from './routes_handlers/usres_r_h';
import products_router from './routes_handlers/products_r_h';
import orders_router from './routes_handlers/orders_r_h';

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
  res.status(200).send('Hello Baby Jesus .. Main route is working properly');
});

app.use(express.json());

users_router(app);

products_router(app);

orders_router(app);

export default app;
