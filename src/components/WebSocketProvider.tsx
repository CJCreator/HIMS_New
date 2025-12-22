import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  sendMessage: (message: any) => void;
  lastMessage: any;
  error: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function WebSocketProvider({ children, enabled = true }: WebSocketProviderProps) {
  const webSocketData = useWebSocket({ enabled });

  // Listen for WebSocket send events from synchronization utilities
  React.useEffect(() => {
    const handleWebSocketSend = (event: CustomEvent) => {
      if (webSocketData.isConnected) {
        webSocketData.sendMessage(event.detail);
      }
    };

    window.addEventListener('websocket-send', handleWebSocketSend as EventListener);
    return () => window.removeEventListener('websocket-send', handleWebSocketSend as EventListener);
  }, [webSocketData]);

  return (
    <WebSocketContext.Provider value={webSocketData}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}