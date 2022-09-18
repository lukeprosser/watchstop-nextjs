import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  await db.connect();

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    admin: false,
  });
  // Save new user to database
  const user = await newUser.save();

  await db.disconnect();

  const { _id, name, email, admin } = user;
  const token = signToken(user);

  res.send({
    token,
    _id,
    name,
    email,
    admin,
  });
});

export default handler;
