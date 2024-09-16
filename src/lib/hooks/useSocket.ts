import { useEffect, useState } from "react";
import { socket } from "@/lib/socket/socket";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>();

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);

      const userData = sessionStorage.getItem("user");

      if (!userData) return;

      const parsedUserData = JSON.parse(userData);

      if (parsedUserData === null) return;

      socket.emit("setUserId", parsedUserData.user.userId);
    };

    const onDisconnect = () => setIsConnected(false);
    const updateOnlineUsers = (users: string[]) => setOnlineUsers(users);

    socket.connect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("onlineUsers", updateOnlineUsers);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("onlineUsers", updateOnlineUsers);
      socket.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string) => socket.emit("joinRoom", { roomId });

  return { isConnected, onlineUsers, joinRoom, socket };
};
