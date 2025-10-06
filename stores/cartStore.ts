import { apiClient } from "@/lib/api";
import { Order, OrderAddress, Product } from "@/lib/types";
import { Toast } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export type CartItem = {
  product: Product;
  quantity: number;
};



interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  isHydrated: boolean;
  total: number;
  itemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  clearUserData: () => void;
  checkout: (address: OrderAddress, paymentId?: string) => Promise<Order>;
  loadCart: () => Promise<void>;
  setHydrated: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  isLoading: true,
  isHydrated: Platform.OS !== "web",
  total: 0,
  itemCount: 0,

  setHydrated: () => set({ isHydrated: true }),

  loadCart: async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) return;

      const cartKey = `cart_${user.id}`;
      const cartData = await AsyncStorage.getItem(cartKey);
      if (cartData) {
        const items = JSON.parse(cartData);
        set({
          cartItems: items,
          total: items.reduce(
            (sum: number, item: CartItem) =>
              sum + parseFloat(item.product.price) * item.quantity,
            0
          ),
          itemCount: items.reduce(
            (sum: number, item: CartItem) => sum + item.quantity,
            0
          ),
        });
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  },



  addToCart: (product: Product) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    let newCart: CartItem[];
    if (existingItem) {
      newCart = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      Toast.success("Quantity updated", `${product.title} quantity increased`);
    } else {
      newCart = [...cartItems, { product, quantity: 1 }];
      Toast.success("Added to cart", `${product.title} added successfully`);
    }

    const user = useAuthStore.getState().user;
    if (user) {
      AsyncStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
    }
    set({
      cartItems: newCart,
      total: newCart.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      ),
      itemCount: newCart.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  removeFromCart: (productId: number) => {
    const { cartItems } = get();
    const item = cartItems.find((item) => item.product.id === productId);
    const newCart = cartItems.filter((item) => item.product.id !== productId);

    const user = useAuthStore.getState().user;
    if (user) {
      AsyncStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
    }
    set({
      cartItems: newCart,
      total: newCart.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      ),
      itemCount: newCart.reduce((sum, item) => sum + item.quantity, 0),
    });

    if (item) {
      Toast.info("Removed from cart", `${item.product.title} removed`);
    }
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const { cartItems } = get();
    const newCart = cartItems.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    const user = useAuthStore.getState().user;
    if (user) {
      AsyncStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart));
    }
    set({
      cartItems: newCart,
      total: newCart.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      ),
      itemCount: newCart.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  clearCart: () => {
    const user = useAuthStore.getState().user;
    if (user) {
      AsyncStorage.setItem(`cart_${user.id}`, JSON.stringify([]));
    }
    set({ cartItems: [], total: 0, itemCount: 0 });
  },

  clearUserData: () => {
    set({ cartItems: [], total: 0, itemCount: 0, isLoading: true });
  },

  checkout: async (address, paymentId) => {
    const { cartItems } = get();

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      address,
      paymentId,
    };

    try {
      const order = await apiClient.createOrder(orderData);
      return order;
    } catch (error) {
      console.error("Checkout failed:", error);
      throw error;
    }
  },
}));
