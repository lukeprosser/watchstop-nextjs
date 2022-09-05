import { createContext, useReducer } from 'react';

export const Store = createContext(null);

const initialState = {};

function reducer(state, action) {}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
}
