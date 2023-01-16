import supertest from 'supertest';
import app from '..';

const request = supertest(app);

describe('Main route testing', () => {
  it('Main route should work properly', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      'Hello Baby Jesus .. Main route is working properly'
    );
  });
});


