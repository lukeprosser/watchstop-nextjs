import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Product from '../../../../../models/Product';
import { isAuthenticated, isAdministrator } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(isAuthenticated, isAdministrator);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

export default handler;
