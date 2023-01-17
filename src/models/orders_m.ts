import client from '../database';

export type orderMod = {
  id?: string | number;
  user_id?: string | number;
  status?: string;
};

export class Orders {
  // Create new order
  async create(o: orderMod): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql = `INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [o.user_id, o.status]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`New order, can not be created. ${error}.`);
    }
  }

  // Show all orders data
  async s_all(): Promise<orderMod[]> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM orders ORDER BY id ASC`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Orders data can not be shown. ${error}.`);
    }
  }

  // Show specific order's data
  async s_one(o: orderMod): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM orders WHERE id = ($1) AND user_id = ($2)`;
      const result = await connection.query(sql, [o.id, o.user_id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Order => ${o.id} data can not be shown. ${error}.`);
    }
  }

  // Update order's status
  async up_status(o: orderMod): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql = `UPDATE orders SET status = ($1) WHERE id = ($2) AND user_id = ($3) RETURNING *`;
      const result = await connection.query(sql, [o.status, o.id, o.user_id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Order => ${o.id}, can not be updated. ${error}.`);
    }
  }

  // Delete order
  async delete(o: orderMod): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql = `DELETE FROM orders WHERE id=($1) AND user_id = ($2) RETURNING *`;
      const result = await connection.query(sql, [o.id, o.user_id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Order => ${o.id}, can not be deleted. ${error}.`);
    }
  }

  // Add product
  async add_pdt(
    order_id: string | number,
    pdt_id: string | number,
    quantity: string | number,
    _op_id?: string | number
  ): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql =
        'INSERT INTO orders_products (order_id, pdt_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const result = await connection.query(sql, [order_id, pdt_id, quantity]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Product => ${pdt_id} can not be added to order => ${order_id}. ${error}`
      );
    }
  }

  // Show all orders' products and quantities
  async s_all_op(
    _op_id?: string | number,
    _order_id?: string | number,
    _pdt_id?: string | number,
    _quantity?: string | number
  ): Promise<orderMod[]> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM orders_products ORDER BY order_id ASC';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Orders' products can not be shown. ${error}`);
    }
  }

  // Show specific order's products and quantities
  async s_one_op(
    op_id: string | number,
    order_id: string | number,
    _pdt_id?: string | number,
    _quantity?: string | number
  ): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql =
        'SELECT * FROM orders_products WHERE id = ($1)) AND order_id = ($2)';
      const result = await connection.query(sql, [op_id, order_id]);
      if (!result.rows.length) {
        throw new Error(`${op_id} does not exist`);
      }
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Order can not be shown. ${error}`);
    }
  }

  // Update product quantities
  async up_pdt_q(
    quantity: string | number,
    op_id: string | number,
    order_id: string | number,
    pdt_id?: string | number
  ): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql = `UPDATE orders_products SET quantity = ($1) WHERE id = ($2) AND order_id = ($3) RETURNING *`;
      const result = await connection.query(sql, [quantity, op_id, order_id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Product => ${pdt_id} quantity can not be updated. ${error}`
      );
    }
  }

  // Delete product
  async delete_pdt(
    op_id: string | number,
    order_id: string | number,
    _pdt_id?: string | number,
    _quantity?: string | number
  ): Promise<orderMod> {
    try {
      const connection = await client.connect();
      const sql =
        'DELETE FROM orders_products WHERE id = ($1) AND order_id = ($2) RETURNING *';
      const result = await connection.query(sql, [op_id, order_id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Product can not be deleted. ${error}`);
    }
  }
}
