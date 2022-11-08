import { Types } from 'mongoose';
import { NextApiRequest } from 'next';

export interface IGetUserAuthInfoRequest extends NextApiRequest {
  user: TUser;
}

export interface IAction {
  type: string;
  payload?: any;
}

export interface IParams {
  id: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  admin: boolean;
  token?: string;
}

export type TUser = {
  _id: Types.ObjectId;
};

export interface IProduct {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  stockCount: number;
  description: string;
}

export interface IProductOrder {
  _id: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  price: number;
}

export interface IDeliveryInfo {
  fullName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  email: string;
}

export interface IOrder {
  _id: string;
  createdAt: string;
  user: { _id: string; email: string };
  orderItems: IProductOrder[];
  deliveryInfo: IDeliveryInfo;
  paymentMethod: string;
  paymentResult: IPaymentResult;
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  paid: boolean;
  paidAt: string;
  delivered: boolean;
  deliveredAt: string;
}

export const adminSidebarItems = [
  {
    key: 'dashboard',
    url: '/admin/dashboard',
    name: 'Dashboard',
  },
  {
    key: 'orders',
    url: '/admin/orders',
    name: 'Orders',
  },
  {
    key: 'products',
    url: '/admin/products',
    name: 'Products',
  },
  {
    key: 'users',
    url: '/admin/users',
    name: 'Users',
  },
];

export const userSidebarItems = [
  {
    key: 'account',
    url: '/account',
    name: 'Account',
  },
  {
    key: 'order-history',
    url: '/order-history',
    name: 'Order History',
  },
];
