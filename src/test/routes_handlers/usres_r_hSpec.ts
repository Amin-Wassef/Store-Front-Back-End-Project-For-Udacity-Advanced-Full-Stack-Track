import supertest from 'supertest';
import app from '../..';
import { userMod, Users } from '../../models/users_m';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET } = process.env;

// Model instantiation
const users = new Users();

const request = supertest(app);

describe('Users end points testing', () => {
  let create_user: userMod;
  let Mina_token: string;

  beforeAll(async () => {
    create_user = await users.create({
      first_name: 'Mina',
      last_name: 'Nabil',
      password: 'rty',
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
      first_name: 'Mina',
      last_name: 'Nabil',
      password: 'rty',
    } as userMod);
    expect(response.status).toBe(200);
    Mina_token = JSON.parse(response.text);
  });

  it('User authentication failed', async () => {
    const response = await request.post('/users/authenticate').send({
      first_name: 'Mina',
      last_name: 'Nabil',
      password: 'wrong password',
    } as userMod);
    expect(response.status).toBe(401);
  });

  let token: string;
  let user_id: number | string;

  it(`Create new user`, async () => {
    const response = await request.post('/users').send({
      first_name: 'Samuel',
      last_name: 'Fouad',
      password: 'fgh',
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

  it(`Show all users' data`, async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it(`Show all users' data failed`, async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Show specific user's data`, async () => {
    const response = await request
      .get(`/users/${user_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it(`Show specific user's data failed`, async () => {
    const response = await request
      .get(`/users/${user_id}`)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Update user's data`, async () => {
    const response = await request
      .patch(`/users/${user_id}`)
      .send({
        first_name: 'samuel',
        last_name: 'fouad',
        password: 'fgh',
      } as userMod)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it(`Update user's data failed`, async () => {
    const response = await request
      .patch(`/users/${user_id}`)
      .send({
        first_name: 'SAMUEL',
        last_name: 'FOUAD',
        password: 'fgh',
      } as userMod)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Delete user failed`, async () => {
    const response = await request
      .delete(`/users/${user_id}`)
      .set('Authorization', `Bearer wrongToken`);
    expect(response.status).toBe(401);
  });

  it(`Delete user`, async () => {
    const response = await request
      .delete(`/users/${user_id}`)
      .set('Authorization', `Bearer ${Mina_token}`);
    expect(response.status).toBe(200);
  });
});
