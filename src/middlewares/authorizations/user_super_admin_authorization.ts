import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET } = process.env;

type payload = {
  user: {
    id: number;
    user_name: string;
    e_mail: string;
  };
  iat: number;
};

// For for a real app in real life
export const user_super_admin_authorization = (
  req: Request,
  res: Response,
  next: NextFunction
): payload | void => {
  try {
    const authorizationHeader = req.headers.authorization as unknown as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      TOKEN_SECRET as unknown as string
    ) as unknown as payload;
    console.log(decoded.user.id);
    console.log(req.body.user_id);
    if (
      decoded.user.id === parseInt(req.params.id) ||
      decoded.user.id === req.body.user_id ||
      decoded.user.id === 1
    )
      next();
  } catch (error) {
    res.status(401).send(`You are not authorized to this action`);
  }
};

// For testing purpose (using token in the body)
// export const user_super_admin_authorization = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): payload | void => {
//   try {
//     const token = req.body.token;
//     const decoded = jwt.verify(
//       token,
//       TOKEN_SECRET as unknown as string
//     ) as unknown as payload;
//     console.log(decoded.user.id);
//     console.log(req.body.id);
//     if (decoded.user.id === parseInt(req.params.id) || decoded.user.id === req.body.id || decoded.user.id === 1) next();
//   } catch (error) {
//     res.status(401).send(`You are not authorized to this action`);
//   }
// };
