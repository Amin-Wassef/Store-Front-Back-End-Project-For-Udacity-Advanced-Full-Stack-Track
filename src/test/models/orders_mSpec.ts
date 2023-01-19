import { orderMod, Orders } from '../../models/orders_m';
import { userMod, Users } from '../../models/users_m';

// Models instantiation
const orders = new Orders();
const users = new Users();

describe('Orders model testing', () => {
  describe('Functions existance for orders', () => {
    it('"Create" function should exists', () => {
      expect(orders.create).toBeDefined();
    });
    it('"Show all" function should exists', () => {
      expect(orders.s_all).toBeDefined();
    });
    it('"Show specific" function should exists', () => {
      expect(orders.s_one).toBeDefined();
    });
    it('"Update" function should exists', () => {
      expect(orders.up_status).toBeDefined();
    });
    it('"Delete" function should exists', () => {
      expect(orders.delete).toBeDefined();
    });
  });

  describe('Functions existance for products in orders', () => {
    it('"Add" function should exists', () => {
      expect(orders.add_pdt).toBeDefined();
    });
    it('"Show all" function should exists', () => {
      expect(orders.s_all_op).toBeDefined();
    });
    it('"Show specific" function should exists', () => {
      expect(orders.s_one_op).toBeDefined();
    });
    it('"Update" function should exists', () => {
      expect(orders.up_pdt_q).toBeDefined();
    });
    it('"Delete" function should exists', () => {
      expect(orders.delete_pdt).toBeDefined();
    });
  });

  describe('Fuctions act properly', () => {
    let create_user: userMod;

    beforeAll(async () => {
      create_user = await users.create({
        first_name: 'Arsany',
        last_name: 'Joseph',
        password: 'zxc',
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

    let create_order: orderMod;

    it('Create new order', async () => {
      create_order = await orders.create({
        user_id: create_user.id,
        status: 'Inactive',
      } as orderMod);
      expect(create_order.user_id).toBe(`${create_user.id}`);
      expect(create_order.status).toBe('Inactive');
    });

    it(`Show all orders' data`, async () => {
      const show_all_orders = await orders.s_all();
      expect(show_all_orders.length).toBe(1);
    });

    it(`Show specific order's data`, async () => {
      const show_specific_order = await orders.s_one({
        id: create_order.id,
        user_id: create_user.id,
      } as orderMod);
      expect(show_specific_order.user_id).toBe(`${create_order.id}`);
      expect(show_specific_order.user_id).toBe(`${create_user.id}`);
      expect(show_specific_order.status).toBe('Inactive');
    });

    it(`Update order's status`, async () => {
      const up_order = await orders.up_status({
        id: create_order.id,
        user_id: create_user.id,
        status: 'Active',
      } as orderMod);
      expect(up_order.id).toBe(create_order.id);
      expect(up_order.user_id).toBe(`${create_user.id}`);
      expect(up_order.status).toBe('Active');
    });

    it(`Delete order`, async () => {
      const delete_order = await orders.delete({
        id: create_order.id,
        user_id: create_user.id,
      } as orderMod);
      expect(delete_order.id).toBe(create_order.id);
      expect(delete_order.user_id).toBe(`${create_user.id}`);
      expect(delete_order.status).toBe('Active');
    });
  });
});
