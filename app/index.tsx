import { requestPermissions } from "@/utils/requestPermission";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";

const LOCATION_TASK_NAME = "location-background-task";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];

    if (location) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Location Updated",
          body: `Lat: ${location.coords.latitude.toFixed(
            4
          )}, Lng: ${location.coords.longitude.toFixed(4)}`,
        },
        trigger: null,
      });
    }
  }
});

export default function Index() {
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    checkTrackingStatus();
  }, []);

  const checkTrackingStatus = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TASK_NAME
      );
      setIsTracking(isRegistered);
      console.log("Task registered:", isRegistered);
    } catch (err) {
      console.error("Error checking tracking status:", err);
    }
  };

  const startTracking = async () => {
    try {
      const hasPermissions = await requestPermissions();

      if (!hasPermissions) {
        Alert.alert(
          "Permissions Required",
          "Please grant all required permissions to start tracking"
        );
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("location-tracking", {
          name: "Location Tracking",
          importance: Notifications.AndroidImportance.LOW,
          sound: null,
          vibrationPattern: null,
        });
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5 * 60 * 1000,
        distanceInterval: 0,
        foregroundService: {
          notificationTitle: "Location Tracking Active",
          notificationBody: "Your location is being tracked in the background",
          notificationColor: "#4CAF50",
        },
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
      });

      setIsTracking(true);
      Alert.alert("Success", "Location tracking started successfully");
    } catch (err) {
      console.error("Error starting tracking:", err);
      Alert.alert(
        "Error",
        `Failed to start tracking: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const stopTracking = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TASK_NAME
      );

      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        setIsTracking(false);
        Alert.alert("Success", "Location tracking stopped");
      } else {
        Alert.alert("Info", "Tracking is not active");
      }
    } catch (err) {
      console.error("Error stopping tracking:", err);
      Alert.alert("Error", "Failed to stop tracking");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Status: {isTracking ? "Tracking Active" : "Not Tracking"}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isTracking ? "Stop Tracking" : "Start Tracking"}
          onPress={isTracking ? stopTracking : startTracking}
          color={isTracking ? "#f44336" : "#4CAF50"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "80%",
    maxWidth: 300,
  },
});
