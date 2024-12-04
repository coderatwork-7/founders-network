import {useRef, useState} from 'react';

export const useMentionPlugin = () => {
  const [show, setShow] = useState(false);
  const pluginPosition = useRef<{x: number; y: number} | null>(null);
  const mentionString = useRef<string>();
  const editor = useRef<any>(null);
  return {
    show,
    setShow,
    pluginPosition,
    mentionString,
    editor
  };
};
