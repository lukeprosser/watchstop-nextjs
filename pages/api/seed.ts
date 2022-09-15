import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import User from '../../models/User';
import Product from '../../models/Product';
import data from '../../utils/data';
import db from '../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany(); // Remove users first
  await User.insertMany(data.users);
  await Product.deleteMany(); // Remove products first
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'Data seeded successfully.' });
});

export default handler;
