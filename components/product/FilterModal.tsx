import { Colors } from "@/constants/colors";
import { Typography } from "@/components/ui/Typography";
import { Check, X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedSkinTypes: string[];
  onSkinTypeToggle: (skinType: string) => void;
  onClearFilters: () => void;
}

const SORT_OPTIONS = [
  { key: "name", label: "Name" },
  { key: "price_low", label: "Price: Low to High" },
  { key: "price_high", label: "Price: High to Low" },
];

const SKIN_TYPES = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  sortBy,
  onSortChange,
  selectedSkinTypes,
  onSkinTypeToggle,
  onClearFilters,
}) => {
  return (
    <Modal
      statusBarTranslucent
      navigationBarTranslucent
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Typography variant="h3" weight="bold" style={styles.title}>
              Filter & Sort
            </Typography>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Typography
                variant="body"
                weight="semiBold"
                style={styles.sectionTitle}
              >
                Sort By
              </Typography>
              <View style={styles.sortOptions}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOption,
                      sortBy === option.key && styles.sortOptionActive,
                    ]}
                    onPress={() => onSortChange(option.key)}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="body"
                      weight="medium"
                      style={[
                        styles.sortOptionText,
                        sortBy === option.key && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Typography>
                    {sortBy === option.key && (
                      <Check size={16} color={Colors.primary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Typography
                variant="body"
                weight="semiBold"
                style={styles.sectionTitle}
              >
                Skin Type
              </Typography>
              <View style={styles.skinTypeOptions}>
                {SKIN_TYPES.map((skinType) => (
                  <TouchableOpacity
                    key={skinType}
                    style={[
                      styles.skinTypeOption,
                      selectedSkinTypes.includes(skinType) &&
                        styles.skinTypeOptionActive,
                    ]}
                    onPress={() => onSkinTypeToggle(skinType)}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="body"
                      weight="medium"
                      style={[
                        styles.skinTypeOptionText,
                        selectedSkinTypes.includes(skinType) &&
                          styles.skinTypeOptionTextActive,
                      ]}
                    >
                      {skinType}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearFilters}
              activeOpacity={0.7}
            >
              <Typography
                variant="button"
                weight="semiBold"
                style={styles.clearButtonText}
              >
                Clear All
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Typography
                variant="button"
                weight="semiBold"
                style={styles.applyButtonText}
              >
                Apply Filters
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingBottom: 34,
  },
  content: {
    paddingHorizontal: 24,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  title: {
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    marginBottom: 12,
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary + "15",
    borderColor: Colors.primary,
  },
  sortOptionText: {
    color: Colors.text,
  },
  sortOptionTextActive: {
    color: Colors.primary,
  },
  skinTypeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skinTypeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 80,
    alignItems: "center",
  },
  skinTypeOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  skinTypeOptionText: {
    color: Colors.text,
  },
  skinTypeOptionTextActive: {
    color: Colors.textOnPrimary,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  clearButtonText: {
    color: Colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: Colors.textOnPrimary,
  },
});
