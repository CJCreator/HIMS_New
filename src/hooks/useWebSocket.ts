import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  enabled?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (message: any) => void;
}

interface WebSocketData {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: any) => void;
  lastMessage: any;
  readyState: number;
  error: string | null;
}

export function useWebSocket(urlOrOptions: string | UseWebSocketOptions, options: UseWebSocketOptions = {}): WebSocketData {
  // Handle both signatures: useWebSocket(url, options) and useWebSocket({ enabled })
  const url = typeof urlOrOptions === 'string' ? urlOrOptions : 'ws://localhost:8080';
  const finalOptions = typeof urlOrOptions === 'object' ? urlOrOptions : options;
  
  const {
    enabled = true,
    reconnectAttempts = 3,
    reconnectInterval = 3000,
    onOpen,
    onClose,
    onMessage
  } = finalOptions;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);

  const sendMessage = useCallback((message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      setConnectionStatus('connecting');
      setError(null);
      
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectCount.current = 0;
        onOpen?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage?.(data);
        } catch (err) {
          setLastMessage(event.data);
          onMessage?.(event.data);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onClose?.();

        // Attempt to reconnect
        if (reconnectCount.current < reconnectAttempts) {
          reconnectCount.current++;
          setTimeout(connect, reconnectInterval);
        }
      };

      ws.current.onerror = () => {
        setError('WebSocket connection error');
        setConnectionStatus('error');
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
      setConnectionStatus('error');
    }
  }, [enabled, url, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect, enabled]);

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    lastMessage,
    readyState: ws.current?.readyState ?? WebSocket.CLOSED,
    error
  };
}