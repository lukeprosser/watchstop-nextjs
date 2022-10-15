import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Types } from 'mongoose';
import Product from '../../../models/Product';
import { isAuthenticated, isAdministrator } from '../../../utils/auth';
import db from '../../../utils/db';

type IUser = {
  _id: Types.ObjectId;
};

interface IGetUserAuthInfoRequest extends NextApiRequest {
  user: IUser;
}

const handler = nc<IGetUserAuthInfoRequest, NextApiResponse>({
  onError: async (err, req, res, next) => {
    await db.disconnect();
    res.status(500).send({ message: err.toString() });
  },
});

// Middleware to check authorisation
handler.use(isAuthenticated, isAdministrator);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
