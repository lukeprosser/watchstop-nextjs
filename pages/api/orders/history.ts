import { NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../models/Order';
import { IGetUserAuthInfoRequest } from '../../../constants';
import { isAuthenticated } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc<IGetUserAuthInfoRequest, NextApiResponse>({
  onError: async (err, req, res) => {
    await db.disconnect();
    res.status(500).send({ message: err.toString() });
  },
});

// Middleware to check authorisation
handler.use(isAuthenticated);

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({ user: req.user._id });
  await db.disconnect();
  res.send(orders);
});

export default handler;
