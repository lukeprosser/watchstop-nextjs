import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Types } from 'mongoose';
import Order from '../../../models/Order';
import { isAuthenticated } from '../../../utils/auth';
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
handler.use(isAuthenticated);

handler.post(async (req, res) => {
  await db.connect();
  // Create new order with user ID
  const newOrder = new Order({ ...req.body, user: req.user._id });
  // Save new order to database
  const order = await newOrder.save();

  res.status(201).send(order);
});

export default handler;
