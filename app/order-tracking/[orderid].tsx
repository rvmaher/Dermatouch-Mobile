import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { useOrder } from "@/lib/queries";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageCircle,
  Package,
  Phone,
  Truck,
  XCircle,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderTrackingScreen() {
  const { orderid } = useLocalSearchParams<{ orderid: string }>();
  const orderIdNum = orderid ? parseInt(orderid) : 0;
  const { data: order, isLoading, error } = useOrder(orderIdNum);

  console.log(
    "Order tracking - orderid:",
    orderid,
    "orderIdNum:",
    orderIdNum,
    "order:",
    order,
    "error:",
    error
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
      case "PAID":
        return Clock;
      case "SHIPPED":
        return Truck;
      case "DELIVERED":
        return CheckCircle2;
      case "CANCELLED":
        return XCircle;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return Colors.success;
      case "PENDING":
      case "PAID":
        return Colors.warning;
      case "SHIPPED":
        return Colors.info;
      case "CANCELLED":
        return Colors.error;
      default:
        return Colors.textTertiary;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatEstimatedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader
          title="Order Tracking"
          leftComponent={
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.primary} strokeWidth={2} />
            </TouchableOpacity>
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!order && !isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader
          title="Order Tracking"
          leftComponent={
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.primary} strokeWidth={2} />
            </TouchableOpacity>
          }
        />
        <View style={styles.errorContainer}>
          <Package size={64} color={Colors.textTertiary} strokeWidth={1.5} />
          <Typography variant="h2" weight="bold" style={styles.errorTitle}>
            Order Not Found
          </Typography>
          <Typography variant="body" weight="regular" style={styles.errorText}>
            We couldn't find tracking information for this order.
          </Typography>
        </View>
      </View>
    );
  }

  const getStatusSteps = (currentStatus: string, orderDate: string) => {
    const steps = [
      {
        status: "PENDING",
        title: "Order Placed",
        description: "Your order has been received",
      },
      {
        status: "PAID",
        title: "Payment Confirmed",
        description: "Payment has been processed",
      },
      {
        status: "SHIPPED",
        title: "Order Shipped",
        description: "Your order is on the way",
      },
      {
        status: "DELIVERED",
        title: "Delivered",
        description: "Order has been delivered",
      },
    ];

    const statusOrder = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => {
      let time = "";
      if (index <= currentIndex) {
        if (index === 0) {
          time = formatDate(orderDate);
        } else if (index === currentIndex) {
          time = "Current";
        } else {
          time = "Completed";
        }
      } else {
        time = "Pending";
      }

      return {
        ...step,
        time,
        isCompleted: index <= currentIndex,
        isCurrent: index === currentIndex,
        isActive: index <= currentIndex,
      };
    });
  };

  const TrackingStep = ({ step, isLast }: { step: any; isLast: boolean }) => {
    const StatusIcon = getStatusIcon(step.status);
    const stepColor = step.isActive
      ? getStatusColor(step.status)
      : Colors.textTertiary;

    return (
      <View style={styles.trackingEvent}>
        <View style={styles.eventLeft}>
          <View
            style={[
              styles.eventIcon,
              {
                backgroundColor: step.isActive
                  ? stepColor + "20"
                  : Colors.surfaceElevated,
                borderWidth: 2,
                borderColor: step.isActive ? stepColor : Colors.border,
              },
            ]}
          >
            <StatusIcon
              size={18}
              color={stepColor}
              strokeWidth={step.isCurrent ? 2.5 : 2}
            />
          </View>
          {!isLast && (
            <View
              style={[
                styles.eventLine,
                {
                  backgroundColor: step.isActive ? stepColor : Colors.border,
                  opacity: step.isActive ? 1 : 0.3,
                },
              ]}
            />
          )}
        </View>

        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Typography
              variant="body"
              weight={step.isCurrent ? "bold" : "semiBold"}
              style={[
                styles.eventTitle,
                {
                  color: step.isActive ? Colors.text : Colors.textTertiary,
                },
              ]}
            >
              {step.title}
            </Typography>
            <Typography
              variant="caption"
              weight="medium"
              style={[
                styles.eventTime,
                {
                  color: step.isActive ? stepColor : Colors.textTertiary,
                },
              ]}
            >
              {step.time}
            </Typography>
          </View>
          <Typography
            variant="body"
            weight="regular"
            style={[
              styles.eventDescription,
              {
                color: step.isActive
                  ? Colors.textSecondary
                  : Colors.textTertiary,
              },
            ]}
          >
            {step.description}
          </Typography>
        </View>
      </View>
    );
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader
          title="Order Tracking"
          leftComponent={
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.primary} strokeWidth={2} />
            </TouchableOpacity>
          }
        />
        <View style={styles.errorContainer}>
          <Package size={64} color={Colors.textTertiary} strokeWidth={1.5} />
          <Typography variant="h2" weight="bold" style={styles.errorTitle}>
            Order Not Found
          </Typography>
          <Typography variant="body" weight="regular" style={styles.errorText}>
            We couldn't find tracking information for this order.
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader
        title="Order Tracking"
        leftComponent={
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Typography variant="h3" weight="bold" style={styles.orderId}>
              Order #{order.id.toString().padStart(6, "0")}
            </Typography>
            <Typography variant="body" weight="medium" style={styles.orderDate}>
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(order.status) + "15",
              },
            ]}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={[
                styles.statusText,
                { color: getStatusColor(order.status) },
              ]}
            >
              {order.status}
            </Typography>
          </View>
        </View>

        <View style={styles.orderItems}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Order Items
          </Typography>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemImageContainer}>
                <Image
                  source={{
                    uri:
                      item.product?.image || "https://via.placeholder.com/60",
                  }}
                  style={styles.itemImage}
                />
              </View>
              <View style={styles.itemDetails}>
                <Typography
                  variant="body"
                  weight="semiBold"
                  style={styles.itemName}
                >
                  {item.product?.title || "Product"}
                </Typography>
                <Typography
                  variant="caption"
                  weight="regular"
                  style={styles.itemCategory}
                >
                  {"Skincare"}
                </Typography>
                <Typography
                  variant="caption"
                  weight="medium"
                  style={styles.itemQuantity}
                >
                  Qty: {item.quantity}
                </Typography>
              </View>
              <Typography variant="body" weight="bold" style={styles.itemPrice}>
                ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Typography>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Typography variant="h3" weight="bold" style={styles.totalAmount}>
              Total: ₹{parseFloat(order.total).toFixed(2)}
            </Typography>
          </View>
        </View>

        <View style={styles.deliveryInfo}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Delivery Address
          </Typography>
          <Typography
            variant="body"
            weight="regular"
            style={styles.addressText}
          >
            {order.address.street}
          </Typography>
          <Typography
            variant="body"
            weight="regular"
            style={styles.addressText}
          >
            {order.address.city}, {order.address.state} {order.address.zipCode}
          </Typography>
          <Typography
            variant="body"
            weight="regular"
            style={styles.addressText}
          >
            {order.address.country}
          </Typography>
        </View>

        <View style={styles.trackingSection}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Order Status
          </Typography>

          <View style={styles.trackingTimeline}>
            {getStatusSteps(order.status, order.createdAt).map(
              (step, index, array) => (
                <TrackingStep
                  key={step.status}
                  step={step}
                  isLast={index === array.length - 1}
                />
              )
            )}
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={20} color={Colors.textOnPrimary} strokeWidth={2} />
            <Typography
              variant="button"
              weight="semiBold"
              style={styles.actionButtonText}
            >
              Contact Support
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
          >
            <MessageCircle
              size={20}
              color={Colors.textSecondary}
              strokeWidth={2}
            />
            <Typography
              variant="button"
              weight="semiBold"
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              Live Chat
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorTitle: {
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: Colors.textSecondary,
    textAlign: "center" as const,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: Colors.surface,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    color: Colors.text,
    marginBottom: 4,
  },
  orderDate: {
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    letterSpacing: 0.5,
  },
  orderItems: {
    backgroundColor: Colors.surface,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemImageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.surfaceElevated,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    color: Colors.text,
    marginBottom: 4,
  },
  itemCategory: {
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  itemQuantity: {
    color: Colors.textTertiary,
  },
  itemPrice: {
    color: Colors.primary,
  },
  totalContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: "flex-end",
  },
  totalAmount: {
    color: Colors.primary,
  },
  deliveryInfo: {
    backgroundColor: Colors.surface,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressText: {
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  trackingSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    color: Colors.text,
    marginBottom: 20,
  },
  trackingTimeline: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackingEvent: {
    flexDirection: "row",
    marginBottom: 24,
  },
  eventLeft: {
    alignItems: "center",
    marginRight: 16,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  eventLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
  },
  eventContent: {
    flex: 1,
    paddingTop: 4,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  eventTitle: {
    flex: 1,
    marginRight: 8,
  },
  eventTime: {
    color: Colors.textTertiary,
  },
  eventDescription: {
    marginBottom: 4,
  },
  eventLocation: {
    color: Colors.textTertiary,
    fontStyle: "italic" as const,
  },
  actionsSection: {
    margin: 16,
    marginTop: 0,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    color: Colors.textOnPrimary,
  },
  actionButtonTextSecondary: {
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
