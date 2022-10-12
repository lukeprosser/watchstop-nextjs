import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Types } from 'mongoose';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
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

handler.get(async (req, res) => {
  await db.connect();
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null, // Match all (not specific)
        sales: { $sum: '$total' }, // Sum each order cost in 'sales'
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  await db.disconnect();
  res.send({ ordersPrice, ordersCount, productsCount, usersCount });
});

export default handler;
