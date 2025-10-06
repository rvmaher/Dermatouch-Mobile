import { Typography } from "@/components/ui/Typography";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.appIcon}
            />
          </View>
          <Typography variant="h1" weight="bold" style={styles.title}>
            Dermatouch
          </Typography>
          <Typography variant="body" weight="medium" style={styles.subtitle}>
            Skincare Essentials
          </Typography>
          <View style={styles.decorativeLine} />
        </View>

        <View style={styles.form}>
          <Typography variant="h2" weight="bold" style={styles.formTitle}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Typography>

          <View style={styles.inputContainer}>
            <Typography variant="body" weight="semiBold" style={styles.label}>
              Email
            </Typography>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Typography variant="body" weight="semiBold" style={styles.label}>
              Password
            </Typography>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Typography
                variant="button"
                weight="bold"
                style={styles.buttonText}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </Typography>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Typography
              variant="body"
              weight="semiBold"
              style={styles.switchText}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    minHeight: Dimensions.get("window").height,
  },
  header: {
    alignItems: "center",
    marginBottom: 56,
  },
  iconContainer: {
    position: "relative" as const,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },

  title: {
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 32,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    color: Colors.text,
    marginBottom: 32,
    textAlign: "center" as const,
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    fontFamily: "Manrope-Medium",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: Colors.textOnPrimary,
    letterSpacing: 0.3,
  },
  switchButton: {
    marginTop: 24,
    alignItems: "center",
    padding: 8,
  },
  switchText: {
    color: Colors.primary,
  },
});
