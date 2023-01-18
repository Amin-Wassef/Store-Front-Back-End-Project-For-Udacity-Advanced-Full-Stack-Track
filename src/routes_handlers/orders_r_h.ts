import express, { Request, Response } from 'express';
import { orderMod, Orders } from '../models/orders_m';
import { user_super_admin_authorization } from '../middlewares/authorizations/user_super_admin_authorization';
import { admin_super_admin_authorization } from '../middlewares/authorizations/admin_super_admin_authorization';
import presence_activity_check from '../middlewares/checking/presence & activity';
import matching_check from '../middlewares/checking/matching';

// Model instantiation
const orders = new Orders();

// Create new order end point
const create_o = async (req: Request, res: Response) => {
  try {
    const order = await orders.create(req.body);
    res.json(order);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Show all orders data end point
const s_all_o = async (req: Request, res: Response) => {
  try {
    const order = await orders.s_all();
    res.json(order);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Show specific order's data end point
const s_one_o = async (req: Request, res: Response) => {
  const data: orderMod = {
    id: req.params.order_id,
    user_id: req.body.user_id,
  };
  try {
    const order = await orders.s_one(data);
    res.json(order);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Update order's status end point
const up_o = async (req: Request, res: Response) => {
  const data: orderMod = {
    status: req.body.status,
    id: req.params.order_id,
    user_id: req.body.user_id,
  };
  try {
    const order = await orders.up_status(data);
    res.json(order);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Delete order end point
const delete_o = async (req: Request, res: Response) => {
  const data: orderMod = {
    id: req.params.order_id,
    user_id: req.body.user_id,
  };
  try {
    const order = await orders.delete(data);
    res.json(order);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Add product end point
const add_op = async (req: Request, res: Response) => {
  const order_id: string = req.params.order_id;
  const pdt_id: number = req.body.pdt_id;
  const quantity: number = req.body.quantity;
  const user_id: string | number = req.body.user_id;

  try {
    const order_product = await orders.add_pdt(
      order_id,
      pdt_id,
      quantity,
      user_id
    );
    res.json(order_product);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Show all orders' products and quantities end point
const s_all_op = async (req: Request, res: Response) => {
  const user_id: string | number = req.body.user_id;
  try {
    const order_product = await orders.s_all_op(user_id);
    res.json(order_product);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Show specific order's products and quantities
const s_one_op = async (req: Request, res: Response) => {
  const op_id: string = req.params.op_id;
  const order_id: string = req.params.order_id;
  const user_id: string | number = req.body.user_id;
  try {
    const order_product = await orders.s_one_op(op_id, order_id, user_id);
    res.json(order_product);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Update product quantities
const up_op = async (req: Request, res: Response) => {
  const order_id: string = req.params.order_id;
  const op_id: string = req.params.op_id;
  const quantity: number = req.body.quantity;
  const user_id: string | number = req.body.user_id;

  try {
    const order_product = await orders.up_pdt_q(
      quantity,
      op_id,
      order_id,
      user_id
    );
    res.json(order_product);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

// Delete product end point
const delete_op = async (req: Request, res: Response) => {
  const order_id: string = req.params.order_id;
  const op_id: string = req.params.op_id;
  const user_id: string | number = req.body.user_id;

  try {
    const order_product = await orders.delete_pdt(op_id, order_id, user_id);
    res.json(order_product);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

const orders_router = (app: express.Application) => {
  app.post('/orders', user_super_admin_authorization, create_o);
  app.get('/orders', admin_super_admin_authorization, s_all_o);
  app.get('/orders/:order_id', user_super_admin_authorization, s_one_o);
  app.patch('/orders/:order_id', user_super_admin_authorization, up_o);
  app.delete('/orders/:order_id', user_super_admin_authorization, delete_o);

  app.post(
    '/orders/:order_id/orders_products',
    presence_activity_check,
    user_super_admin_authorization,
    matching_check,
    add_op
  );
  app.get(
    '/orders/orders_products/:all',
    admin_super_admin_authorization,
    s_all_op
  );
  app.get(
    '/orders/:order_id/orders_products/:op_id',
    user_super_admin_authorization,
    matching_check,
    s_one_op
  );
  app.patch(
    '/orders/:order_id/orders_products/:op_id',
    presence_activity_check,
    user_super_admin_authorization,
    matching_check,
    up_op
  );
  app.delete(
    '/orders/:order_id/orders_products/:op_id',
    presence_activity_check,
    user_super_admin_authorization,
    matching_check,
    delete_op
  );
};

export default orders_router;
