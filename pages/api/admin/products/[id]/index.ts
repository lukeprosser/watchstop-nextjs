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

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);

  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.image = req.body.image;
    product.price = req.body.price;
    product.stockCount = req.body.stockCount;
    product.description = req.body.description;

    await product.save();
    await db.disconnect();
    res.send({ message: 'Product updated successfully.' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found.' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);

  if (product) {
    await product.remove();
    db.disconnect();
    res.send({ message: 'Product deleted successfully.' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found.' });
  }
});

export default handler;
