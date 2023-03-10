import express, { Request, Response } from 'express';
import { productMod, Products } from '../models/products_m';
import { user_authorization } from '../middlewares/authorizations/user_authorization';
import { admin_super_admin_authorization } from '../middlewares/authorizations/admin_super_admin_authorization';

// Model instantiation
const products = new Products();

// Create new product end point
const create_p = async (req: Request, res: Response) => {
  try {
    const product = await products.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Show all products' data end point
const s_all_p = async (req: Request, res: Response) => {
  try {
    const product = await products.s_all();
    res.json(product);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Show specific product's data end point
const s_one_p = async (req: Request, res: Response) => {
  const id: productMod = { id: req.params.id };

  try {
    const product = await products.s_one(id);
    res.json(product);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Update product's data end point
const up_p = async (req: Request, res: Response) => {
  const data: productMod = {
    id: req.params.id,
    pdt_name: req.body.pdt_name,
    pdt_price: req.body.pdt_price,
  };

  try {
    const product = await products.up_pdt(data);
    res.json(product);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Delete product end point
const delete_p = async (req: Request, res: Response) => {
  const id: productMod = { id: req.params.id };

  try {
    const product = await products.delete(id);
    res.json(product);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

const products_router = (app: express.Application) => {
  app.post('/products', admin_super_admin_authorization, create_p);
  app.get('/products', user_authorization, s_all_p);
  app.get('/products/:id', user_authorization, s_one_p);
  app.patch('/products/:id', admin_super_admin_authorization, up_p);
  app.delete('/products/:id', admin_super_admin_authorization, delete_p);
};

export default products_router;
