import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

type MoveMessage = {
  lat: number;
  long: number;
  roomId: string;
  type: "move";
};

type JoinMessage = {
  message: string;
  type: "join_room";
};

type MessageData = MoveMessage | JoinMessage;

const useSocket = (token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);

  const handleConnect = () => setIsConnected(true);
  const handleDisconnect = () => setIsConnected(false);

  const handleJoin = (message: string) => {
    setMessages((prev) => [...prev, { message, type: "join_room" }]);
  };

  const handleMove = (data: Omit<MoveMessage, "type">) =>
    setMessages((prev) => [...prev, { ...data, type: "move" }]);

  useEffect(() => {
    if (token) {
      const newSocket: Socket = io(process.env.EXPO_PUBLIC_API_URL || "", {
        path: "/track-sio/sio/",
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${token}`,
            },
          },
        },
      });

      setSocket(newSocket);
      setIsConnected(newSocket.connected);

      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("room_message", handleJoin);
      newSocket.on("move", handleMove);

      return () => {
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("room_message", handleJoin);
        newSocket.off("move", handleMove);
        newSocket.close();
      };
    }
  }, [token]);

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit("join_room", roomId);
    }
  };

  const handleLeaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit("leave_room", roomId);
    }
  };

  const handleSendMessage = (lat: number, long: number, roomId: string) => {
    if (socket) {
      socket.emit("move", { lat, long, roomId });
    }
  };

  return {
    isConnected,
    messages,
    joinRoom,
    handleLeaveRoom,
    handleSendMessage,
  };
};

export default useSocket;
