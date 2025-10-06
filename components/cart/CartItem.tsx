import { Colors } from "@/constants/colors";
import { Typography } from "@/components/ui/Typography";
import { useCartStore, CartItem as CartItemType } from "@/stores/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  return (
    <View style={styles.cartItem}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.image}
        />
      </View>

      <View style={styles.info}>
        <Typography variant="body" weight="bold" style={styles.name} numberOfLines={2}>
          {item.product.title}
        </Typography>
        <Typography variant="caption" weight="regular" style={styles.category}>
          {item.product.category?.name || 'Skincare'}
        </Typography>
        <Typography variant="body" weight="bold" style={styles.price}>
          ₹{parseFloat(item.product.price).toFixed(2)}
        </Typography>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
            activeOpacity={0.7}
          >
            <Minus size={16} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.quantityDisplay}>
            <Typography variant="body" weight="bold" style={styles.quantityText}>
              {item.quantity}
            </Typography>
          </View>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
            activeOpacity={0.7}
          >
            <Plus size={16} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actions}>
        <Typography variant="body" weight="bold" style={styles.total}>
          ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
        </Typography>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeFromCart(item.product.id)}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color={Colors.error} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: Colors.surfaceElevated,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  name: {
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    color: Colors.textSecondary,
    textTransform: "capitalize" as const,
    marginBottom: 8,
  },
  price: {
    color: Colors.primary,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quantityDisplay: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quantityText: {
    color: Colors.text,
    textAlign: "center" as const,
    minWidth: 20,
  },
  actions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 12,
  },
  total: {
    color: Colors.text,
    marginBottom: 12,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.error + "10",
  },
});