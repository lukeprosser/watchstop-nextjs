import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import User from '../../../../../models/User';
import { isAuthenticated, isAdministrator } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(isAuthenticated, isAdministrator);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);

  if (user) {
    user.name = req.body.name;
    user.admin = Boolean(req.body.admin);

    await user.save();
    await db.disconnect();
    res.send({ message: 'User updated successfully.' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not found.' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);

  if (user) {
    await user.remove();
    db.disconnect();
    res.send({ message: 'User deleted successfully.' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not found.' });
  }
});

export default handler;
