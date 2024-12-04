import {useEffect, useState} from 'react';

export default function useIsTouchScreen() {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    setIsTouchScreen('ontouchstart' in window);
  }, []);

  return isTouchScreen;
}
