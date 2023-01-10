// import express from "express";
import { Router, Request, Response } from 'express';
import { Products } from '../models/products_m';
import { user_verifyAuthToken } from '../middlewares/authorizations/user_authorization';
import { admin_super_admin_authorization } from '../middlewares/authorizations/admin_super_admin_authorization';

// Model instantiation
const products = new Products();

// const products_router = express.Router();
const products_router = Router();

// Create new product end point
products_router.post(
  '/',
  admin_super_admin_authorization,
  async (req: Request, res: Response) => {
    try {
      const product = await products.create(req.body);
      res.json(product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Delete product end point
products_router.delete(
  '/:id',
  admin_super_admin_authorization,
  async (req: Request, res: Response) => {
    try {
      const product = await products.delete(req.body);
      res.json(product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show all products data end point
products_router.get(
  '/',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const product = await products.s_all();
      res.json(product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show specific product's data end point
products_router.get(
  '/:id',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const product = await products.s_one(req.body);
      res.json(product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Update product's data end point
products_router.patch(
  '/:id',
  admin_super_admin_authorization,
  async (req: Request, res: Response) => {
    try {
      const product = await products.up_pdt(req.body);
      res.json(product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

export default products_router;
