import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

export const requestPermissions = async () => {
  try {
    const { status: notifStatus } =
      await Notifications.requestPermissionsAsync();

    if (notifStatus !== "granted") {
      Alert.alert("Permission Denied", "Notification permission is required");
      return false;
    }

    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required");
      return false;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== "granted") {
      Alert.alert(
        "Background Permission Required",
        'Please grant "Allow all the time" permission for background location tracking to work when the app is closed.'
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("Permission error:", err);
    return false;
  }
};
