import supertest from 'supertest';
import app from '..';

const request = supertest(app);

it('Main route testing', async () => {
  const response = await request.get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('Hello Baby Jesus');
});
