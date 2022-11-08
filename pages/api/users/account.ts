import { NextApiResponse } from 'next';
import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import { isAuthenticated, signToken } from '../../../utils/auth';
import User from '../../../models/User';
import { IGetUserAuthInfoRequest } from '../../../constants';
import db from '../../../utils/db';

const handler = nc<IGetUserAuthInfoRequest, NextApiResponse>();

handler.use(isAuthenticated);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);

  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password
    ? bcrypt.hashSync(req.body.password)
    : user.password;

  user.save();
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
