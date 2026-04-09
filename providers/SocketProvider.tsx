"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/authStore";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "ws://localhost:5000",
      {
        auth: {
          token: token,
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connect_error", err.message);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]); // Reconnect when auth state changes

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
      {isConnected && <SessionNotificationListener />}
    </SocketContext.Provider>
  );
}

function SessionNotificationListener() {
  const { useSessionSocket } = require("@/features/videoSession/hooks/useSessionSocket");
  useSessionSocket();
  return null;
}