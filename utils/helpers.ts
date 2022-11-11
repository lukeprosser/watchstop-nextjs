import axios from 'axios';

export const roundToTwoDec = (num: number) =>
  Math.round(num * 100 + Number.EPSILON) / 100;

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const isInStock = async (productId: string, quantity: number) => {
  const {
    data: { stockCount },
  } = await axios.get(`/api/products/${productId}`);
  return stockCount >= quantity;
};
