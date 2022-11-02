import { useEffect, useRef } from 'react';

export default function useClickOutside(handler: Function) {
  const domNode = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const maybeHandler = (e: MouseEvent) => {
      if (!domNode?.current?.contains(e.target as HTMLLIElement)) {
        handler();
      }
    };

    document.addEventListener('mousedown', maybeHandler);

    return () => document.removeEventListener('mousedown', maybeHandler);
  });

  return domNode;
}
