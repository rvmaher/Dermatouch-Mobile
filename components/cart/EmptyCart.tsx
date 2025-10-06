import { Colors } from "@/constants/colors";
import { Typography } from "@/components/ui/Typography";
import { ArrowRight, ShoppingBag } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface EmptyCartProps {
  onShopPress: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onShopPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <ShoppingBag
          size={64}
          color={Colors.textTertiary}
          strokeWidth={1.5}
        />
      </View>
      <Typography variant="h2" weight="bold" style={styles.title}>
        Cart is empty
      </Typography>
      <Typography variant="body" weight="regular" style={styles.text}>
        Add some products to get started with your skincare routine
      </Typography>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={onShopPress}
        activeOpacity={0.8}
      >
        <Typography variant="button" weight="bold" style={styles.shopButtonText}>
          Explore Products
        </Typography>
        <ArrowRight
          size={18}
          color={Colors.textOnPrimary}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  iconContainer: {
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
  title: {
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center" as const,
  },
  text: {
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: "center" as const,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shopButtonText: {
    color: Colors.textOnPrimary,
  },
});