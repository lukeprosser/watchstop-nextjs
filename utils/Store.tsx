import { createContext, useReducer, Dispatch } from 'react';
import { setCookie, getCookie, hasCookie } from 'cookies-next';
import { IProduct } from '../pages';

interface IState {
  cart: { cartItems: IProduct[] };
}

interface ContextType {
  state: IState;
  dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const initialState: { cart: { cartItems: IProduct[] } } = {
  cart: {
    cartItems: hasCookie('cartItems')
      ? JSON.parse(getCookie('cartItems')!.toString())
      : [],
  },
};

export const Store = createContext<ContextType | null>(null);

function reducer(state: IState, action: any) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
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
    default:
      return state;
  }
}

export function StoreProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
