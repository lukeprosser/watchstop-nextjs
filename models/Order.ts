import mongoose from 'mongoose';

interface IProduct {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface IDeliveryInfo {
  fullName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

interface IPaymentResult {
  id: string;
  status: string;
  email: string;
}

export interface IOrder {
  user: mongoose.Schema.Types.ObjectId;
  orderItems: IProduct[];
  deliveryInfo: IDeliveryInfo;
  paymentMethod: string;
  paymentResult: IPaymentResult;
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  paid: boolean;
  paidAt: Date;
  delivered: boolean;
  deliveredAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    deliveryInfo: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postcode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email: String },
    subtotal: { type: Number, required: true },
    delivery: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    paid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    delivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
