import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  enabled?: boolean;
  url?: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface WebSocketData {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: any) => void;
  lastMessage: any;
  error: string | null;
}

export function useWebSocket(options: UseWebSocketOptions = {}): WebSocketData {
  const {
    enabled = true,
    url = 'ws://localhost:8080',
    reconnectAttempts = 3,
    reconnectInterval = 3000
  } = options;

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
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (err) {
          setLastMessage(event.data);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
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
    error
  };
}