import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUND } = process.env;

export type userMod = {
  id: string;
  first_name?: string;
  last_name?: string;
  password: string;
};

export class Users {
  // Create new user
  async create(u: userMod): Promise<userMod> {
    try {
      const connection = await client.connect(); // Create a new connection to the database
      const sql = `INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *`; // Create a sql cmd (query)
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUND as string)
      );
      const result = await connection.query(sql, [
        u.first_name,
        u.last_name,
        hash,
      ]); // Execute the query
      connection.release(); // Release the connection
      return result.rows[0]; // Return the results
    } catch (error) {
      throw new Error(
        `New user => ${u.first_name}, can not be created. ${error}`
      );
    }
  }

  // Delete user
  async delete(u: userMod): Promise<userMod> {
    try {
      const connection = await client.connect();
      const sql = `DELETE FROM users WHERE id = ($1) RETURNING *`;
      const result = await connection.query(sql, [u.id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`User => ${u.id}, can not be deleted. ${error}.`);
    }
  }

  // Show all users data
  async s_all(): Promise<userMod[]> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM users ORDER BY id ASC`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Users data can not be shown. ${error}.`);
    }
  }

  // Show specific user data
  async s_one(u: userMod): Promise<userMod> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM users WHERE id = ($1)`;
      const result = await connection.query(sql, [u.id]);
      console.log(result.rows[0]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`User => ${u.id} data can not be shown. ${error}.`);
    }
  }

  // Update user's data
  async up_user(u: userMod): Promise<userMod> {
    try {
      const connection = await client.connect();
      const sql = `UPDATE users SET first_name = ($1), last_name = ($2), password = ($3) WHERE id = ($4) RETURNING *`;
      const hash = bcrypt.hashSync(
        u.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUND as string)
      );
      const result = await connection.query(sql, [
        u.first_name,
        u.last_name,
        hash,
        u.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`User => ${u.id}, can not be updated. ${error}.`);
    }
  }

  // User authentication
  async authenticate(u: userMod): Promise<userMod | null> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM users WHERE first_name = ($1) AND last_name = ($2)`;
      const result = await connection.query(sql, [u.first_name, u.last_name]);
      if (result.rows.length) {
        console.log(result.rows[0]);
        const hased_password = result.rows[0].password;
        if (bcrypt.compareSync(u.password + BCRYPT_PASSWORD, hased_password)) {
          return result.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(
        `Unable to sign in, user name or password is not matching. ${error}.`
      );
    }
  }
}
