
import { subscribePushApi, unsubscribePushApi } from "../api/notificationApi";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export const isPushSupported = () =>
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  !!VAPID_PUBLIC_KEY;

export const enablePushNotifications = async () => {
  if (!isPushSupported()) {
    return { success: false, reason: "unsupported" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { success: false, reason: "denied" };
  }
  const registration = await navigator.serviceWorker.register("/serviceWorker.js");
  await navigator.serviceWorker.ready;


  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  await subscribePushApi(subscription.toJSON());

  return { success: true, subscription };
};

export const disablePushNotificaions = async () => {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();

  if (!subscription) return;

  await unsubscribePushApi(subscription.endpoint).catch(() => {});
  await subscription.unsubscribe();
};

export const onMessageListener = (callback) => {
  if (!("serviceWorker" in navigator)) return;

  const handler = (event) => {
    if (event.data && event.data.type === "PUSH_NOTIFICATION") {
      console.log("Foreground Push Message:", event.data.payload);
      callback(event.data.payload);
    }
  };

  navigator.serviceWorker.addEventListener("message", handler);
  return () => {
    navigator.serviceWorker.removeEventListener("message", handler);
  };
};