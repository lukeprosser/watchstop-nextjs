import { createContext, useReducer, Dispatch } from 'react';
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import { IProduct } from '../pages';

interface IUser {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  token: string;
}

interface IDeliveryInfo {
  fullName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

interface IState {
  cart: {
    cartItems: IProduct[];
    deliveryInfo?: IDeliveryInfo; // Optional
  };
  userInfo: IUser;
}

interface ContextType {
  state: IState;
  dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const initialState: IState = {
  cart: {
    cartItems: hasCookie('cartItems')
      ? JSON.parse(getCookie('cartItems')!.toString())
      : [],
    deliveryInfo: hasCookie('deliveryInfo')
      ? JSON.parse(getCookie('deliveryInfo')!.toString())
      : {},
  },
  userInfo: hasCookie('userInfo')
    ? JSON.parse(getCookie('userInfo')!.toString())
    : null,
};

export const Store = createContext<ContextType | null>(null);

function reducer(state: IState, action: any) {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return { ...state, userInfo: null, cart: { cartItems: [] } };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item: IProduct) => item._id === newItem._id
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map(
            (item: IProduct) => (item._id === existingItem._id ? newItem : item) // Prevent duplicate item
          )
        : [...state.cart.cartItems, newItem];
      setCookie('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload
      );
      setCookie('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'SAVE_DELIVERY_INFO':
      return {
        ...state,
        cart: { ...state.cart, deliveryInfo: action.payload },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

export function StoreProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
