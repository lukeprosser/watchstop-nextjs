import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { nanoid } from 'nanoid';
import Product from '../../../../models/Product';
import { IGetUserAuthInfoRequest } from '../../../../constants';
import { isAuthenticated, isAdministrator } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc<IGetUserAuthInfoRequest, NextApiResponse>();

handler.use(isAuthenticated, isAdministrator);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'Name',
    slug: `product-${nanoid()}`, // slug must be unique
    brand: 'Brand',
    category: 'Category',
    image:
      'https://res.cloudinary.com/lukeprosser/image/upload/v1666801514/watchstop/placeholder.jpg',
    price: 0,
    stockCount: 0,
    numReviews: 0,
    rating: 0,
    description: 'Description',
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product created successfully.', product });
});

export default handler;
