import { Fonts } from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface TypographyProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "button";
  weight?: "light" | "regular" | "medium" | "semiBold" | "bold" | "extraBold";
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  weight = "regular",
  style,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "h1":
        return styles.h1;
      case "h2":
        return styles.h2;
      case "h3":
        return styles.h3;
      case "body":
        return styles.body;
      case "caption":
        return styles.caption;
      case "button":
        return styles.button;
      default:
        return styles.body;
    }
  };

  const getFontFamily = () => {
    switch (weight) {
      case "light":
        return Fonts.light;
      case "regular":
        return Fonts.regular;
      case "medium":
        return Fonts.medium;
      case "semiBold":
        return Fonts.semiBold;
      case "bold":
        return Fonts.bold;
      case "extraBold":
        return Fonts.extraBold;
      default:
        return Fonts.regular;
    }
  };

  return (
    <Text
      style={[getVariantStyle(), { fontFamily: getFontFamily() }, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 36,
    lineHeight: 44,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
  },
});
