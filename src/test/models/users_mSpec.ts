import { userMod, Users } from '../../models/users_m';

// Model instantiation
const users = new Users();

describe('Users model testing', () => {
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
    let create_u: userMod;

    beforeAll(async () => {
      create_u = await users.create({
        first_name: 'Amin',
        last_name: 'Wassef',
        password: 'qwe',
      } as userMod);
      const id = create_u.id;
      const first_name = create_u.first_name;
      const last_name = create_u.last_name;
      console.log({ id, first_name, last_name });
    });
    afterAll(async () => {
      const delete_u = await users.delete({
        id: create_u.id,
        password: '',
      });
    });
    it('User authentication', async () => {
      const auth_user = await users.authenticate({
        first_name: 'Amin',
        last_name: 'Wassef',
        password: 'qwe',
      } as userMod);
      expect(auth_user?.id).toBe(create_u.id);
      expect(auth_user?.first_name).toBe('Amin');
      expect(auth_user?.last_name).toBe('Wassef');
    });
    it('User authentication failed', async () => {
      const auth_user = await users.authenticate({
        first_name: 'wrong first_name',
        last_name: 'Wassef',
        password: 'qwe',
      } as userMod);
      expect(auth_user).toBeNull;
    });

    let create_user: userMod;

    it('Create new user', async () => {
      create_user = await users.create({
        first_name: 'Daniel',
        last_name: 'Wassef',
        password: 'asd',
      });
      const id = create_user.id;
      const first_name = create_user.first_name;
      const last_name = create_user.last_name;
      console.log({ id, first_name, last_name });
      expect(create_user.first_name).toBe('Daniel');
      expect(create_user.last_name).toBe('Wassef');
    });
    it('Show all users data', async () => {
      const show_all_users = await users.s_all();
      expect(show_all_users).toContain(create_user);
    });
    it('Show specific user data', async () => {
      const show_specific_user = await users.s_one({
        id: create_user.id,
        password: '',
      } as userMod);
      expect(show_specific_user.id).toBe(create_user.id);
      expect(show_specific_user.first_name).toBe(create_user.first_name);
      expect(show_specific_user.last_name).toBe(create_user.last_name);
    });
    it(`Update user's data`, async () => {
      const up_user = await users.up_user({
        id: create_user.id,
        first_name: 'daniel',
        last_name: 'wassef',
        password: 'asd',
      } as userMod);
      expect(up_user.id).toBe(create_user.id);
      expect(up_user.first_name).toBe('daniel');
      expect(up_user.last_name).toBe('wassef');
    });
    it(`Delete user`, async () => {
      const delete_user = await users.delete({
        id: create_user.id,
        password: '',
      } as userMod);
      expect(delete_user.id).toBe(create_user.id);
      expect(delete_user.first_name).toBe('daniel');
      expect(delete_user.last_name).toBe('wassef');
    });
  });
});
