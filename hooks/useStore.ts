import { useContext } from 'react';
import { Store } from '../utils/Store';

export default function useStore() {
  const value = useContext(Store);
  if (!value) throw new Error('Store context must be defined.');
  return value;
}
