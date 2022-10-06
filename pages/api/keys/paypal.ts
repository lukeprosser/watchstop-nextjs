import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { isAuthenticated } from '../../../utils/auth';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(isAuthenticated);

handler.get(async (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb'); // Fallback to sandbox
});

export default handler;
