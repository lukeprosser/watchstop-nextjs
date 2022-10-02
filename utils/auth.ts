import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

interface IUserDb {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface IUserAuth {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  iat: number;
  exp: number;
}

interface IGetUserAuthInfoRequest extends NextApiRequest {
  user: IUserAuth;
}

const signToken = (user: IUserDb) => {
  if (!process.env.JWT_SECRET) throw new Error('Authorisation error');
  const { _id, name, email, admin } = user;
  return jwt.sign({ _id, name, email, admin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const isAuthenticated = async (
  req: IGetUserAuthInfoRequest,
  res: NextApiResponse,
  next: Function
) => {
  if (!process.env.JWT_SECRET) throw new Error('Authorisation error');
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Slice to remove 'Bearer ' from token
    // Decoded value possibly JwtPayload, string or undefined - needs handling
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded: any) => {
      if (error) {
        res.status(401).send({ message: 'Token is not valid.' });
      } else {
        // Add user info to request
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token not provided.' });
  }
};

export { signToken, isAuthenticated };
