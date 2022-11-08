import { NextApiResponse } from 'next';
import nc from 'next-connect';
import User from '../../../../models/User';
import { IGetUserAuthInfoRequest } from '../../../../constants';
import { isAuthenticated, isAdministrator } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc<IGetUserAuthInfoRequest, NextApiResponse>();

handler.use(isAuthenticated, isAdministrator);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;
