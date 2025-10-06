import { Colors } from "@/constants/colors";
import { Typography } from "./Typography";
import { CheckCircle, XCircle } from "lucide-react-native";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";

interface PaymentModalProps {
  visible: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  primaryButton: {
    text: string;
    onPress: () => void;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
  };
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  type,
  title,
  message,
  primaryButton,
  secondaryButton,
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  const IconComponent = type === "success" ? CheckCircle : XCircle;
  const iconColor = type === "success" ? Colors.success : Colors.error;
  const iconBgColor = type === "success" ? Colors.success + "15" : Colors.error + "15";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <IconComponent size={48} color={iconColor} strokeWidth={2} />
          </View>

          <Typography variant="h2" weight="bold" style={styles.title}>
            {title}
          </Typography>

          <Typography variant="body" weight="regular" style={styles.message}>
            {message}
          </Typography>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: type === "success" ? Colors.primary : iconColor },
              ]}
              onPress={primaryButton.onPress}
              activeOpacity={0.8}
            >
              <Typography
                variant="button"
                weight="bold"
                style={styles.primaryButtonText}
              >
                {primaryButton.text}
              </Typography>
            </TouchableOpacity>

            {secondaryButton && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={secondaryButton.onPress}
                activeOpacity={0.8}
              >
                <Typography
                  variant="button"
                  weight="semiBold"
                  style={styles.secondaryButtonText}
                >
                  {secondaryButton.text}
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    maxWidth: 340,
    width: "100%",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButton: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryButtonText: {
    color: Colors.textOnPrimary,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
  },
});