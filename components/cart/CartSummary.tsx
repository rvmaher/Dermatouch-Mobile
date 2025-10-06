import { Colors } from "@/constants/colors";
import { Typography } from "@/components/ui/Typography";
import { ArrowRight, CreditCard } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CartSummaryProps {
  itemCount: number;
  total: number;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  itemCount,
  total,
  isCheckingOut,
  onCheckout,
}) => {
  return (
    <View style={styles.footer}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Typography variant="body" weight="medium" style={styles.summaryLabel}>
            Subtotal ({itemCount} items)
          </Typography>
          <Typography variant="body" weight="semiBold" style={styles.summaryValue}>
            ${total.toFixed(2)}
          </Typography>
        </View>
        <View style={styles.summaryRow}>
          <Typography variant="body" weight="medium" style={styles.summaryLabel}>
            Shipping
          </Typography>
          <Typography variant="body" weight="semiBold" style={styles.summaryValue}>
            Free
          </Typography>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Typography variant="body" weight="bold" style={styles.totalLabel}>
            Total
          </Typography>
          <Typography variant="h3" weight="bold" style={styles.totalAmount}>
            ${total.toFixed(2)}
          </Typography>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          isCheckingOut && styles.checkoutButtonDisabled,
        ]}
        onPress={onCheckout}
        disabled={isCheckingOut}
        activeOpacity={0.8}
      >
        <CreditCard size={20} color={Colors.textOnPrimary} strokeWidth={2} />
        <Typography variant="button" weight="bold" style={styles.checkoutButtonText}>
          {isCheckingOut ? "Processing Order..." : "Secure Checkout"}
        </Typography>
        {!isCheckingOut && (
          <ArrowRight
            size={18}
            color={Colors.textOnPrimary}
            strokeWidth={2}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContainer: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryLabel: {
    color: Colors.textSecondary,
  },
  summaryValue: {
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: Colors.text,
  },
  totalAmount: {
    color: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  checkoutButtonText: {
    color: Colors.textOnPrimary,
  },
});