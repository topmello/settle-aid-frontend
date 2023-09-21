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

const DEBUG = true;

export const useTrack = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const token = useSelector(selectToken);
  const roomId = useSelector(selectRoomId);
  const [startTracking, setStartTracking] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const lonLat = useSelector(selectLonLat);
  const [parentLocation, setParentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  useCurrentLocationRealtime();

  const handleConnect = () => setIsConnected(true);
  const handleDisconnect = () => setIsConnected(false);

  const handleJoin = (message: string) => {
    DEBUG && console.log("handlejoin", message);
    setMessages((prev) => [...prev, { message, type: "join_room" }]);
    if (startTracking) {
      sendLocation(lonLat.latitude, lonLat.longitude, roomId);
    }
  };

  const handleLeave = (message: string) => {
    DEBUG && console.log("leave room", message);
    setMessages((prev) => [...prev, { message, type: "join_room" }]);
  };

  const handleMove = (data: any) => {
    // DEBUG && console.log("handleMove", data);
    setMessages((prev) => [...prev, { ...data, type: "move" }]);
    setParentLocation({
      latitude: data?.details?.msg?.lat,
      longitude: data?.details?.msg?.long,
    });
  };

  useEffect(() => {
    exitRoom();
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
      newSocket.on("error", (err) => {
        console.log(err);
      });

      return () => {
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("room_message", handleJoin);
        newSocket.off("move", handleMove);
        newSocket.close();
        setMessages([]);
      };
    }
  }, [token]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
      exitRoom();
    };
  }, []);

  useEffect(() => {
    if (startTracking && lonLat.latitude && lonLat.longitude) {
      sendLocation(lonLat.latitude, lonLat.longitude, roomId);
    }
  }, [lonLat, startTracking, roomId]);

  const handleLeaveRoom = (room: string) => {
    if (socket) {
      socket.emit("leave_room", room);
    }
  };

  const sendLocation = (lat: number = 0, long: number = 0, room: string) => {
    if (socket && startTracking) {
      socket.emit("move", { lat, long, roomId: room });
    }
  };

  const createRoom = async () => {
    return fetch({
      method: "GET",
      url: "/track/generate-pin/",
      token: token,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.room_id);
          dispatch(
            setRoomId({
              roomId: res.data.room_id,
            })
          );
          return res.data.roomId;
        } else {
          throw new Error("Failed to create room");
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response.data));
      });
  };

  const startTrackMe = (room: string) => {
    joinRoom(room);
    setStartTracking(true);
  };

  const joinRoom = (room: string) => {
    if (roomId !== room) {
      dispatch(
        setRoomId({
          roomId: room,
        })
      );
    }
    if (socket) {
      socket.emit("join_room", room);
    }
  };

  const exitRoom = () => {
    setMessages([]);
    handleLeaveRoom(roomId);
    dispatch(
      setRoomId({
        roomId: "",
      })
    );
  };

  return {
    isConnected,
    messages,
    roomId,
    joinRoom,
    handleLeaveRoom,
    createRoom,
    startTrackMe,
    exitRoom,
    parentLocation,
  };
};
