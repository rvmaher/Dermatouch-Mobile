import { CategoryChips } from "@/components/product/CategoryChips";
import { FilterModal } from "@/components/product/FilterModal";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchBar } from "@/components/product/SearchBar";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { useCategories, useProducts } from "@/lib/queries";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { cartItems } = useCartStore();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useProducts({
    search: searchQuery || undefined,
    categoryId: selectedCategory || undefined,
    sortBy: sortBy as "title" | "price" | "createdAt",
    sortOrder,
    limit: 50,
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const products = productsData?.data || [];
  const isLoading = productsLoading || categoriesLoading;

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === "price_low") {
      setSortBy("price");
      setSortOrder("asc");
    } else if (newSortBy === "price_high") {
      setSortBy("price");
      setSortOrder("desc");
    } else {
      setSortBy("title");
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSortBy("title");
    setSortOrder("asc");
    setSelectedCategory(0);
    setSelectedSkinTypes([]);
  };

  const handleSkinTypeToggle = (skinType: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(skinType)
        ? prev.filter((type) => type !== skinType)
        : [...prev, skinType]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Home"
        rightComponent={
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <User size={24} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        }
      />
      <View>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setShowFilterModal(true)}
        />

        {categories && (
          <CategoryChips
            categories={[{ id: 0, name: "All" }, ...categories]}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography variant="h3" weight="bold" style={styles.emptyTitle}>
            No products found
          </Typography>
          <Typography variant="body" weight="regular" style={styles.emptyText}>
            {searchQuery ? `No results for "${searchQuery}"` : 'No products available'}
          </Typography>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard item={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={productsLoading}
              onRefresh={refetchProducts}
              colors={[Colors.primary]}
            />
          }
        />
      )}

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        sortBy={
          sortBy === "price"
            ? sortOrder === "asc"
              ? "price_low"
              : "price_high"
            : "name"
        }
        onSortChange={handleSortChange}
        selectedSkinTypes={selectedSkinTypes}
        onSkinTypeToggle={handleSkinTypeToggle}
        onClearFilters={clearFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileButton: {
    padding: 4,
  },
  productsList: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
