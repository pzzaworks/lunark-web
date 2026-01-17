"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserContext } from '@/contexts';
import { IMessage } from '@/types/message';
import toast from 'react-hot-toast';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

export interface PendingTransaction {
  id: string;
  chatId: string;
  type: 'transfer' | 'approve';
  transaction: {
    to: string;
    value: string;
    data: string;
    chainId: number;
  };
  details: Record<string, any>;
  buttonText: string;
  explorerUrl: string;
}

interface SocketContextState {
  socket: Socket | null;
  isConnected: boolean;
  currentChatId: string;
  reconnectionAttempts: number;
  pendingTransaction: PendingTransaction | null;
}

interface SocketContextValue extends SocketContextState {
  joinChat: (chatId: string) => void;
  leaveChat: () => void;
  stopStream: () => void;
  startStream: () => Promise<void>;
  clearPendingTransaction: () => void;
}

const initialState: SocketContextState = {
  socket: null,
  isConnected: false,
  currentChatId: '',
  reconnectionAttempts: 0,
  pendingTransaction: null,
};

export const SocketContext = createContext<SocketContextValue>({
  ...initialState,
  joinChat: () => {},
  leaveChat: () => {},
  stopStream: () => {},
  startStream: async () => {},
  clearPendingTransaction: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChatId, setCurrentChatId] = useState('');
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null);
  const reconnectCount = useRef(0);
  const { user } = useUserContext();
  const { address } = useAppKitAccount();
  const { switchNetwork } = useAppKitNetwork();

  const clearPendingTransaction = useCallback(() => {
    setPendingTransaction(null);
  }, []);

  const initializeSocket = useCallback(() => {
    if (!user?.id) {
      return null;
    }

    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      return null;
    }

    // Clean up existing socket if it exists
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 5000,
      auth: {
        userId: user.id,
        sessionToken
      }
    });

    newSocket.on('connect_error', (error) => {
      reconnectCount.current += 1;
      if (reconnectCount.current >= 3) {
        newSocket.disconnect();
        setIsConnected(false);
      }
    });

    newSocket.on('connect', () => {
      console.log(`✅ Socket connected: ${newSocket.id}`);
      setIsConnected(true);
      reconnectCount.current = 0;

      // Authenticate with user address to join user room
      if (address) {
        const normalizedAddress = address.toLowerCase();
        newSocket.emit('authenticate', { address: normalizedAddress });
        console.log(`🔐 Authenticating socket with address: ${normalizedAddress}`);
      } else {
        console.log(`⚠️ No address available for authentication`);
      }
    });

    // Listen for authentication confirmation
    newSocket.on('authenticated', (data) => {
      console.log(`✅ Socket authenticated:`, data);
    });

    newSocket.on('error', ({ message }) => {
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setCurrentChatId('');
    });

    newSocket.on('joinedChat', ({ chatId }) => {
      setCurrentChatId(chatId);
    });

    // Listen for network switch events from backend
    newSocket.on('networkSwitch', async (networkData: any) => {
      console.log('🔀 Network switch event received from backend:', networkData);

      try {
        // Show toast notification
        toast.loading(`Switching to ${networkData.name}...`, { id: 'network-switch' });

        // Switch network in wallet
        const appKitNetwork = {
          id: networkData.chainId,
          name: networkData.name,
          nativeCurrency: {
            name: networkData.name,
            symbol: networkData.symbol,
            decimals: 18,
          },
          rpcUrls: {
            default: { http: [networkData.rpcUrl] },
          },
          blockExplorers: {
            default: { name: 'Explorer', url: networkData.explorerUrl },
          },
        };

        await switchNetwork(appKitNetwork);

        toast.success(`Switched to ${networkData.name}`, { id: 'network-switch' });
        console.log(`✅ Network switched to ${networkData.name} (Chain ${networkData.chainId})`);
      } catch (error: any) {
        console.error('Failed to switch network:', error);
        toast.error(`Failed to switch network: ${error.message}`, { id: 'network-switch' });
      }
    });

    // Listen for pending transaction events from backend
    newSocket.on('pendingTransaction', (txData: PendingTransaction) => {
      console.log('💳 Pending transaction received:', txData);
      setPendingTransaction(txData);
    });

    setSocket(newSocket);
    return newSocket;
  }, [user?.id, address, switchNetwork]);

  const joinChat = useCallback((chatId: string) => {
    if (!chatId || !user?.id) {
      return;
    }

    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      return;
    }

    if (!socket?.connected) {
      const newSocket = initializeSocket();
      if (!newSocket) {
        return;
      }
      
      // Wait for connection before joining
      newSocket.on('connect', () => {
        newSocket.emit('joinChat', {
          chatId,
          userId: user.id,
          sessionToken
        });
      });
    } else {
      socket.emit('joinChat', {
        chatId,
        userId: user.id,
        sessionToken
      });
    }
  }, [user?.id, socket, initializeSocket]);

  const leaveChat = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setCurrentChatId('');
    }
  }, [socket]);

  const stopStream = useCallback(() => {
    if (socket?.connected && currentChatId) {
      socket.emit('stopStream');
    }
  }, [socket, currentChatId]);

  const startStream = useCallback(async () => {
    if (!socket?.connected || !currentChatId) return;
    socket.emit('streamStart');
  }, [socket, currentChatId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [socket]);

  // Handle socket cleanup on user change
  useEffect(() => {
    if (!user?.id) {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      setIsConnected(false);
      setCurrentChatId('');
    }
  }, [user?.id, socket]);

  // Initialize socket on mount
  useEffect(() => {
    if (user?.id && !socket) {
      initializeSocket();
    }
  }, [user?.id, initializeSocket]);

  // Re-authenticate when address changes
  useEffect(() => {
    if (socket?.connected && address) {
      const normalizedAddress = address.toLowerCase();
      console.log(`🔄 Address changed, re-authenticating: ${normalizedAddress}`);
      socket.emit('authenticate', { address: normalizedAddress });
    }
  }, [socket, address]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      currentChatId,
      reconnectionAttempts: reconnectCount.current,
      pendingTransaction,
      joinChat,
      leaveChat,
      stopStream,
      startStream,
      clearPendingTransaction,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext); 