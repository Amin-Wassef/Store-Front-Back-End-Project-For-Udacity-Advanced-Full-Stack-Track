// import express from "express";
import { Router, Request, Response } from 'express';
import { Orders } from '../models/orders_m';
import { user_verifyAuthToken } from '../middlewares/authorizations/user_authorization';
import activity_check from '../middlewares/check/order_presence&activity_check';

// Model instantiation
const orders = new Orders();

// const router = express.Router();
const orders_router = Router();

// Create new order end point
orders_router.post(
  '/',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const order = await orders.create(req.body);
      res.json(order);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Delete order end point
orders_router.delete(
  '/:id',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const order = await orders.delete(req.body);
      res.json(order);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show all orders data end point
orders_router.get(
  '/',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const order = await orders.s_all();
      res.json(order);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show specific order's data end point
orders_router.get(
  '/:id',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const order = await orders.s_one(req.body);
      res.json(order);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Update order's status end point
orders_router.patch(
  '/:id',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const order = await orders.up_status(req.body);
      res.json(order);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Add product end point
orders_router.post(
  '/:order_id/orders_products',
  user_verifyAuthToken,
  activity_check,
  async (req: Request, res: Response) => {
    const order_id: string = req.params.order_id;
    const pdt_id: number = req.body.pdt_id;
    const quantity: number = req.body.quantity;

    try {
      const order_product = await orders.add_pdt(order_id, pdt_id, quantity);
      res.json(order_product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Delete product end point
orders_router.delete(
  '/:order_id/orders_products/:op_id',
  user_verifyAuthToken,
  activity_check,
  async (req: Request, res: Response) => {
    const order_id: string = req.params.order_id;
    const op_id: string = req.params.op_id;

    try {
      const order_product = await orders.delete_pdt(op_id);
      res.json(order_product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show all orders' products and quantities end point
orders_router.get(
  '/orders_products',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const order_product = await orders.s_all_op();
      res.json(order_product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show specific order's products and quantities
orders_router.get(
  '/orders_products/:op_id',
  user_verifyAuthToken,
  async (req: Request, res: Response) => {
    const op_id: string = req.params.op_id;
    try {
      const order_product = await orders.s_one_op(op_id);
      res.json(order_product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Update product quantities
orders_router.patch(
  '/:order_id/orders_products/:op_id',
  user_verifyAuthToken,
  activity_check,
  async (req: Request, res: Response) => {
    const order_id: string = req.params.order_id;
    const op_id: string = req.params.op_id;
    const quantity: number = req.body.quantity;

    try {
      const order_product = await orders.up_pdt_q(quantity, op_id);
      res.json(order_product);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

export default orders_router;
