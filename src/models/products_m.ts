import client from '../database';

export type productMod = {
  id: string;
  pdt_name?: string;
  pdt_price?: string;
};

export class Products {
  // Create new product
  async create(p: productMod): Promise<productMod> {
    try {
      const connection = await client.connect();
      const sql = `INSERT INTO products (pdt_name, pdt_price) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [p.pdt_name, p.pdt_price]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `New product => ${p.pdt_name}, can not be created. ${error}.`
      );
    }
  }

  // Delete product
  async delete(p: productMod): Promise<productMod> {
    try {
      const connection = await client.connect();
      const sql = `DELETE FROM products WHERE id=($1) RETURNING *`;
      const result = await connection.query(sql, [p.id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Product => ${p.id}, can not be deleted. ${error}.`);
    }
  }

  // Show all products data
  async s_all(): Promise<productMod[]> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM products ORDER BY pdt_name ASC`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Products data can not be shown. ${error}.`);
    }
  }

  // Sow specific product data
  async s_one(p: productMod): Promise<productMod> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM products WHERE id = ($1)`;
      const result = await connection.query(sql, [p.id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Product => ${p.id} data can not be shown. ${error}.`);
    }
  }

  // Update product's data
  async up_pdt(p: productMod): Promise<productMod> {
    try {
      const connection = await client.connect();
      const sql = `UPDATE products SET pdt_name = ($1), pdt_price = ($2) WHERE id = ($3) RETURNING *`;
      const result = await connection.query(sql, [
        p.pdt_name,
        p.pdt_price,
        p.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Product => ${p.id}, can not be updated. ${error}.`);
    }
  }
}
