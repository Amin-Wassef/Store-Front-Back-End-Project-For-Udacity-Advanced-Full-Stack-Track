import express, { Request, Response } from 'express';
import { userMod, Users } from '../models/users_m';
import { super_admin_authorization } from '../middlewares/authorizations/super_admin_authorization';
import { admin_super_admin_authorization } from '../middlewares/authorizations/admin_super_admin_authorization';
import { user_super_admin_authorization } from '../middlewares/authorizations/user_super_admin_authorization';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET } = process.env;

// Model instantiation
const users = new Users();

// Create new user end point
const create_u = async (req: Request, res: Response) => {
  try {
    const user = await users.create(req.body);
    const id = user?.id;
    const first_name = user?.first_name;
    const last_name = user?.last_name;
    const token = jwt.sign(
      { user: { id, first_name, last_name } },
      TOKEN_SECRET as unknown as string
    );
    res.json(token);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Show all users data end point
const s_all_u = async (req: Request, res: Response) => {
  try {
    const user = await users.s_all();
    res.json(user);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Show specific user data end point
const s_one_u = async (req: Request, res: Response) => {
  const data: userMod = {
    id: req.params.id,
    password: req.body.password,
  };
  try {
    const user = await users.s_one(data);
    res.json(user);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Update user's data end point
const up_u = async (req: Request, res: Response) => {
  const data: userMod = {
    id: req.params.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
  };
  try {
    const user = await users.up_user(data);
    res.json(user);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Delete user end point
const delete_u = async (req: Request, res: Response) => {
  const data: userMod = {
    id: req.params.id,
    password: req.body.password,
  };
  try {
    const user = await users.delete(data);
    res.json(user);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

// Password authentication
const auth_u = async (req: Request, res: Response) => {
  try {
    const user = await users.authenticate(req.body);
    const id = user?.id;
    const first_name = user?.first_name;
    const last_name = user?.last_name;
    const token = jwt.sign(
      { user: { id, first_name, last_name } },
      TOKEN_SECRET as unknown as string
    );
    res.json(token);
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

const users_router = (app: express.Application) => {
  app.post('/users', create_u);
  app.get('/users', admin_super_admin_authorization, s_all_u);
  app.get('/users/:id', user_super_admin_authorization, s_one_u);
  app.patch('/users/:id', user_super_admin_authorization, up_u);
  app.delete('/users/:id', super_admin_authorization, delete_u);
  app.post('/users/authenticate', auth_u);
};

export default users_router;
