import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { Bell, Package, ShoppingBag, Truck } from "lucide-react-native";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "Order Shipped",
    message: "Your order #000123 has been shipped and is on the way",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "promotion",
    title: "Special Offer",
    message: "Get 20% off on all skincare products. Limited time offer!",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    type: "order",
    title: "Order Delivered",
    message: "Your order #000122 has been delivered successfully",
    time: "2 days ago",
    read: true,
  },
  {
    id: 4,
    type: "reminder",
    title: "Restock Reminder",
    message: "Time to restock your favorite Vitamin C Serum",
    time: "3 days ago",
    read: false,
  },
];

export default function NotificationsScreen() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return Truck;
      case "promotion":
        return ShoppingBag;
      case "reminder":
        return Package;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return Colors.info;
      case "promotion":
        return Colors.success;
      case "reminder":
        return Colors.warning;
      default:
        return Colors.primary;
    }
  };

  const NotificationCard = React.memo(function NotificationCard({
    item,
  }: {
    item: any;
  }) {
    const NotificationIcon = getNotificationIcon(item.type);
    const iconColor = getNotificationColor(item.type);

    return (
      <View style={[styles.notificationCard]}>
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconBackground]}>
              <NotificationIcon size={20} color={iconColor} strokeWidth={2} />
            </View>
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.titleRow}>
              <Typography
                variant="body"
                weight="bold"
                style={styles.notificationTitle}
              >
                {item.title}
              </Typography>
              <Typography
                variant="caption"
                weight="medium"
                style={styles.notificationTime}
              >
                {item.time}
              </Typography>
            </View>
            <Typography
              variant="body"
              weight="regular"
              style={styles.notificationMessage}
            >
              {item.message}
            </Typography>
          </View>
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" />
      <FlatList
        data={DUMMY_NOTIFICATIONS}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    position: "relative",
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  notificationTitle: {
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    color: Colors.textTertiary,
  },
  notificationMessage: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 0,
    right: 0,
  },
});
