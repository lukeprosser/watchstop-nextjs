import { NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../models/Order';
import User from '../../../models/User';
import { IGetUserAuthInfoRequest } from '../../../constants';
import { isAuthenticated, isAdministrator } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nc<IGetUserAuthInfoRequest, NextApiResponse>({
  onError: async (err, req, res) => {
    await db.disconnect();
    res.status(500).send({ message: err.toString() });
  },
});

// Middleware to check authorisation
handler.use(isAuthenticated, isAdministrator);

handler.get(async (req, res) => {
  await db.connect();
  // Fetch all orders as well as associated user email address from User data
  const orders = await Order.find({}).populate('user', 'email', User);
  await db.disconnect();
  res.send(orders);
});

export default handler;
