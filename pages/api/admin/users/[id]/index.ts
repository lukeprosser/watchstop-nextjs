import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import User from '../../../../../models/User';
import { isAuthenticated, isAdministrator } from '../../../../../utils/auth';
import db from '../../../../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(isAuthenticated, isAdministrator);

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
