// hooks/useNotifications.ts
import * as Notifications from "expo-notifications";

export async function scheduleNotification(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput,
) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      alert("Permission not granted for notifications!");
      return;
    }
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger,
  });
}
