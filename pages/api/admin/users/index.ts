import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Types } from 'mongoose';
import User from '../../../../models/User';
import { isAuthenticated, isAdministrator } from '../../../../utils/auth';
import db from '../../../../utils/db';

type IUser = {
  _id: Types.ObjectId;
};

interface IGetUserAuthInfoRequest extends NextApiRequest {
  user: IUser;
}

const handler = nc<IGetUserAuthInfoRequest, NextApiResponse>();

handler.use(isAuthenticated, isAdministrator);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
