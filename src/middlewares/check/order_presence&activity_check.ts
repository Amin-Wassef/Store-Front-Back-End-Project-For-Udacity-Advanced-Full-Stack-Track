import { Request, Response, NextFunction } from 'express';
import client from '../../database';

const activity_check = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const order_id = req.params.order_id;
  const pdt_id = req.params.pdt_id;
  const quantity = req.body.quantity;

  try {
    const connection = await client.connect();
    const sql = 'SELECT * FROM orders WHERE id=($1)';
    const result = await connection.query(sql, [order_id]);

    if (!result.rows.length)
      throw new Error(`Order => ${order_id} doesn't exist.`);

    const order = result.rows[0];

    if (order.status === 'Inactive') {
      throw new Error(
        `Action can not be applied to order => ${order_id} as order status is ${order.status}`
      );
    }

    connection.release();
    next();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export default activity_check;
