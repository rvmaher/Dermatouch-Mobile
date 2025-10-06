import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { PaymentModal } from "@/components/ui/PaymentModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { OrderAddress } from "@/lib/types";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
//@ts-ignore
import RazorpayCheckout from "react-native-razorpay";
export default function CartScreen() {
  const { cartItems, total, checkout, clearCart } = useCartStore();
  const router = useRouter();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderJustPlaced, setOrderJustPlaced] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [address, setAddress] = useState<OrderAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowAddressModal(true);
  };

  const handlePlaceOrder = async () => {
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      setPaymentResult({
        type: "error",
        title: "Missing Information",
        message:
          "Please fill in all address fields to continue with your order.",
      });
      setShowPaymentModal(true);
      return;
    }

    const options = {
      description: "Dermatouch Skincare Products",
      currency: "INR",
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: Math.round(total * 100).toString(),
      name: "Dermatouch",
      prefill: {
        email: "customer@dermatouch.com",
        contact: "9999999999",
        name: "Customer",
      },
      theme: { color: Colors.primary },
    };

    try {
      const paymentData = await RazorpayCheckout.open(options);

      try {
        await checkout(address, paymentData.razorpay_payment_id);

        setShowAddressModal(false);
        setOrderJustPlaced(true);

        clearCart();

        setPaymentResult({
          type: "success",
          title: "🎉 Order Placed Successfully!",
          message:
            "Your skincare essentials are on their way. Thank you for choosing Dermatouch!",
        });
        setShowPaymentModal(true);
      } catch (orderError: any) {
        setPaymentResult({
          type: "error",
          title: "Order Processing Failed",
          message:
            "Payment was successful but we couldn't process your order. Please contact support with your payment ID: " +
            paymentData.razorpay_payment_id,
        });
        setShowPaymentModal(true);
      }
    } catch (paymentError: any) {
      if (paymentError.code) {
        setPaymentResult({
          type: "error",
          title: "Payment Failed",
          message: `${
            paymentError.description ||
            "Payment could not be processed. Please try again."
          }`,
        });
      } else {
        setPaymentResult({
          type: "error",
          title: "Payment Cancelled",
          message: "Payment was cancelled. Your order has not been placed.",
        });
      }
      setShowPaymentModal(true);
    }
  };

  if (cartItems.length === 0 && !orderJustPlaced) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Cart"
          leftComponent={
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={Colors.primary} strokeWidth={2} />
            </TouchableOpacity>
          }
        />
        <EmptyCart onShopPress={() => router.push("/(tabs)")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Cart"
        leftComponent={
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <CartItem item={item} />}
        showsVerticalScrollIndicator={false}
      />

      <CartSummary
        itemCount={cartItems.length}
        total={total}
        isCheckingOut={false}
        onCheckout={handleCheckout}
      />

      <Modal
        navigationBarTranslucent
        statusBarTranslucent
        visible={showAddressModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Typography variant="h2" weight="bold" style={styles.modalTitle}>
              Delivery Address
            </Typography>
            <TouchableOpacity
              onPress={() => setShowAddressModal(false)}
              style={styles.closeButton}
            >
              <Typography
                variant="body"
                weight="semiBold"
                style={styles.closeText}
              >
                Cancel
              </Typography>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Typography variant="body" weight="semiBold" style={styles.label}>
                Street Address
              </Typography>
              <TextInput
                style={styles.input}
                value={address.street}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, street: text }))
                }
                placeholder="Enter street address"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography variant="body" weight="semiBold" style={styles.label}>
                City
              </Typography>
              <TextInput
                style={styles.input}
                value={address.city}
                onChangeText={(text) =>
                  setAddress((prev) => ({ ...prev, city: text }))
                }
                placeholder="Enter city"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Typography
                  variant="body"
                  weight="semiBold"
                  style={styles.label}
                >
                  State
                </Typography>
                <TextInput
                  style={styles.input}
                  value={address.state}
                  onChangeText={(text) =>
                    setAddress((prev) => ({ ...prev, state: text }))
                  }
                  placeholder="State"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.inputHalf}>
                <Typography
                  variant="body"
                  weight="semiBold"
                  style={styles.label}
                >
                  ZIP Code
                </Typography>
                <TextInput
                  style={styles.input}
                  value={address.zipCode}
                  onChangeText={(text) =>
                    setAddress((prev) => ({ ...prev, zipCode: text }))
                  }
                  placeholder="ZIP"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.placeOrderButton}
              onPress={handlePlaceOrder}
            >
              <Typography
                variant="button"
                weight="bold"
                style={styles.buttonText}
              >
                Place Order
              </Typography>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {paymentResult && (
        <PaymentModal
          visible={showPaymentModal}
          type={paymentResult.type}
          title={paymentResult.title}
          message={paymentResult.message}
          primaryButton={{
            text:
              paymentResult.type === "success" ? "View Orders" : "Try Again",
            onPress: () => {
              setShowPaymentModal(false);
              setPaymentResult(null);
              setOrderJustPlaced(false);
              if (paymentResult.type === "success") {
                router.push("/(tabs)/orders");
              }
            },
          }}
          secondaryButton={{
            text:
              paymentResult.type === "success" ? "Continue Shopping" : "Cancel",
            onPress: () => {
              setShowPaymentModal(false);
              setPaymentResult(null);
              setOrderJustPlaced(false);
              if (paymentResult.type === "success") {
                router.push("/(tabs)");
              }
            },
          }}
        />
      )}
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
  list: {
    padding: 16,
    paddingBottom: 240,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.textOnPrimary,
  },
});
