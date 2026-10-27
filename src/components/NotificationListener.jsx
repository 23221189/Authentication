import { useEffect } from "react";
import { useSocket } from "../context/SocketContext.jsx";
import { enablePushNotifications } from "../utils/pushNotification.js";

const NotificationListener = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      enablePushNotifications().catch((err) =>
        console.warn(
          "Push setup failed:",
          err.message
        )
      );
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload) => {
      console.log(
        "Real-time notification received:",
        payload
      );

      window.dispatchEvent(
        new CustomEvent("new-notification", {
          detail: payload,
        })
      );
    };

    socket.on(
      "new-notification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "new-notification",
        handleNewNotification
      );
    };
  }, [socket]);

  return null;
};

export default NotificationListener;