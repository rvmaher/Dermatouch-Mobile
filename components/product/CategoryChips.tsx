import { Colors } from "@/constants/colors";
import { Typography } from "@/components/ui/Typography";
import { Category } from "@/lib/types";
import React, { useRef, useEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

interface CategoryChipsProps {
  categories: (Category | { id: number; name: string })[];
  selectedCategory: number;
  onCategorySelect: (categoryId: number) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const selectedIndex = categories.findIndex(cat => cat.id === selectedCategory);
    if (selectedIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: selectedIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [selectedCategory, categories]);

  const renderChip = ({ item }: { item: Category | { id: number; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.chip,
        selectedCategory === item.id && styles.chipActive,
      ]}
      onPress={() => onCategorySelect(item.id)}
      activeOpacity={0.7}
    >
      <Typography
        variant="body"
        weight="semiBold"
        style={[
          styles.chipText,
          selectedCategory === item.id && styles.chipTextActive,
        ]}
      >
        {item.name}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={categories}
      renderItem={renderChip}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      onScrollToIndexFailed={() => {}}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
    marginRight: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.text,
  },
  chipTextActive: {
    color: Colors.textOnPrimary,
  },
});
