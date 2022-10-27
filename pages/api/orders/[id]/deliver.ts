import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAdministrator, isAuthenticated } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: async (err, req, res) => {
    await db.disconnect();
    res.status(500).send({ message: err.toString() });
  },
});

// Middleware to check authorisation
handler.use(isAuthenticated, isAdministrator);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.delivered = true;
    order.deliveredAt = new Date();
    const deliveredOrder = await order.save();
    await db.disconnect();
    res.send({
      message: 'Order status updated successfully.',
      order: deliveredOrder,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order not found.' });
  }
});

export default handler;
