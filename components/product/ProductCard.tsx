import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/lib/types";
import { Check, Minus, Plus, Star } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface ProductCardProps {
  item: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { addToCart, updateQuantity, cartItems } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const cartItem = cartItems.find(
    (cartItem) => cartItem.product.id === item.id
  );
  const quantity = cartItem?.quantity || 0;

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const height = useSharedValue(36);

  const handleAddToCart = () => {
    addToCart(item);
    setIsAdded(true);

    // Scale animation for feedback
    scale.value = withSpring(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1, { duration: 200 });
    });

    setTimeout(() => setIsAdded(false), 1000);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
      height: height.value,
    };
  });

  React.useEffect(() => {
    if (quantity > 0) {
      height.value = withTiming(72, { duration: 300 }); // Height for quantity controls
    } else {
      height.value = withTiming(36, { duration: 300 }); // Height for add button
    }
  }, [quantity]);

  return (
    <View style={styles.productCard}>
      <TouchableOpacity style={styles.productTouchable} activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.categoryBadge}>
            <Typography
              variant="caption"
              weight="bold"
              style={styles.categoryBadgeText}
            >
              {item.category?.name || 'Product'}
            </Typography>
          </View>
          <View style={styles.ratingBadge}>
            <Star size={10} color={Colors.accent} fill={Colors.accent} strokeWidth={0} />
            <Typography
              variant="caption"
              weight="bold"
              style={styles.ratingText}
            >
              4.0
            </Typography>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Typography
            variant="body"
            weight="bold"
            style={styles.productName}
            numberOfLines={2}
          >
            {item.title}
          </Typography>
          <Typography
            variant="caption"
            weight="regular"
            style={styles.productDescription}
            numberOfLines={2}
          >
            {item.description}
          </Typography>

          <Animated.View style={[styles.actionContainer, animatedStyle]}>
            {quantity > 0 ? (
              <>
                <View style={styles.priceContainer}>
                  <Typography
                    variant="body"
                    weight="bold"
                    style={styles.productPrice}
                  >
                    ₹{parseFloat(item.price).toFixed(2)}
                  </Typography>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, quantity - 1)}
                    activeOpacity={0.7}
                  >
                    <Minus size={14} color={Colors.primary} strokeWidth={2} />
                  </TouchableOpacity>
                  <View style={styles.quantityDisplay}>
                    <Typography
                      variant="caption"
                      weight="bold"
                      style={styles.quantityText}
                    >
                      {quantity}
                    </Typography>
                  </View>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, quantity + 1)}
                    activeOpacity={0.7}
                  >
                    <Plus size={14} color={Colors.primary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.priceButtonRow}>
                <Typography
                  variant="body"
                  weight="bold"
                  style={styles.productPrice}
                >
                  ₹{parseFloat(item.price).toFixed(2)}
                </Typography>
                <TouchableOpacity
                  style={[styles.addButton, isAdded && styles.addButtonSuccess]}
                  onPress={handleAddToCart}
                  activeOpacity={0.8}
                >
                  {isAdded ? (
                    <Check
                      size={16}
                      color={Colors.textOnPrimary}
                      strokeWidth={2}
                    />
                  ) : (
                    <Plus
                      size={16}
                      color={Colors.textOnPrimary}
                      strokeWidth={2}
                    />
                  )}
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={styles.addButtonText}
                  >
                    {isAdded ? "Added" : "Add"}
                  </Typography>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    width: (width - 48) / 2,
  },
  productTouchable: {
    flex: 1,
  },
  imageContainer: {
    position: "relative" as const,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.surfaceElevated,
  },
  categoryBadge: {
    position: "absolute" as const,
    top: 12,
    left: 12,
    backgroundColor: Colors.overlayLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: Colors.primary,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  ratingBadge: {
    position: "absolute" as const,
    top: 12,
    right: 12,
    backgroundColor: Colors.overlayLight,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    color: Colors.accent,
    fontSize: 10,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    color: Colors.text,
    marginBottom: 6,
  },
  productDescription: {
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    color: Colors.primary,
    marginBottom: 2,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    height: 36,
  },
  addButtonSuccess: {
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
  },
  addButtonText: {
    color: Colors.textOnPrimary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 36,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quantityDisplay: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 32,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    color: Colors.text,
    textAlign: "center" as const,
  },
  actionContainer: {
    overflow: "hidden",
  },
});
