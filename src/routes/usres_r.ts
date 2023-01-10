// import express from "express";
import { Router, Request, Response } from 'express';
import { Users } from '../models/users_m';
import { super_admin_verifyAuthToken } from '../middlewares/authorizations/super_admin_authorization';
import { user_super_admin_authorization } from '../middlewares/authorizations/user_super_admin_authorization';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET } = process.env;

// Model instantiation
const users = new Users();

// const users_router = express.Router();
const users_router = Router();

// Create new user end point
users_router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await users.create(req.body);
    const token = jwt.sign({ user }, TOKEN_SECRET as unknown as string);
    res.json(token);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

// Delete user end point
users_router.delete(
  '/:id',
  super_admin_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const user = await users.delete(req.body);
      res.json(user);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show all users data end point
users_router.get(
  '/',
  super_admin_verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const user = await users.s_all();
      res.json(user);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Show specific user data end point
users_router.get(
  '/:id',
  user_super_admin_authorization,
  async (req: Request, res: Response) => {
    try {
      const user = await users.s_one(req.body);
      res.json(user);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Update user's data end point
users_router.patch(
  '/:id',
  user_super_admin_authorization,
  async (req: Request, res: Response) => {
    try {
      const user = await users.up_user(req.body);
      res.json(user);
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  }
);

// Password authentication
users_router.post('/authenticate', async (req: Request, res: Response) => {
  try {
    const user = await users.authenticate(req.body);
    const token = jwt.sign({ user }, TOKEN_SECRET as unknown as string);
    res.json(token);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

export default users_router;
