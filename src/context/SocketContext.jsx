import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);
const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {

    if (!user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const token = sessionStorage.getItem("token");
    if(import.meta.env.DEV){
      console.log("Connecting socket for user:", user._id);
    }
    const newSocket = io(SERVER_ORIGIN, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax:5000,
      randomizationFactor:0.5,
      auth:{token},
    });

    newSocket.on("connect", () => {
      if(import.meta.env.DEV){
    console.log("Socket connected:", newSocket.id);
      }
    });
    newSocket.on("disconnect", (reason) => {
      if(import.meta.env.DEV){
          console.log("Socket disconnected:", reason);
      }
    });
    newSocket.on("connect_error", (err) => {
      if(import.meta.env.DEV){
          console.error("Socket connection error:", err.message);
      }
      
    });
    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  return ctx || { socket: null };
};