import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { isAuthenticated, signToken } from '../../../utils/auth';
import User from '../../../models/User';
import db from '../../../utils/db';

type IUser = {
  _id: Types.ObjectId;
};

interface IGetUserAuthInfoRequest extends NextApiRequest {
  user: IUser;
}

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
