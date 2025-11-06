import { NotificationProvider } from "@/context/notificationContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <NotificationProvider>
      <Stack />
    </NotificationProvider>
  );
}
