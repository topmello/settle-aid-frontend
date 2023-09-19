import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { selectToken } from "../store/authSlice";
import { selectRoomId, setRoomId } from "../store/appSlice";
import { fetch } from "../api/fetch";
import { AppDispatch } from "../store";
import { selectLonLat } from "../store/routeSlice";
import useCurrentLocationRealtime from "./useCurrentLocationRealtime";

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

export const useTrack = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const token = useSelector(selectToken);
  const roomId = useSelector(selectRoomId);
  const dispatch = useDispatch<AppDispatch>();
  const [shareTimerId, setShareTimerId] = useState<NodeJS.Timeout | null>(null);
  const lonLat = useSelector(selectLonLat);
  useCurrentLocationRealtime();

  const handleConnect = () => setIsConnected(true);
  const handleDisconnect = () => setIsConnected(false);

  const handleJoin = (message: string) => {
    console.log("handlejoin", message)
    setMessages((prev) => [...prev, { message, type: "join_room" }]);
  };

  const handleMove = (data: Omit<MoveMessage, "type">) => {
    console.log("handleMove", data)
    setMessages((prev) => [...prev, { ...data, type: "move" }]);
  }

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

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
      exitRoom();
    }
  }, []);

  const handleLeaveRoom = (room: string) => {
    if (socket) {
      socket.emit("leave_room", room);
    }
  };

  const sendLocation = (lat: number, long: number, room: string) => {
    if (socket) {
      console.log("send location", lat, long, room)
      socket.emit("move", { lat, long, room });
    }
  };

  const createRoom = async () => {
    return fetch({
      method: "GET",
      url: "/track/generate-pin/",
      token: token,
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data.room_id)
        dispatch(setRoomId({
          roomId: res.data.room_id
        }));
        startTrackMe(res.data.room_id);
        return res.data.roomId;
      } else {
        throw new Error("Failed to create room");
      }
    }).catch(err => {
      console.log(JSON.stringify(err.response.data));
    });
  }

  const startTrackMe = (room: string) => {
    if (shareTimerId) {
      clearInterval(shareTimerId);
    }
    joinRoom(room);
    const timerId = setInterval(() => {
      console.log(lonLat.latitude, lonLat.longitude, room)
      console.log(messages)
      sendLocation(lonLat.latitude, lonLat.longitude, room);
    }, 5000);
    setShareTimerId(timerId);
  }

  const joinRoom = (room: string) => {
    if (roomId !== room) {
      dispatch(setRoomId({
        roomId: room,
        }));
    }
    if (socket) {
      console.log("join room", room)
      socket.emit("join_room", room);
    }
  };

  const exitRoom = () => {
    handleLeaveRoom(roomId);
    dispatch(setRoomId({
      roomId: "",
    }));
    if (shareTimerId) {
      clearInterval(shareTimerId);
    }
  }

  return {
    isConnected,
    messages,
    roomId,
    joinRoom,
    handleLeaveRoom,
    sendLocation,
    createRoom,
    startTrackMe,
    exitRoom,
  };
};