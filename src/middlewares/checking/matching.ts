import { Request, Response, NextFunction } from 'express';
import client from '../../database';

const matching_check = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const order_id = req.params.order_id;
  const id = req.body.id;

  try {
    const connection = await client.connect();
    const sql = 'SELECT * FROM orders WHERE id=($1)';
    const result = await connection.query(sql, [order_id]);

    const user_id = result.rows[0].user_id;

    if (user_id !== id) {
      throw new Error(`You are not allowed to act on this order`);
    }

    connection.release();
    next();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export default matching_check;
