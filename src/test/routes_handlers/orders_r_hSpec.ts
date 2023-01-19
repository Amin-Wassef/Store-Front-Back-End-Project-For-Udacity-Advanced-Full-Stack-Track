import supertest from 'supertest';
import app from '../..';
import { orderMod, Orders } from '../../models/orders_m';
import { userMod, Users } from '../../models/users_m';
import { productMod, Products } from '../../models/products_m';
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
  let pdt_id: string | number;

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

    const res = await request
      .post('/products')
      .send({
        pdt_name: 'Flumox 1g Tab',
        pdt_price: 26.0,
      } as productMod)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    pdt_id = res.body.id;
    console.log(res.body);
    console.log(pdt_id);
  });

  afterAll(async () => {
    const response = await request
      .delete(`/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);

    const res = await request
      .delete(`/products/${pdt_id}`)
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
    console.log(response.body);
    expect(response.status).toBe(200);
    order_id = response.body.id;
    console.log(order_id);
  });

  it(`Create new order failed`, async () => {
    const response = await request
      .post('/orders')
      .send({
        user_id: user_id,
        status: 'Inactive',
      } as orderMod)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Show all orders' data`, async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it(`Show all orders' data failed`, async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Show specific order's data`, async () => {
    const response = await request
      .get(`/orders/${order_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it(`Show specific order's data failed`, async () => {
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
        user_id: user_id,
      } as orderMod)
      .set('Authorization', `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  it(`Update order's status failed`, async () => {
    const response = await request
      .patch(`/orders/${order_id}`)
      .send({
        status: 'Inactive',
      } as orderMod)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  let op_id: string | number;

  it('Add product', async () => {
    const response = await request
      .post(`/orders/${order_id}/orders_products`)
      .send({
        pdt_id: pdt_id,
        quantity: 6,
        user_id: user_id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    op_id = response.body.id;
    console.log(response.body);
    console.log(op_id);
  });

  it('Add product failed', async () => {
    const response = await request
      .post(`/orders/${order_id}/orders_products`)
      .send({
        pdt_id: pdt_id,
        quantity: 6,
        user_id: user_id,
      })
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Show all orders' products`, async () => {
    const response = await request
      .get(`/orders/orders_products/all`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it(`Show all orders' products failed`, async () => {
    const response = await request
      .get(`/orders/orders_products/all`)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Show specific order's products and quantities`, async () => {
    const response = await request
      .get(`/orders/${order_id}/orders_products/${op_id}`)
      .send({
        user_id: user_id,
      })
      .set('Authorization', `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  it(`Show specific order's products and quantities failed`, async () => {
    const response = await request
      .get(`/orders/${order_id}/orders_products/${op_id}`)
      .send({
        user_id: user_id,
      })
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Update product's quantities`, async () => {
    const response = await request
      .patch(`/orders/${order_id}/orders_products/${op_id}`)
      .send({
        user_id: user_id,
        quantity: 2,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it(`Update product's quantities failed`, async () => {
    const response = await request
      .patch(`/orders/${order_id}/orders_products/${op_id}`)
      .send({
        user_id: user_id,
        quantity: 2,
      })
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Delete product failed`, async () => {
    const response = await request
      .delete(`/orders/${order_id}/orders_products/${op_id}`)
      .send({
        user_id: user_id,
      })
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Delete product`, async () => {
    const response = await request
      .delete(`/orders/${order_id}/orders_products/${op_id}`)
      .send({
        user_id: user_id,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
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
