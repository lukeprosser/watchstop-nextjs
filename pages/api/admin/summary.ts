import { NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
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
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null, // _id required key but no need to reference
        sales: { $sum: '$total' }, // Sum each order cost in 'sales'
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  const ordersCount = await Order.countDocuments();
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%m-%Y', date: '$createdAt' } }, // Set date as key
        total: { $sum: '$total' }, // Sum each order cost in 'total'
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  await db.disconnect();
  res.send({ ordersPrice, ordersCount, salesData, productsCount, usersCount });
});

export default handler;
