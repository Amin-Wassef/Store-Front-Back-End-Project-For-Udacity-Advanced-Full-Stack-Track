import client from '../../database';
import { userMod, Users } from '../../models/users_m';

// Model instantiation
const users = new Users();

describe('User model testing', () => {
  describe('Functions existance', () => {
    it('"Authenticate" function should exists', () => {
      expect(users.authenticate).toBeDefined();
    });
    it('"Create" function should exists', () => {
      expect(users.create).toBeDefined();
    });
    it('"Show all" function should exists', () => {
      expect(users.s_all).toBeDefined();
    });
    it('"Show specific" function should exists', () => {
      expect(users.s_one).toBeDefined();
    });
    it('"Update" function should exists', () => {
      expect(users.up_user).toBeDefined();
    });
    it('"Delete" function should exists', () => {
      expect(users.delete).toBeDefined();
    });
  });
  describe('Fuctions act properly', () => {
    beforeAll(async () => {
      const user_create = await users.create({
        first_name: 'Amin',
        last_name: 'Wassef',
        password: 'qwe',
      } as userMod);
    });
    afterAll(async () => {
      const user = await users.delete({
        id: '1',
        password: '',
      });
    });
    it('User authentication', async () => {
      const user_auth = await users.authenticate({
        first_name: 'Amin',
        last_name: 'Wassef',
        password: 'qwe',
      } as userMod);
      expect(user_auth?.first_name).toBe('Amin');
      expect(user_auth?.last_name).toBe('Wassef');
    });
    it('User authentication failed', async () => {
      const user_auth = await users.authenticate({
        first_name: 'Amin',
        last_name: 'Wassef',
        password: 'wrong password',
      } as userMod);
      expect(user_auth).toBe(null);
    });
    it('Create new user', async () => {
      const user_create = await users.create({
        first_name: 'Daniel',
        last_name: 'Wassef',
        password: 'asd',
      } as userMod);
      expect(user_create.first_name).toBe('Daniel');
      expect(user_create.last_name).toBe('Wassef');
    });
    it('Show all users data', async () => {
      const all_users_show = await users.s_all();
      expect(all_users_show.length).toBe(2);
    });
  });
});
