import { rest } from 'msw';
import productData from './products.json';

export const handlers = [
  rest.get(
    'http://localhost/api/products/635aa38885984595e85b850b',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(productData[0]));
    }
  ),
  rest.get(
    'http://localhost/api/products/635aa38885984595e85b850c',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(productData[1]));
    }
  ),
  rest.get(
    'http://localhost/api/products/635aa38885984595e85b850d',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(productData[2]));
    }
  ),
];
