// import * as Notifications from "expo-notifications";
// import { useEffect } from "react";
// import { Platform } from "react-native";

// async function registerForNotificationsAsync() {
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") {
//     throw new Error("Notification permission not granted");
//   }

//   // For local scheduled notifications you do NOT need a push token.
// }

// export function useNotificationPermissions() {
//   useEffect(() => {
//     if (Platform.OS === "android" || Platform.OS === "ios") {
//       registerForNotificationsAsync().catch(console.warn);
//     }
//   }, []);
// }
