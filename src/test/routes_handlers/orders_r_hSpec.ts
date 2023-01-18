import supertest from 'supertest';
import app from '../..';
import { orderMod, Orders } from '../../models/orders_m';
import { userMod, Users } from '../../models/users_m';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET } = process.env;

// Model instantiation
const orders = new Orders();
const users = new Users();

const request = supertest(app);

describe('Orders end points testing', () => {
  let token: string;
  let user_id: number | string;

  beforeAll(async () => {
    const response = await request.post('/users').send({
      first_name: 'Angelos',
      last_name: 'Saad',
      password: 'uio',
    } as userMod);
    expect(response.status).toBe(200);

    token = JSON.parse(response.text);

    const decoded = jwt.verify(
      token,
      TOKEN_SECRET as unknown as string
    ) as JwtPayload;

    user_id = decoded.user.id;
    console.log(decoded.user);
  });
  afterAll(async () => {
    const response = await request
      .delete(`/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  let order_id: string | number;

  it(`Create new order`, async () => {
    const response = await request
      .post('/orders')
      .send({
        user_id: user_id,
        status: 'Inactive',
      } as orderMod)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    order_id = response.body.id;
    console.log(order_id);
  });
  it(`Show all orders data`, async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it(`Show all orders data failed`, async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Show specific order data`, async () => {
    const response = await request
      .get(`/orders/${order_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it(`Show specific order data failed`, async () => {
    const response = await request
      .get(`/orders/${order_id}`)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Update order's status`, async () => {
    const response = await request
      .patch(`/orders/${order_id}`)
      .send({
        status: 'Active',
      } as orderMod)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it(`Update order's status failed`, async () => {
    const response = await request
      .patch(`/orders/${order_id}`)
      .send({
        status: 'Active',
      } as orderMod)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Delete order failed`, async () => {
    const response = await request
      .delete(`/orders/${order_id}`)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Delete order`, async () => {
    const response = await request
      .delete(`/orders/${order_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
