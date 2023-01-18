import supertest from 'supertest';
import app from '../..';
import { productMod, Products } from '../../models/products_m';
import { userMod, Users } from '../../models/users_m';

// Model instantiation
const products = new Products();
const users = new Users();

const request = supertest(app);

describe('Products end points testing', () => {
  let create_user: userMod;
  let token: string;

  beforeAll(async () => {
    create_user = await users.create({
      first_name: 'BIshoy',
      last_name: 'Boshra',
      password: 'vbn',
    } as userMod);
    const id = create_user.id;
    const first_name = create_user.first_name;
    const last_name = create_user.last_name;
    console.log({ id, first_name, last_name });
  });
  afterAll(async () => {
    const delete_user = await users.delete({
      id: create_user.id,
      password: '',
    });
  });

  it('User authentication', async () => {
    const response = await request.post('/users/authenticate').send({
      first_name: 'BIshoy',
      last_name: 'Boshra',
      password: 'vbn',
    } as userMod);
    expect(response.status).toBe(200);
    token = JSON.parse(response.text);
  });

  let id: string | number;

  it(`Create new product`, async () => {
    const response = await request
      .post('/products')
      .send({
        pdt_name: 'Augmentine 1g Tab',
        pdt_price: 90.25,
      } as productMod)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    id = response.body.id;
    console.log(id);
  });
  it(`Show all products data`, async () => {
    const response = await request
      .get('/products')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it(`Show all products data failed`, async () => {
    const response = await request
      .get('/products')
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Show specific product data`, async () => {
    const response = await request
      .get(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it(`Show specific product data failed`, async () => {
    const response = await request
      .get(`/products/${id}`)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Update product's data`, async () => {
    const response = await request
      .patch(`/products/${id}`)
      .send({
        pdt_name: 'Augmentine 1g tab',
        pdt_price: 95.0,
      } as productMod)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it(`Update product's data failed`, async () => {
    const response = await request
      .patch(`/products/${id}`)
      .send({
        pdt_name: 'Augmentine 1g Tablet',
        pdt_price: 90.5,
      } as productMod)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Delete product failed`, async () => {
    const response = await request
      .delete(`/products/${id}`)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });
  it(`Delete product`, async () => {
    const response = await request
      .delete(`/products/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
