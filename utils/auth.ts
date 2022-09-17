import jwt from 'jsonwebtoken';

type IUser = {
  _id: string;
  name: string;
  email: string;
  admin: Boolean;
};

const signToken = (user: IUser) => {
  if (!process.env.JWT_SECRET) throw new Error('Authorisation error');
  const { _id, name, email, admin } = user;
  return jwt.sign({ _id, name, email, admin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export { signToken };
