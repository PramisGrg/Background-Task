import { useNotification } from "@/context/notificationContext";
import * as Notifications from "expo-notifications";
import { Text, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {
  const { expoPushToken, notification, error } = useNotification();

  console.log(notification, "This is notification");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this</Text>
    </View>
  );
}
