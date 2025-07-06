import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { io } from 'socket.io-client';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWebSocket = () => {
    if (!user || isConnecting) return;

    setIsConnecting(true);
    
    try {
      // Use Socket.IO client instead of WebSocket
      const socket = io(process.env.REACT_APP_WEBSOCKET_URL, {
        withCredentials: true,
        transports: ['websocket']
      });
      
      socket.on('connect', () => {
        console.log('Socket.IO connected');
        // Subscribe to notifications
        socket.emit('subscribe', user.id);
        setIsConnecting(false);
      });

      socket.on('notification', (data) => {
        console.log('Received notification:', data);
        
        if (data.type === 'newPendingAd' || data.type === 'adApproved') {
          // Show toast notification
          toast.custom((t) => (
            <div className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-black/20 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <Bell className={`h-5 w-5 ${data.type === 'newPendingAd' ? 'text-orange-500' : 'text-green-500'}`} />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {data.type === 'newPendingAd' ? 'New Pending Ad' : 'Ad Approved'}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {data.businessName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ));
          
          setNotifications(prev => [...prev, { ...data, timestamp: new Date() }]);
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        setIsConnecting(false);
      });

      socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        setIsConnecting(false);
      });

      setSocket(socket);
    } catch (error) {
      console.error('Error creating Socket.IO connection:', error);
      setIsConnecting(false);
      setTimeout(connectWebSocket, 5000);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}