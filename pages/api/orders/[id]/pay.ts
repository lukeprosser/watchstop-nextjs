import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuthenticated } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: async (err, req, res) => {
    await db.disconnect();
    res.status(500).send({ message: err.toString() });
  },
});

// Middleware to check authorisation
handler.use(isAuthenticated);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.paid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email: req.body.payer.email_address,
    };
    const paidOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'Order paid successfully.', order: paidOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found.' });
  }
});

export default handler;
