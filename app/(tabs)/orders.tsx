import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { useOrders } from "@/lib/queries";
import { Order } from "@/lib/types";
import { router } from "expo-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  Package,
  Truck,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const { data: ordersData, isLoading, refetch } = useOrders();
  const orders = ordersData?.data || [];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return CheckCircle;
      case "PENDING":
      case "PAID":
        return Clock;
      case "SHIPPED":
        return Truck;
      default:
        return Package;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const OrderCard = React.memo(function OrderCard({ item }: { item: Order }) {
    const StatusIcon = getStatusIcon(item.status);

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity activeOpacity={0.95}>
          <View style={styles.orderHeader}>
            <View style={styles.orderHeaderLeft}>
              <Typography variant="body" weight="bold" style={styles.orderId}>
                Order #{item.id.toString().padStart(6, "0")}
              </Typography>
              <View style={styles.dateContainer}>
                <Calendar
                  size={14}
                  color={Colors.textSecondary}
                  strokeWidth={2}
                />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={styles.orderDate}
                >
                  {formatDate(item.createdAt)}
                </Typography>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + "15" },
              ]}
            >
              <StatusIcon
                size={14}
                color={getStatusColor(item.status)}
                strokeWidth={2}
              />
              <Typography
                variant="caption"
                weight="bold"
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Typography>
            </View>
          </View>

          <View style={styles.itemsContainer}>
            {item.items.slice(0, 2).map((orderItem, itemIndex: number) => (
              <View key={itemIndex} style={styles.orderItem}>
                <View style={styles.itemImageContainer}>
                  <Image
                    source={{
                      uri: orderItem.product?.image,
                    }}
                    style={styles.itemImage}
                  />
                </View>
                <View style={styles.itemDetails}>
                  <Typography
                    variant="body"
                    weight="semiBold"
                    style={styles.itemName}
                    numberOfLines={1}
                  >
                    {orderItem.product?.title || "Product"}
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
                    Qty: {orderItem.quantity}
                  </Typography>
                </View>
                <Typography
                  variant="body"
                  weight="bold"
                  style={styles.itemPrice}
                >
                  ₹
                  {(parseFloat(orderItem.price) * orderItem.quantity).toFixed(
                    2
                  )}
                </Typography>
              </View>
            ))}
            {item.items.length > 2 && (
              <Typography
                variant="body"
                weight="regular"
                style={styles.moreItems}
              >
                +{item.items.length - 2} more items
              </Typography>
            )}
          </View>

          <View style={styles.orderFooter}>
            <View style={styles.totalContainer}>
              <Typography
                variant="body"
                weight="medium"
                style={styles.totalLabel}
              >
                Total Amount
              </Typography>
              <Typography variant="h3" weight="bold" style={styles.totalAmount}>
                ₹{parseFloat(item.total).toFixed(2)}
              </Typography>
            </View>
            <View style={styles.orderActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/order-tracking/${item.id}`)}
              >
                <Typography
                  variant="body"
                  weight="semiBold"
                  style={styles.actionButtonText}
                >
                  Track Order
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Orders" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Orders" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Package size={64} color={Colors.textTertiary} strokeWidth={1.5} />
          </View>
          <Typography variant="h2" weight="bold" style={styles.emptyTitle}>
            No orders yet
          </Typography>
          <Typography variant="body" weight="regular" style={styles.emptyText}>
            Your order history will appear here once you make your first
            purchase
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Orders" />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[Colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center" as const,
  },
  list: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    color: Colors.text,
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderDate: {
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
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
    textTransform: "capitalize" as const,
    marginBottom: 4,
  },
  itemQuantity: {
    color: Colors.textTertiary,
  },
  itemPrice: {
    color: Colors.primary,
  },
  moreItems: {
    color: Colors.textSecondary,
    fontStyle: "italic" as const,
    textAlign: "center" as const,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  totalAmount: {
    color: Colors.primary,
  },
  orderActions: {
    marginLeft: 16,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: Colors.textOnPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
