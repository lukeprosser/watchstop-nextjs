import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const { _id, name, email, admin } = user;
    const token = signToken(user);
    res.send({
      token,
      _id,
      name,
      email,
      admin,
    });
  } else {
    console.log('Wrong email or password.');
    res.status(401).send({ message: 'Email or password not recognised.' });
  }
});

export default handler;
