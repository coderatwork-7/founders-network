import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';
import {useSession} from 'next-auth/react';

export const WebSocketContext = createContext<MessageEvent<any> | {}>({});

interface IProps extends PropsWithChildren {
  url: string;
}

export const WebSocketProvider: React.FC<IProps> = ({children, url}) => {
  const {data: session} = useSession(); // Get session data
  const socket = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;
  const reconnectDelay = 3000;
  const [message, setMessage] = useState<MessageEvent<any> | {}>({});

  const connectWebSocket = () => {
    if (!session || !url) return;

    const token = session?.user?.tokens?.access;
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5Nzk0OTc2LCJpYXQiOjE3MjkxOTAxNzYsImp0aSI6IjU4ZTY4NzU4YjZlYzRhZjZiYjVkNDEyZTM0MDE4OWIwIiwidXNlcl9pZCI6OTkzMiwibGlmZXRpbWUiOmZhbHNlfQ.yW73rehIqo6DyLV_1ojPEjmxrJ1lHWqA45mZ31McS9s'
    if (!token) {
      console.error('Token not found in session');
      return;
    }

    const wsUrlWithToken = `${url}?token=${encodeURIComponent(token)}`;

    socket.current = new WebSocket(wsUrlWithToken);

    socket.current.onopen = () => {
      console.log('Web Socket: open 🟢');
      reconnectAttempts.current = 0;
    };

    socket.current.onclose = () => {
      console.log('Web Socket: closed 🔴');
      if (session && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(
          `Attempting to reconnect... (attempt ${reconnectAttempts.current})`
        );
        setTimeout(() => {
          connectWebSocket(); // Try to reconnect
        }, reconnectDelay);
      } else {
        console.error('Max reconnect attempts reached, stopping reconnection.');
      }
    };

    socket.current.onerror = error => {
      console.error('WebSocket error:', error);
      socket.current?.close();
    };

    socket.current.onmessage = message => {
      const {type, ...data} = JSON.parse(message.data);
      console.log('WS Message:', message.data);
      setMessage(message.data);
    };
  };

  useEffect(() => {
    if (session) {
      connectWebSocket(); // Connect WebSocket if session exists
    }

    return () => {
      socket.current?.close();
    };
  }, [session, url]);

  return (
    <WebSocketContext.Provider value={message}>
      {children}
    </WebSocketContext.Provider>
  );
};
