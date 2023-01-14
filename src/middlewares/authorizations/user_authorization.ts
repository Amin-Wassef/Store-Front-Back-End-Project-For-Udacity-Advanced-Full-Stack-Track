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
    password: string;
  };
  iat: number;
};

// For for a real app in real life
export const user_verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization as unknown as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, TOKEN_SECRET as unknown as string);
    console.log(decoded);
    if (decoded) next();
  } catch (error) {
    res.status(401).send(`You are not authorized to this action`);
  }
};

// For testing purpose (using token in the body)
// export const user_verifyAuthToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   try {
//     const token = req.body.token;
//     const decoded = jwt.verify(
//       token,
//       TOKEN_SECRET as unknown as string
//     ) as unknown as payload;
//     console.log(decoded);
//     if (decoded) next();
//   } catch (error) {
//     res.status(401).send(`You are not authorized to this action`);
//   }
// };
